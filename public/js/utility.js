let getDefaultValue = function(value) {
    if (value === null || value === undefined) return value;

    if (typeof(value) === 'number') return 0;
    if (typeof(value) === 'string') return "";
    if (typeof(value) === 'boolean') return false;

    if (Array.isArray(value)) return [];
    if (typeof(value) === 'object') return {};
    if (typeof(value) === 'function') return () => {};

    if (typeof(value) === 'bigint') return 0n;
    if (typeof(value) === 'symbol') return Symbol();

    throw new Error("Unknown type.");
}

let extractKeys = function(reference) {
    return Object.keys(reference).reduce((object, key) => {
        object[key] = getDefaultValue(reference[key]);
        return object;
    }, {});
}

let isObject = function(o) {
    return typeof o === 'object' && !Array.isArray(o) && o !== null;
}

let hasAllowedKeys = function(check, reference) {
    return Object.keys(check).every(key => key in reference && typeof check[key] === typeof reference[key]);
}

let getAverage = function(array, mapper = (e) => e) {
    if (array.length === 0) return null;
    return array.reduce((sum, element) => sum + mapper(element), 0) / array.length;
}

let largerOutlier = function(x, y, reference, mapper = (e) => e) {
    return Math.abs(mapper(x) - reference) > Math.abs(mapper(y) - reference) ? x : y;
}

let isInSegment = function(x, a, b) {
    return x >= a && x <= b;
}

// required format: "dd.mm.yyyy."
let getYear = function(dateString) {
    if (!(/^\d{2}\.\d{2}\.\d{4}\.$/).test(dateString)) return undefined;
    return Number(dateString.substring(6, 10));
}