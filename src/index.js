import '../node_modules/normalize.css/normalize.css';
import './style';
import { Component } from 'preact';
import WasmTerminal from '@wasmer/wasm-terminal';

import fetchCommand, {wasmMan} from './functions/fetch-command';
import { getWelcomeMessage } from './services/wasmman/callback-commands/welcome';

const readFileAsBuffer = file => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = event => {
      resolve(event.target.result);
    } 
    fileReader.onabout = () => {
      reject();
    }
    fileReader.readAsArrayBuffer(file);
  });
}

export default class App extends Component {

  constructor() {
    super();

    const wasmTerminal = new WasmTerminal({
      processWorkerUrl: "./assets/wasm-terminal/process.worker.js",
      fetchCommand: fetchCommand
    });

    this.resizing = false;
    this.wasmTerminal = wasmTerminal;
    this.dropZone = undefined;

    if (window) {
      window.addEventListener('resize', this.onResize.bind(this));
    }
  }

  componentDidMount() {
    this._setupWasmTerminal();
    this._setupDropZone();
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }

  onResize() {
    if (!this.resizing) {
      this.resizing = true;
      setTimeout(() => {
        this.wasmTerminal.fit();
        this.resizing = false;
      }, 16);
    }
  }

	render() {
    return (
      <div class="fullscreen">
        <main id="wasm-terminal">
        </main>
        <div id="drop-zone">
          <h1>Please drop a `.wasm` file.</h1>
        </div>
      </div>
		);
  }

  _setupWasmTerminal() {
    // Let's bind our wasm terminal to it's container
    const containerElement = document.querySelector("#wasm-terminal");
    this.wasmTerminal.print(getWelcomeMessage());
    this.wasmTerminal.open(containerElement);

    // Xterm has this weird bug where it won' fit correctly
    // Thus, create a watcher to force it to fit
    // And stop watching once we fit to 90% height
    const fitXtermOnLoadWatcher = () => {
      const xtermScreen = document.querySelector(".xterm-screen");
      const body = document.body;
      if (xtermScreen) {
        const xtermScreenHeight = xtermScreen.offsetHeight;
        const bodyHeight = body.offsetHeight;
        this.wasmTerminal.fit();
        this.wasmTerminal.focus();
        if (xtermScreenHeight / bodyHeight > 0.9) {
          return;
        }
      }

      setTimeout(() => fitXtermOnLoadWatcher(), 50);
    };
    fitXtermOnLoadWatcher();
  }

  _setupDropZone() {
    this.dropZone = document.querySelector('#drop-zone');

    // Handle the respective drag events, and prevent default to stop the browser from opening the file
    document.body.addEventListener('dragenter', event => {
      event.preventDefault();
      if (!this.dropZone.classList.contains('fade')) {
        this.dropZone.classList.add('fade');
      }
      this.dropZone.classList.add('active');
    });
    document.body.addEventListener('dragover', event => {
      event.preventDefault();
      if (!this.dropZone.classList.contains('active')) {
        this.dropZone.classList.add('active');
      }
    });
    document.body.addEventListener('dragleave', event => {
      event.preventDefault();
      this.dropZone.classList.remove('active');
    });
    document.body.addEventListener('drop', event => {
      event.preventDefault();

      // From MDN under Public Domain:
      // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop

      // Remove the active class
      this.dropZone.classList.remove('active');

      // Use DataTransferItemList interface to access the file(s)
      if (event.dataTransfer.items) {
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (event.dataTransfer.items[i].kind === 'file') {
            var file = event.dataTransfer.items[i].getAsFile();
            this._handleDropFile(file);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.files.length; i++) {
          this._handleDropFile(event.dataTransfer.files[i]);
        }
      }
    }); 
  }

  async _handleDropFile(file) {
    const fileBuffer = await readFileAsBuffer (file);
    const fileBinary = new Uint8Array(fileBuffer);

    wasmMan.installWasmBinary(file.name.replace('.wasm', ''), fileBinary);
  }
}
