'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Axios__default = /*#__PURE__*/_interopDefaultLegacy(Axios);

/**
 * Take input from [0, n] and return it as [0, 1]
 * @hidden
 */
function bound01(n, max) {
    if (isOnePointZero(n)) {
        n = '100%';
    }
    var isPercent = isPercentage(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    // Automatically convert percentage into number
    if (isPercent) {
        n = parseInt(String(n * max), 10) / 100;
    }
    // Handle floating point rounding errors
    if (Math.abs(n - max) < 0.000001) {
        return 1;
    }
    // Convert into [0, 1] range if it isn't already
    if (max === 360) {
        // If n is a hue given in degrees,
        // wrap around out-of-range values into [0, 360] range
        // then convert into [0, 1].
        n = (n < 0 ? (n % max) + max : n % max) / parseFloat(String(max));
    }
    else {
        // If n not a hue given in degrees
        // Convert into [0, 1] range if it isn't already.
        n = (n % max) / parseFloat(String(max));
    }
    return n;
}
/**
 * Force a number between 0 and 1
 * @hidden
 */
function clamp01(val) {
    return Math.min(1, Math.max(0, val));
}
/**
 * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
 * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
 * @hidden
 */
function isOnePointZero(n) {
    return typeof n === 'string' && n.includes('.') && parseFloat(n) === 1;
}
/**
 * Check to see if string passed in is a percentage
 * @hidden
 */
function isPercentage(n) {
    return typeof n === 'string' && n.includes('%');
}
/**
 * Return a valid alpha value [0,1] with all invalid values being set to 1
 * @hidden
 */
function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }
    return a;
}
/**
 * Replace a decimal with it's percentage value
 * @hidden
 */
function convertToPercentage(n) {
    if (n <= 1) {
        return Number(n) * 100 + "%";
    }
    return n;
}
/**
 * Force a hex value to have 2 characters
 * @hidden
 */
function pad2(c) {
    return c.length === 1 ? '0' + c : String(c);
}

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
/**
 * Handle bounds / percentage checking to conform to CSS color spec
 * <http://www.w3.org/TR/css3-color/>
 * *Assumes:* r, g, b in [0, 255] or [0, 1]
 * *Returns:* { r, g, b } in [0, 255]
 */
function rgbToRgb(r, g, b) {
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255,
    };
}
/**
 * Converts an RGB color value to HSL.
 * *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
 * *Returns:* { h, s, l } in [0,1]
 */
function rgbToHsl(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var l = (max + min) / 2;
    if (max === min) {
        s = 0;
        h = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h: h, s: s, l: l };
}
function hue2rgb(p, q, t) {
    if (t < 0) {
        t += 1;
    }
    if (t > 1) {
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + (q - p) * (6 * t);
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
}
/**
 * Converts an HSL color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */
function hslToRgb(h, s, l) {
    var r;
    var g;
    var b;
    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);
    if (s === 0) {
        // achromatic
        g = l;
        b = l;
        r = l;
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
}
/**
 * Converts an RGB color value to HSV
 *
 * *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
 * *Returns:* { h, s, v } in [0,1]
 */
function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var v = max;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0; // achromatic
    }
    else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}
/**
 * Converts an HSV color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */
function hsvToRgb(h, s, v) {
    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    var i = Math.floor(h);
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];
    return { r: r * 255, g: g * 255, b: b * 255 };
}
/**
 * Converts an RGB color to hex
 *
 * Assumes r, g, and b are contained in the set [0, 255]
 * Returns a 3 or 6 character hex
 */
function rgbToHex(r, g, b, allow3Char) {
    var hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16)),
    ];
    // Return a 3 character hex if possible
    if (allow3Char &&
        hex[0].startsWith(hex[0].charAt(1)) &&
        hex[1].startsWith(hex[1].charAt(1)) &&
        hex[2].startsWith(hex[2].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join('');
}
/**
 * Converts an RGBA color plus alpha transparency to hex
 *
 * Assumes r, g, b are contained in the set [0, 255] and
 * a in [0, 1]. Returns a 4 or 8 character rgba hex
 */
// eslint-disable-next-line max-params
function rgbaToHex(r, g, b, a, allow4Char) {
    var hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16)),
        pad2(convertDecimalToHex(a)),
    ];
    // Return a 4 character hex if possible
    if (allow4Char &&
        hex[0].startsWith(hex[0].charAt(1)) &&
        hex[1].startsWith(hex[1].charAt(1)) &&
        hex[2].startsWith(hex[2].charAt(1)) &&
        hex[3].startsWith(hex[3].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }
    return hex.join('');
}
/** Converts a decimal to a hex value */
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
/** Converts a hex value to a decimal */
function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
}
/** Parse a base-16 hex value into a base-10 integer */
function parseIntFromHex(val) {
    return parseInt(val, 16);
}
function numberInputToObject(color) {
    return {
        r: color >> 16,
        g: (color & 0xff00) >> 8,
        b: color & 0xff,
    };
}

// https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json
/**
 * @hidden
 */
var names = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    goldenrod: '#daa520',
    gold: '#ffd700',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavenderblush: '#fff0f5',
    lavender: '#e6e6fa',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32',
};

/**
 * Given a string or object, convert that input to RGB
 *
 * Possible string inputs:
 * ```
 * "red"
 * "#f00" or "f00"
 * "#ff0000" or "ff0000"
 * "#ff000000" or "ff000000"
 * "rgb 255 0 0" or "rgb (255, 0, 0)"
 * "rgb 1.0 0 0" or "rgb (1, 0, 0)"
 * "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
 * "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
 * "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
 * "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
 * "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
 * ```
 */
function inputToRGB(color) {
    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;
    if (typeof color === 'string') {
        color = stringInputToObject(color);
    }
    if (typeof color === 'object') {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = 'hsv';
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = 'hsl';
        }
        if (Object.prototype.hasOwnProperty.call(color, 'a')) {
            a = color.a;
        }
    }
    a = boundAlpha(a);
    return {
        ok: ok,
        format: color.format || format,
        r: Math.min(255, Math.max(rgb.r, 0)),
        g: Math.min(255, Math.max(rgb.g, 0)),
        b: Math.min(255, Math.max(rgb.b, 0)),
        a: a,
    };
}
// <http://www.w3.org/TR/css3-values/#integers>
var CSS_INTEGER = '[-\\+]?\\d+%?';
// <http://www.w3.org/TR/css3-values/#number-value>
var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
// Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
// Actual matching.
// Parentheses and commas are optional, but not required.
// Whitespace can take the place of commas or opening paren
var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
    rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
    hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
    hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
    hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
    hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
};
/**
 * Permissive string parsing.  Take in a number of formats, and output an object
 * based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
 */
function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
        return false;
    }
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color === 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: 'name' };
    }
    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match = matchers.rgb.exec(color);
    if (match) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.hex8.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? 'name' : 'hex8',
        };
    }
    match = matchers.hex6.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? 'name' : 'hex',
        };
    }
    match = matchers.hex4.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            a: convertHexToDecimal(match[4] + match[4]),
            format: named ? 'name' : 'hex8',
        };
    }
    match = matchers.hex3.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            format: named ? 'name' : 'hex',
        };
    }
    return false;
}
/**
 * Check to see if it looks like a CSS unit
 * (see `matchers` above for definition).
 */
function isValidCSSUnit(color) {
    return Boolean(matchers.CSS_UNIT.exec(String(color)));
}

