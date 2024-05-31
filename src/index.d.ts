export = FaviconsWebpackPlugin;
declare class FaviconsWebpackPlugin {
    /**
     * @param {import('./options').FaviconWebpackPlugionOptions | string} args
     */
    constructor(args: import('./options').FaviconWebpackPlugionOptions | string);
    /**
     * @param {import('@rspack/core').Compiler} compiler
     */
    apply(compiler: import('@rspack/core').Compiler): void;
    #private;
}
