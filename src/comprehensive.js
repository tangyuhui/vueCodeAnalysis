/**
 * Created by tangyuhui on 2018/1/24.
 */
'user strict'
import * as util from './util';
import arrayProto from './array-augmentations';
import PubSub from './pubsub';

function Vue(options){
    this.el=options.el;
    this.data=options.data;
    this.event=new PubSub();
    this.path="";
    this.init();
    this.render();
    this.originalHtml;
    this.dom;
}
Vue.prototype={
    init(){
        this.walk(this.data, this.path);
        this.compile();
    },
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
                self.event.emit(path||key,value);
                oldValue=value;
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

document.querySelector("#xg").addEventListener("click",function(){
    app.data.user.name="tang"+Date.now();
})

let app = new Vue({
    el: '#app',
    data: {
        user: {
            name: 'youngwind',
            age: 25
        }
    }
});
app.$watch("set",function(self){
    self.compile(self.originalHtml);
})