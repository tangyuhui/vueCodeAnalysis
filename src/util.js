var isFunction = function (functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
};

var isInt = function (x) {
    return x % 1 === 0;
};

var isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

var isObject = function(obj) {
    return {}.toString.apply(obj) === '[object Object]';
};

export {isFunction,isInt,isArray,isObject}
