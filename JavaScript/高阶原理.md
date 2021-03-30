# 总结资料

- [金九银十，初中级前端面试复习总结「JavaScript篇」](https://juejin.im/post/6868843713729134599)
- [金九银十，初中级前端面试复习总结「Vue篇」](https://juejin.im/post/6869908820353810445)
- [金九银十，初中级前端面试复习总结「浏览器、HTTP、前端安全」](https://juejin.im/post/6869376045636648973)



# 执行上下文

*参考资料*：

> https://github.com/mqyqingfeng/Blog/issues/3 及后续几篇文章

## 概念总结

- 词法作用域：函数的作用域是在函数定义时决定的
- 执行上下文栈：函数调用时，函数的**执行上下文**入栈



- 变量对象：包含 arguments、变量声明、函数声明（优先）、形参列表
- 作用域链：执行上下文创建时创建，当前活动对象在最前，函数的[[scope]]属性接着，该属性在函数定义时创建（基于词法作用域）

## 执行上下文创建过程

1. 函数声明，保存作用域链（基于词法作用域）到scope属性
2. 函数执行，创建函数上下文，**入栈**
3. 函数上下文中，先创建作用域链，先复制函数的[[scope]]
4. 创建AO（用arguments），包含arguments、形参、函数声明（**同名函数优先变量**）、变量声明
5. 把AO压入作用域链顶端

## this指向

实用场景分析：
`var obj = {a: 1, b: function(){console.log(this);}}`

1. 作为对象调用时，指向该对象 obj.b(); // 指向obj
2. 作为函数调用, var b = obj.b; b(); // 指向全局window
3. 作为构造函数调用 var b = new Fun(); // this指向当前实例对象
4. 作为call与apply调用 obj.b.apply(object, []); // this指向当前的object

ES规范角度分析：

```
1.如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)

2.如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么this的值为 ImplicitThisValue(ref)

3.如果 ref 不是 Reference，那么 this 的值为 undefined
```

## 箭头函数

箭头函数的this，会从作用域链上找父级的this

没有arguments，没有Prototype属性，不能用作构造函数

**箭头函数的this在定义的时候就决定，不会随着调用而更改**

# 闭包

闭包函数：函数主体+自由变量（作用域链上的变量）。 即使上层执行上下文被销毁，依然维护一个作用域链，作用域链上的AO因为存在引用所以还在内存中

> https://github.com/mqyqingfeng/Blog/issues/9

# 模拟call和apply、bind

## call和apply

1. 在对象下添加函数
2. 对象执行函数
3. 删除对象中的函数

解决问题：

1. 参数列表：用arguments，保存为数组，然后用eval执行 对象的函数（数组字符串为参数）
2. null：加判断，null时对象是window
3. 返回值：用一个result变量保存第二步的结果，最后return

```javascript
Object.prototype.call = function(content){
            content = content || window
            var obj = arguments[0]
            obj.f = this
            
            var result = obj.f(...Array.from(arguments).shift())
            ovj.f = null //删除掉
            return result
        }


        var name = "a"
        function foo(c1,c2){console.log(this.name,c1,c2);return "ok"}
        obj = {name:"b"}
        foo("2","3")
        foo.call(obj,"1","2")
```

## bind

### bind的不同

返回一个函数，bind的参数列表 , 是返回函数的默认参数，返回函数的新参数追加在这些参数后面

`foo.bind(obj,"1") //返回Function`

### 模拟思路

1. 形成：构造一个函数，将apply()的结果返回

2. 传参：bind的arguments *拼接*  返回函数的arguments
3. new场景：返回函数的this是实例，传参不变。 
   - 新函数的this是实例。用instanceof判断
   - 新函数的实例，是继承绑定函数的。用寄生式继承（创建空函数）。
4. 调用bind的不是函数，报错。typeof this !== "function"

```javascript
Object.prototype.bind = function(){
    var obj = arguments[0]
    var self = this
    var args1 = Array.prototype.slice.call(arguments,1)
    return function() {return self.apply(obj,args1.concat(arguments))}
}

```

改进的new场景版本：

```javascript
Object.prototype.bind = function(){
    var obj = arguments[0]
    var self = this
    var args1 = Array.prototype.slice.call(arguments,1)
    var fNOP = function(){}
    fNOP.prototype = self.prototype
    var fBound = function() {return self.apply(this instanceof fNOP?this:obj,args1.concat(arguments))}
    fBound.prototype = new fNOP()
    return fBound
}
```

为什么要继承：new出的实例要访问绑定函数的原型的值

为什么要中间函数去继承: 不希望返回函数改变被绑定函数的原型，新函数要有**独立的原型对象**

# 模拟new

过程：

1. 新建空对象，使构造函数在空对象的环境下执行
2. 原型链补充。对象的__proto__指向构造函数的Prototype
3. 返回值，如果构造函数返回对象，则返回它，否则，返回创建的对象

第一版：

```javascript
//用这个函数模拟new
objectFactory(foo,……)

function objectFactory(){
	var constructor = arguments[0]
    var obj = new Object()
    constructor.apply(obj,Array.prototype.slice(arguments,1)) //给空对象填东西
    obj.__proto__ = constructor.prototype
    return obj
}
```

第二版：解决构造函数有返回值

```javascript
objectFactory(foo,……)

function objectFactory(){
	var constructor = arguments[0]
    var obj = new Object()
    var ret = constructor.apply(obj,Array.prototype.slice(arguments,1)) //给空对象填东西
    obj.__proto__ = constructor.prototype
    return typeof ret === "Object"?ret:obj
}
```



# 类数组对象

凡是有length和数字索引的对象，都是类数组对象，都能使用数组原型方法

**只可以当参数来用**

Array.prototype.slice(arguments)

Array.prototype.concat([],arguments)

…………

# 对象创建方法的优缺点

工厂模式

- 缺点：无法识别，没有公共对象和函数

构造函数模式

- 优点：可识别
- 缺点：实例没有公共对象和函数

构造函数模式优化

- 优点：有了公共对象和函数
- 缺点：封装性差

原型模式

- 优点：方法不会重新创建
- 缺点：所有属性共享

组合模式

- 优点：该共享的共享，该私有的私有
- 缺点：封装性，原型不能写在构造函数里

动态原型模式

- 优点：组合模式的升级版，封装好
- 缺点：代码复杂，可读性差

寄生构造函数模式

- 和工厂模式一样，多了个new

# 继承方法的优缺点

## 原型链继承

```javascript
function parent(){
    this.name = 'kevin';
}
parent.prototype.getName = function () {
    console.log(this.name);
}
function child(){
    
}
child.prototype = new parent()
```

子类继承父类的**私有属性**和**原型属性**

### 优点

1. 父类的属性和方法，子类都能访问

### 缺点

1. 父类的私有引用类型，所有子类指向同一个。子类不能拥有专属且继承的引用类型
2. 无法多继承，一个子类不能继承多个父类
3. 子类实例创建时，无法向父类传参

## 借用构造函数（经典继承）

```javascript
function parent(){
    this.name = "morton"
}
function child(){
    parent.call(this[,参数列表])
}
```

### 优点

1.子类的引用值独立

2.可以向父类构造函数传参

### 缺点

每个子类都创建一份函数，不复用

## 组合继承

```javascript
function parent(){
    this.name = "morton"
}
function child(){
    parent.call(this[,参数列表])
}
child.prototype = new parent()
```

优点：借用构造函数和原型链继承的优点

## 原型式继承

```javascript
function creatObject(o){
    function f(){}
    f.prototype = o
    return new f()
}
```

Object.create()的模拟实现。新对象以旧对象为原型

### 缺点

所有引用类型的值，被所有子类共享，和原型链继承一样

## 组合寄生式继承

```javascript
function parent(){
    this.name = "morton"
}
function child(){
    parent.call(this[,参数列表])
}

function f(){}
f.prototype = parent.prototype
child.prototype = new f()

```

优点：有组合继承的优点。且不需要调用两次父类构造函数，减少重复变量的产生

## Class继承

super()相对于apply，借用构造函数，继承父类的实例属性

extend相对于寄生式继承，继承父类的原型属性

# 浮点数精度

- ES用64位来存储一个浮点数

浮点数在内存中的存的东西

（1位）S：符号位

（52位）fraction：有效数字段，去掉最高位1.（因为1肯定是第一个数字，所以没必要存）

（11位）E+bias：E是幂，bias是偏移量（2^(位数-1)-1)。 bias存在是为了表示负数。计算机取出幂的时候要减去bias

## 精度丢失

例如十进制0.1，转换为二进制时是无限循环小数。精度就被丢失了。

## 浮点数运算

1. 对阶：小阶对大阶
2. 尾数运算
3. 规格化：将运算结果规格化，简单来说就是转换科学计数法
4. 舍入处理：对运算结果，多出来的尾数，进行0舍1入

此时计算的结果，再转换回整数，例如 0.1+0.2 ，转换的结果不是0.3，而接近于0.3

```javascript
// 十进制转二进制
parseFloat(0.1).toString(2);
//=> "0.0001100110011001100110011001100110011001100110011001101"

// 二进制转十进制
parseInt(1100100,2)
//=> 100

// 以指定的精度返回该数值对象的字符串表示
(0.1 + 0.2).toPrecision(21)
//=> "0.300000000000000044409"
(0.3).toPrecision(21)
//=> "0.299999999999999988898"
```

# 深浅拷贝

- 都是针对 引用类型的拷贝。

- 浅拷贝 只复制 属性的**引用**和**基本类型**。 深拷贝 复制 属性 **引用的实体**和**基本类型**，对引用申请了新的内存空间

- 浅拷贝适合 属性都是基本类型的拷贝
- 浅拷贝 只拷贝对象里放在栈区的东西，深拷贝涉及堆区的东西

## 浅拷贝

如果对象是数组，可以用concat、slice、解构操作符、Array.from完成拷贝

如果对象不是数组，写一个循环遍历赋值所有属性

```javascript
var shallowCopy = function(obj) {
    // 只拷贝对象
    if (typeof obj !== 'object') return;
    // 根据obj的类型判断是新建一个数组还是对象
    var newObj = obj instanceof Array ? [] : {};
    // 遍历obj，并且判断是obj的属性才拷贝
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
```

## 深拷贝

如果没有函数

```javascript
var new_arr = JSON.parse(JSON.stringify(arr));
```

其它情况(递归）：

```javascript
var deepCopy = function(obj) {
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}
```

# 防抖

https://github.com/mqyqingfeng/Blog/issues/22

## 非立即执行版本

触发事件时，先清除timeout，再执行一个新的timeout

注意两个实现点：1.this 2.event对象

```javascript
        var count = 1
        function action(){
            var node=document.createElement("div")
            var myText = document.createTextNode(count++)
            node.appendChild(myText)
            this.appendChild(node)
        }
        
        var node = document.getElementById("k")
        node.onmousemove = debounce(action,1000)


        function debounce(fn,wait){
            var timeout
            return function(){
                arg = Array.from(arguments)
                clearTimeout(timeout)
                timeout = setTimeout(()=>fn.apply(this,arg),wait)
            }
        }
```

## 立即执行版本

模型：一个沙漏，是消失的。只有鼠标经过才出现。鼠标经过时，漏斗若存在，则重置

事件触发时，无timeout时执行，有timeout时重置timeout

```javascript
function debounce(fn,wait){
            var timeout
            var func =  function(){
                arg = Array.from(arguments)
                
                if(timeout) clearTimeout(timeout)
                var callnow = !timeout
                timeout = setTimeout(()=>timeout = null,wait)
                if(callnow) {var res = fn.apply(this,arg)
                             return res
                            }
            }
            func.cancel = function(){
                clearTimeout(timeout)
                timeout = null
            }
        }
```

实现：1.返回值 2.取消功能

- 为什么返回值只在立即执行版本里出现？

  答：非立即执行版本，函数在settimeout中执行，无法返回值到原函数

- 取消功能是什么？

  是取消防抖等待，而不是取消整个防抖函数的效果。使用户在点击【取消防抖】按钮后，再次触发事件可以立即执行

# 节流

## 时间戳版

```javascript
 function throttle(fn,wait){
            var pre = 0
            return function(){
                arg = Array.from(arguments)
                now = new Date()
                if(now - pre >= wait){
                    fn.apply(this,arg)
                    pre = now
                }
            } 
        }
```

## 定时器版

```javascript
function throttle(fn,wait){
            var timeout
            return function(){
                if(!timeout){
                    timeout = setTimeout(()=>{
                        fn.apply(this,Array.from(arguments))
                        timeout = null
                    },wait)
                }
            }
        }
```

- 时间戳和定时器版本的比较：

  时间戳：在计时前执行

  定时器：在计时后执行

## 合并版本（在最头和最尾都执行）

在时间戳的基础上。 若用户在时间戳的计时中触发，则创建一个定时器，定时是计时的剩余时间，使计时结束后执行一次函数

```javascript
  function throttle(fn,wait){
            var pre = 0
            var timeout
            return function(){
                var now = new Date()
                var remaining = wait - (now - pre)
                if (remaining<=0 || remaining>wait){
                    if(timeout){
                        //系统改了时间的情况
                        clearTimeout(timeout)
                        timeout = null
                    }
                    fn.apply(this,Array.from(arguments))
                    pre = now
                }
                else if(!timeout){
                    timeout = setTimeout(()=>{
                        fn.apply(this,Array.from(arguments))
                        pre = new Date()
                        timeout = null //使下次可用
                    },remaining)
                }
            }
        }
```

- 改进一个带option参数的版本，约定leading：false 表示禁用第一次执行；trailing: false 表示禁用停止触发的回调

  leading==false 时，控制previous始终等于now，让时间戳部分无法执行

  training==false时，控制创建定时器的分支无法进入

# 数组去重

- 数据类型：新数组（初始为空，保存结果）、原数组。

  - 双层for循环（兼容性强；新数组保存结果（新数组作用类似set，插入前看是否存在））

  - 用indexOf对1优化

  - **排序后去重**（只比较相邻，即旧数组的index和新数组的队尾

- 数据类型：原数组
  - filter

- 数据类型：原数组，新对象
  - Object的键为value，值为Boolean。遍历数据时，判断Object[value]
- 数据类型：原数组，Set or Map



**元素类型有undefined、正则字面量、NaN 等类型时。  Object键值对方法可以去重。键名用 typeof a+a保存**

# 判断对象相等

```javascript
 function compare(a,b){
            if(Object.keys(a).length !== Object.keys(b).length) return false
            for(let key in a){
                if(a.hasOwnProperty(key)){
                    if(typeof b[key] !== 'object'&& typeof a[key] !== "object"){
                        if(a[key]===b[key]){
                            continue
                        }
                        else{return false}
                    }
                    else if(typeof b[key] === 'object'&& typeof a[key] === "object"){
                        if(compare(b[key],a[key])){
                            continue
                        }
                        else{return false}
                    }
                }
            }
            return true
        }
        var a = {a:1,b:2,c:{r:2,y:7,p:{d:2}}}
        var b = {a:1,b:2,c:{r:2,y:7,p:{d:2}}}
        console.log(compare(a,b))
```

该代码只满足属性有对象和基本类型。不包含对数组等的判断

# 类型判断

- typeof

  不能判断对象是什么，不能判断null，可判断函数

- instanceof

  不能直接输出，只能靠猜

- Object.Prototype.toString.call()

  只能判断对象，对基本类型会返回封装对象类型

- Array.isArray

  只能判断数组

## 对象判断

### 空对象

for-in循环，一进入就代表不是空对象

### window对象

window对象有window属性指向自身

`window.window === window`

### 类数组对象

两个条件之一即可：

1. 长度为 0
2. lengths 属性是大于 0 的数字类型，并且obj[length - 1]必须存在

### 是不是DOM元素

node.nodetype === 1

# 找数组最大值

- Math.max()
- reduce
- 先排序

# 数组扁平化

- 递归（可用reduce来简化）
- toString

# 函数柯里化、偏函数

## 柯里化

用途：参数复用

把一个函数（有n个参数）柯里化后，得到一个可接收0~n个参数的柯里函数。

实现： curry函数中，对参数长度判断，如果满了则执行，如果参数不够，则再柯里化

## 偏函数

柯里化是将一个多参数函数转换成多个单参数函数，也就是将一个 n 元函数转换成 n 个一元函数。

局部应用则是固定一个函数的一个或者多个参数，也就是将一个 n 元函数转换成一个 n - x 元函数。

实现：模拟bind，但this不指定

# vue

https://juejin.im/post/6844904084374290446

https://juejin.im/post/6844903508810940429

# 类型转换

深层次理解：

https://github.com/mqyqingfeng/Blog/issues/159

https://github.com/mqyqingfeng/Blog/issues/164



## 运算+、-

### 只有原始类型的转换

规则：

- 转换成number类型

- 如是加法且一方有字符串，结果是转换成string类型

- undefined转换number是NaN

### 含引用类型的转换

流程：

执行valueOf()的结果是基本类型，如果不是则toString()转换为string再运算。

## 取反！

规则：

- 转换成boolean类型
- 所有引用类型都是true

## 比较==

规则：

- 转换成number类型
- undefined==null
- 引用类型转换成字符串比较，如果不相等再转number

# 实现get、post

```javascript
//实现get
    function getJSON(url){
        let promise = new Promise((resolve,reject)=>{
            let xhr = new XMLHttpRequest()
            //新建http请求
            xhr.open("GET",url,true)

            //设置状态的监听函数
            xhr.onreadystatechange = function(){
                if(xhr.readyState !== 4) return
                if(this.status>=200&&this.status<300||this.status==304){
                    resolve(this.response)
                }else {
                    reject(new Error(this.statusText))
                }
            }

            //设置错误监听函数
            xhr.onerror =  function(){
                reject(new Error(this.statusText))
            }

            //设置响应的数据类型
            xhr.responseType = "json"

            //设置请求头
            xhr.setRequestHeader("Accept","application/json")

            //发送
            xhr.send(null)
        })
        return promise
    }
```





# 浏览器输入url后发生什么（待总结）

DNS解析ip

根据ip对服务器发送连接请求

三次握手，连接服务器

数据传输

四次挥手，断开服务器（不一定会断开连接，因为HTTP1.1中会复用TCP连接）

浏览器解析数据

并行构建DOM树和CSSOM树

合成Render树

布局

绘制

渲染层合成（展示内容在页面上）。

# https重定向（待总结）

原题的描述是，为什么在浏览器上输入`http://www.baidu.com`会跳转到`https`下对应的域名，这样做目的是什么？

其实很简单，跳转是服务端做了重定向的处理，目的是为了网站的安全性。

### 有几种方式可以让网页重定向

1. a标签
2. location.href
3. window.open
4. 设置html的meta标签


作者：WahFung
链接：https://juejin.im/post/6875705865798844430
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

# window.open有什么弊端（待总结）

# UTF-8和GBK的区别（待总结）

# 浏览器缓存机制

[《浅谈浏览器缓存》](https://segmentfault.com/a/1190000012573337) [《前端优化：浏览器缓存技术介绍》](https://juejin.im/post/5b9346dcf265da0aac6fbe57#heading-3) [《请求头中的 Cache-Control》](https://www.web-tinker.com/article/21221.html) [《Cache-Control 字段值详解》](https://juejin.im/post/5c2d6c9ae51d450cf4195a08)



### http头、http2、http3，https，jwt，oauth2.0，resfulApi，graphQL

# 回流重绘，Fragment

# vue路由懒加载

# webpack

https://juejin.im/post/6844904079219490830#heading-9

https://juejin.im/post/6844903861740634120

https://juejin.im/post/6844903877771264013 面试题

https://juejin.im/post/6854573217336541192 原理

https://juejin.im/post/6859538537830858759 原理

https://juejin.im/post/6844904094281236487 面试题

https://juejin.im/post/6844904054393405453 loader

[webpack的代码分割（路由懒加载同理）](https://juejin.im/post/5e796ec1e51d45271e2a9af9)

#### webpack是什么?

> js的静态模块打包器

#### 核心概念有什么?是什么意思

> entry:入口文件
>
> output:输出
>
> loader: 模块转换器
>
> plugins

#### 使用babel

> rule下,指定test,use,include,exclude

#### 配置js版本转换

```javascript
//webpack.config.js
module.exports = {
    // mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            [
                                "@babel/plugin-transform-runtime",
                                {
                                    "corejs": 3
                                }
                            ]
                        ]
                    }
                },
                exclude: /node_modules/
            }
        ]
    }
}
```

#### 写loader

写在rules中. 有test,use,include ; use中有loader,options 

### 原理

#### module模块化

实现：

```javascript
var module = (function(){
 var a = 1
 var b = 2 //私有
 return function(){
     console.log(a) //共有
 }
})()

//更好写法
(function(window){
 var a = 1
 var b = 2 //私有
 var fn = function(){
     console.log(a) //共有
 }
 window.module = {fn}
})(window)

//fn意味着接口，是暴露给模块外的接口。
```

模块化的优点：

1. 作用域封装
2. 重用 （例如相同header）
3. 解除耦合（内部不影响外部）

#### 模块方案

##### AMD

define（模块名，依赖，输出（函数or对象）

1. 显式模块依赖
2. 不注册到全局变量

##### commonJs

一个文件是一个模块

require函数引入（赋值到某变量），exports对象导出（对其属性赋值）

##### ES6 module

import-from引入

export导出

#### webpack打包机制

1. 从入口文件，分析依赖

2. 每个依赖包装起来，放到一个数组
3. 实现模块加载方法，把它放在模块执行的环境中
4. 入口的执行放在立即执行函数中



#### loader有哪些

**loader是倒叙加载的**

- css-loader ：css语法的解析

- style-loader:对样式生成一个style标签，并插入到页面中

- babel-loader： 在use中设置option属性。presets设置规则。 preset-env是转换ES6的规则。可选设置缓存
- file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
- url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去
- image-loader：加载并且压缩图片文件
- sass-loader
- vue-loader
- `cache-loader`: 可以在一些性能开销较大的 Loader 之前添加，目的是将结果缓存到磁盘里

#### plugins

**结构**

plugins : [] 是个数组

数组元素用new UglifiJSPlugin() （先用require引入）

**和loader区别**

loader是文件加载器。 plugins强调事件监听的能力，比如文件压缩

**有哪些？**

- uglifyjs 压缩js文件

- htmlPlugin
  - 参数有template（一个路径）、filename

#### **文件监听原理呢？**

在发现源码发生变化时，自动重新构建出新的输出文件。

Webpack开启监听模式，有两种方式：

- 启动 webpack 命令时，带上 --watch 参数
- 在配置 webpack.config.js 中设置 watch:true

缺点：每次需要手动刷新浏览器

原理：轮询判断文件的最后编辑时间是否变化，如果某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等 `aggregateTimeout` 后再执行。

# ajax

```javascript
//实现get
    function getJSON(url){
        let promise = new Promise((resolve,reject)=>{
            let xhr = new XMLHttpRequest()
            //新建http请求
            xhr.open("GET",url,true)

            //设置状态的监听函数
            xhr.onreadystatechange = function(){
                if(xhr.readyState !== 4) return
                if(this.status>=200&&this.status<300||this.status==304){
                    resolve(this.response)
                }else {
                    reject(new Error(this.statusText))
                }
            }

            //设置错误监听函数
            xhr.onerror =  function(){
                reject(new Error(this.statusText))
            }

            //设置响应的数据类型
            xhr.responseType = "json"

            //设置请求头
            xhr.setRequestHeader("Accept","application/json")

            //发送
            xhr.send(null)
        })
        return promise
    }

```

