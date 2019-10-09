interface WasmTerminalPluginConfig {
    [commandOption: string]: any;
}
export declare type CallbackCommand = (args: string[], stdin: string) => Promise<string | undefined>;
export default class WasmTerminalPlugin {
    afterOpen?: () => string | undefined;
    beforeFetchCommand?: (commandName: string) => Promise<string> | Promise<Uint8Array> | Promise<CallbackCommand> | Promise<undefined> | undefined;
    constructor(config: WasmTerminalPluginConfig);
    apply(functionName: string, params?: any[]): any;
}
export {};
