export type WebpackCompilation = import("@rspack/core").Compilation;
/**
 * Executes the generator function and caches the result in memory
 * The cache will be invalidated after the logo source file was modified
 *
 * @template TResult
 *
 * @param {string[]} absoluteFilePaths - file paths used used by the generator
 * @param {boolean} useWebpackCache - Support webpack built in cache
 * @param {WebpackCompilation} compilation - the current webpack compilation
 * @param {string[]} eTags - eTags to verify the string
 * @param {(files: { filePath: string, hash: string, content: Buffer }[]) => string} idGenerator
 * @param {(files: { filePath: string, hash: string, content: Buffer }[], id: string) => Promise<TResult>} generator
 *
 * @returns {Promise<TResult>}
 */
export function runCached<TResult>(absoluteFilePaths: string[], useWebpackCache: boolean, compilation: WebpackCompilation, eTags: string[], idGenerator: (files: {
    filePath: string;
    hash: string;
    content: Buffer;
}[]) => string, generator: (files: {
    filePath: string;
    hash: string;
    content: Buffer;
}[], id: string) => Promise<TResult>): Promise<TResult>;
