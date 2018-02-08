class Directive {
  constructor(el,expression,vm) {
     this.el=el;
     this.expression=expression;
     this.vm=vm;
     this.update();
  }
  update(){
     this.el.nodeValue=this.vm.getData(this.expression);
  }
}
export default Directive;
 