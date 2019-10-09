import WasmTerminalPlugin from "../wasm-terminal-plugin";
import WasmTerminalConfig from "../wasm-terminal-config";
import WasmTty from "../wasm-tty/wasm-tty";
export default class CommandFetcher {
    wasmTerminalConfig: WasmTerminalConfig;
    wasmTerminalPlugins: WasmTerminalPlugin[];
    commandToCompiledModuleCache: {
        [key: string]: WebAssembly.Module;
    };
    wasmTty?: WasmTty;
    constructor(wasmTerminalConfig: WasmTerminalConfig, wasmTerminalPlugins: WasmTerminalPlugin[], wasmTty?: WasmTty);
    getCommandForCommandName(commandName: string, wasmTty?: WasmTty): Promise<WebAssembly.Module>;
    _tryToWriteStatus(message: string): void;
    _tryToClearStatus(): void;
    _getWAPMUrlForCommandName(commandName: String): Promise<any>;
    _getBinaryFromUrl(url: string): Promise<Uint8Array>;
    _getWasmModuleFromBinary(commandBinary: Uint8Array, wasmTransformerWasmUrl: string): Promise<WebAssembly.Module>;
}
