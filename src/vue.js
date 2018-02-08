/**
 * Created by tangyuhui on 2018/1/29.
 */

'user strict'
import * as util from './utils';
import arrayProto from './array-augmentations';
import PubSub from './pubsub';
import * as compileFunc from './compile';
import Batcher from './Batcher';
function Vue(options){
    this.$options=options;
    this.data=options.data;
    let data = this.data;
    var self = this;
    Object.keys(data).forEach(function(key) {
     self._proxyData(key);
   });
    this.directiveCollection=[];
    this.event=new PubSub();
    this.batcher=new Batcher();
    this.path="";
    this.$el = document.querySelector(options.el);
    this.init();
}
Vue.prototype={
    init(){
        this.walk(this.data, this.path);
        this._compile();
    },
    ...compileFunc,
    convert(data,key, value,path){
        var self= this;
        var oldValue = value;
        Object.defineProperty(data, key, {
            set: function (value) {
                if(util.isObject(value)){
                    self.walk(value,path);
                }else if(util.isArray(value)){
                    value.__proto__ =Object.create(arrayProto);
                }
                console.log("data",data);
                console.log("key",key);
                oldValue=value;
               
                self.directives.forEach(function(directive){
                	 if(directive.expression==path){
                	 	directive.update();
                	 }
                })
                self.event.emit(path||key,value);
                self.event.emit("set",self);
            },
            get:function(value){
                return oldValue;
            }
        })
    },
    walk(data,path){
        path=path==""?path:path+".";
        for (let key  in data) {
            let value = data[key];
            if(data.hasOwnProperty(key)){
                /*判断是什么类型*/
                if (typeof value == "string" || util.isInt(value)) {
                    this.convert(data,key, value,path+key);
                } else if (util.isObject(value)) {
                    console.log(this.path);
                    this.walk(value,path+key);
                } else if(util.isArray(value)){
                    value.__proto__ =Object.create(arrayProto);
                }
            }
        }
    },
    $watch(param,cb){
        if(util.isArray(this.data[param])){
            /*是数组*/
        }else{
            this.event.on(param,cb);
        }
    },
    getData(data) {
	    var dataArray = data.split(".");
	    //[user,name]
	    let result = this.data;
	    for (let value of dataArray) {
	        if (result) {
	            result = result[value];
	        }
	    }
	    return result;
   },
   _proxyData(key) {
	 let self = this;
	 Object.defineProperty(self, key, {
	  configurable: false,
	  enumerable: true,
	  get: function proxyGetter() {
	   return self._data[key];
	  },
	  set: function proxySetter(newVal) {
	   self._data[key] = newVal;
	  }
	 });
 },
 compileGetter(path) {
    path = path.split('.');
    let boby = 'if (o !=null';
    let pathString = 'o';
    let key;
    for (let i = 0; i < path.length - 1; i++) {
        key = path[i];
        pathString += `.${key}`;
        boby += ` && ${pathString} != null`;
    }
    key = path[path.length - 1];
    pathString += `.${key}`;
    boby += `) return ${pathString}`;
    return new Function('o', boby);   // eslint-disable-line
 }
}


let app = new Vue({
    el: '#app',
    data: {
        user: {
            name: 'youngwind',
            age: 25
        }
    }
});
window.app = app;
app.$watch("set",function(self){
	console.log("开始编译啦");
})

