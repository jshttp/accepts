/*!
 * accepts
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */
const Negotiator = require('negotiator')
const mime = require('mime-types')

/**
 * Module exports.
 * @public
 */
module.exports = Accepts

/**
 * Create a new Accepts object for the given req.
 *
 * @param {object} req
 * @public
 */
function Accepts(req) {
    if (!(this instanceof Accepts)) {
        return new Accepts(req)
    }

    this.headers = req.headers
    this.negotiator = new Negotiator(req)
}

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
 * @param {...String|String[]|String} types
 * @return {String[]|String|false}
 * @public
 */
Accepts.prototype.type = Accepts.prototype.types = function (types) {
    if (arguments.length === 0) {
        return this.negotiator.mediaTypes()
    }

    const arrayTypes = Array.isArray(types) ? types : Array.from(arguments);
    if (!arrayTypes.length) {
        return this.negotiator.mediaTypes()
    }

    // no accept header, return first given type
    if (!this.headers.accept) {
        return arrayTypes[0]
    }

    const mimes = arrayTypes.map(extToMime)
    const first = this.negotiator.mediaType(mimes.filter(validMime))
    return first ? arrayTypes[mimes.indexOf(first)] : false
}

/**
 * Return accepted encodings or best fit based on `encodings`.
 *
 * Given `Accept-Encoding: gzip, deflate`
 * an array sorted by quality is returned:
 *
 *     ['gzip', 'deflate']
 *
 * @param {...String|String[]|String} encodings
 * @return {String[]|String|false}
 * @public
 */
Accepts.prototype.encoding = Accepts.prototype.encodings = function (encodings) {
    if (arguments.length === 0) {
        return this.negotiator.encodings()
    } else if (Array.isArray(encodings)) {
        if (!encodings.length) return this.negotiator.encodings()
        return this.negotiator.encoding(encodings) || false
    }
    return this.negotiator.encoding(Array.from(arguments)) || false
}

/**
 * Return accepted charsets or best fit based on `charsets`.
 *
 * Given `Accept-Charset: utf-8, iso-8859-1;q=0.2, utf-7;q=0.5`
 * an array sorted by quality is returned:
 *
 *     ['utf-8', 'utf-7', 'iso-8859-1']
 *
 * @param {...String|String[]|String} charsets
 * @return {String[]|String|false}
 * @public
 */
Accepts.prototype.charset = Accepts.prototype.charsets = function (charsets) {
    if (arguments.length === 0) {
        return this.negotiator.charsets()
    } else if (Array.isArray(charsets)) {
        if (!charsets.length) return this.negotiator.charsets()
        return this.negotiator.charset(charsets) || false
    }
    return this.negotiator.charset(Array.from(arguments)) || false
}

/**
 * Return accepted languages or best fit based on `langs`.
 *
 * Given `Accept-Language: en;q=0.8, es, pt`
 * an array sorted by quality is returned:
 *
 *     ['es', 'pt', 'en']
 *
 * @param {...String|String[]|String} languages
 * @return {String[]|String|false}
 * @public
 */
Accepts.prototype.lang = Accepts.prototype.langs = Accepts.prototype.language = Accepts.prototype.languages = function (languages) {
    if (arguments.length === 0) {
        return this.negotiator.languages()
    } else if (Array.isArray(languages)) {
        if (!languages.length) return this.negotiator.languages()
        return this.negotiator.language(languages) || false
    }
    return this.negotiator.language(Array.from(arguments)) || false
}

/**
 * Convert extnames to mime.
 *
 * @param {String} type
 * @return {String}
 * @private
 */
function extToMime(type) {
    return type.indexOf('/') === -1
        ? mime.lookup(type)
        : type
}

/**
 * Check if mime is valid.
 *
 * @param {String} type
 * @return {Boolean}
 * @private
 */
function validMime(type) {
    return typeof type === 'string'
}
