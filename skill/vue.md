# base

## 数据传输

Data到模板(HTML元素内容)：{{data键}}

Data到指令(HTML元素属性)：v-指令名:指令属性="data键"

## 基础指令

- v-if	true则生成dom节点
- v-show    true则隐藏dom节点,但实际节点是生成的
- v-for="dog in dogs" 或者 v-for="(dog,key) in dogs"。 可循环得到数组或对象的，参数的顺序是（value，key）
- v-on:属性名="data键"。是**属性绑定**，可用**冒号**代替，如 :text="233"
- v-modal="data键"   只用于input元素,双向绑定input的value
- v-text   作为元素的text输出
- v-html  作为元素的子页面输出
- v-on  事件,DOM事件对象会作为第一个参数传入method。也可以用$event访问事件对象。 事件修饰符可以修改事件。@click.prevent阻止事件默认行为,@click.stop 避免在父级触发. @click.once 只触发第一次

## 响应式

Vue监控data对象的变化,并实时更新到DOM

响应式的实现:

1. 脏检查：新建一个原始副本，比较这两个。
2. Object.defineProperty()把所有属性都变成存储器属性，都用在setter中可以知道属性发生改变。然后执行更新dom

vue实例之外添加新属性：（**待研究**）

1. 在初始化中定义属性
2. Object.assign(target,source)合并到vue对象的数据属性

## Vue初始化

new Vue({})，Vue对象传递一个对象作为参数，它的属性有

### el

字符串，绑定的元素

### data

一个对象，Vue的属性列表

### methods

一个对象，包含各个函数，用逗号分隔。方法可以在js中使用，也可以在指令和插值中使用

### computed

一个对象，叫【计算属性】。和method写法相同但不接受参数。和methods的区别是：computed是属性调用，methods是函数调用（必须加双括号）；computed带有缓存功能。能读取上次访问的结果

缓存功能细节：只有data发生改变时，computed调用的结果才会重新求值。否则读取上次的结果。就像一个属性一样。

计算属性，可以设置set和get

<img src="C:\Users\morto\AppData\Roaming\Typora\typora-user-images\image-20200716143301277.png" alt="image-20200716143301277" style="zoom:67%;" />

### watchers

一个对象，叫【侦听器】，包含各个函数，用逗号分隔。函数名是属性名。该属性变化时执行。

**也可以用带setter的计算属性来侦听**

#### 获取旧值：使用函数名的参数

<img src="C:\Users\morto\AppData\Roaming\Typora\typora-user-images\image-20200716144330726.png" alt="image-20200716144330726" style="zoom:67%;" />

#### 深度监听，子对象变化时也能监听

<img src="C:\Users\morto\AppData\Roaming\Typora\typora-user-images\image-20200716144527080.png" alt="image-20200716144527080" style="zoom:67%;" />

### filters

一个对象，叫【过滤器】，属性全是方法。

使用过滤器：在插值中 {{ data键 | 过滤器名 }}，和指令中

接收参数：在定义时，第一个参数是value，第二个参数开始是调用时的第一个参数。

## 访问DOM元素

在元素的添加一个ref属性。

在js中使用this.$ref.value来访问.只能调用组件内部的元素

## 生命周期钩子

created,mounted,updated,destroyed 和四个before.

写在初始化参数对象中。

## 自定义指令

<img src="C:\Users\morto\AppData\Roaming\Typora\typora-user-images\image-20200716161216996.png" alt="image-20200716161216996" style="zoom:67%;" />

<img src="C:\Users\morto\AppData\Roaming\Typora\typora-user-images\image-20200716161230528.png" alt="image-20200716161230528" style="zoom:67%;" />

<img src="C:\Users\morto\AppData\Roaming\Typora\typora-user-images\image-20200716161415845.png" alt="image-20200716161415845" style="zoom:67%;" />

# 组件

### 局部组件

const 组件名={template:""}

然后再Vue初始化中包含 components:{组件名们}

### 全局组件

Vue.component("组件名",{组件定义}}

可以在任何地方使用,不用再vue配置对象使用它

### 组件定义(数据\方法\计算属性)

数据是一个函数(防止组件之间数据复用）

```javascript
data(){
    return{
        key:value……
    }
}
```



	### 传递数据

#### props

props属性，是一个数组，或一个对象

`props:["one","two"]`

传值时指定类型

`props:{price:Number,unit:[Number, String, Price]}`

更多选项,例如是否必须(如果必须的prop没有值,会抛出警告),设置默认值

`props:{price:{type:Number,required:true,default:0}`

指定验证函数,返回true时传值才可用

`props:{ price { required:true,validater(value){return value>=0 } } }`

是通过HTML属性来传入组件的。

props获取的值，可以当做data来使用，例如计算属性或者方法中

#### 大小写

HTML中的aaa-bbb的属性名（kebab形式），在props中用camel形式可识别转换，aaaBbb

#### 子组件数据更新到父级

待看

### slot插槽将内容text传递给组件

普通插槽，具名插槽，作用域插槽

### 自定义事件