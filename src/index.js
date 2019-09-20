import '../node_modules/normalize.css/normalize.css';
import './assets/wasm-terminal/xterm.css';
import './style';
import { Component } from 'preact';
import WasmTerminal, {WasmTerminalPlugin} from '@wasmer/wasm-terminal';

import WelcomeMessagePlugin from './plugins/welcome-message';
import HelpPlugin from './plugins/help';
import AboutPlugin from './plugins/about';
import ListPlugin from './plugins/list';
import CustomWasmModulesPlugin from './plugins/custom-wasm-modules';

export default class App extends Component {

  constructor() {
    super();

    const wasmTerminal = new WasmTerminal({
      wasmTransformerWasmUrl:
      "assets/wasm-terminal/wasm_transformer_bg.wasm",
      processWorkerUrl: "/assets/wasm-terminal/process.worker.js"
    });
    wasmTerminal.addPlugin(WelcomeMessagePlugin);
    wasmTerminal.addPlugin(HelpPlugin);
    wasmTerminal.addPlugin(AboutPlugin);
    wasmTerminal.addPlugin(ListPlugin);
    wasmTerminal.addPlugin(CustomWasmModulesPlugin);

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
