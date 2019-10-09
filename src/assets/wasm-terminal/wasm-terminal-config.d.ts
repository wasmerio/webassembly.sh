export declare type CallbackCommand = (args: string[], stdin: string) => Promise<string>;
declare type FetchCommandFunction = (commandName: string) => Promise<Uint8Array | CallbackCommand>;
export default class WasmTerminalConfig {
    fetchCommand: FetchCommandFunction;
    processWorkerUrl?: string;
    constructor(config: any);
}
export {};
