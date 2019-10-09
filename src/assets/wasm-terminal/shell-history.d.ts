/**
 * The shell history provides an ring-buffer
 */
export default class ShellHistory {
    size: number;
    entries: Array<string>;
    cursor: number;
    constructor(size: number);
    /**
     * Push an entry and maintain ring buffer size
     */
    push(entry: string): void;
    /**
     * Check if the history includes an entry
     */
    includes(entry: string): boolean;
    /**
     * Rewind history cursor on the last entry
     */
    rewind(): void;
    /**
     * Returns the previous entry
     */
    getPrevious(): string;
    /**
     * Returns the next entry
     */
    getNext(): string;
}
