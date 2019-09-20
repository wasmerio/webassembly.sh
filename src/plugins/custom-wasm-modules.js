import { WasmTerminalPlugin } from '@wasmer/wasm-terminal';

const helpText = `
ayye lmao

`;

const HelpPlugin = new WasmTerminalPlugin({
  beforeFetchCommand: (commandName) => {
    if (commandName === 'help') {
      return Promise.resolve(() => {
        return helpText;
      });
    }
  }
});

export default HelpPlugin;