var TinyColor = /** @class */ (function () {
    function TinyColor(color, opts) {
        if (color === void 0) { color = ''; }
        if (opts === void 0) { opts = {}; }
        var _a;
        // If input is already a tinycolor, return itself
        if (color instanceof TinyColor) {
            // eslint-disable-next-line no-constructor-return
            return color;
        }
        if (typeof color === 'number') {
            color = numberInputToObject(color);
        }
        this.originalInput = color;
        var rgb = inputToRGB(color);
        this.originalInput = color;
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        this.a = rgb.a;
        this.roundA = Math.round(100 * this.a) / 100;
        this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
        this.gradientType = opts.gradientType;
        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (this.r < 1) {
            this.r = Math.round(this.r);
        }
        if (this.g < 1) {
            this.g = Math.round(this.g);
        }
        if (this.b < 1) {
            this.b = Math.round(this.b);
        }
        this.isValid = rgb.ok;
    }
    TinyColor.prototype.isDark = function () {
        return this.getBrightness() < 128;
    };
    TinyColor.prototype.isLight = function () {
        return !this.isDark();
    };
    /**
     * Returns the perceived brightness of the color, from 0-255.
     */
    TinyColor.prototype.getBrightness = function () {
        // http://www.w3.org/TR/AERT#color-contrast
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    };
    /**
     * Returns the perceived luminance of a color, from 0-1.
     */
    TinyColor.prototype.getLuminance = function () {
        // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = this.toRgb();
        var R;
        var G;
        var B;
        var RsRGB = rgb.r / 255;
        var GsRGB = rgb.g / 255;
        var BsRGB = rgb.b / 255;
        if (RsRGB <= 0.03928) {
            R = RsRGB / 12.92;
        }
        else {
            // eslint-disable-next-line prefer-exponentiation-operator
            R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
        }
        if (GsRGB <= 0.03928) {
            G = GsRGB / 12.92;
        }
        else {
            // eslint-disable-next-line prefer-exponentiation-operator
            G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
        }
        if (BsRGB <= 0.03928) {
            B = BsRGB / 12.92;
        }
        else {
            // eslint-disable-next-line prefer-exponentiation-operator
            B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };
    /**
     * Returns the alpha value of a color, from 0-1.
     */
    TinyColor.prototype.getAlpha = function () {
        return this.a;
    };
    /**
     * Sets the alpha value on the current color.
     *
     * @param alpha - The new alpha value. The accepted range is 0-1.
     */
    TinyColor.prototype.setAlpha = function (alpha) {
        this.a = boundAlpha(alpha);
        this.roundA = Math.round(100 * this.a) / 100;
        return this;
    };
    /**
     * Returns the object as a HSVA object.
     */
    TinyColor.prototype.toHsv = function () {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
    };
    /**
     * Returns the hsva values interpolated into a string with the following format:
     * "hsva(xxx, xxx, xxx, xx)".
     */
    TinyColor.prototype.toHsvString = function () {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        var h = Math.round(hsv.h * 360);
        var s = Math.round(hsv.s * 100);
        var v = Math.round(hsv.v * 100);
        return this.a === 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this.roundA + ")";
    };
    /**
     * Returns the object as a HSLA object.
     */
    TinyColor.prototype.toHsl = function () {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
    };
    /**
     * Returns the hsla values interpolated into a string with the following format:
     * "hsla(xxx, xxx, xxx, xx)".
     */
    TinyColor.prototype.toHslString = function () {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        var h = Math.round(hsl.h * 360);
        var s = Math.round(hsl.s * 100);
        var l = Math.round(hsl.l * 100);
        return this.a === 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this.roundA + ")";
    };
    /**
     * Returns the hex value of the color.
     * @param allow3Char will shorten hex value to 3 char if possible
     */
    TinyColor.prototype.toHex = function (allow3Char) {
        if (allow3Char === void 0) { allow3Char = false; }
        return rgbToHex(this.r, this.g, this.b, allow3Char);
    };
    /**
     * Returns the hex value of the color -with a # appened.
     * @param allow3Char will shorten hex value to 3 char if possible
     */
    TinyColor.prototype.toHexString = function (allow3Char) {
        if (allow3Char === void 0) { allow3Char = false; }
        return '#' + this.toHex(allow3Char);
    };
    /**
     * Returns the hex 8 value of the color.
     * @param allow4Char will shorten hex value to 4 char if possible
     */
    TinyColor.prototype.toHex8 = function (allow4Char) {
        if (allow4Char === void 0) { allow4Char = false; }
        return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    };
    /**
     * Returns the hex 8 value of the color -with a # appened.
     * @param allow4Char will shorten hex value to 4 char if possible
     */
    TinyColor.prototype.toHex8String = function (allow4Char) {
        if (allow4Char === void 0) { allow4Char = false; }
        return '#' + this.toHex8(allow4Char);
    };
    /**
     * Returns the object as a RGBA object.
     */
    TinyColor.prototype.toRgb = function () {
        return {
            r: Math.round(this.r),
            g: Math.round(this.g),
            b: Math.round(this.b),
            a: this.a,
        };
    };
    /**
     * Returns the RGBA values interpolated into a string with the following format:
     * "RGBA(xxx, xxx, xxx, xx)".
     */
    TinyColor.prototype.toRgbString = function () {
        var r = Math.round(this.r);
        var g = Math.round(this.g);
        var b = Math.round(this.b);
        return this.a === 1 ? "rgb(" + r + ", " + g + ", " + b + ")" : "rgba(" + r + ", " + g + ", " + b + ", " + this.roundA + ")";
    };
    /**
     * Returns the object as a RGBA object.
     */
    TinyColor.prototype.toPercentageRgb = function () {
        var fmt = function (x) { return Math.round(bound01(x, 255) * 100) + "%"; };
        return {
            r: fmt(this.r),
            g: fmt(this.g),
            b: fmt(this.b),
            a: this.a,
        };
    };
    /**
     * Returns the RGBA relative values interpolated into a string
     */
    TinyColor.prototype.toPercentageRgbString = function () {
        var rnd = function (x) { return Math.round(bound01(x, 255) * 100); };
        return this.a === 1
            ? "rgb(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%)"
            : "rgba(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%, " + this.roundA + ")";
    };
    /**
     * The 'real' name of the color -if there is one.
     */
    TinyColor.prototype.toName = function () {
        if (this.a === 0) {
            return 'transparent';
        }
        if (this.a < 1) {
            return false;
        }
        var hex = '#' + rgbToHex(this.r, this.g, this.b, false);
        for (var _i = 0, _a = Object.entries(names); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (hex === value) {
                return key;
            }
        }
        return false;
    };
    /**
     * String representation of the color.
     *
     * @param format - The format to be used when displaying the string representation.
     */
    TinyColor.prototype.toString = function (format) {
        var formatSet = Boolean(format);
        format = format !== null && format !== void 0 ? format : this.format;
        var formattedString = false;
        var hasAlpha = this.a < 1 && this.a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith('hex') || format === 'name');
        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === 'name' && this.a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === 'rgb') {
            formattedString = this.toRgbString();
        }
        if (format === 'prgb') {
            formattedString = this.toPercentageRgbString();
        }
        if (format === 'hex' || format === 'hex6') {
            formattedString = this.toHexString();
        }
        if (format === 'hex3') {
            formattedString = this.toHexString(true);
        }
        if (format === 'hex4') {
            formattedString = this.toHex8String(true);
        }
        if (format === 'hex8') {
            formattedString = this.toHex8String();
        }
        if (format === 'name') {
            formattedString = this.toName();
        }
        if (format === 'hsl') {
            formattedString = this.toHslString();
        }
        if (format === 'hsv') {
            formattedString = this.toHsvString();
        }
        return formattedString || this.toHexString();
    };
    TinyColor.prototype.toNumber = function () {
        return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    };
    TinyColor.prototype.clone = function () {
        return new TinyColor(this.toString());
    };
    /**
     * Lighten the color a given amount. Providing 100 will always return white.
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.lighten = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor(hsl);
    };
    /**
     * Brighten the color a given amount, from 0 to 100.
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.brighten = function (amount) {
        if (amount === void 0) { amount = 10; }
        var rgb = this.toRgb();
        rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
        rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
        rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
        return new TinyColor(rgb);
    };
    /**
     * Darken the color a given amount, from 0 to 100.
     * Providing 100 will always return black.
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.darken = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor(hsl);
    };
    /**
     * Mix the color with pure white, from 0 to 100.
     * Providing 0 will do nothing, providing 100 will always return white.
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.tint = function (amount) {
        if (amount === void 0) { amount = 10; }
        return this.mix('white', amount);
    };
    /**
     * Mix the color with pure black, from 0 to 100.
     * Providing 0 will do nothing, providing 100 will always return black.
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.shade = function (amount) {
        if (amount === void 0) { amount = 10; }
        return this.mix('black', amount);
    };
    /**
     * Desaturate the color a given amount, from 0 to 100.
     * Providing 100 will is the same as calling greyscale
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.desaturate = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor(hsl);
    };
    /**
     * Saturate the color a given amount, from 0 to 100.
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.saturate = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor(hsl);
    };
    /**
     * Completely desaturates a color into greyscale.
     * Same as calling `desaturate(100)`
     */
    TinyColor.prototype.greyscale = function () {
        return this.desaturate(100);
    };
    /**
     * Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
     * Values outside of this range will be wrapped into this range.
     */
    TinyColor.prototype.spin = function (amount) {
        var hsl = this.toHsl();
        var hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return new TinyColor(hsl);
    };
    /**
     * Mix the current color a given amount with another color, from 0 to 100.
     * 0 means no mixing (return current color).
     */
    TinyColor.prototype.mix = function (color, amount) {
        if (amount === void 0) { amount = 50; }
        var rgb1 = this.toRgb();
        var rgb2 = new TinyColor(color).toRgb();
        var p = amount / 100;
        var rgba = {
            r: (rgb2.r - rgb1.r) * p + rgb1.r,
            g: (rgb2.g - rgb1.g) * p + rgb1.g,
            b: (rgb2.b - rgb1.b) * p + rgb1.b,
            a: (rgb2.a - rgb1.a) * p + rgb1.a,
        };
        return new TinyColor(rgba);
    };
    TinyColor.prototype.analogous = function (results, slices) {
        if (results === void 0) { results = 6; }
        if (slices === void 0) { slices = 30; }
        var hsl = this.toHsl();
        var part = 360 / slices;
        var ret = [this];
        for (hsl.h = (hsl.h - ((part * results) >> 1) + 720) % 360; --results;) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(new TinyColor(hsl));
        }
        return ret;
    };
    /**
     * taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
     */
    TinyColor.prototype.complement = function () {
        var hsl = this.toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return new TinyColor(hsl);
    };
    TinyColor.prototype.monochromatic = function (results) {
        if (results === void 0) { results = 6; }
        var hsv = this.toHsv();
        var h = hsv.h;
        var s = hsv.s;
        var v = hsv.v;
        var res = [];
        var modification = 1 / results;
        while (results--) {
            res.push(new TinyColor({ h: h, s: s, v: v }));
            v = (v + modification) % 1;
        }
        return res;
    };
    TinyColor.prototype.splitcomplement = function () {
        var hsl = this.toHsl();
        var h = hsl.h;
        return [
            this,
            new TinyColor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
            new TinyColor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l }),
        ];
    };
    /**
     * Compute how the color would appear on a background
     */
    TinyColor.prototype.onBackground = function (background) {
        var fg = this.toRgb();
        var bg = new TinyColor(background).toRgb();
        return new TinyColor({
            r: bg.r + (fg.r - bg.r) * fg.a,
            g: bg.g + (fg.g - bg.g) * fg.a,
            b: bg.b + (fg.b - bg.b) * fg.a,
        });
    };
    /**
     * Alias for `polyad(3)`
     */
    TinyColor.prototype.triad = function () {
        return this.polyad(3);
    };
    /**
     * Alias for `polyad(4)`
     */
    TinyColor.prototype.tetrad = function () {
        return this.polyad(4);
    };
    /**
     * Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
     * monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...
     */
    TinyColor.prototype.polyad = function (n) {
        var hsl = this.toHsl();
        var h = hsl.h;
        var result = [this];
        var increment = 360 / n;
        for (var i = 1; i < n; i++) {
            result.push(new TinyColor({ h: (h + i * increment) % 360, s: hsl.s, l: hsl.l }));
        }
        return result;
    };
    /**
     * compare color vs current color
     */
    TinyColor.prototype.equals = function (color) {
        return this.toRgbString() === new TinyColor(color).toRgbString();
    };
    return TinyColor;
}());

