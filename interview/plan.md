March 22. Output a resume.



Shortcoming (from experience):

promise

network

cdn

跨域

animation\transition\transform

JS实现一个队列,清空队列除了把队列赋值为空数组，还有别的方法吗？

package.json的作用是什么，里面有什么内容？

.gitignore里面内容是什么，它的作用是什么？

eslint的两个文件.eslintignore和.eslintrc.js的作用是什么？

使用递归实现十进制转化为二进制（写代码）

前端缓存

# 复习方法

 冴羽的博客
 https://github.com/mqyqingfeng/Blog
 初中级前端的高级进阶指南
 https://juejin.im/post/6844904103504527374
 前端中级
 https://github.com/sl1673495/blogs/issues/52
 前端高级
 https://github.com/sl1673495/blogs/issues/37
 校招总结
 https://github.com/CavsZhouyou/Front-End-Interview-Notebook
 前端面试指南
 https://www.cxymsg.com/
 面试合集
 https://github.com/Jack-cool/fe_interview/issues
 2.算法
 做完
 https://github.com/sl1673495/blogs/issues/53
 就够了
 3.vue
 https://juejin.im/post/6844904084374290446
 4.webpack
 5.nodejs
 待学习知识点：
 冴羽的博客 js专题14~20 函数式编程
 冴羽的博客 ES6部分

# 复习要点

# 复习要点

网友整理：https://www.nowcoder.com/discuss/258810

https://www.nowcoder.com/discuss/513379?type=post&order=time&pos=&page=2&channel=0&source_id=search_post

- webpack（异步加载路由时，webpack chunk的加载顺序怎么保证正确)WebPack中Tree shaking的原理

- vue（基础、双向绑定原理、数组监听等、虚拟dom、diff、vuex工作原理、action和mutations区别联系 ;\**数据劫持和fiber**）

  - proxyhttps://www.jianshu.com/p/77eaaf34e732
  - https://juejin.im/post/6844904097338884110 面试资料汇总
  - https://juejin.im/post/6844903864861196302#heading-3 面试精华
  - https://segmentfault.com/a/1190000019208626 组件通信

- 【ok】eventloop 

- trycatch 

- promise（Promise.all用过吗，自己用promise封装一个Promise.all？要求每一个promise能并行执行，并且要保证最后的回调参数顺序与执行顺序一致（解释：每个 promise 封装的请求不一定会按照调用顺序得到响应，可能后面调用的比前面的要快，但一样要保证最后的顺序是按照调用顺序的）

  - https://juejin.im/post/6844903625609707534

- 组件懒加载

- 【ok】正则?=是什么（千分位加逗号）

- 回流重回

- 算法 二叉树和排序。二叉树翻转 https://www.nowcoder.com/ta/job-code-high 。实现归并排序。手写桶排序。[二叉树](https://www.nowcoder.com/jump/super-jump/word?word=二叉树)搜路径和

- reflow

- TCP连接 （拥塞控制、流量控制、三握手四挥手、网络请求的方法、状态码、然后给了很多网络请求的情景，让我说出返回的响应头—— 和udp区别

- 强缓存和协商缓存。整体缓存讲一下

- XSS和CSRF

- 输入框用防抖还是节流

- 轮播图组件

- 上传下载（大文件按需切片上传？断点续传和秒传？(hash值怎么取，md5怎么加密，大文件加密很慢怎么办？)  如何改写webuploader源码支持按需切片而不是平均切片？

- 拖曳（鼠标跟随和鼠标拖拽功能如何实现？两者原理的区别？

- 深拷贝（含包装对象、正则、 date）https://blog.csdn.net/liwusen/article/details/78759373 https://blog.csdn.net/RexingLeung/article/details/105171429 https://www.jianshu.com/p/ad3750e8db26

- weakMap

- 跨域方式，CORS策略，复杂请求和简单请求，什么情况发复杂请求？options请求的作用;**localstorage怎么跨域共享** ;**jsonp返回的文件格式是啥**

- 水平垂直居中的方式(5种)

- 浏览器的渲染原理(问的很细，问到绘制指令的顺序和浏览器的进程和线程是如何工作的，css的层叠性，还有绘制指令的具体顺序，浏览器进程线程之间的切换和通信等等)

- 动画 写一个不断旋转的三角形

- cookie的特性，关于安全方面的特性

- 实现一个每秒输出hello world的函数，要求第三次输出后停止，用闭包实现

- 手写ajax

- 浏览器中的js和nodejs有什么区别

- 浏览器的回收机制，新生代，老生代

- 正向代理与反向代理

- 手写中间件测试请求时间

- 对称加密与非对称加密

- http和https区别、http状态码、304 \**301和302深入的区别**

