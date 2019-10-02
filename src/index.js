import '../node_modules/normalize.css/normalize.css';
import '../node_modules/@wasmer/wasm-terminal/dist/xterm/xterm.css';
import './style';
import { Component } from 'preact';
import WasmTerminal, { fetchCommandFromWAPM } from '@wasmer/wasm-terminal';
import wasmInit, { lowerI64Imports } from "./assets/wasm-transformer";

export default class App extends Component {

  constructor() {
    super();

    // Let's write handler for the fetchCommand property of the WasmTerminal Config.
    const fetchCommandHandler = async commandName => {
      // Let's return a "CallbackCommand" if our command matches a special name
      if (commandName === "callback-command") {
        const callbackCommand = async (args, stdin) => {
          return `Callback Command Working! Args: ${args}, stdin: ${stdin}`;
        };
        return callbackCommand;
      }

      // Let's fetch a wasm Binary from WAPM for the command name.
      const wasmBinary = await fetchCommandFromWAPM(commandName);

      // Initialize the Wasm Transformer, and use it to lower
      // i64 imports from Wasi Modules, so that most Wasi modules
      // Can run in a Javascript context.
      await wasmInit('./assets/wasm-transformer/wasm_transformer_bg.wasm');
      return lowerI64Imports(wasmBinary);
    };

    const wasmTerminal = new WasmTerminal({
      processWorkerUrl: "./assets/wasm-terminal/process.worker.js",
      fetchCommand: fetchCommandHandler
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
