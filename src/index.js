import Observer from './observer/observer';
import * as scope from './instance/scope';
 
 
class Tvue {
  constructor(options={}) {
    this.init(options);  
  }
  
  init(){
  	 this.options= options;
  	 this.$data=options.data;
     // 初始化data, 主要是做Observer,数据监听这一块
//   this._initData(this.$data);
  }
}

Object.assign(Tvue.prototype, {
  ...scope
});

export default Tvue;