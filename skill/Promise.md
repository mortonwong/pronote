> 参考资料：https://javascript.ruanyifeng.com/advanced/promise.html

## 异步的理解
异步是多线程实现的一种目的

将耗时任务放入一个新线程去执行，这就是异步任务，而其他任务继续同步执行
## 异步任务种类
- setTimeOut(func,time[,args...])，第一个参数是回调函数
- Image对象的图片加载，自带onload和onerror回调函数
- AJAX
    - 生成一个实例，xhr = new XMLHttpRequest()
    - open()方法配置基本信息 xhr.open(method,url,async)
    - onload()方法接收回调函数。参数是e，this.status、this.responseText都可用
    - onerror()方法接收回调函数。参数e是错误信息。
    - send()方法执行请求
## 实现
### 细节：
- Promise在执行构造函数（new 的时候）的时候就开始执行异步任务（实际是放入异步队列）
- Promise状态有pending、rejected、fulfilled
- Promise的参数是一个函数（异步任务的外函数，我称之为**包装函数**），这个函数的参数是两个函数（resolve、reject）
- then()是Promise实例的方法，参数是两个回调函数（resolve和reject对应的回调函数）。then直接执行函数
    - **回调函数如果有返回值，返回值需是包装函数，这个包装函数也将执行，并且可再次用then接收**
    - 函数接收的参数由上一层**包装函数**传递
### 练习1：3秒后，状态从pendding到fulfilled
```js
let p = new Promise((resolve,reject)=>{
    setTimeout(resolve,3000,"already past 3s")
})  

p.then(console.log)
```
这样不能体现Promise的封装性，应该是**一个异步任务就是一个Promise对象**，所以应该这样写
```js
function timeout(){
    return new Promise((resolve,reject)=>{
        setTimeout(resolve,3000,"already past 3s")
    })
}
timeout().then((msg)=>{console.log(msg)})
```
### 练习2：实现一个图片异步加载
背景：图片加载是一个耗时过程，写成异步就不会影响其他非耗时任务加载
```js
function imgLoad(path){
    return new Promise((resolve,reject)=>{
        let img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = path
    })
}
```
### 练习3：实现一个Promise封装GET请求
```js
function ajax(msg,url){
    return new Promise((resolve,reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open("GET",url + '/?msg=' + msg,true)
        xhr.onload = function(e){
            if(this.status === 200){ //状态码类型是Number
                resolve(JSON.parse(this.responseText))
            }
        }
        xhr.onerror = function(e){
            reject(e)
        }
    })
}
ajax("获取用户信息","www.to8to.com").then(console.log,console.error)
```
### 练习4：实现一个Promise封装POST请求
### 练习5：实现一个Promise封装AJAX加载图片