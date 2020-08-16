class Watcher{
    constructor(vm,expr,cb){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        //先把旧值保存
        this.oldVal = this.getOldVal();
    }
    getOldVal(vm,expr){
        Dep.target = this;
        const oldVal = compileUtile.getVal(this.expr,this.vm);
        //触发属性get，依赖收集完成就接触Dep.target的引用
        Dep.target = null;
        return oldVal;
    }   
    update(){
        const  newVal =  compileUtile.getVal(this.expr,this.vm);
        if(newVal!=this.oldVal){
            //返回新值
            this.cb(newVal);
        }
    }
}

class Dep {
    constructor(){
        this.subs=[];
    }

    //收集订阅者
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        console.log(this.subs)
        this.subs.forEach((watcher)=>{
            // 通知订阅者
            watcher.update()
        })
    }
}
class Observer{
    constructor(data){
        this.observe(data);
    }
    observe(data){
        if(data&&typeof data=='object'){
            Object.keys(data).forEach((key)=>{
                this.defineReactive(data,key,data[key]);

            })
        }
    }
   
    defineReactive(obj,key,value){
        this.observe(value);
        //创建订阅者收集器
        const dep = new Dep();
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:false,
            get:()=>{
                //依赖收集，往Dep中添加订阅者
                Dep.target&&dep.addSub(Dep.target);
                return value;
            },
            set:(newVal)=>{
                //解决只能监听对象属性，无法监听整个对象更改的问题
                this.observe(newVal);
                if(newVal!=value){
                    value = newVal;
                }
                dep.notify();
            }
        })
    }
}