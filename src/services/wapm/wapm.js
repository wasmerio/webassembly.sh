// Wasm Module (Package) Manager for the shell
import table from "text-table";
import * as idbKeyval from "idb-keyval";
import { WasmFs } from "@wasmer/wasmfs";
import { fetchCommandFromWAPM } from "./query";
import { extractContents } from "@wasmer/wasmfs/lib/tar";
import { lowerI64Imports } from "@wasmer/wasm-transformer";

import welcome from "./callback-commands/welcome";
import about from "./callback-commands/about";
import help from "./callback-commands/help";
import download from "./callback-commands/download";
import curl from "./callback-commands/curl";

var COMPILED_MODULES = {};
// const WAPM_COMMAND_GRAPHQL_QUERY = `query shellGetCommandQuery($command: String!) {
//   command: getCommand(name: $command) {
//     packageVersion {
//       package {
//         displayName
//       }
//       modules {
//         name
//         publicUrl
//         abi
//       }
//       version
//       commands {
//         command
//         module {
//           name
//           publicUrl
//           abi
//         }
//       }
//     }
//   }
// }`;

const WAPM_PACKAGE_QUERY = `query shellGetPackageQuery($name: String!, $version: String) {
  packageVersion: getPackageVersion(name: $name, version: $version) {
    package {
      displayName
    }
    version
    modules {
      name
      publicUrl
      abi
    }
    commands {
      command
      module {
        name
        publicUrl
        abi
      }
    }
  }
}
`;

const STORAGE_KEY = "WAPM_STORAGE";

const execWapmQuery = async (query, variables) => {
  const fetchResponse = await fetch("https://registry.wapm.io/graphql", {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      // operationName: "shellGetCommandQuery",
      query,
      variables
    })
  });
  const response = await fetchResponse.json();
  if (response && response.data) {
    return response.data;
  }
};

const getBinaryFromUrl = async url => {
  const fetched = await fetch(url);
  const buffer = await fetched.arrayBuffer();
  return new Uint8Array(buffer);
};

// const getWAPMPackageFromCommandName = async commandName => {
//   let data = await execWapmQuery(WAPM_COMMAND_GRAPHQL_QUERY, {
//     command: commandName,
//   });
//   if (data && data.command && data.command.packageVersion) {
//     return data.command.packageVersion;
//   } else {
//     throw new Error(`command not found ${commandName}`);
//   }
// };

const getWAPMPackageFromPackageName = async packageName => {
  let version;
  if (packageName.indexOf("@") > -1) {
    const splitted = packageName.split("@");
    packageName = splitted[0];
    version = splitted[1];
  }
  let data = await execWapmQuery(WAPM_PACKAGE_QUERY, {
    name: packageName,
    version: version
  });
  if (data && data.packageVersion) {
    return data.packageVersion;
  } else {
    throw new Error(`Package not found in the registry ${packageName}`);
  }
};

const getWasmBinaryFromUrl = async url => {
  const fetched = await fetch(url);
  const buffer = await fetched.arrayBuffer();
  return new Uint8Array(buffer);
};

export default class WAPM {
  constructor(externalWasmBinaryCache) {
    this.wapmInstalledPackages = [];
    this.wapmCommands = {};
    this.uploadedCommands = {};
    this.cachedModules = {};

    this.wasmFs = new WasmFs();
    // For the file uploads
    this.wasmFs.fs.mkdirSync("/tmp/", { recursive: true });

    // Launch off an update request to our storage
    this._updateFromStorage();
    this.callbackCommands = {
      wapm: this._wapmCallbackCommand.bind(this),
      welcome,
      about,
      help,
      download,
      curl
    };
    this.externalWasmBinaryCache = externalWasmBinaryCache;

    // Create a hidden input on the page for opening files
    const hiddenInput = document.createElement("input");
    hiddenInput.id = "hidden-file-input";
    hiddenInput.classList.add("hidden-file-input");
    hiddenInput.setAttribute("type", "file");
    hiddenInput.setAttribute("accept", ".wasm");
    hiddenInput.setAttribute("hidden", true);
    hiddenInput.addEventListener(
      "change",
      this._onHiddenInputChange.bind(this)
    );
    document.body.appendChild(hiddenInput);
    this._hiddenInput = hiddenInput;

    // A variable for resolving file input
    this.currentInstallResolver = undefined;
  }

  async regenerateWAPMCommands() {
    this.wapmCommands = {};
    for (let packageVersion of this.wapmInstalledPackages) {
      for (let command of packageVersion.commands) {
        if (command.module.abi === "wasi") {
          let commandUrl = command.module.publicUrl;
          this.wapmCommands[command.command] = await this.fetchBinary(
            commandUrl
          );
        }
      }
    }
  }
  async fetchBinary(binaryUrl) {
    if (!(binaryUrl in this.cachedModules)) {
      this.cachedModules[binaryUrl] = await getWasmBinaryFromUrl(binaryUrl);
    }
    return this.cachedModules[binaryUrl];
  }

