"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CiphService = void 0;
const url = require("url");
const querystring = require("querystring");
const HTTPClient_1 = require("./interfaces/HTTPClient");
const jsVarStr = '[a-zA-Z_\\$][a-zA-Z_0-9]*';
const jsSingleQuoteStr = `'[^'\\\\]*(:?\\\\[\\s\\S][^'\\\\]*)*'`;
const jsDoubleQuoteStr = `"[^"\\\\]*(:?\\\\[\\s\\S][^"\\\\]*)*"`;
const jsQuoteStr = `(?:${jsSingleQuoteStr}|${jsDoubleQuoteStr})`;
const jsKeyStr = `(?:${jsVarStr}|${jsQuoteStr})`;
const jsPropStr = `(?:\\.${jsVarStr}|\\[${jsQuoteStr}\\])`;
const jsEmptyStr = `(?:''|"")`;
const reverseStr = ':function\\(a\\)\\{' +
    '(?:return )?a\\.reverse\\(\\)' +
    '\\}';
const sliceStr = ':function\\(a,b\\)\\{' +
    'return a\\.slice\\(b\\)' +
    '\\}';
const spliceStr = ':function\\(a,b\\)\\{' +
    'a\\.splice\\(0,b\\)' +
    '\\}';
const swapStr = ':function\\(a,b\\)\\{' +
    'var c=a\\[0\\];a\\[0\\]=a\\[b(?:%a\\.length)?\\];a\\[b(?:%a\\.length)?\\]=c(?:;return a)?' +
    '\\}';
const actionsObjRegexp = new RegExp(`var (${jsVarStr})=\\{((?:(?:` +
    jsKeyStr + reverseStr + '|' +
    jsKeyStr + sliceStr + '|' +
    jsKeyStr + spliceStr + '|' +
    jsKeyStr + swapStr +
    '),?\\r?\\n?)+)\\};');
const actionsFuncRegexp = new RegExp(`function(?: ${jsVarStr})?\\(a\\)\\{` +
    `a=a\\.split\\(${jsEmptyStr}\\);\\s*` +
    `((?:(?:a=)?${jsVarStr}` +
    jsPropStr +
    '\\(a,\\d+\\);)+)' +
    `return a\\.join\\(${jsEmptyStr}\\)` +
    '\\}');
const reverseRegexp = new RegExp(`(?:^|,)(${jsKeyStr})${reverseStr}`, 'm');
const sliceRegexp = new RegExp(`(?:^|,)(${jsKeyStr})${sliceStr}`, 'm');
const spliceRegexp = new RegExp(`(?:^|,)(${jsKeyStr})${spliceStr}`, 'm');
const swapRegexp = new RegExp(`(?:^|,)(${jsKeyStr})${swapStr}`, 'm');
class CiphService {
    constructor(httpClient) {
        this.httpClient = httpClient;
        this.cache = new Map();
        this.decipher = (tokens, sig) => {
            sig = sig.split('');
            for (let i = 0, len = tokens.length; i < len; i++) {
                let token = tokens[i], pos;
                switch (token[0]) {
                    case 'r':
                        sig = sig.reverse();
                        break;
                    case 'w':
                        pos = ~~token.slice(1);
                        const first = sig[0];
                        sig[0] = sig[pos % sig.length];
                        sig[pos] = first;
                        break;
                    case 's':
                        pos = ~~token.slice(1);
                        sig = sig.slice(pos);
                        break;
                    case 'p':
                        pos = ~~token.slice(1);
                        sig.splice(0, pos);
                        break;
                }
            }
            return sig.join('');
        };
    }
    getTokens(html5playerfile, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedTokens = this.cache.get(html5playerfile);
            const response = yield this.httpClient.request({
                method: HTTPClient_1.HTTPRequestMethod.GET,
                url: html5playerfile
            });
            const tokens = this.extractActions(response.data);
            if (!tokens || !tokens.length) {
                throw new Error('Could not extract signature deciphering actions');
            }
            this.cache.set(html5playerfile, tokens);
            return tokens;
        });
    }
    extractActions(body) {
        const objResult = actionsObjRegexp.exec(body);
        const funcResult = actionsFuncRegexp.exec(body);
        if (!objResult || !funcResult) {
            return null;
        }
        const obj = objResult[1].replace(/\$/g, '\\$');
        const objBody = objResult[2].replace(/\$/g, '\\$');
        const funcBody = funcResult[1].replace(/\$/g, '\\$');
        let result = reverseRegexp.exec(objBody);
        const reverseKey = result && result[1]
            .replace(/\$/g, '\\$')
            .replace(/\$|^'|^"|'$|"$/g, '');
        result = sliceRegexp.exec(objBody);
        const sliceKey = result && result[1]
            .replace(/\$/g, '\\$')
            .replace(/\$|^'|^"|'$|"$/g, '');
        result = spliceRegexp.exec(objBody);
        const spliceKey = result && result[1]
            .replace(/\$/g, '\\$')
            .replace(/\$|^'|^"|'$|"$/g, '');
        result = swapRegexp.exec(objBody);
        const swapKey = result && result[1]
            .replace(/\$/g, '\\$')
            .replace(/\$|^'|^"|'$|"$/g, '');
        const keys = `(${[reverseKey, sliceKey, spliceKey, swapKey].join('|')})`;
        const myreg = '(?:a=)?' + obj +
            `(?:\\.${keys}|\\['${keys}'\\]|\\["${keys}"\\])` +
            '\\(a,(\\d+)\\)';
        const tokenizeRegexp = new RegExp(myreg, 'g');
        const tokens = [];
        while ((result = tokenizeRegexp.exec(funcBody)) !== null) {
            const key = result[1] || result[2] || result[3];
            switch (key) {
                case swapKey:
                    tokens.push('w' + result[4]);
                    break;
                case reverseKey:
                    tokens.push('r');
                    break;
                case sliceKey:
                    tokens.push('s' + result[4]);
                    break;
                case spliceKey:
                    tokens.push('p' + result[4]);
                    break;
            }
        }
        return tokens;
    }
    decipherFormats(formats, html5player, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const decipheredFormats = [];
            const tokens = yield this.getTokens(html5player, options);
            formats.forEach((format) => {
                const cipher = format.signatureCipher || format.cipher;
                if (cipher) {
                    Object.assign(format, querystring.parse(cipher));
                    delete format.signatureCipher;
                    delete format.cipher;
                }
                const sig = tokens && format.s ? this.decipher(tokens, format.s) : null;
                this.setDownloadURL(format, sig);
                decipheredFormats.push(format);
            });
            return decipheredFormats;
        });
    }
    setDownloadURL(format, sig) {
        let decodedUrl;
        if (format.url) {
            decodedUrl = format.url;
        }
        else {
            return;
        }
        try {
            decodedUrl = decodeURIComponent(decodedUrl);
        }
        catch (err) {
            return;
        }
        const parsedUrl = url.parse(decodedUrl, true);
        delete parsedUrl.search;
        const query = parsedUrl.query;
        query.ratebypass = 'yes';
        if (sig) {
            query[format.sp || 'signature'] = sig;
        }
        format.url = url.format(parsedUrl);
    }
}
exports.CiphService = CiphService;
