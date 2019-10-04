// Function to be set to our fetchCommand in our WasmTerminal Config
import { fetchCommandFromWAPM } from '@wasmer/wasm-terminal';
import wasmInit, { lowerI64Imports } from "../assets/wasm-transformer";
import WasmMan from '../services/wasmman/wasmman';

const commandBinaryCache = {};
let didInitWasmTransformer = false;
const wasmMan = new WasmMan(commandBinaryCache);

const fetchCommand = async (commandName) => {

  // Check the Cache
  if (commandBinaryCache[commandName]) {
    return commandBinaryCache[commandName];
  }

  const wasmManCommand = await wasmMan.getCommand(commandName);

  if (typeof wasmManCommand === 'function') {
    return wasmManCommand;
  }

  if (!didInitWasmTransformer) {
    await wasmInit('/assets/wasm-transformer/wasm_transformer_bg.wasm');
    didInitWasmTransformer = true;
  }

  const loweredBinary = lowerI64Imports(wasmManCommand);

  // Cache the result
  commandBinaryCache[commandName] = loweredBinary;

  // Return the binary
  return loweredBinary;
};

export default fetchCommand;
