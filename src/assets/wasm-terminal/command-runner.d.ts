import Process from "../process/process";
import { CommandOptions } from "./command";
import WasmTerminalConfig from "../wasm-terminal-config";
import WasmTty from "../wasm-tty/wasm-tty";
export default class CommandRunner {
    commandOptionsForProcessesToRun: Array<any>;
    spawnedProcessObjects: Array<any>;
    spawnedProcesses: number;
    pipedStdinDataForNextProcess: Uint8Array;
    isRunning: boolean;
    supportsSharedArrayBuffer: boolean;
    wasmTerminalConfig: WasmTerminalConfig;
    commandString: string;
    commandStartReadCallback: Function;
    commandEndCallback: Function;
    wasmTty?: WasmTty;
    constructor(wasmTerminalConfig: WasmTerminalConfig, commandString: string, commandStartReadCallback: Function, commandEndCallback: Function, wasmTty?: WasmTty);
    runCommand(): Promise<void>;
    kill(): void;
    _addStdinToSharedStdin(data: Uint8Array, processObjectIndex: number): void;
    _tryToSpawnProcess(commandOptionIndex: number): Promise<void>;
    _spawnProcess(commandOptionIndex: number): Promise<void>;
    _spawnProcessAsWorker(commandOptionIndex: number): Promise<{
        process: any;
        worker: Worker;
        sharedStdin: Int32Array;
    }>;
    _spawnProcessAsService(commandOptionIndex: number): Promise<{
        process: Process;
    }>;
    _processDataCallback(commandOptionIndex: number, data: Uint8Array): void;
    _processEndCallback(commandOptionIndex: number, processWorker?: Worker): void;
    _processErrorCallback(commandOptionIndex: number, error: string): void;
    _processStartStdinReadCallback(): void;
    _getBlobUrlForProcessWorker(processWorkerUrl: string, wasmTty?: WasmTty): Promise<string>;
    _getCommandOptionsFromAST(ast: any, wasmTerminalConfig: WasmTerminalConfig, wasmTty?: WasmTty): Promise<Array<CommandOptions>>;
}
