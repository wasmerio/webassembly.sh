import { WasmTerminalPlugin } from '@wasmer/wasm-terminal';

const customWasmModuleUrls = {
  qjs: "assets/wasm-modules/qjs.wasm",
  duk: "assets/wasm-modules/duk.wasm"
}

const CustomWasmModulesPlugin = new WasmTerminalPlugin({
  beforeFetchCommand: (commandName) => {
    if (customWasmModuleUrls[commandName]) {
      return Promise.resolve(customWasmModuleUrls[commandName]);
    }
  }
});

export default CustomWasmModulesPlugin;
