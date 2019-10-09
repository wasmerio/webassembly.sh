/**
 * Convert offset at the given input to col/row location
 *
 * This function is not optimized and practically emulates via brute-force
 * the navigation on the terminal, wrapping when they reach the column width.
 */
export declare function offsetToColRow(input: string, offset: number, maxCols: number): {
    row: number;
    col: number;
};
/**
 * Counts the lines in the given input
 */
export declare function countLines(input: string, maxCols: number): number;
