import { Terminal, IBuffer } from "xterm";
import { ActiveCharPrompt, ActivePrompt } from "../wasm-shell/shell-utils";
export default class WasmTTY {
    xterm: Terminal;
    _termSize: {
        cols: number;
        rows: number;
    };
    _firstInit: boolean;
    _promptPrefix: string;
    _continuationPromptPrefix: string;
    _cursor: number;
    _input: string;
    constructor(xterm: Terminal);
    /**
     * Function to return a deconstructed readPromise
     */
    _getAsyncRead(): {
        promise: Promise<unknown>;
        resolve: undefined;
        reject: undefined;
    };
    /**
     * Return a promise that will resolve when the user has completed
     * typing a single line
     */
    read(promptPrefix: string, continuationPromptPrefix?: string): ActivePrompt;
    /**
     * Return a promise that will be resolved when the user types a single
     * character.
     *
     * This can be active in addition to `.read()` and will be resolved in
     * priority before it.
     */
    readChar(promptPrefix: string): ActiveCharPrompt;
    /**
     * Prints a message and changes line
     */
    println(message: string): void;
    /**
     * Prints a message and properly handles new-lines
     */
    print(message: string): void;
    /**
     * Prints a list of items using a wide-format
     */
    printWide(items: Array<string>, padding?: number): void;
    /**
     * Apply prompts to the given input
     */
    applyPrompts(input: string): string;
    /**
     * Advances the `offset` as required in order to accompany the prompt
     * additions to the input.
     */
    applyPromptOffset(input: string, offset: number): number;
    /**
     * Clears the current prompt
     *
     * This function will erase all the lines that display the current prompt
     * and move the cursor in the beginning of the first line of the prompt.
     */
    clearInput(): void;
    /**
     * Clears the entire Tty
     *
     * This function will erase all the lines that display on the tty,
     * and move the cursor in the beginning of the first line of the prompt.
     */
    clearTty(): void;
    /**
     * Function to return if it is the initial read
     */
    getFirstInit(): boolean;
    /**
     * Function to get the current Prompt prefix
     */
    getPromptPrefix(): string;
    /**
     * Function to get the current Continuation Prompt prefix
     */
    getContinuationPromptPrefix(): string;
    /**
     * Function to get the terminal size
     */
    getTermSize(): {
        rows: number;
        cols: number;
    };
    /**
     * Function to get the current input in the line
     */
    getInput(): string;
    /**
     * Function to get the current cursor
     */
    getCursor(): number;
    /**
     * Function to return the terminal buffer
     */
    getBuffer(): IBuffer;
    /**
     * Replace input with the new input given
     *
     * This function clears all the lines that the current input occupies and
     * then replaces them with the new input.
     */
    setInput(newInput: string, shouldNotClearInput?: boolean): void;
    /**
     * Set the new cursor position, as an offset on the input string
     *
     * This function:
     * - Calculates the previous and current
     */
    setCursor(newCursor: number): void;
    /**
     * Sets the direct cursor value. Should only be used in keystroke contexts
     */
    setCursorDirectly(newCursor: number): void;
    _writeCursorPosition(newCursor: number): void;
    setTermSize(cols: number, rows: number): void;
    setFirstInit(value: boolean): void;
    setPromptPrefix(value: string): void;
    setContinuationPromptPrefix(value: string): void;
}