  // Check if a command is cached
  isCommandCached(commandName) {
    const cachedCommand = this._getCachedCommand(commandName);
    return cachedCommand !== undefined;
  }

  // Get a command from the wapm manager
  async getCommand(options) {
    let commandName = options.args[0];
    // Check if the command was cached
    const cachedCommand = this._getCachedCommand(commandName);
    if (cachedCommand) {
      return cachedCommand;
    }

    // Try to install from WAPM
    return await this._installFromWapmCommand(options);
  }

  async installWasmBinary(commandName, wasmBinary) {
    this.uploadedCommands[commandName] = wasmBinary;
    await this._syncToStorage();
  }

  async _updateFromStorage() {
    const wapmStorage = await idbKeyval.get(STORAGE_KEY);

    if (!wapmStorage) {
      return;
    }

    if (wapmStorage.wapmInstalledPackages) {
      this.wapmInstalledPackages = wapmStorage.wapmInstalledPackages;
    }

    if (wapmStorage.wapmCommands) {
      this.wapmCommands = wapmStorage.wapmCommands;
    }

    if (wapmStorage.uploadedCommands) {
      this.uploadedCommands = wapmStorage.uploadedCommands;
    }

    if (wapmStorage.cachedModules) {
      this.cachedModules = wapmStorage.cachedModules;
    }
  }

  async _syncToStorage() {
    const wapmStorage = {
      wapmInstalledPackages: this.wapmInstalledPackages,
      uploadedCommands: this.uploadedCommands,
      cachedModules: this.cachedModules
    };
    await idbKeyval.set(STORAGE_KEY, wapmStorage);
  }

  _getCachedCommand(commandName) {
    if (this.callbackCommands[commandName]) {
      return this.callbackCommands[commandName];
    }
    if (this.uploadedCommands[commandName]) {
      return this.uploadedCommands[commandName];
    }

    return undefined;
  }

  async _wapmCallbackCommand(options) {
    const args = options.args;
    if (args.length === 1) {
      return this._help();
    }

    if (args[1] === "upload") {
      const commandName = await this._installFromFile();
      const uploadMessage = `Module ${commandName}.wasm installed successfully!
→ Installed commands: ${commandName}`;
      return uploadMessage.replace(/\n\n/g, "\n \n");
    }

    if (args[1] === "install" && args.length === 3) {
      return await this._install(args[2]);
    }

    if (args[1] === "uninstall" && args.length === 3) {
      return await this._uninstall(args[2]);
    }

    if (args[1] === "list") {
      return this._list();
    }

    return this._help();
  }

  _help() {
    const helpMessage = `wapm-cli lite (adapted for WebAssembly.sh)
The Wasmer Engineering Team <engineering@wasmer.io>
WebAssembly Package Manager CLI

USAGE:
    wapm <SUBCOMMAND>

SUBCOMMANDS:
    list                           List the currently installed packages and their commands
    install                        Install a package from Wapm
    upload                         Install a local Wasm module
    uninstall                      Uninstall a package`;

    return helpMessage.replace(/\n\n/g, "\n \n");
  }

  _list() {
    let packageModules = [];
    Object.keys(this.wapmInstalledPackages).forEach(key => {
      let _package = this.wapmInstalledPackages[key];
      _package.modules.forEach(mod => {
        packageModules.push([
          _package.package.displayName,
          _package.version,
          mod.name,
          mod.abi
        ]);
      });
    });

    let packages = [["COMMAND", "VERSION", "MODULE", "ABI"]].concat(
      packageModules
    );

    let commands = [["COMMAND", "TYPE"]]
      .concat(
        Object.keys(this.wapmCommands).map(key => {
          return [`${key}`, "WAPM"];
        })
      )
      .concat(
        Object.keys(this.uploadedCommands).map(key => {
          return [`${key}`, "uploaded by user"];
        })
      )
      .concat(
        Object.keys(this.callbackCommands).map(key => {
          return [`${key}`, "builtin"];
        })
      );

    let message = `LOCAL PACKAGES:
 ${table(packages, { align: ["l"], hsep: " | " }).replace(/\n/g, "\n ")}
    
LOCAL COMMANDS:
 ${table(commands, { align: ["l"], hsep: " | " }).replace(/\n/g, "\n ")}

Additional commands can be installed by: 
    • Running a command from any WASI package in https://wapm.io
    • Uploading a file with \`wapm upload\``;

    return message.replace(/\n\n/g, "\n \n");
  }

