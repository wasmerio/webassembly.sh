/// <reference types="node" />
import { Duplex } from "stream";
export declare type CommandOptions = {
    args: string[];
    env: {
        [key: string]: string;
    };
    module?: WebAssembly.Module;
    callback?: Function;
};
export declare class Command {
    args: string[];
    env: {
        [key: string]: string;
    };
    constructor({ args, env }: CommandOptions);
    run(): void;
    instantiate(stdoutCallback?: Function, pipedStdinData?: Uint8Array): Promise<Duplex> | Duplex;
    getStdout(): string;
    kill(): Promise<void>;
}
