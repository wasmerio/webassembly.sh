export interface ActiveCharPrompt {
    promptPrefix: string;
    promise: Promise<any>;
    resolve?: (what: string) => any;
    reject?: (error: Error) => any;
}
export interface ActivePrompt extends ActiveCharPrompt {
    continuationPromptPrefix: string;
}
/**
 * Detects all the word boundaries on the given input
 */
export declare function wordBoundaries(input: string, leftSide?: boolean): number[];
/**
 * The closest left (or right) word boundary of the given input at the
 * given offset.
 */
export declare function closestLeftBoundary(input: string, offset: number): number;
export declare function closestRightBoundary(input: string, offset: number): number;
/**
 * Checks if there is an incomplete input
 *
 * An incomplete input is considered:
 * - An input that contains unterminated single quotes
 * - An input that contains unterminated double quotes
 * - An input that ends with "\"
 * - An input that has an incomplete boolean shell expression (&& and ||)
 * - An incomplete pipe expression (|)
 */
export declare function isIncompleteInput(input: string): boolean;
/**
 * Returns true if the expression ends on a tailing whitespace
 */
export declare function hasTrailingWhitespace(input: string): boolean;
/**
 * Returns the last expression in the given input
 */
export declare function getLastToken(input: string): string;
/**
 * Returns the auto-complete candidates for the given input
 */
export declare function collectAutocompleteCandidates(callbacks: ((index: number, tokens: string[]) => string[])[], input: string): string[];
