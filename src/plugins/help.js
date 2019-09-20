
import { WasmTerminalPlugin } from '@wasmer/wasm-terminal';

const message = `
Help
`;

const HelpPlugin = new WasmTerminalPlugin({
  beforeFetchCommand: (commandName) => {
    if (commandName === 'help') {
      return Promise.resolve(() => {
        return message.replace(/\n\n/g, '\n \n');
      });
    }
  }
});

export default HelpPlugin;
