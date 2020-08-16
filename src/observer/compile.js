export default class Compile{
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
                //文本节点
                this.compileText(node);
            }
            if(node.childNodes&&node.childNodes.length){
                this.compile(node);
            }
        })
    }
    compileElement(node){

    }
    compileText(node){

    }
}