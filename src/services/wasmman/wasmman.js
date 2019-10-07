// Wasm Module (Package) Manager for the shell
import { fetchCommandFromWAPM } from '@wasmer/wasm-terminal';
import welcome from './callback-commands/welcome';

const customWasmModuleUrls = {
  qjs: "assets/wasm-modules/qjs.wasm",
  duk: "assets/wasm-modules/duk.wasm"
};

export default class WasmMan {
  constructor(externalWasmBinaryCache) {
    this.wasmBinaryCommands = {};
    this.callbackCommands = {
      callback: async (args, stdin) => {
        return `Callback Command Working! Args: ${args}, stdin: ${stdin}`;
      },
      wasmman: this._wasmManCallbackCommand.bind(this),
      welcome
    };
    this.externalWasmBinaryCache = externalWasmBinaryCache;

    // Create a hidden input on the page for opening files
    const hiddenInput = document.createElement('input');
    hiddenInput.id = 'hidden-file-input';
    hiddenInput.classList.add('hidden-file-input');
    hiddenInput.setAttribute('type', 'file');
    hiddenInput.setAttribute('accept', '.wasm');
    hiddenInput.setAttribute('hidden', true);
    hiddenInput.addEventListener('change', this._onHiddenInputChange.bind(this));
    document.body.appendChild(hiddenInput);
    this._hiddenInput = hiddenInput;

    // A variable for resolving file input
    this.currentInstallResolver = undefined;

  }

  // Get a command from the wasm maanger
  async getCommand(commandName) {
    if (this.callbackCommands[commandName]) {
      return this.callbackCommands[commandName];
    }

    if (this.wasmBinaryCommands[commandName]) {
      return this.wasmBinaryCommands[commandName]
    }

    if (customWasmModuleUrls[commandName]) {
      return await this._installFromUrl(commandName, customWasmModuleUrls[commandName]);
    }

    // Try to install from WAPM
    return await this._installFromWapm(commandName);
  }

  async _wasmManCallbackCommand(args) {
    if (args.length === 1) {
      return this._help();
    }

    if (args[1] === 'install') {
       const commandName = await this._installFromFile();
       return `Installed ${commandName} ! Run it with: \`${commandName}\``
    }

    if (args[1] === 'remove' && args.length === 3) {
      return this._remove(args[2]);
    }

    if (args[1] === 'list') {
      return this._list();
    }

    return this._help();
  }

  _help() {
    const helpMessage =
`
wasmman - The heroic command manager for webassembly.sh

Usage:

\`wasmman list\` - List installed commands 

\`wasmman install\` - Install a local wasm module

\`wasmman remove [command name]\` - Remove an installed wasm module

`;

    return helpMessage.replace(/\n\n/g, '\n \n');
  }

  _list() {
    let message = 'Installed Commands:';
    Object.keys(this.wasmBinaryCommands).forEach(key => {
      message += `\n${key}`;
    });
    Object.keys(this.callbackCommands).forEach(key => {
      message += `\n${key}`;
    });

    message += 
`

Additional commands can be installed by: 

* running a package name from https://wapm.io

* Uploading a file with \`wasmman install\`

`;
    
    return message.replace(/\n\n/g, '\n \n');
  }

  _remove(commandName) {
    if (this.callbackCommands[commandName]) {
      return `Cannot remove the built-in callback command: \`${commandName}\`.`
    }

    if (!this.wasmBinaryCommands[commandName]) {
      return `No command found named: \`${commandName}\``;
    }

    delete this.wasmBinaryCommands[commandName];
    delete this.externalWasmBinaryCache[commandName];

    return `Removed the command: \`${commandName}\`.`
  }

  async _installFromWapm(commandName) {
    const wasmBinary = await fetchCommandFromWAPM(commandName);
    this._installWasmBinary(commandName, wasmBinary);
    return wasmBinary;
  }

  async _installFromUrl(commandName, commandUrl) {
    const response = await fetch(commandUrl);
    const buffer = await response.arrayBuffer();
    const wasmBinary = new Uint8Array(buffer);
    this._installWasmBinary(commandName, wasmBinary);
    return wasmBinary;
  }

  async _installFromFile() {
    const gotInputPromise = new Promise(resolve => {
      this.currentInstallResolver = resolve;
    });
    this._hiddenInput.click();

    const file = await gotInputPromise;

    if (!file) {
      return "Cancelled opening wasm file.";
    }

    const buffer = await file.arrayBuffer();
    const wasmBinary = new Uint8Array(buffer);

    const commandName = file.name.replace('.wasm', '');

    this._installWasmBinary(commandName, wasmBinary);
    return commandName;
  }

  _onHiddenInputChange(event) {
    if (this.currentInstallResolver) {
      this.currentInstallResolver(event.target.files[0]);
    }
  }

  _installWasmBinary(commandName, wasmBinary) {
    this.wasmBinaryCommands[commandName] = wasmBinary;
  }
}
