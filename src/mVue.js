//指令处理类
const compileUtile = {
    getVal(expr,vm){
        //reduce用的好啊
        const reg = /\{\{(.+?)\}\}/g;
        //处理双大括号
        if(reg.test(expr)){
            expr = expr.replace(reg,(...args)=>{
                return args[1]
            });
        }
        return expr.split('.').reduce((data,curentval)=>{
            return data[curentval];
        },vm.$data)
    },
    text(node,expr,vm){
        new Watcher(vm,expr,(newVal)=>{
            this.updater.textUpdate(node,newVal);
        })
        const value = this.getVal(expr,vm);
        this.updater.textUpdate(node,value);
    },
    html(node,expr,vm){
        new Watcher(vm,expr,(newVal)=>{
            this.updater.htmlUpdate(node,newVal);
        })
        const value = this.getVal(expr,vm);
        this.updater.htmlUpdate(node,value);
    },
    model(node,expr,vm){
        new Watcher(vm,expr,(newVal)=>{
            this.updater.modelUpdate(node,newVal);
        })
        const value = this.getVal(expr,vm);
        this.updater.modelUpdate(node,value);
    },
    on(node,expr,vm,event){
        let fn = vm.$options.methods&&vm.$options.methods[expr];
        node.addEventListener(event,fn.bind(vm),false)
    },
    bind(node,expr,vn,attrName){
        //设置属性
    },
    //更新函数
    updater:{
        textUpdate(node,value){
          node.textContent = value;
        },
        htmlUpdate(node,value){
            node.innerHTML= value;
        },
        modelUpdate(node,value){
            node.value=value;
        }
    }
}
//Compile指令解析器
class Compile{
    constructor(el,vm){
       this.el =  this.isElementNode(el)?el:document.querySelector(el);
       this.vm = vm;
       //1.获取虚拟节点对象，放入内存中，操作减少页面的回流和重绘
       const fragment = this.node2Fragment(this.el);
       //2.编译虚拟节点
       this.compile(fragment);
       //3.追加子元素到跟元素
       this.el.appendChild(fragment);
    }
    isElementNode(node){//判断是否是元素节点对象
        return node.nodeType===1;
    }
    node2Fragment(el){//创建虚拟节点
        const f = document.createDocumentFragment();
        let firstChild;
        while(firstChild= el.firstChild){//循环取子节点创建虚拟节点，直到取完
            f.appendChild(firstChild) //appendChild方法会将原来的dom树中的节点添加到虚拟的节点对象中，并且会删除原来的节点
        }
        return f;
    }
    compile(fragment){
        //1.获取子节点
        const childNodes = fragment.childNodes;
        [...childNodes].forEach(node=>{
            if(this.isElementNode(node)){
                //是元素节点
                //编译元素节点
                this.compileElement(node);
            }else{
                //是文本节点
                //编译文本节点
                this.compileText(node);
            }
            if(node.childNodes&&node.childNodes.length){
                this.compile(node);
            }
        })
    }
    compileElement(node){
        const attrs = node.attributes;
        [...attrs].forEach(attr=>{
            const {name,value} = attr;//结构赋值
            if(this.isDerective(name)){//是否是一个指令 v-text v-on:clik
                const [,directive] = name.split('-');//text model html, on:click...
                const [dirName,eventName]= directive.split(':');//text,on
                //一个指令处理的类
                compileUtile[dirName](node,value,this.vm,eventName);
                //删除指令属性
                node.removeAttribute('v-'+dirName);
            }else if(this.isEventShortName(name)){//处理@简写事件
                console.log(name)
                const [,eventName]= name.split('@');
                console.log(eventName)
                compileUtile['on'](node,value,this.vm,eventName);
                node.removeAttribute('@:'+eventName);
            }
        })
    }
    compileText(node){
        const content = node.textContent;
        //匹配大括号{{}}
        const reg = /\{\{(.+?)\}\}/;
        if(reg.test(content)){
            compileUtile['text'](node,content,this.vm);
        }
    }
    isDerective(attrName){
        return attrName.startsWith('v-');
    }
    isEventShortName(attrName){
        return attrName.startsWith('@');
    }
}

// import s from './observer/compile'
class mVue{
    constructor(options){
        //初始化
        this.$options = options;
        this.$el = options.el;
        this.$data = options.data;
        if(this.$el){
            
            //1.实现观察者observer
            new Observer(this.$data);
            //2.实现指令解析器
            new Compile(this.$el,this);
        }
       
    }
}