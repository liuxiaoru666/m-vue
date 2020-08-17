# vue源码学习
 [vue源码构建过程](https://juejin.im/post/6861067406119616526/)

[入口代码分析](https://juejin.im/post/6861108316685713416/)

[$mount的实现](https://juejin.im/post/6861190719768526856/)

 [响应式原理](https://juejin.im/post/6861097998705917965/)

## 面试题
1、MVVM响应式原理

官方话术：

vue采用数据劫持，结合发布订阅者模式，通过Object.defineProperty劫持数据的getter，seter，当数据变动时，发布消息给依赖收集器，通知订阅器触发更新回调

vue源码实现：

通过Observer、Compile、Watcher三者结合，Observer类,对所有属性监听、劫持，Compile解析器大括号表达式时，创建Watcher,绑定更新视图回调函数，当数据发生变化，发布消息依赖收集，通知订阅执行更新回调，最终通过Watcher搭建Observer和Compile的桥梁，实现MVVM的响应式

