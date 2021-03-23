# 第一章 Script

HTML5 <script> 标签里的 crossorigin 属性到底有什么用？

https://www.chrisyue.com/what-the-hell-is-crossorigin-attribute-in-html-script-tag.html

详解 script 标签(async,defer,integrity,crossorigin 和 onerror 属性)

https://www.codercto.com/a/43499.html

# 第二章 语言基础

- var的作用域、var声明提升（hoist）

- let的作用域，let不会声明提升

- for中let和var在第一个表达式的区别 https://www.cnblogs.com/echolun/p/10584703.html

- const
- 声明风格与最佳实践
- 数据类型有7种，其中6种原式数据类型
- typeof 传一个null是什么

- NaN == NAN 的结果是什么
- 转换为数值的函数，不同的用途是什么  ———— Number、perseInt、perseFloat 



- tostring()和String()的区别
- 模板字面量
- 字符串插值
- 标签函数
- 原始字符串



- symbol类型的作用,用法 https://zhuanlan.zhihu.com/p/77317602




- 指数操作符
- 无符号右移
- for-in不用来遍历数组而用for-of的三个原因 https://www.cnblogs.com/yanggb/p/11455127.html
- for-in和for-of的本质区别
- 标签语句
- with语句
- switch语句的特殊性

## 第四章

- instanceof作用和原理https://juejin.im/post/6844904081803182087
- 执行上下文栈、作用域链、活动对象、标识符解析
- 一个上下文中，定义和变量和函数，都属于这个上下文
- 一个函数的作用域链指什么
- 作用域链增强
- 执行上下文的创建过程，为什么有变量提升和函数提升https://www.cnblogs.com/echolun/p/11438363.html
- 函数内部赋值一个未声明的变量发生了什么
- 如何让对象不能修改



- 垃圾回收机制https://segmentfault.com/a/1190000018605776
- 两种垃圾回收算法，标记清理、引用计数（记录连线数量、缺点）
- 内存管理（经常解除引用，let和const，减少隐藏类的产生（初始化顺序、构造函数初始化全部），防止内存泄露（全局变量、定时器、闭包），减少对象更替（减少初始化，对象池）
- 隐藏类https://www.jianshu.com/p/39bdf2b4409e
- null和delete对隐藏类的影响



- 原始值和引用值存在栈和堆



## 第五章

- 正则匹配模式有哪些（igmyus）
- 粘附标记
- RegExp构造函数有什么参数
- RegExp实例有什么属性
- RegExp实例有什么方法

- exec方法
- RegExp构造函数属性



- Number实例有什么方法，toFixed
- isInteger是Number构造函数方法



- substring、substr、slice的区别 （负数下，substring的负数都变成0）
- 字符串对象的indexof和lastIndexof，参数
- 三个字符串包含方法，参数

- trim及其两个类似方法
- repeat
- padstart、padend及其参数
- 如何迭代、解构每个字符
- 如何大小写转换



- 字符串模式匹配有哪些函数（4个
- 字符串比较方法
- eval
- 表达式上下文，语句上下文

- 数组构造函数
- Array.of和from，用途（以后要回来看）
- map和join对数组空位处理
- 检验是否数组
- 数组迭代器方法
- fill、copywithin及参数
- join方法
- 栈方法，返回值，方向
- 排序方法
- 连接方法
- slice方法
- splice方法
- 刷题技巧
  https://www.cnblogs.com/wenruo/p/11100537.html



## 第七章

哪些原生类型有默认迭代器

扩展操作符

浅拷贝（只复制对象的引用）

用一个新对象，复制一个旧的可迭代对象（在构造函数）

数组解构



## 第八章

- 数据属性有哪些特性（4个）

- 定义访问器属性

- 修改属性的特性，多个元素

- 读取属性的特性，多个特性
- 合并对象。（参数、返回值、对第一个参数对象的影响）浅复制
- 对象解构

- 判断一个对象是否含某个属性
- 判断一个对象是否是另一个对象的原型
- 判断一个属性是否可枚举
- 返回对象的字符串表示(三种)



- 创建对象的方法
  - 工厂模式：一个创建函数，返回new Object()；缺点：没有对象标识
  - 构造函数模式：一个构造函数,属性用this,用new来调用; 所有新实例的[[Prototype]] (constructor)指向这个构造函数。缺点：对象内的方法不能共用（但是有办法解决）
  - 原型模式：

![image-20200908153838950](C:\Users\morto\AppData\Roaming\Typora\typora-user-images\image-20200908153838950.png)

- 检查一个对象是否和另一个对象有同一个原型（isPrototypeOf）
- 从实例，获得原型对象（Object.getPrototypeOf(实例)）
- 设置实例的原型对象 （Object.setPrototypeOf（实例，新原型对象））
- 以一个对象为原型，创建一个实例（Object.create()）
- 原型链中，访问属性的顺序 （从对象开始找，再去原型往上找）
- hasOwnProperty（属性名） 会往原型链上找吗,不可枚举属性呢?
- in操作符，会往原型链找吗
- hasPrototypeProperty（）返回什么
- 获得一个对象的所有可枚举属性数组（Object.keys()
- getOwnPropertyNames返回什么
- getOwnPropertySymbol返回什么
- 对象迭代方法 (Object.values(对象名),Object.entries(对象名)) (**还没看完**)



继承:https://blog.csdn.net/qq_30904985/article/details/81252792

- 原型链:原型对象是另一个原型对象的实例，子构造函数.prototype = new 父构造函数() 
- 原型链的问题:1.父类型的引用属性,会被所有子类型共享 .**只希望继承父类的原型对象中的内容**, 2.父构造函数无法被子类型传参 3.不能写进构造器
- instanceof判定如何父子对象
- 盗用构造函数:解决父类型引用值被共享的问题. 方法: 子构造函数中 父构造函数.call(this) . 问题:不能继承父类原型属性/方法,不能函数复用
- 组合继承:原型链和盗用构造函数都使用.是js中使用最多的继承模式.  先继承属性(盗用构造函数),再继承方法(原型链) 缺点:调用了两次父类构造函数，生成了两份实例
- 寄生组合继承: 1.盗用构造函数继承 2.在父与子之间做一个新类, 做三级原型继承(新类的Prototype指向父的Prototype) 优点:不会生成两份实例

## 第十章

- 递归函数，如何在内部不写函数名实现调用自己

## 题收集

![image-20200906215836219](C:\Users\morto\AppData\Roaming\Typora\typora-user-images\image-20200906215836219.png)

![](C:\Users\morto\AppData\Roaming\Typora\typora-user-images\image-20200906215856916.png)

