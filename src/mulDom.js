/**
 * Created by tangyuhui on 2018/1/24.
 */

function Vue(options){
  this.el=options.el;
  this.data=options.data;
  this.render();
  // {user:{  name: 'youngwind',age: 25}}
}
Vue.prototype={
    render(){
         var elDom = document.getElementById(this.el.replace(/^#/,""));
         var htmlTxt = elDom.innerHTML;
         var matchTxt = htmlTxt.match(/{{.*}}/ig);
         for (let value of matchTxt){
             /*将所有特殊字符进行转义*/
            var reg = new RegExp(value.replace(".","\\."),"g");
            var obj=value.replace(/({{)(.*)(}})/g,"$2");
             htmlTxt =  htmlTxt.replace(reg,this.getData(obj));
         }
        elDom.innerHTML=htmlTxt;
         console.log(matchTxt);
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
            name: 'youngwind',
            age: 25
        }
    }
});