var hueStep = 2; // 色相阶梯

var saturationStep = 0.16; // 饱和度阶梯，浅色部分

var saturationStep2 = 0.05; // 饱和度阶梯，深色部分

var brightnessStep1 = 0.05; // 亮度阶梯，浅色部分

var brightnessStep2 = 0.15; // 亮度阶梯，深色部分

var lightColorCount = 5; // 浅色数量，主色上

var darkColorCount = 4; // 深色数量，主色下
// 暗色主题颜色映射关系表

var darkColorMap = [{
  index: 7,
  opacity: 0.15
}, {
  index: 6,
  opacity: 0.25
}, {
  index: 5,
  opacity: 0.3
}, {
  index: 5,
  opacity: 0.45
}, {
  index: 5,
  opacity: 0.65
}, {
  index: 5,
  opacity: 0.85
}, {
  index: 4,
  opacity: 0.9
}, {
  index: 3,
  opacity: 0.95
}, {
  index: 2,
  opacity: 0.97
}, {
  index: 1,
  opacity: 0.98
}];

function getHue(hsv, i, light) {
  var hue; // 根据色相不同，色相转向不同

  if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
    hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
  } else {
    hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
  }

  if (hue < 0) {
    hue += 360;
  } else if (hue >= 360) {
    hue -= 360;
  }

  return hue;
}

function getSaturation(hsv, i, light) {
  // grey color don't change saturation
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s;
  }

  var saturation;

  if (light) {
    saturation = hsv.s - saturationStep * i;
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep;
  } else {
    saturation = hsv.s + saturationStep2 * i;
  } // 边界值修正


  if (saturation > 1) {
    saturation = 1;
  } // 第一格的 s 限制在 0.06-0.1 之间


  if (light && i === lightColorCount && saturation > 0.1) {
    saturation = 0.1;
  }

  if (saturation < 0.06) {
    saturation = 0.06;
  }

  return Number(saturation.toFixed(2));
}

function getValue(hsv, i, light) {
  var value;

  if (light) {
    value = hsv.v + brightnessStep1 * i;
  } else {
    value = hsv.v - brightnessStep2 * i;
  }

  if (value > 1) {
    value = 1;
  }

  return Number(value.toFixed(2));
}

function generate(color) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var patterns = [];
  var pColor = new TinyColor(color);

  for (var i = lightColorCount; i > 0; i -= 1) {
    var hsv = pColor.toHsv();
    var colorString = new TinyColor({
      h: getHue(hsv, i, true),
      s: getSaturation(hsv, i, true),
      v: getValue(hsv, i, true)
    }).toHexString();
    patterns.push(colorString);
  }

  patterns.push(pColor.toHexString());

  for (var _i = 1; _i <= darkColorCount; _i += 1) {
    var _hsv = pColor.toHsv();

    var _colorString = new TinyColor({
      h: getHue(_hsv, _i),
      s: getSaturation(_hsv, _i),
      v: getValue(_hsv, _i)
    }).toHexString();

    patterns.push(_colorString);
  } // dark theme patterns


  if (opts.theme === 'dark') {
    return darkColorMap.map(function (_ref) {
      var index = _ref.index,
          opacity = _ref.opacity;
      var darkColorString = new TinyColor(opts.backgroundColor || '#141414').mix(patterns[index], opacity * 100).toHexString();
      return darkColorString;
    });
  }

  return patterns;
}

var presetPrimaryColors = {
  red: '#F5222D',
  volcano: '#FA541C',
  orange: '#FA8C16',
  gold: '#FAAD14',
  yellow: '#FADB14',
  lime: '#A0D911',
  green: '#52C41A',
  cyan: '#13C2C2',
  blue: '#1890FF',
  geekblue: '#2F54EB',
  purple: '#722ED1',
  magenta: '#EB2F96',
  grey: '#666666'
};
var presetPalettes = {};
var presetDarkPalettes = {};
Object.keys(presetPrimaryColors).forEach(function (key) {
  presetPalettes[key] = generate(presetPrimaryColors[key]);
  presetPalettes[key].primary = presetPalettes[key][5]; // dark presetPalettes

  presetDarkPalettes[key] = generate(presetPrimaryColors[key], {
    theme: 'dark',
    backgroundColor: '#141414'
  });
  presetDarkPalettes[key].primary = presetDarkPalettes[key][5];
});

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

var decodeUriComponent = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};

var splitOnFirst = (string, separator) => {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (separator === '') {
		return [string];
	}

	const separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [string];
	}

	return [
		string.slice(0, separatorIndex),
		string.slice(separatorIndex + separator.length)
	];
};

var queryString = createCommonjsModule(function (module, exports) {




const isNullOrUndefined = value => value === null || value === undefined;

function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case 'index':
			return key => (result, value) => {
				const index = result.length;

				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[', index, ']'].join('')];
				}

				return [
					...result,
					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
				];
			};

		case 'bracket':
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[]'].join('')];
				}

				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
			};

		case 'comma':
		case 'separator':
			return key => (result, value) => {
				if (value === null || value === undefined || value.length === 0) {
					return result;
				}

				if (result.length === 0) {
					return [[encode(key, options), '=', encode(value, options)].join('')];
				}

				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
			};

		default:
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, encode(key, options)];
				}

				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
			};
	}
}

