
import { WasmTerminalPlugin } from '@wasmer/wasm-terminal';

const message = `
About
`;

const AboutPlugin = new WasmTerminalPlugin({
  beforeFetchCommand: (commandName) => {
    if (commandName === 'about') {
      return Promise.resolve(() => {
        return message.replace(/\n\n/g, '\n \n');
      });
    }
  }
});

export default AboutPlugin;
