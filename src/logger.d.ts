export type WebpackCompilation = import("@rspack/core").Compilation;
export type WebpackLogger = ReturnType<WebpackCompilation['getLogger']>;
/** @typedef {import("@rspack/core").Compilation} WebpackCompilation */
/** @typedef {ReturnType<WebpackCompilation['getLogger']>} WebpackLogger */
/**
 * Returns the favicon webpack logger instance
 * @see https://webpack.js.org/api/logging/
 *
 * @param {WebpackCompilation} compilation
 * @returns {WebpackLogger}
 */
export function webpackLogger(compilation: WebpackCompilation): WebpackLogger;