function parserForArrayFormat(options) {
	let result;

	switch (options.arrayFormat) {
		case 'index':
			return (key, value, accumulator) => {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return (key, value, accumulator) => {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		case 'comma':
		case 'separator':
			return (key, value, accumulator) => {
				const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
				const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
				value = isEncodedArray ? decode(value, options) : value;
				const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
				accumulator[key] = newValue;
			};

		default:
			return (key, value, accumulator) => {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function validateArrayFormatSeparator(value) {
	if (typeof value !== 'string' || value.length !== 1) {
		throw new TypeError('arrayFormatSeparator must be single character string');
	}
}

function encode(value, options) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function decode(value, options) {
	if (options.decode) {
		return decodeUriComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	}

	if (typeof input === 'object') {
		return keysSorter(Object.keys(input))
			.sort((a, b) => Number(a) - Number(b))
			.map(key => input[key]);
	}

	return input;
}

function removeHash(input) {
	const hashStart = input.indexOf('#');
	if (hashStart !== -1) {
		input = input.slice(0, hashStart);
	}

	return input;
}

function getHash(url) {
	let hash = '';
	const hashStart = url.indexOf('#');
	if (hashStart !== -1) {
		hash = url.slice(hashStart);
	}

	return hash;
}

function extract(input) {
	input = removeHash(input);
	const queryStart = input.indexOf('?');
	if (queryStart === -1) {
		return '';
	}

	return input.slice(queryStart + 1);
}

function parseValue(value, options) {
	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		value = Number(value);
	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
		value = value.toLowerCase() === 'true';
	}

	return value;
}

function parse(query, options) {
	options = Object.assign({
		decode: true,
		sort: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ',',
		parseNumbers: false,
		parseBooleans: false
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const formatter = parserForArrayFormat(options);

	// Create an object with no prototype
	const ret = Object.create(null);

	if (typeof query !== 'string') {
		return ret;
	}

	query = query.trim().replace(/^[?#&]/, '');

	if (!query) {
		return ret;
	}

	for (const param of query.split('&')) {
		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

		// Missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		value = value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? value : decode(value, options);
		formatter(decode(key, options), value, ret);
	}

	for (const key of Object.keys(ret)) {
		const value = ret[key];
		if (typeof value === 'object' && value !== null) {
			for (const k of Object.keys(value)) {
				value[k] = parseValue(value[k], options);
			}
		} else {
			ret[key] = parseValue(value, options);
		}
	}

	if (options.sort === false) {
		return ret;
	}

	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
		const value = ret[key];
		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
			// Sort object keys, not values
			result[key] = keysSorter(value);
		} else {
			result[key] = value;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = (object, options) => {
	if (!object) {
		return '';
	}

	options = Object.assign({
		encode: true,
		strict: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ','
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const shouldFilter = key => (
		(options.skipNull && isNullOrUndefined(object[key])) ||
		(options.skipEmptyString && object[key] === '')
	);

	const formatter = encoderForArrayFormat(options);

	const objectCopy = {};

	for (const key of Object.keys(object)) {
		if (!shouldFilter(key)) {
			objectCopy[key] = object[key];
		}
	}

	const keys = Object.keys(objectCopy);

	if (options.sort !== false) {
		keys.sort(options.sort);
	}

	return keys.map(key => {
		const value = object[key];

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			return value
				.reduce(formatter(key), [])
				.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(x => x.length > 0).join('&');
};

exports.parseUrl = (url, options) => {
	options = Object.assign({
		decode: true
	}, options);

	const [url_, hash] = splitOnFirst(url, '#');

	return Object.assign(
		{
			url: url_.split('?')[0] || '',
			query: parse(extract(url), options)
		},
		options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
	);
};

exports.stringifyUrl = (object, options) => {
	options = Object.assign({
		encode: true,
		strict: true
	}, options);

	const url = removeHash(object.url).split('?')[0] || '';
	const queryFromUrl = exports.extract(object.url);
	const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

	const query = Object.assign(parsedQueryFromUrl, object.query);
	let queryString = exports.stringify(query, options);
	if (queryString) {
		queryString = `?${queryString}`;
	}

	let hash = getHash(object.url);
	if (object.fragmentIdentifier) {
		hash = `#${encode(object.fragmentIdentifier, options)}`;
	}

	return `${url}${queryString}${hash}`;
};
});

let id = 0;
function jsonp(url, params = {}, cbFieldName = 'cb') {
    return new Promise((resolve, reject) => {
        const parseUrlRes = queryString.parseUrl(url);
        url = parseUrlRes.url;
        const handlerName = `jsonp_cb_${Date.now()}_${id++}`;
        const script = document.createElement('script');
        script.async = true;
        script.src = `${url}?${queryString.stringify(Object.assign(Object.assign(Object.assign({}, parseUrlRes.query), { [cbFieldName]: handlerName }), params))}`;
        script.onerror = reject;
        window[handlerName] = resolve;
        document.body.append(script);
    });
}

var LINK_TYPE;
(function (LINK_TYPE) {
    LINK_TYPE[LINK_TYPE["google"] = 0] = "google";
    LINK_TYPE[LINK_TYPE["baidu"] = 1] = "baidu";
    LINK_TYPE[LINK_TYPE["biying"] = 2] = "biying";
    LINK_TYPE[LINK_TYPE["amazon"] = 3] = "amazon";
    LINK_TYPE[LINK_TYPE["jd"] = 4] = "jd";
    LINK_TYPE[LINK_TYPE["tmall"] = 5] = "tmall";
    LINK_TYPE[LINK_TYPE["zhihu"] = 6] = "zhihu";
    LINK_TYPE[LINK_TYPE["bilibili"] = 7] = "bilibili";
    LINK_TYPE[LINK_TYPE["gaode"] = 8] = "gaode";
    LINK_TYPE[LINK_TYPE["github"] = 9] = "github";
    LINK_TYPE[LINK_TYPE["youtube"] = 10] = "youtube";
    LINK_TYPE[LINK_TYPE["douban"] = 11] = "douban";
    LINK_TYPE[LINK_TYPE["weibo"] = 12] = "weibo";
})(LINK_TYPE || (LINK_TYPE = {}));
function getAutocompleteWay(type) {
    return (q) => {
        return jsonp(`https://suggestqueries.google.com/complete/search`, {
            q,
            client: 'psy-ab',
        }, 'jsonp')
            .then(res => {
            const ls = res === null || res === void 0 ? void 0 : res[1];
            return Array.isArray(ls) ? ls.map(_ => _[0]) : [];
        })
            .catch(() => []);
    };
}
/**
 * q: keywords query
 */
const linksSchema = {
    [LINK_TYPE.google]: {
        searchSchema: 'https://www.google.com/search?q=${q}',
        name: 'Google',
    },
    [LINK_TYPE.baidu]: {
        searchSchema: 'https://www.baidu.com/s?wd=${q}',
        name: 'Baidu',
    },
    [LINK_TYPE.biying]: {
        searchSchema: 'https://cn.bing.com/search?q=${q}',
        name: 'Biying',
    },
    [LINK_TYPE.amazon]: {
        searchSchema: 'https://www.amazon.com/s?k=${q}',
        name: 'Amazon',
    },
    [LINK_TYPE.jd]: {
        searchSchema: 'https://search.jd.com/Search?keyword=${q}&enc=utf-8',
        name: 'JD',
    },
    [LINK_TYPE.tmall]: {
        searchSchema: 'https://list.tmall.com/search_product.htm?q=${q}',
        name: 'Tmall',
    },
    [LINK_TYPE.zhihu]: {
        searchSchema: 'https://www.zhihu.com/search?type=content&q=${q}',
        name: '知乎',
    },
    [LINK_TYPE.bilibili]: {
        searchSchema: 'http://search.bilibili.com/all?keyword=${q}',
        name: 'Bilibili',
    },
    [LINK_TYPE.gaode]: {
        searchSchema: 'https://ditu.amap.com/search?query=${q}',
        name: '高德',
    },
    [LINK_TYPE.github]: {
        searchSchema: 'https://github.com/search?q=${q}',
        name: 'Github',
    },
    [LINK_TYPE.youtube]: {
        searchSchema: 'https://www.youtube.com/results?search_query=${q}',
        name: 'Youtube',
    },
    [LINK_TYPE.douban]: {
        searchSchema: 'https://www.douban.com/search?source=suggest&q=${q}',
        name: '豆瓣',
    },
    [LINK_TYPE.weibo]: {
        searchSchema: 'https://s.weibo.com/weibo/${q}',
        name: '微博',
    },
};
function getTargetSearchUrl(type, q) {
    const res = linksSchema[type] || linksSchema[LINK_TYPE.google];
    return res.searchSchema.replace('${q}', encodeURIComponent(q));
}
function gen(ls) {
    return ls.map(_ => (Object.assign(Object.assign({}, linksSchema[_]), { link: _ })));
}
const selectSchema = [
    {
        title: '搜索',
        ls: gen([LINK_TYPE.google, LINK_TYPE.baidu, LINK_TYPE.biying]),
    },
    {
        title: '👨‍💻',
        ls: gen([LINK_TYPE.github, LINK_TYPE.zhihu]),
    },
    {
        title: '生活',
        ls: gen([
            LINK_TYPE.tmall,
            LINK_TYPE.jd,
            LINK_TYPE.bilibili,
            LINK_TYPE.gaode,
            LINK_TYPE.youtube,
            LINK_TYPE.douban,
            LINK_TYPE.weibo,
            LINK_TYPE.amazon,
        ]),
    },
];

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

const LS = {
    get(key, defaultValue) {
        return defaultValue;
    },
    set(key, value) {
        return;
    },
};

const LS_RECENT_USAGE_KEY = '__LS_RECENT_USAGE_KEY__';

var _a, _b;
const recentUsedList = writable(LS.get(LS_RECENT_USAGE_KEY, [LINK_TYPE.google]));
const selectedLinkType = writable((_b = (_a = get_store_value(recentUsedList)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : LINK_TYPE.google);
recentUsedList.subscribe(value => {
    LS.set(LS_RECENT_USAGE_KEY, value);
});

/* src/components/LinkTypeSelect.svelte generated by Svelte v3.31.0 */

const css = {
	code: ".ls-wrap.svelte-pi78ez.svelte-pi78ez{position:relative}section.svelte-pi78ez.svelte-pi78ez{width:70px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:4px;cursor:pointer}.panel-wrap.svelte-pi78ez.svelte-pi78ez{position:absolute;z-index:10;top:40px;left:0}.panel-content.svelte-pi78ez.svelte-pi78ez{padding:15px;margin-top:8px;background-color:#fff;border-radius:4px;box-shadow:0 2px 4px rgba(0, 0, 0, 0.16);width:310px;max-width:100%}.panel-sl-item.svelte-pi78ez ul.svelte-pi78ez{margin:0;display:flex;flex-wrap:wrap;padding:0}.panel-sl-item.svelte-pi78ez ul li.svelte-pi78ez{width:70px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:4px;cursor:pointer;transition:all 0.3s}.panel-sl-item.svelte-pi78ez ul li.svelte-pi78ez:hover{color:var(--color4)}.panel-sl-item.svelte-pi78ez ul li.selected.svelte-pi78ez{color:var(--primary)}.panel-sl-item.svelte-pi78ez+.panel-sl-item.svelte-pi78ez{margin-top:5px}",
	map: "{\"version\":3,\"file\":\"LinkTypeSelect.svelte\",\"sources\":[\"LinkTypeSelect.svelte\"],\"sourcesContent\":[\"<div\\n  class=\\\"ls-wrap\\\"\\n  on:mouseenter={() => (showPanel = true)}\\n  on:mouseleave={() => (showPanel = false)}>\\n  <section>{linksSchema[$selectedLinkType].name}</section>\\n  {#if showPanel}\\n    <div class=\\\"panel-wrap\\\" transition:fade={{ duration: 200 }}>\\n      <div class=\\\"panel-content\\\">\\n        {#each selectSchema as item}\\n          <div class=\\\"panel-sl-item\\\">\\n            <strong>{item.title}</strong>\\n            <ul>\\n              {#each item.ls as linkItem}\\n                <li\\n                  title={linkItem.name}\\n                  class:selected={linkItem.link === $selectedLinkType}\\n                  on:click={() => handleSelect(linkItem.link)}>\\n                  {linkItem.name}\\n                </li>\\n              {/each}\\n            </ul>\\n          </div>\\n        {/each}\\n      </div>\\n    </div>\\n  {/if}\\n</div>\\n\\n<script lang=\\\"ts\\\">import { linksSchema, LINK_TYPE, selectSchema } from '@/shared/links';\\nimport { selectedLinkType } from '@/store';\\nimport { fade } from 'svelte/transition';\\nlet showPanel = false;\\nfunction handleSelect(lk) {\\n    selectedLinkType.set(lk);\\n    showPanel = false;\\n}\\n//# sourceMappingURL=LinkTypeSelect.svelte.js.map</script>\\n\\n<style lang=\\\"less\\\">.ls-wrap {\\n  position: relative;\\n}\\nsection {\\n  width: 70px;\\n  height: 40px;\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  border-radius: 4px;\\n  cursor: pointer;\\n}\\n.panel-wrap {\\n  position: absolute;\\n  z-index: 10;\\n  top: 40px;\\n  left: 0;\\n}\\n.panel-content {\\n  padding: 15px;\\n  margin-top: 8px;\\n  background-color: #fff;\\n  border-radius: 4px;\\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);\\n  width: 310px;\\n  max-width: 100%;\\n}\\n.panel-sl-item ul {\\n  margin: 0;\\n  display: flex;\\n  flex-wrap: wrap;\\n  padding: 0;\\n}\\n.panel-sl-item ul li {\\n  width: 70px;\\n  height: 40px;\\n  display: flex;\\n  align-items: center;\\n  justify-content: center;\\n  border-radius: 4px;\\n  cursor: pointer;\\n  transition: all 0.3s;\\n}\\n.panel-sl-item ul li:hover {\\n  color: var(--color4);\\n}\\n.panel-sl-item ul li.selected {\\n  color: var(--primary);\\n}\\n.panel-sl-item + .panel-sl-item {\\n  margin-top: 5px;\\n}\\n</style>\\n\"],\"names\":[],\"mappings\":\"AAsCmB,QAAQ,4BAAC,CAAC,AAC3B,QAAQ,CAAE,QAAQ,AACpB,CAAC,AACD,OAAO,4BAAC,CAAC,AACP,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,aAAa,CAAE,GAAG,CAClB,MAAM,CAAE,OAAO,AACjB,CAAC,AACD,WAAW,4BAAC,CAAC,AACX,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,EAAE,CACX,GAAG,CAAE,IAAI,CACT,IAAI,CAAE,CAAC,AACT,CAAC,AACD,cAAc,4BAAC,CAAC,AACd,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,GAAG,CACf,gBAAgB,CAAE,IAAI,CACtB,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,IAAI,AACjB,CAAC,AACD,4BAAc,CAAC,EAAE,cAAC,CAAC,AACjB,MAAM,CAAE,CAAC,CACT,OAAO,CAAE,IAAI,CACb,SAAS,CAAE,IAAI,CACf,OAAO,CAAE,CAAC,AACZ,CAAC,AACD,4BAAc,CAAC,EAAE,CAAC,EAAE,cAAC,CAAC,AACpB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,aAAa,CAAE,GAAG,CAClB,MAAM,CAAE,OAAO,CACf,UAAU,CAAE,GAAG,CAAC,IAAI,AACtB,CAAC,AACD,4BAAc,CAAC,EAAE,CAAC,gBAAE,MAAM,AAAC,CAAC,AAC1B,KAAK,CAAE,IAAI,QAAQ,CAAC,AACtB,CAAC,AACD,4BAAc,CAAC,EAAE,CAAC,EAAE,SAAS,cAAC,CAAC,AAC7B,KAAK,CAAE,IAAI,SAAS,CAAC,AACvB,CAAC,AACD,4BAAc,CAAG,cAAc,cAAC,CAAC,AAC/B,UAAU,CAAE,GAAG,AACjB,CAAC\"}"
};

const LinkTypeSelect = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $selectedLinkType = get_store_value(selectedLinkType);

	$$result.css.add(css);

	return `<div class="${"ls-wrap svelte-pi78ez"}"><section class="${"svelte-pi78ez"}">${escape(linksSchema[$selectedLinkType].name)}</section>
  ${ ``}
</div>`;
});

const axios = Axios__default['default'].create();

function getHitokoto() {
    return axios.get('https://v1.hitokoto.cn/?encode=json');
}

function useAsync(fn, { defaultValue = null, defaultArgs = [], skip = false, } = {}) {
    let res = writable({
        loading: false,
        data: defaultValue,
        error: null,
        callTimes: 0,
    });
    const call = async (...args) => {
        try {
            res.update(pre => {
                return Object.assign(Object.assign({}, pre), { loading: true });
            });
            const data = await fn(...(args.length > 0 ? args : defaultArgs));
            res.update(pre => {
                return Object.assign(Object.assign({}, pre), { loading: false, data: data !== null && data !== void 0 ? data : defaultValue, error: null, callTimes: pre.callTimes + 1 });
            });
            return data;
        }
        catch (error) {
            res.update(pre => {
                return Object.assign(Object.assign({}, pre), { loading: false, data: defaultValue, error, callTimes: pre.callTimes + 1 });
            });
            throw error;
        }
    };
    onMount(() => {
        !skip && call();
    });
    return [res, call];
}

/* src/components/SearchInput.svelte generated by Svelte v3.31.0 */

const css$1 = {
	code: "section.svelte-yslqqq.svelte-yslqqq{position:relative}input.svelte-yslqqq.svelte-yslqqq{appearance:none;height:48px;display:block;width:100%;padding:0 10px;outline:none;-webkit-tap-highlight-color:transparent;-webkit-box-direction:normal;background-color:#fff;background-image:none;transition:all 0.3s;touch-action:manipulation;text-overflow:ellipsis;color:var(--tc);border:none}input.svelte-yslqqq.svelte-yslqqq:focus{border-color:var(--primary)}.sg-wrap.svelte-yslqqq.svelte-yslqqq{position:absolute;top:3px;width:100%;border-radius:var(--radius);margin:0;background-color:#fff;box-shadow:0 2px 4px rgba(0, 0, 0, 0.16);padding:10px 0}.sg-wrap.svelte-yslqqq li.svelte-yslqqq{height:32px;line-height:32px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;padding:0 15px;position:relative}.sg-wrap.svelte-yslqqq li.svelte-yslqqq:hover,.sg-wrap.svelte-yslqqq li.focus.svelte-yslqqq{background-color:#f4f4f4}",
	map: "{\"version\":3,\"file\":\"SearchInput.svelte\",\"sources\":[\"SearchInput.svelte\"],\"sourcesContent\":[\"<section on:keydown={handleOnWrapKeyDown}>\\n  <!-- svelte-ignore a11y-autofocus -->\\n  <input\\n    type=\\\"text\\\"\\n    value={displayValue}\\n    bind:this={elInput}\\n    on:input={handleOnInput}\\n    on:keydown={handleOnKeyDown}\\n    on:compositionstart={() => (hasComposition = true)}\\n    on:compositionend={() => (hasComposition = false)}\\n    on:focus={handleOnFocus}\\n    on:blur={handleOnBlur}\\n    spellcheck={false}\\n    autocomplete=\\\"off\\\"\\n    maxlength={2048}\\n    {placeholder} />\\n\\n  <div style=\\\"position: relative;\\\">\\n    {#if suggestionList.length > 0}\\n      <ul class=\\\"sg-wrap el-shadow \\\" transition:fade={{ duration: 200 }}>\\n        {#each suggestionList as item, idx}\\n          <li\\n            title={item}\\n            class:focus={idx + 1 === sgHoverIndex}\\n            on:click={() => handleOnClickSuggestion(item)}>\\n            {item}\\n          </li>\\n        {/each}\\n      </ul>\\n    {/if}\\n  </div>\\n</section>\\n\\n<script lang=\\\"ts\\\">var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\\n    return new (P || (P = Promise))(function (resolve, reject) {\\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\\n        function rejected(value) { try { step(generator[\\\"throw\\\"](value)); } catch (e) { reject(e); } }\\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\\n    });\\n};\\nvar _a, _b;\\nimport { getHitokoto } from '@/shared/api';\\nimport { useAsync } from '@/shared/hooks';\\nimport { getAutocompleteWay, getTargetSearchUrl, LINK_TYPE, } from '@/shared/links';\\nimport { recentUsedList, selectedLinkType } from '@/store';\\nimport { createEventDispatcher, tick } from 'svelte';\\nimport { fade } from 'svelte/transition';\\nconst dispatch = createEventDispatcher();\\nconst [res] = useAsync(getHitokoto);\\n$: placeholder = ((_b = (_a = $res.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.hitokoto) || '🔍 搜索...';\\n$: autoCompleteHandler = getAutocompleteWay(LINK_TYPE.google);\\nlet elInput;\\nlet value = '';\\nlet hasComposition = false;\\nlet sgHoverIndex = 0;\\nlet autoCompleteId;\\nlet suggestionList = [];\\n$: trimedValue = value.trim();\\n$: displayValue =\\n    sgHoverIndex === 0 ? value : suggestionList[sgHoverIndex - 1];\\n$: if (value && !true) {\\n    clearTimeout(autoCompleteId);\\n    autoCompleteId = setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {\\n        const ls = yield autoCompleteHandler(value);\\n        value && (suggestionList = ls);\\n    }), 350);\\n}\\nelse if (!value) {\\n    clearTimeout(autoCompleteId);\\n    suggestionList = [];\\n}\\n$: {\\n    $selectedLinkType;\\n    elInput === null || elInput === void 0 ? void 0 : elInput.focus();\\n}\\nfunction handleOnKeyDown(e) {\\n    if (e.key === 'Enter') {\\n        if (hasComposition)\\n            return;\\n        submitSearch(displayValue);\\n    }\\n}\\nfunction handleOnInput(e) {\\n    value = e.target.value;\\n    sgHoverIndex = 0;\\n}\\nconst setInputSelectionToEnd = () => __awaiter(void 0, void 0, void 0, function* () {\\n    if (!elInput)\\n        return;\\n    yield tick();\\n    elInput.selectionStart = 9999;\\n    elInput.selectionEnd = 9999;\\n});\\nfunction handleOnWrapKeyDown(e) {\\n    if (!suggestionList.length) {\\n        return;\\n    }\\n    const rangeLength = suggestionList.length + 1;\\n    if (e.key === 'ArrowUp') {\\n        e.preventDefault();\\n        sgHoverIndex = (sgHoverIndex + rangeLength - 1) % rangeLength;\\n        setInputSelectionToEnd();\\n        return;\\n    }\\n    if (e.key === 'ArrowDown') {\\n        e.preventDefault();\\n        sgHoverIndex = (sgHoverIndex + 1) % rangeLength;\\n        setInputSelectionToEnd();\\n        return;\\n    }\\n}\\nfunction handleOnClickSuggestion(suggest) {\\n    submitSearch(suggest);\\n}\\nfunction submitSearch(searchVal) {\\n    searchVal = searchVal || placeholder;\\n    const target = getTargetSearchUrl($selectedLinkType, searchVal);\\n    window.open(target, '_blank');\\n    value = '';\\n    sgHoverIndex = 0;\\n    recentUsedList.update(pre => {\\n        const rs = pre.filter(_ => _ !== $selectedLinkType);\\n        rs.unshift($selectedLinkType);\\n        rs.splice(5);\\n        return rs;\\n    });\\n}\\nfunction handleOnFocus(e) {\\n    dispatch('focus', e);\\n}\\nfunction handleOnBlur(e) {\\n    dispatch('blur', e);\\n}\\nexport function submit() {\\n    submitSearch(displayValue);\\n}\\n//# sourceMappingURL=SearchInput.svelte.js.map</script>\\n\\n<style lang=\\\"less\\\">section {\\n  position: relative;\\n}\\ninput {\\n  appearance: none;\\n  height: 48px;\\n  display: block;\\n  width: 100%;\\n  padding: 0 10px;\\n  outline: none;\\n  -webkit-tap-highlight-color: transparent;\\n  -webkit-box-direction: normal;\\n  background-color: #fff;\\n  background-image: none;\\n  transition: all 0.3s;\\n  touch-action: manipulation;\\n  text-overflow: ellipsis;\\n  color: var(--tc);\\n  border: none;\\n}\\ninput:focus {\\n  border-color: var(--primary);\\n}\\n.sg-wrap {\\n  position: absolute;\\n  top: 3px;\\n  width: 100%;\\n  border-radius: var(--radius);\\n  margin: 0;\\n  background-color: #fff;\\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16);\\n  padding: 10px 0;\\n}\\n.sg-wrap li {\\n  height: 32px;\\n  line-height: 32px;\\n  overflow: hidden;\\n  text-overflow: ellipsis;\\n  white-space: nowrap;\\n  cursor: pointer;\\n  padding: 0 15px;\\n  position: relative;\\n}\\n.sg-wrap li:hover,\\n.sg-wrap li.focus {\\n  background-color: #f4f4f4;\\n}\\n</style>\\n\"],\"names\":[],\"mappings\":\"AA4ImB,OAAO,4BAAC,CAAC,AAC1B,QAAQ,CAAE,QAAQ,AACpB,CAAC,AACD,KAAK,4BAAC,CAAC,AACL,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,KAAK,CACd,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,CAAC,CAAC,IAAI,CACf,OAAO,CAAE,IAAI,CACb,2BAA2B,CAAE,WAAW,CACxC,qBAAqB,CAAE,MAAM,CAC7B,gBAAgB,CAAE,IAAI,CACtB,gBAAgB,CAAE,IAAI,CACtB,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,YAAY,CAAE,YAAY,CAC1B,aAAa,CAAE,QAAQ,CACvB,KAAK,CAAE,IAAI,IAAI,CAAC,CAChB,MAAM,CAAE,IAAI,AACd,CAAC,AACD,iCAAK,MAAM,AAAC,CAAC,AACX,YAAY,CAAE,IAAI,SAAS,CAAC,AAC9B,CAAC,AACD,QAAQ,4BAAC,CAAC,AACR,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,KAAK,CAAE,IAAI,CACX,aAAa,CAAE,IAAI,QAAQ,CAAC,CAC5B,MAAM,CAAE,CAAC,CACT,gBAAgB,CAAE,IAAI,CACtB,UAAU,CAAE,CAAC,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACzC,OAAO,CAAE,IAAI,CAAC,CAAC,AACjB,CAAC,AACD,sBAAQ,CAAC,EAAE,cAAC,CAAC,AACX,MAAM,CAAE,IAAI,CACZ,WAAW,CAAE,IAAI,CACjB,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,QAAQ,CACvB,WAAW,CAAE,MAAM,CACnB,MAAM,CAAE,OAAO,CACf,OAAO,CAAE,CAAC,CAAC,IAAI,CACf,QAAQ,CAAE,QAAQ,AACpB,CAAC,AACD,sBAAQ,CAAC,gBAAE,MAAM,CACjB,sBAAQ,CAAC,EAAE,MAAM,cAAC,CAAC,AACjB,gBAAgB,CAAE,OAAO,AAC3B,CAAC\"}"
};

const SearchInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $res;
	let $selectedLinkType = get_store_value(selectedLinkType);

	var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
			? value
			: new P(function (resolve) {
						resolve(value);
					});
		}

		return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) {
					try {
						step(generator.next(value));
					} catch(e) {
						reject(e);
					}
				}

				function rejected(value) {
					try {
						step(generator["throw"](value));
					} catch(e) {
						reject(e);
					}
				}

				function step(result) {
					result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
				}

				step((generator = generator.apply(thisArg, _arguments || [])).next());
			});
	};

	var _a, _b;
	const dispatch = createEventDispatcher();
	const [res] = useAsync(getHitokoto);
	$res = get_store_value(res);
	let elInput;
	let value = "";
	let sgHoverIndex = 0;
	let autoCompleteId;
	let suggestionList = [];

	function submitSearch(searchVal) {
		searchVal = searchVal || placeholder;
		const target = getTargetSearchUrl($selectedLinkType, searchVal);
		window.open(target, "_blank");
		value = "";
		sgHoverIndex = 0;

		recentUsedList.update(pre => {
			const rs = pre.filter(_ => _ !== $selectedLinkType);
			rs.unshift($selectedLinkType);
			rs.splice(5);
			return rs;
		});
	}

	function submit() {
		submitSearch(displayValue);
	}

	if ($$props.submit === void 0 && $$bindings.submit && submit !== void 0) $$bindings.submit(submit);
	$$result.css.add(css$1);
	$res = get_store_value(res);
	let placeholder;
	let autoCompleteHandler;
	let trimedValue;
	let displayValue;

	placeholder = ((_b = (_a = $res.data) === null || _a === void 0
	? void 0
	: _a.data) === null || _b === void 0
	? void 0
	: _b.hitokoto) || "🔍 搜索...";

	autoCompleteHandler = getAutocompleteWay(LINK_TYPE.google);
	trimedValue = value.trim();

	 {
		if (value && !true) {
			clearTimeout(autoCompleteId);

			autoCompleteId = setTimeout(
				() => __awaiter(void 0, void 0, void 0, function* () {
					const ls = yield autoCompleteHandler(value);
					value && (suggestionList = ls);
				}),
				350
			);
		} else if (!value) {
			clearTimeout(autoCompleteId);
			suggestionList = [];
		}
	}

	displayValue = sgHoverIndex === 0
	? value
	: suggestionList[sgHoverIndex - 1];

	return `<section class="${"svelte-yslqqq"}">
  <input type="${"text"}"${add_attribute("maxlength", 2048, 0)}${add_attribute("value", displayValue, 0)}${add_attribute("spellcheck", false, 0)} autocomplete="${"off"}"${add_attribute("placeholder", placeholder, 0)} class="${"svelte-yslqqq"}"${add_attribute("this", elInput, 1)}>

  <div style="${"position: relative;"}">${suggestionList.length > 0
	? `<ul class="${"sg-wrap el-shadow  svelte-yslqqq"}">${each(suggestionList, (item, idx) => `<li${add_attribute("title", item, 0)} class="${["svelte-yslqqq", idx + 1 === sgHoverIndex ? "focus" : ""].join(" ").trim()}">${escape(item)}
          </li>`)}</ul>`
	: ``}</div>
</section>`;
});

/* src/components/RecentUsage.svelte generated by Svelte v3.31.0 */

const css$2 = {
	code: "section.svelte-11epmju{color:var(--tc);font-size:14px;height:22px;display:flex;align-items:center}ul.svelte-11epmju{margin:0;padding:0;display:flex}li.svelte-11epmju{list-style:none;width:60px;text-align:center;cursor:pointer;transition:all 0.3s}li.svelte-11epmju:hover{color:var(--color4)}li.active.svelte-11epmju{color:var(--primary)}",
	map: "{\"version\":3,\"file\":\"RecentUsage.svelte\",\"sources\":[\"RecentUsage.svelte\"],\"sourcesContent\":[\"<section>\\n  最近使用：\\n  <ul>\\n    {#each displayList as item}\\n      <li\\n        class:active={item.value === $selectedLinkType}\\n        on:click={() => selectedLinkType.set(item.value)}>\\n        {item.name}\\n      </li>\\n    {/each}\\n  </ul>\\n</section>\\n\\n<script>\\n  import { linksSchema } from '@/shared/links';\\n  import { recentUsedList, selectedLinkType } from '@/store';\\n\\n  $: displayList = $recentUsedList.map(_ => ({\\n    ...linksSchema[_],\\n    value: _,\\n  }));\\n</script>\\n\\n<style lang=\\\"less\\\">section {\\n  color: var(--tc);\\n  font-size: 14px;\\n  height: 22px;\\n  display: flex;\\n  align-items: center;\\n}\\nul {\\n  margin: 0;\\n  padding: 0;\\n  display: flex;\\n}\\nli {\\n  list-style: none;\\n  width: 60px;\\n  text-align: center;\\n  cursor: pointer;\\n  transition: all 0.3s;\\n}\\nli:hover {\\n  color: var(--color4);\\n}\\nli.active {\\n  color: var(--primary);\\n}\\n</style>\\n\"],\"names\":[],\"mappings\":\"AAuBmB,OAAO,eAAC,CAAC,AAC1B,KAAK,CAAE,IAAI,IAAI,CAAC,CAChB,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,AACrB,CAAC,AACD,EAAE,eAAC,CAAC,AACF,MAAM,CAAE,CAAC,CACT,OAAO,CAAE,CAAC,CACV,OAAO,CAAE,IAAI,AACf,CAAC,AACD,EAAE,eAAC,CAAC,AACF,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,CACX,UAAU,CAAE,MAAM,CAClB,MAAM,CAAE,OAAO,CACf,UAAU,CAAE,GAAG,CAAC,IAAI,AACtB,CAAC,AACD,iBAAE,MAAM,AAAC,CAAC,AACR,KAAK,CAAE,IAAI,QAAQ,CAAC,AACtB,CAAC,AACD,EAAE,OAAO,eAAC,CAAC,AACT,KAAK,CAAE,IAAI,SAAS,CAAC,AACvB,CAAC\"}"
};

const RecentUsage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $recentUsedList = get_store_value(recentUsedList);
	let $selectedLinkType = get_store_value(selectedLinkType);
	$$result.css.add(css$2);
	let displayList;
	displayList = $recentUsedList.map(_ => ({ ...linksSchema[_], value: _ }));

	return `<section class="${"svelte-11epmju"}">最近使用：
  <ul class="${"svelte-11epmju"}">${each(displayList, item => `<li class="${["svelte-11epmju", item.value === $selectedLinkType ? "active" : ""].join(" ").trim()}">${escape(item.name)}
      </li>`)}</ul>
</section>`;
});

/* src/components/Time.svelte generated by Svelte v3.31.0 */

const css$3 = {
	code: "section.svelte-hrsx5p{text-align:center;margin-bottom:10px;font-family:'IBM Plex Mono', serif;white-space:nowrap}",
	map: "{\"version\":3,\"file\":\"Time.svelte\",\"sources\":[\"Time.svelte\"],\"sourcesContent\":[\"<section>{displayTime}</section>\\n\\n<script lang=\\\"ts\\\">import { onMount } from 'svelte';\\nlet now = true ? '----/--/-- --:--:--' : Date.now();\\nconst fomater = new Intl.DateTimeFormat(['zh-CN', 'en-US'], {\\n    year: 'numeric',\\n    month: '2-digit',\\n    day: '2-digit',\\n    hour: '2-digit',\\n    minute: '2-digit',\\n    second: '2-digit',\\n    hour12: false,\\n});\\n$: displayTime = typeof now === 'string' ? now : fomater.format(now);\\nfunction loop() {\\n    now = Date.now();\\n    requestAnimationFrame(loop);\\n}\\nonMount(() => {\\n    if (!true) {\\n        loop();\\n    }\\n});\\n//# sourceMappingURL=Time.svelte.js.map</script>\\n\\n<style lang=\\\"less\\\">section {\\n  text-align: center;\\n  margin-bottom: 10px;\\n  font-family: 'IBM Plex Mono', serif;\\n  white-space: nowrap;\\n}\\n</style>\\n\"],\"names\":[],\"mappings\":\"AAyBmB,OAAO,cAAC,CAAC,AAC1B,UAAU,CAAE,MAAM,CAClB,aAAa,CAAE,IAAI,CACnB,WAAW,CAAE,eAAe,CAAC,CAAC,KAAK,CACnC,WAAW,CAAE,MAAM,AACrB,CAAC\"}"
};

const Time = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let now =  "----/--/-- --:--:--" ;

	onMount(() => {
	});

	$$result.css.add(css$3);
	let displayTime;
	displayTime =  now ;
	return `<section class="${"svelte-hrsx5p"}">${escape(displayTime)}</section>`;
});

