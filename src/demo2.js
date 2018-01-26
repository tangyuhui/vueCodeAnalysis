/**
 * Created by tangyuhui on 2018/1/24.
 */
'user strict'
import * as util from './util';
import arrayProto from './array-augmentations';
import PubSub from './pubsub';
var Dep=null;
function Vue(options){
    this.el=options.el;
    this.data=options.data;
    this.computed=options.computed;
    Object.assign(this.data,this.computed);
    this.event=new PubSub();
    this.path="";
    this.init();
    this.render();
    this.originalHtml;
    this.dom;
}
Vue.prototype={
    init(){
        this.walk(this.data, this.path)
    },
    convert(data,key, value,path){
        var self= this;
        if(util.isFunction(value)){
            var oldvalue;
            var depFun=function(){
                oldvalue=value.call(self);
            }
            Dep=depFun;
            oldvalue= value.call(self);
            Object.defineProperty(data,key,{
                 get:function(){
                     return oldvalue;
                 }
             })
            Dep=null;
        }else{
            var oldValue = value;
            var deps=[];
            Object.defineProperty(data, key, {
                set: function (value) {
                    if(util.isObject(value)){
                        self.walk(value,path);
                    }else if(util.isArray(value)){
                        value.__proto__ =Object.create(arrayProto);
                    }
                    oldValue=value;
                    if(deps.length>0){
                        /*有依赖者*/
                        deps.forEach(function(depFun){
                            depFun.call(self);
                        })
                    }
                    self.event.emit(path||key,value);
                    self.event.emit("set",self);
                },
                get:function(value){
                    if(Dep){
                        deps.push(Dep);
                    }
                    return oldValue;
                }
            })
        }
    },
    walk(data,path){
        path=path==""?path:path+".";
        for (let key  in data) {
            let value = data[key];
            if(data.hasOwnProperty(key)){
                /*判断是什么类型*/
              if (util.isObject(value)) {
                    console.log(this.path);
                    this.walk(value,path+key);
                } else if(util.isArray(value)){
                    value.__proto__ =Object.create(arrayProto);
                }else{
                  this.convert(data,key, value,path+key);
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
    render(){
        var elDom = document.getElementById(this.el.replace(/^#/,""));
        var htmlTxt = elDom.innerHTML;
        this.originalHtml=htmlTxt;
        this.dom=elDom;
        this.compile(this.originalHtml);
    },
    compile(htmlTxt){
        var matchTxt = htmlTxt.match(/{{.*}}/ig);
        for (let value of matchTxt){
            /*将所有特殊字符进行转义*/
            var reg = new RegExp(value.replace(".","\\."),"g");
            var obj=value.replace(/({{)(.*)(}})/g,"$2");
            htmlTxt =  htmlTxt.replace(reg,this.getData(obj));
        }
        this.dom.innerHTML=htmlTxt;
    },
    getData(data){
        var dataArray= data.split(".");
        //[user,name]
        let result=this.data;
        for(let value of dataArray){
            result=result[value];
        }
        return result;
    }
}


let app = new Vue({
    el: '#app',
    data: {
        user: {
            name: {
                firstName:"tang",
                lastName:"yu hui"
            },
            age: 25
        }
    },
    computed: {
        // 计算属性的 getter
        getFullname: function () {
            return this.data.user.name.firstName+this.data.user.name.lastName;
        }
    }
});
app.$watch("set",function(self){
       self.compile(self.originalHtml);
})
var button = document.querySelector("#xg");
button.addEventListener("click",function(){
    app.data.user.name.firstName="tang"+Date.now();
})