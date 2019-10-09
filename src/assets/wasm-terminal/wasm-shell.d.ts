import { ActiveCharPrompt, ActivePrompt } from "./shell-utils";
import ShellHistory from "./shell-history";
import WasmTerminalConfig from "../wasm-terminal-config";
import WasmTty from "../wasm-tty/wasm-tty";
import CommandRunner from "../command-runner/command-runner";
/**
 * A shell is the primary interface that is used to start other programs.
 * It's purpose to handle:
 * - Job control (control of child processes),
 * - Control Sequences (CTRL+C to kill the foreground process)
 * - Line editing and history
 * - Output text to the tty -> terminal
 * - Interpret text within the tty to launch processes and interpret programs
 */
declare type AutoCompleteHandler = (index: number, tokens: string[]) => string[];
export default class WasmShell {
    wasmTerminalConfig: WasmTerminalConfig;
    wasmTty: WasmTty;
    history: ShellHistory;
    commandRunner?: CommandRunner;
    maxAutocompleteEntries: number;
    _autocompleteHandlers: AutoCompleteHandler[];
    _active: boolean;
    _activePrompt?: ActivePrompt;
    _activeCharPrompt?: ActiveCharPrompt;
    constructor(wasmTerminalConfig: WasmTerminalConfig, wasmTty: WasmTty, options?: {
        historySize: number;
        maxAutocompleteEntries: number;
    });
    prompt(): Promise<void>;
    /**
     * This function returns a command runner for the specified line
     */
    getCommandRunner(line: string): CommandRunner;
    /**
     * This function completes the current input, calls the given callback
     * and then re-displays the prompt.
     */
    printAndRestartPrompt(callback: () => Promise<any> | undefined): void;
    /**
     * Abort a pending read operation
     */
    abortRead(reason?: string): void;
    /**
     * Move cursor at given direction
     */
    handleCursorMove: (dir: number) => void;
    /**
     * Erase a character at cursor location
     */
    handleCursorErase: (backspace: boolean) => void;
    /**
     * Insert character at cursor location
     */
    handleCursorInsert: (data: string) => void;
    /**
     * Handle input completion
     */
    handleReadComplete: () => void;
    /**
     * Handle terminal -> tty input
     */
    handleTermData: (data: string) => void;
    /**
     * Handle a single piece of information from the terminal -> tty.
     */
    handleData: (data: string) => void;
}
export {};
ng) => void;
}
export {};
