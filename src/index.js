import '../node_modules/normalize.css/normalize.css';
import './style';
import { Component } from 'preact';
import WasmTerminal from '@wasmer/wasm-terminal';

import fetchCommand from './functions/fetch-command';
import { getWelcomeMessage } from './services/wasmman/callback-commands/welcome';

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

    // Let's bind our dropzone
    this.dropZone = document.querySelector('#drop-zone');
    this.dropZone.addEventListener('dragenter', event => {
      event.preventDefault();
      if (!this.dropZone.classList.contains('fade')) {
        this.dropZone.classList.add('fade');
      }
      this.dropZone.classList.add('active');
    });
    this.dropZone.addEventListener('dragover', event => {
      event.preventDefault();
    });
    this.dropZone.addEventListener('dragleave', event => {
      event.preventDefault();
      this.dropZone.classList.remove('active');
    });
    this.dropZone.addEventListener('drop', event => {
      console.log('yooo', event);
      event.preventDefault();

      // Remove the active class
      this.dropZone.classList.remove('active');

      if (event.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (event.dataTransfer.items[i].kind === 'file') {
            var file = event.dataTransfer.items[i].getAsFile();
            console.log('... file[' + i + '].name = ' + file.name);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < event.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
        }
      }
    }); 
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
}