function isNil(v) {
    return v === null || v === void 0;
}

/* src/components/Icon.svelte generated by Svelte v3.31.0 */

const Icon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { name } = $$props;
	let { size = null } = $$props;
	let { color = null } = $$props;
	if ($$props.name === void 0 && $$bindings.name && name !== void 0) $$bindings.name(name);
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	let className;
	let style;
	className = `soiconfont so-${name}`;

	style = [
		["font-size:" + (typeof size === "number" ? `${size}px` : size), !isNil(size)],
		["color:" + color, !isNil(color)]
	].filter(([,show]) => show).map(([line]) => line).join(";");

	return `<i${add_attribute("class", className, 0)}${add_attribute("style", style, 0)}></i>`;
});

/* src/App.svelte generated by Svelte v3.31.0 */

const css$4 = {
	code: "@font-face{font-family:'IBM Plex Mono';font-style:normal;font-weight:100;font-display:swap;src:url(https://fonts.gstatic.com/s/ibmplexmono/v6/-F6pfjptAgt5VM-kVkqdyU8n3kwq0g.ttf) format('truetype')}@font-face{font-family:'IBM Plex Mono';font-style:normal;font-weight:300;font-display:swap;src:url(https://fonts.gstatic.com/s/ibmplexmono/v6/-F6qfjptAgt5VM-kVkqdyU8n3oQI8lc.ttf) format('truetype')}main.svelte-6g1uff{height:100vh;display:flex;flex-direction:column;align-items:center}.ma__usually-wrap.svelte-6g1uff{width:640px;max-width:100%;margin-bottom:10px;padding:0 4px;white-space:nowrap}.ma__input-wrap.svelte-6g1uff{width:640px;max-width:100%;display:flex;align-items:center;padding-right:10px;border-radius:var(--radius);border:1px solid var(--nc);transition:all 0.3s}.ma__input-wrap.svelte-6g1uff:hover,.ma__input-wrap.focus.svelte-6g1uff{border-color:var(--color5)}.link-type-sl.svelte-6g1uff{margin-right:10px}.divider-y.svelte-6g1uff{background-color:grey;display:block;width:1px;height:20px}.search-input-cp.svelte-6g1uff{flex-grow:1}.search-submit.svelte-6g1uff{appearance:none;padding:4px 6px;border:none;outline:none;background:none;cursor:pointer;color:var(--color6);transition:all 0.3s}.search-submit.svelte-6g1uff:hover{color:var(--color4)}",
	map: "{\"version\":3,\"file\":\"App.svelte\",\"sources\":[\"App.svelte\"],\"sourcesContent\":[\"<main>\\n  <div style=\\\"margin-top: 300px\\\" />\\n  <div>\\n    <Time />\\n  </div>\\n  <div class=\\\"ma__usually-wrap\\\">\\n    <RecentUsage />\\n  </div>\\n  <div class=\\\"ma__input-wrap\\\" class:focus={isFocus}>\\n    <div class=\\\"link-type-sl\\\">\\n      <LinkTypeSelect />\\n    </div>\\n    <i class=\\\"divider-y\\\" />\\n    <div class=\\\"search-input-cp\\\">\\n      <SearchInput\\n        on:focus={() => (isFocus = true)}\\n        on:blur={() => (isFocus = false)}\\n        bind:this={inputIns} />\\n    </div>\\n\\n    <button on:click={inputIns?.submit} class=\\\"search-submit\\\">\\n      <Icon name=\\\"search\\\" size={20} />\\n    </button>\\n  </div>\\n</main>\\n\\n<script lang=\\\"ts\\\">import LinkTypeSelect from '@/components/LinkTypeSelect.svelte';\\nimport SearchInput from '@/components/SearchInput.svelte';\\nimport RecentUsage from '@/components/RecentUsage.svelte';\\nimport Time from '@/components/Time.svelte';\\nimport Icon from './components/Icon.svelte';\\nlet isFocus = false;\\nlet inputIns;\\n//# sourceMappingURL=App.svelte.js.map</script>\\n\\n<style lang=\\\"less\\\">@font-face {\\n  font-family: 'IBM Plex Mono';\\n  font-style: normal;\\n  font-weight: 100;\\n  font-display: swap;\\n  src: url(https://fonts.gstatic.com/s/ibmplexmono/v6/-F6pfjptAgt5VM-kVkqdyU8n3kwq0g.ttf) format('truetype');\\n}\\n@font-face {\\n  font-family: 'IBM Plex Mono';\\n  font-style: normal;\\n  font-weight: 300;\\n  font-display: swap;\\n  src: url(https://fonts.gstatic.com/s/ibmplexmono/v6/-F6qfjptAgt5VM-kVkqdyU8n3oQI8lc.ttf) format('truetype');\\n}\\nmain {\\n  height: 100vh;\\n  display: flex;\\n  flex-direction: column;\\n  align-items: center;\\n}\\n.ma__usually-wrap {\\n  width: 640px;\\n  max-width: 100%;\\n  margin-bottom: 10px;\\n  padding: 0 4px;\\n  white-space: nowrap;\\n}\\n.ma__input-wrap {\\n  width: 640px;\\n  max-width: 100%;\\n  display: flex;\\n  align-items: center;\\n  padding-right: 10px;\\n  border-radius: var(--radius);\\n  border: 1px solid var(--nc);\\n  transition: all 0.3s;\\n}\\n.ma__input-wrap:hover,\\n.ma__input-wrap.focus {\\n  border-color: var(--color5);\\n}\\n.link-type-sl {\\n  margin-right: 10px;\\n}\\n.divider-y {\\n  background-color: grey;\\n  display: block;\\n  width: 1px;\\n  height: 20px;\\n}\\n.search-input-cp {\\n  flex-grow: 1;\\n}\\n.search-submit {\\n  appearance: none;\\n  padding: 4px 6px;\\n  border: none;\\n  outline: none;\\n  background: none;\\n  cursor: pointer;\\n  color: var(--color6);\\n  transition: all 0.3s;\\n}\\n.search-submit:hover {\\n  color: var(--color4);\\n}\\n</style>\\n\"],\"names\":[],\"mappings\":\"AAmCmB,UAAU,AAAC,CAAC,AAC7B,WAAW,CAAE,eAAe,CAC5B,UAAU,CAAE,MAAM,CAClB,WAAW,CAAE,GAAG,CAChB,YAAY,CAAE,IAAI,CAClB,GAAG,CAAE,IAAI,6EAA6E,CAAC,CAAC,OAAO,UAAU,CAAC,AAC5G,CAAC,AACD,UAAU,AAAC,CAAC,AACV,WAAW,CAAE,eAAe,CAC5B,UAAU,CAAE,MAAM,CAClB,WAAW,CAAE,GAAG,CAChB,YAAY,CAAE,IAAI,CAClB,GAAG,CAAE,IAAI,8EAA8E,CAAC,CAAC,OAAO,UAAU,CAAC,AAC7G,CAAC,AACD,IAAI,cAAC,CAAC,AACJ,MAAM,CAAE,KAAK,CACb,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,WAAW,CAAE,MAAM,AACrB,CAAC,AACD,iBAAiB,cAAC,CAAC,AACjB,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,IAAI,CACf,aAAa,CAAE,IAAI,CACnB,OAAO,CAAE,CAAC,CAAC,GAAG,CACd,WAAW,CAAE,MAAM,AACrB,CAAC,AACD,eAAe,cAAC,CAAC,AACf,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,IAAI,CACf,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,aAAa,CAAE,IAAI,CACnB,aAAa,CAAE,IAAI,QAAQ,CAAC,CAC5B,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,IAAI,CAAC,CAC3B,UAAU,CAAE,GAAG,CAAC,IAAI,AACtB,CAAC,AACD,6BAAe,MAAM,CACrB,eAAe,MAAM,cAAC,CAAC,AACrB,YAAY,CAAE,IAAI,QAAQ,CAAC,AAC7B,CAAC,AACD,aAAa,cAAC,CAAC,AACb,YAAY,CAAE,IAAI,AACpB,CAAC,AACD,UAAU,cAAC,CAAC,AACV,gBAAgB,CAAE,IAAI,CACtB,OAAO,CAAE,KAAK,CACd,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,IAAI,AACd,CAAC,AACD,gBAAgB,cAAC,CAAC,AAChB,SAAS,CAAE,CAAC,AACd,CAAC,AACD,cAAc,cAAC,CAAC,AACd,UAAU,CAAE,IAAI,CAChB,OAAO,CAAE,GAAG,CAAC,GAAG,CAChB,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,OAAO,CACf,KAAK,CAAE,IAAI,QAAQ,CAAC,CACpB,UAAU,CAAE,GAAG,CAAC,IAAI,AACtB,CAAC,AACD,4BAAc,MAAM,AAAC,CAAC,AACpB,KAAK,CAAE,IAAI,QAAQ,CAAC,AACtB,CAAC\"}"
};

