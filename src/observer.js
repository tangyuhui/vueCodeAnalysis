'user strict'
import * as util from './util';
import arrayProto from './array-augmentations';
import PubSub from './pubsub';
function Observer(data,path="") {
    let b = "我是块级作用域let";
    this.data = data;
    this.event=new PubSub();
    this.path=path;
    this.init();
}
Observer.prototype = {
    init(){
        this.walk(this.data, this.path)
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
    }
}


let app2 = new Observer({
    name: "tang",
    age: 25
});
app2.data.name={
    firstName: 'shaofeng',
    lastName: 'liang'
}
app2.$watch('name', function (newName) {
    console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
});
app2.$watch('firstName', function (newName) {
    console.log('我的firstName姓名发生了变化')
});

app2.data.name.firstName = 'hahaha';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
app2.data.name.lastName = 'blablabla';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。



