import { Extension } from 'micromark-util-types';
interface Options {
    singleTilde?: boolean;
}
/**
 * @typedef Options
 * @property {boolean} [singleTilde=true]
 *   Whether to support strikethrough with a single tilde (`boolean`, default:
 *   `true`).
 *   Single tildes work on github.com, but are technically prohibited by the
 *   GFM spec.
 */
/**
 * @param {Options} [options]
 * @returns {Extension}
 */
declare let pandocHighlight: (options?: Options) => Extension;
export { pandocHighlight };