const App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let inputIns;
	$$result.css.add(css$4);
	let $$settled;
	let $$rendered;

	do {
		$$settled = true;

		$$rendered = `<main class="${"svelte-6g1uff"}"><div style="${"margin-top: 300px"}"></div>
  <div>${validate_component(Time, "Time").$$render($$result, {}, {}, {})}</div>
  <div class="${"ma__usually-wrap svelte-6g1uff"}">${validate_component(RecentUsage, "RecentUsage").$$render($$result, {}, {}, {})}</div>
  <div class="${["ma__input-wrap svelte-6g1uff",  ""].join(" ").trim()}"><div class="${"link-type-sl svelte-6g1uff"}">${validate_component(LinkTypeSelect, "LinkTypeSelect").$$render($$result, {}, {}, {})}</div>
    <i class="${"divider-y svelte-6g1uff"}"></i>
    <div class="${"search-input-cp svelte-6g1uff"}">${validate_component(SearchInput, "SearchInput").$$render(
			$$result,
			{ this: inputIns },
			{
				this: $$value => {
					inputIns = $$value;
					$$settled = false;
				}
			},
			{}
		)}</div>

    <button class="${"search-submit svelte-6g1uff"}">${validate_component(Icon, "Icon").$$render($$result, { name: "search", size: 20 }, {}, {})}</button></div>
</main>`;
	} while (!$$settled);

	return $$rendered;
});

exports.app = App;