- async和await源码

- 迭代器和生成器

- es6继承

- 网络安全方面以及如何处理 （详细展开）

- img src为什么不能用空 应该用什么

- 懒加载优化

- loader、plugin的运行原理与作用

- url到页面加载的过程，每个阶段发生什么

- 实现jsonp

- 嵌套数组指定层次展开 flat扁平化

- 为什么浏览器的请求有两次，一次options，第二次才是真正请求？哪些场景用到

- 数组扁平化

- svg的取舍

- vue3.0 。 composition API

- css画圆

- 如何知道某个dom元素是否在当前可视窗口呢？

- scrollTop如何获取？

- 优化首屏渲染的方式有哪几种？

  1. Ssr的渲染原理，与csr的区别

- 柯里化

- transition和animation的区别

- 三个异步fetch请求，只要有一个请求变成resolve，那么就输出对应的result，并结束。如果请求过程中出现错误，则需要在最后输出错误信息

- 实现深搜索，例如对于这样一个数组city和指定的code，输出对应的name：

  - ```javascript
    作者：Rana1996
    链接：https://www.nowcoder.com/discuss/532072?type=post&order=time&pos=&page=1&channel=0&source_id=search_post
    来源：牛客网
    
     var city = [
         {
             code : 0,
             name: 'beijing',
         },
         {
             code : 211,
             name: 'jiangsu',
             children: [
                 {
                     code: 212,
                     name: 'nanjing'
                 }
             ]
         }
     ]
     
    function search(code) {
    // code
        return name
    } 
    ```

- **图片都放在哪里 访问太多怎么办 cdn**

- **substring和slice的区别**

- **多个请求 并行串行 max

- **求不大于n的指数**

- **写一个Modal组件**

- **给一个数组 输出最大的两个数**

- JS加载阻塞DOM渲染问题，怎么解决

- JS动态数组的实现

- src和href区别

- 打开一个网页的解析过程
  1）构建DOM树，即创建document对象，解析html元素和字符数据，添加element节点和text节点到document中。此时，document.readyState = 'loading'
  2）遇到link外部CSS，创建线程加载，并继续解析文档
  3）遇到script外部JS：
  a.未设置async、defer：浏览器加载JS，并堵塞，等待JS加载并执行完成，然后继续解析文档
  b.设置async：异步加载脚本，脚本加载完立即执行脚本
  c.设置defer：异步加载脚本，文档解析完成后执行脚本
  4）遇到img等，先解析DOM结构，然后异步加载src，并继续解析文档
  5）文档解析完成，此时document.readyState = 'interactive'
  6）设置有defer的JS脚本执行
  7）document对象触发DOMContentLoaded事件，标志着程序执行由同步脚本执行阶段转化为事件驱动阶段
  8）文档和所有资源加载完成，document.readyState = 'complete'，window触发onload事件
  9）此后，以异步响应方式处理用户输入、网络事件等

待加入：

https://www.nowcoder.com/discuss/510622?type=post&order=time&pos=&page=1&channel=0&source_id=search_post

面经搜索结果：https://www.nowcoder.com/search?query=%E5%AD%97%E8%8A%82%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F&type=post

# 面试经验

## 腾讯CDG一面

- 浏览器渲染过程(回流和重绘)
- 防抖节流
- 输入URL按回车发生了什么 (DNS\http(s)\浏览器渲染)

- 判断两对象的相等(含对象的数组去重)
- vue组件通信
- vue组件的data为什么是函数
- vue2.0和3.0区别
- js闭包



接下来该学习方针：

剑指offer、js相关题

《红宝书第四版》

《Web性能权威指南》

《深入浅出VUE.JS》

《你不知道的JavaScript》

《JavaScript忍者秘籍》

《网络是怎样连接的》

《图解HTTP》

《JavaScript设计模式》--没什么可说的

《设计模式之蝉》

《Webkit技术内幕》

## 字节一面

vue双向绑定原理

webpack怎么提升效率

https、cdn等网络部分

跨域，简单请求复杂请求

promise（await、async）

上传下载

文件拖曳

# 面试项目

[《js 实现网页全屏切换（平滑过渡），鼠标滚动切换》](https://blog.csdn.net/liona_koukou/article/details/52680409) [《用 ES6 写全屏滚动插件》](https://juejin.im/post/5aeef41cf265da0ba0630de0)

#### overflow:scroll 时不能平滑滚动的问题怎么处理？

```
以下代码可解决这种卡顿的问题：-webkit-overflow-scrolling:touch;是因为这行代码启用了硬件加速特性，所以滑动很流
畅。
```

拖拽

https://juejin.im/post/6844903746443411469

建议：工程方面、代码规范、

