// @ts-check

// Import types
/** @typedef {import("@rspack/core").Compilation} WebpackCompilation */

const path = require('path');
const { getContentHash } = require('./hash');

/**
 * Executes asynchronous function with a callback-style calling convention and returns a promise.
 *
 * @template T, E
 *
 * @param {(cb: (error: E, result: T) => void) => void} func
 * @returns {Promise<T, E>}
 */
function asPromise(func) {
  return new Promise((resolve, reject) => {
    /** @type {(error: E, result: T) => void} */
    const cb = (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    };
    func(cb);
  });
}

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
async function runCached(
  absoluteFilePaths,
  useWebpackCache,
  compilation,
  eTags,
  idGenerator,
  generator,
) {
  // Start generating the favicons
  const faviconsGenerations = await (useWebpackCache
    ? runWithFileCache(
        absoluteFilePaths,
        compilation,
        idGenerator,
        eTags,
        generator,
      )
    : readFiles(absoluteFilePaths, compilation).then((fileContents) =>
        generator(fileContents, idGenerator(fileContents)),
      ));

  return faviconsGenerations;
}

/**
 *
 * Use the webpack cache which supports filesystem caching to improve build speed
 * See also https://webpack.js.org/configuration/other-options/#cache
 * Create one cache for every output target
 *
 * Executes the generator function and stores it in the webpack file cache
 * @template TResult
 *
 * @param {string[]} files - the file pathes to be watched for changes
 * @param {WebpackCompilation} compilation - the current webpack compilation
 * @param {(files: { filePath: string, hash: string, content: Buffer }[]) => string} idGenerator
 * @param {string[]} eTags - eTags to verify the string
 * @param {(files: { filePath: string, hash: string, content: Buffer }[], id: string) => Promise<TResult>} generator
 *
 * @returns {Promise<TResult>}
 */
async function runWithFileCache(
  files,
  compilation,
  idGenerator,
  eTags,
  generator,
) {
  const fileSources = await readFiles(files, compilation);
  const webpackCache = compilation.getCache('favicons-webpack-plugin');
  // Cache invalidation token
  const eTag = [...eTags, fileSources.map(({ hash }) => hash)].join(' ');
  const cacheId = idGenerator(fileSources);

  return webpackCache.providePromise(cacheId, eTag, () =>
    generator(fileSources, cacheId),
  );
}

/**
 * readFiles and get content hashes
 *
 * @param {string[]} absoluteFilePaths
 * @param {WebpackCompilation} compilation
 * @returns {Promise<{filePath: string, hash: string, content: Buffer}[]>}
 */
function readFiles(absoluteFilePaths, compilation) {
  return Promise.all(
    absoluteFilePaths.map(async (absoluteFilePath) => {
      if (!absoluteFilePath) {
        return { filePath: absoluteFilePath, hash: '', content: '' };
      }

      const content = await asPromise((cb) =>
        compilation.inputFileSystem.readFile(
          path.resolve(compilation.compiler.context, absoluteFilePath),
          cb,
        ),
      );

      return {
        filePath: absoluteFilePath,
        hash: getContentHash(content),
        content,
      };
    }),
  );
}

module.exports = { runCached };
