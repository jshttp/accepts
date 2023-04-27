/*!
 * accepts
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
declare const Negotiator: any;
declare const mime: any;
/**
 * Create a new Accepts Class for the given req.
 *
 * @param {object} req
 * @public
 */
declare class Accepts {
    negotiator: any;
    headers: Headers | undefined;
    constructor(req: Request);
    /**
     * Check if the given `type(s)` is acceptable, returning
     * the best match when true, otherwise `undefined`, in which
     * case you should respond with 406 "Not Acceptable".
     *
     * The `type` value may be a single mime type string
     * such as "application/json", the extension name
     * such as "json" or an array `["json", "html", "text/plain"]`. When a list
     * or array is given the _best_ match, if any is returned.
     *
     * Examples:
     *
     *     // Accept: text/html
     *     this.types('html');
     *     // => "html"
     *
     *     // Accept: text/*, application/json
     *     this.types('html');
     *     // => "html"
     *     this.types('text/html');
     *     // => "text/html"
     *     this.types('json', 'text');
     *     // => "json"
     *     this.types('application/json');
     *     // => "application/json"
     *
     *     // Accept: text/*, application/json
     *     this.types('image/png');
     *     this.types('png');
     *     // => undefined
     *
     *     // Accept: text/*;q=.5, application/json
     *     this.types(['html', 'json']);
     *     this.types('html', 'json');
     *     // => "json"
     *
     * @param {String|Array} types...
     * @return {String|Array|Boolean}
     * @public
     */
    types(types_: string | string[]): string | string[] | boolean;
    /**
     * Return accepted encodings or best fit based on `encodings`.
     *
     * Given `Accept-Encoding: gzip, deflate`
     * an array sorted by quality is returned:
     *
     *     ['gzip', 'deflate']
     *
     * @param {String|Array} encodings...
     * @return {String|Array}
     * @public
     */
    encodings(encodings_: string | string[]): string | string[];
    /**
     * Return accepted charsets or best fit based on `charsets`.
     *
     * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
     * an array sorted by quality is returned:
     *
     *     ['utf-8', 'utf-7', 'iso-8859-1']
     *
     * @param {String|Array} charsets...
     * @return {String|Array}
     * @public
     */
    charsets(charsets_: string | string[]): string | string[];
    /**
     * Return accepted languages or best fit based on `langs`.
     *
     * Given `Accept-Language: en;q=0.8, es, pt`
     * an array sorted by quality is returned:
     *
     *     ['es', 'pt', 'en']
     *
     * @param {String|Array} langs...
     * @return {Array|String}
     * @public
     */
    languages(languages_: string | string[]): string | string[];
    lang(languages_: string | string[]): string | string[];
}
/**
 * Convert extnames to mime.
 *
 * @param {String} type
 * @return {String}
 * @private
 */
declare function extToMime(type: string): string;
/**
 * Check if mime is valid.
 *
 * @param {String} type
 * @return {String}
 * @private
 */
declare function validMime(type: string): boolean;
