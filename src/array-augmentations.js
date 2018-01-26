/**
 * Created by tangyuhui on 2018/1/23.
 */
function FakeArray(){
    var a =  Array.apply(this,arguments);
    a.__proto__=FakeArray.prototype;
    a.constructor=FakeArray;
    return a;
}

FakeArray.prototype=Object.create(Array.prototype);
FakeArray.prototype.constructor=FakeArray;

var aryMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

aryMethods.forEach(function(currentValue,index){
    var originFunction =Array.prototype[currentValue];
    FakeArray.prototype[currentValue]=function(){
        this.event.emit(key,value);
        originFunction.apply(this,arguments);
    }
})

export default Object.create(FakeArray.prototype)