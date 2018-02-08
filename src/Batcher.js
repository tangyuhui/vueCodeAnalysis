class Batcher {
  constructor() {
    this.queue=[];
    this.has={};
    
  }
  /*添加批处理对象*/
  push(job){
  	if(!this.has[job.id]){
  	   this.queue.push(job);
  	   this.has[job.id]=job;
  	}else{
  	  var index=this.queue.findIndex(function(element, index, array){
  	    	return element.id==job.id;
  	    });
  	  if(index>=0){
  	   this.queue[index]=job;	
  	  }
  	}
  	if(!this.waiting){
  	 setTimeout(()=>{
  	  this.waitting=true;
  		this.flush();
  	 })
  	}
  }
  /*重置*/
  reset(){
    this.queue=[]; 	
    this.has={};
    this.waiting=false;
  }
  /*执行并清空*/
  flush(){
  	this.queue.forEach(function(job){
  		job.cb.call(this);
  	})
  	this.reset();
  }
}
export default Batcher;

//var batcher = new Batcher();

//batcher.push({id:1,name:"tang",cb:function(){
//	alert("1");
//}});
//batcher.push({id:2,name:"yu",cb:function(){
//	alert("2");
//}});
//batcher.push({id:3,name:"hui",cb:function(){
//	alert("3");
//}});
// 
//batcher.push({id:1,name:"2tang",cb:function(){
//	alert("4");
//}});
//console.log(batcher);