/**
 * Created by tangyuhui on 2018/1/24.
 */
function PubSub() {
    this.handlers = {};
}
PubSub.prototype = {
    // 订阅事件
    on: function(eventType,handler){
        var self = this;
        if(!(eventType in self.handlers)) {
            self.handlers[eventType] = [];
        }
        self.handlers[eventType].push(handler);
        return this;
    },
    // 触发事件(发布事件)
    emit: function(eventType){
        var self = this;
        var handlerArgs = Array.prototype.slice.call(arguments,1);
        var eventChain = eventType.split(".");
        for (const eventType of eventChain) {
            if(self.handlers[eventType]){
                for(var i = 0; i < self.handlers[eventType].length; i++) {
                    self.handlers[eventType][i].apply(self,handlerArgs);
                }
            }
        }
        return self;
    }
};// 调用方式如下：

 export default PubSub;