/**
 * Created by tangyuhui on 2018/1/25.
 */
import Directive from './directive';
import parseText from './parse';
export function _compile() {
    this.directives=[];
    this.compileNode(this.$el);
}
export function compileNode(dom) {
    if (dom.nodeType == Node.ELEMENT_NODE) {
        this.compileElement(dom);
    } else if (dom.nodeType == Node.TEXT_NODE) {
        this.compileText(dom);
    }
}
export function compileElement(dom) {
    var self = this;
    /*判断是否有子元素*/
    if (dom.hasChildNodes()) {
        dom.childNodes.forEach(function (value) {
            self.compileNode(value);
        })
    }
}
export function compileText(dom) {
    var self = this;
    var nodeValue = dom.nodeValue;
    var directiveData=[];
    /*检测是否是空白节点*/
    if (nodeValue.search(/^\s*$/) != -1) {
        return false;
    } else {
        var tokens = parseText(nodeValue);
        tokens.forEach(function(token){
        	if(token.tag){
        	 var el = document.createTextNode(token.value);
        	 var expression=token.value;
        	 //创建指令
        	 var directive = new Directive(el,expression,self);
        	 self.directives.push(directive); 
      	     dom.parentNode.insertBefore(el,dom)
        	} else{
     	     dom.parentNode.insertBefore(document.createTextNode(token.value),dom);
        	}
        })
       dom.remove(); 
    }
}
