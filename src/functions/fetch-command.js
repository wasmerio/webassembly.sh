// Function to be set to our fetchCommand in our WasmTerminal Config
import { lowerI64Imports } from "@wasmer/wasm-transformer";
import WAPM from '../services/wapm/wapm';

const commandBinaryCache = {};
let didInitWasmTransformer = false;
export const wapm = new WAPM(commandBinaryCache);

const fetchCommand = async (options) => {
  let commandName = options.args[0];
  if (window.gtag) {
    window.gtag('event', 'run command', {
      // 'event_category': '',
      'event_label': commandName,
      // 'value': '<here the command args and environment>'
    });
  }

  commandName = commandName.trim();
  // We convert the `wapm run thecommand ...` to `thecommand ...`
  if (commandName.startsWith("wapm run ")) {
    commandName = commandName.substr(9)
  }

  const wapmCommand = await wapm.getCommand(options);
  return wapmCommand;
};

export default fetchCommand;

