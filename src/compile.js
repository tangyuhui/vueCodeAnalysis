/**
 * Created by tangyuhui on 2018/1/25.
 */
function Complie(options) {
    this.data = options.data;
    this.$el = document.querySelector(options.el);
    this.template = this.$el.cloneNode(true);
    this._compile(this.template);
}
Complie.prototype = {
    _compile: _compile,
    compileElement: compileElement,
    compileText: compileText,
    getData: getData,
    compileNode:compileNode
}
function _compile(dom) {
    this.docFrag = document.createDocumentFragment();
    this.convertChain = [];
    this.compileNode(dom);
    this.$el.parentNode.replaceChild(this.docFrag, this.$el);
}
function compileNode(dom) {
    if (dom.nodeType == Node.ELEMENT_NODE) {
        this.compileElement(dom);
    } else if (dom.nodeType == Node.TEXT_NODE) {
        this.compileText(dom);
    }
}
function compileElement(dom) {
    var self = this;
    var element = document.createElement(dom.nodeName);

    if (dom.hasAttributes()) {
        var attributes = dom.attributes;
        Array.from(attributes).forEach(function (attr) {
            var name = attr.name;
            var value = attr.value;
            element.setAttribute(name, value);
        })
    }
    if (this.convertChain && this.convertChain.length > 0) {
        var fatherDom = this.convertChain[this.convertChain.length - 1];
        fatherDom.appendChild(element);
    } else {
        this.docFrag.appendChild(element);
    }

    if (dom.hasChildNodes()) {
        this.convertChain.push(element);
        dom.childNodes.forEach(function (value) {
            self.compileNode(value);
        })
        this.convertChain.pop();
    }
}
function compileText(dom) {
    var self = this;
    var nodeValue = dom.nodeValue;
    if (nodeValue.search(/^\s*$/) != -1) {
        return false;
    } else {
        var compileValue = dom.nodeValue;
        var matchArray = compileValue.match(/{{.+?}}/g);
        console.log(matchArray);
        if (matchArray) {
            matchArray.forEach(function (value) {
                var oldValue = value;
                value = value.replace(/[{}]/g, "");
                compileValue = compileValue.replace(oldValue, self.getData(value));
            })
        }
        var textNode = document.createTextNode(compileValue);
        if (this.convertChain && this.convertChain.length > 0) {
            var fatherDom = this.convertChain[this.convertChain.length - 1];
            fatherDom.appendChild(textNode);
        }
    }
}
function getData(data) {
    var dataArray = data.split(".");
    //[user,name]
    let result = this.data;
    for (let value of dataArray) {
        if (result) {
            result = result[value];
        }
    }
    return result;
}
let app = new Complie({
    el: '#app',
    data: {
        user: {
            name: 'youngwind',
            age: 25
        }
    }
});