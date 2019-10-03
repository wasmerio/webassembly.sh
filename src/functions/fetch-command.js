// Function to be set to our fetchCommand in our WasmTerminal Config
import { fetchCommandFromWAPM } from '@wasmer/wasm-terminal';
import wasmInit, { lowerI64Imports } from "../assets/wasm-transformer";

const callbackCommands = {
  callback: async (args, stdin) => {
    return `Callback Command Working! Args: ${args}, stdin: ${stdin}`;
  }
};

const customWasmModuleUrls = {
  qjs: "assets/wasm-modules/qjs.wasm",
  duk: "assets/wasm-modules/duk.wasm"
};

const commandBinaryCache = {};
let didInitWasmTransformer = false;

const fetchCommand = async (commandName) => {

  // Check the Cache
  if (commandBinaryCache[commandName]) {
    return commandBinaryCache[commandName];
  }

  const callbackCommand = callbackCommands[commandName];
  if (callbackCommand) {
    return callbackCommand;
  }

  // Look for binary commands
  let wasmBinary = undefined;
  
  const commandUrl = customWasmModuleUrls[commandName];

  if (commandUrl) {
    const fetched = await fetch(commandUrl);
    const buffer = await fetched.arrayBuffer();
    wasmBinary = new Uint8Array(buffer);
  } else {
    wasmBinary = await fetchCommandFromWAPM(commandName);
  }

  if (!didInitWasmTransformer) {
    await wasmInit('/assets/wasm-transformer/wasm_transformer_bg.wasm');
    didInitWasmTransformer = true;
  }

  const loweredBinary = lowerI64Imports(wasmBinary);

  // Cache the result
  commandBinaryCache[commandName] = loweredBinary;

  // Return the binary
  return loweredBinary;
};

export default fetchCommand;
