/// <reference types="node" />
import WASI from "@wasmer/wasi";
import WasmFs from "@wasmer/wasmfs";
import { Command, CommandOptions } from "../command-runner/command";
import { Duplex } from "stream";
export default class WASICommand extends Command {
    wasi: WASI;
    promisedInstance: Promise<WebAssembly.Instance>;
    instance: WebAssembly.Instance | undefined;
    wasmFs: WasmFs;
    sharedStdin?: Int32Array;
    startStdinReadCallback?: Function;
    pipedStdin: string;
    readStdinCounter: number;
    stdoutLog: string;
    stdoutCallback?: Function;
    constructor(options: CommandOptions, sharedStdin?: Int32Array, startStdinReadCallback?: Function);
    instantiate(stdoutCallback?: Function, pipedStdinData?: Uint8Array): Promise<Duplex>;
    run(): void;
    stdoutWrite(stdoutBuffer: Buffer | Uint8Array, offset?: number, length?: number, position?: number): number;
    stdinRead(stdinBuffer: Buffer | Uint8Array, offset?: number, length?: number, position?: number): number;
}
