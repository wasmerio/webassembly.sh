import '../node_modules/normalize.css/normalize.css';
import './style';
import { Component } from 'preact';
import WasmTerminal from '@wasmer/wasm-terminal';

import fetchCommand from './functions/fetch-command/fetch-command';
import { getWelcomeMessage } from './functions/fetch-command/custom-commands/welcome-message';

export default class App extends Component {

  constructor() {
    super();

    const wasmTerminal = new WasmTerminal({
      processWorkerUrl: "./assets/wasm-terminal/process.worker.js",
      fetchCommand: fetchCommand
    });

    this.resizing = false;
    this.wasmTerminal = wasmTerminal;

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
			<main id="wasm-terminal">
			</main>
		);
	}
}
