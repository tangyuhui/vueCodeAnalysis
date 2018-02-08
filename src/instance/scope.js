/**
 * Created by youngwind on 16/9/6.
 */

import Observer from '../observer/observer';
import _ from '../util/index';

/**
 * 初始化观察独享
 * @param data {Object} 就是那个大的对象啦
 * @private
 */
export function _initData(data) {
    this.observer = Observer.create(data);
};
 
/**
 * 初始化代理,将 $data里面的数据代理到vm实例上面去
 * @private
 */
export function _initProxy() {
    for (let key in this.$data) {
        // this[key] = this.$data[key];
        _.proxy(this, this.$data, key);
    }
};
