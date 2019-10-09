import { CommandOptions } from "../command-runner/command";
import WASICommand from "./wasi-command";
export default class Process {
    commandOptions: CommandOptions;
    dataCallback: Function;
    endCallback: Function;
    errorCallback: Function;
    sharedStdin?: Int32Array;
    startStdinReadCallback?: Function;
    wasiCommand?: WASICommand;
    callbackCommand?: any;
    constructor(commandOptions: CommandOptions, dataCallback: Function, endCallback: Function, errorCallback: Function, sharedStdinBuffer?: SharedArrayBuffer, startStdinReadCallback?: Function);
    start(pipedStdinData?: Uint8Array): Promise<void>;
    startWASICommand(pipedStdinData?: Uint8Array): Promise<void>;
    startCallbackCommand(pipedStdinData?: Uint8Array): Promise<void>;
}
