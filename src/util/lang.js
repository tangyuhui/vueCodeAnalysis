/**
 * Created by youngwind on 16/8/30.
 */
 
  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }
  var class2type = {};
  var toString = class2type.toString;
  var typesArray="Boolean Number String Function Array Date RegExp Object Error".split(" ") 
   typesArray.forEach(function(name){
   	  class2type[ "[object " + name + "]" ] = name.toLowerCase()
  }) 
 /*判断对象类别*/
 export var isArray = Array.isArray ||  function(object){ return object instanceof Array }
 export function isFunction(value) { return type(value) == "function" }
 export function isWindow(obj)     { return obj != null && obj == obj.window }
 export function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
 export function isObject(obj)     { return type(obj) == "object" }
 export function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
 }

 
/**
 * 定义对象属性
 * @param obj {Object} 对象
 * @param key {String} 键值
 * @param val {*} 属性值
 * @param enumerable {Boolean} 是否可枚举
 */
export function define(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
};

/**
 * 这不需要多加解释吧
 * @param to
 * @param from
 */
export function extend(to, from) {
    for (let key in from) {
        to[key] = from[key];
    }
};

/**
 * 代理属性
 * @param to {Object} 目标对象
 * @param from {Object} 当前对象
 * @param key {String} 键值
 */
export function proxy(to, from, key) {
    if (to.hasOwnProperty(key)) return;
    Object.defineProperty(to, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            return from[key];
        },
        set: function (val) {
            from[key] = val;
        }
    });
};
 
 