  async _install(packageName) {
    let _package = await getWAPMPackageFromPackageName(packageName);
    if (!_package) {
      throw new Error(`Package not found in the registry: ${packageName}`);
    }
    this.wapmInstalledPackages = this.wapmInstalledPackages.filter(
      installedPackage =>
        installedPackage.package.displayName !== _package.package.displayName
    );
    this.wapmInstalledPackages.push(_package);
    await this.regenerateWAPMCommands();
    await this._syncToStorage();
    return `Package ${_package.package.displayName}@${
      _package.version
    } installed successfully!
→ Installed commands: ${_package.commands
      .map(command => command.command)
      .join(", ")}`;
  }

  async _uninstall(packageOrCommandName) {
    // Uninstalling a callback (should error)
    if (this.callbackCommands[packageOrCommandName]) {
      return `Cannot remove the built-in command: \`${packageOrCommandName}\`.`;
    }

    // Uninstalling an uploaded command
    if (this.uploadedCommands[packageOrCommandName]) {
      delete this.uploadedCommands[packageOrCommandName];
      await this._syncToStorage();
      return `Uploaded command "${packageOrCommandName}" uninstalled successfully.`;
    }

    // Uninstalling a wapm package
    let wapmInstalledPackage = this.wapmInstalledPackages.filter(
      installedPackage =>
        installedPackage.package.displayName === packageOrCommandName
    );
    if (wapmInstalledPackage) {
      wapmInstalledPackage = wapmInstalledPackage[0];
      this.wapmInstalledPackages = this.wapmInstalledPackages.filter(
        installedPackage => installedPackage !== wapmInstalledPackage
      );
      await this.regenerateWAPMCommands();

      await this._syncToStorage();
      return `Package "${wapmInstalledPackage.package.displayName}" uninstalled successfully.`;
    }

    return `Package "${packageOrCommandName}" is not installed.`;
  }

  async _installFromWapmCommand({ args, env }) {
    let commandName = args[0];
    // const wasmPackage = await getWAPMPackageFromCommandName(commandName);
    // await this.regenerateWAPMCommands();
    // await this._syncToStorage();
    // return this.wapmCommands[commandName];
    console.log("_installFromWapmCommand");
    const binaryName = `/bin/${commandName}`;
    if (!this.wasmFs.fs.existsSync(binaryName)) {
      this.wasmFs.fs.mkdirpSync("/bin");
      let command = await fetchCommandFromWAPM({args, env});

      const packageUrl = command.packageVersion.distribution.downloadUrl;
      let binary = await getBinaryFromUrl(packageUrl);
    
      const packageVersion = command.packageVersion;
      const installedPath = `/_wasmer/wapm_packages/${packageVersion.package.name}@${packageVersion.version}`;
      
      // We extract the contents on the desired directory
      await extractContents(this.wasmFs, binary, installedPath);
      
      const wasmFullPath = `${installedPath}/${command.module.source}`;
      const filesystem = packageVersion.filesystem;
      const wasmBinary = this.wasmFs.fs.readFileSync(wasmFullPath);
      const loweredBinary = await lowerI64Imports(wasmBinary);
      const loweredFullPath = `${wasmFullPath}.__lowered__`;
      this.wasmFs.fs.writeFileSync(loweredFullPath, loweredBinary);
      let preopens = {};
      filesystem.forEach(({ wasm, host }) => {
        preopens[wasm] = `${installedPath}/${host}`;
      });
      const mainFunction = new Function(`// wasi
return function main(options) {
var preopens = ${JSON.stringify(preopens)};
return {
  "args": options.args,
  "env": options.env,
  // We use the path for the lowered Wasm
  "modulePath": ${JSON.stringify(loweredFullPath)},
  "preopens": preopens,
};
}
`)();
      this.wasmFs.fs.writeFileSync(binaryName, mainFunction.toString());
    }
    let fileContents = this.wasmFs.fs.readFileSync(binaryName, "utf8");
    let mainProgram = new Function(`return ${fileContents}`)();
    let program = mainProgram({args, env});
    if (!(program.modulePath in COMPILED_MODULES)) {
      let programContents;
      try {
        programContents = this.wasmFs.fs.readFileSync(program.modulePath);
      } catch {
        throw new Error(
          `The lowered module ${program.modulePath} doesn't exist`
        );
      }
      COMPILED_MODULES[program.modulePath] = Promise.resolve(
        WebAssembly.compile(programContents)
      );
    }
    program.module = await COMPILED_MODULES[program.modulePath];
    return program;
  }

  async _installFromUrl(commandName, commandUrl) {
    const response = await fetch(commandUrl);
    const buffer = await response.arrayBuffer();
    const wasmBinary = new Uint8Array(buffer);
    this.installWasmBinary(commandName, wasmBinary);
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

    const commandName = file.name.replace(".wasm", "");

    this.installWasmBinary(commandName, wasmBinary);
    return commandName;
  }

  _onHiddenInputChange(event) {
    if (this.currentInstallResolver) {
      this.currentInstallResolver(event.target.files[0]);
    }
  }
}
