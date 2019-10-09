import { Terminal } from "xterm";
import { WebLinksAddon } from "xterm-addon-web-links";
import WasmTerminalConfig from "./wasm-terminal-config";
import WasmTty from "./wasm-tty/wasm-tty";
import WasmShell from "./wasm-shell/wasm-shell";
export default class WasmTerminal {
    xterm: Terminal;
    webLinksAddon: WebLinksAddon;
    wasmTerminalConfig: WasmTerminalConfig;
    wasmTty: WasmTty;
    wasmShell: WasmShell;
    pasteEvent: any;
    resizeEvent: any;
    dataEvent: any;
    isOpen: boolean;
    pendingPrintOnOpen: string;
    constructor(config: any);
    open(container: HTMLElement): void;
    fit(): void;
    focus(): void;
    print(message: string): void;
    runCommand(line: string): void;
    destroy(): void;
    onPaste(data: string): void;
    /**
     * Handle terminal resize
     *
     * This function clears the prompt using the previous configuration,
     * updates the cached terminal size information and then re-renders the
     * input. This leads (most of the times) into a better formatted input.
     */
    handleTermResize: (data: {
        rows: number;
        cols: number;
    }) => void;
}
