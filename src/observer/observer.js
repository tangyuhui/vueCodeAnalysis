import arrayAugmentations from '../observer/array-augmentations';
import objectAugmentations from '../observer/object-augmentations';
import  _ from '../util/index';

class Observer {
  constructor(data) {
   this.data=data;
   if(_.isArray(this.data)){
   	  this.data.__proto__ =Object.create(arrayAugmentations);
   }else if(_.isPaintObject(this.data)){
   	  this.walk(this.data);
   }
  }
  walk(data){
  	 for(let prop in data){
  	 	if(data.hasOwnProperty(prop)){
  	 	    let value=data[prop];
  	 		if(typeof value =="string"){
  	 			Object.defineProperty(data,prop,{
					  get : function(){
					    return value;
					  },
					  set : function(newValue){
					  	console.log("触发了set");
					    value = newValue;
					  },
					  enumerable : true,
					  configurable : true
				})
  	 		}else if(_.isPaintObject(value)){
  	 			this.observer(value);
  	 		}
  	 	}
  	 }
  }
  observer(value){
   var o=new Observer(value);
   o.parent={
   	ctx:this
   }
  }
}
 
export default Observer;