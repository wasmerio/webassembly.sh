import './style';
import './assets/wasm-terminal/xterm.css';
import { Component } from 'preact';
import WasmTerminal from '@wasmer/wasm-terminal';

export default class App extends Component {

  constructor() {
    super();

    const wasmTerminal = new WasmTerminal({
      wasmTransformerWasmUrl:
      "assets/wasm-terminal/wasm_transformer_bg.wasm",
      processWorkerUrl: "/assets/wasm-terminal/process.worker.js",
      additionalWasmCommands: {
      },
      callbackCommands: {
        // Pass a command run with `hello`, that outputs the following to /dev/stdout
        hello: (args, stdin) => {
          return Promise.resolve(`Hello! Args: ${args}, stdin: ${stdin}`);
        }
      }
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
    this.wasmTerminal.fit();
    this.wasmTerminal.focus();
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
