
import { WasmTerminalPlugin } from '@wasmer/wasm-terminal';

const message = `
List
`;

const ListPlugin = new WasmTerminalPlugin({
  beforeFetchCommand: (commandName) => {
    if (commandName === 'list') {
      return Promise.resolve(() => {
        return message.replace(/\n\n/g, '\n \n');
      });
    }
  }
});

export default ListPlugin;
