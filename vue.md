## 小问题汇总

### Vue.use()

```jsx
import Loading from './components/loading/index'
```

先引入

后use

```javascript
Vue.use(Loading)
```

引入的其实是一个js文件，而不是一个vue组件

这个js文件export一个对象，这个对象中有install方法。

use后会调用这个install方法，并传入一个Vue对象

↓index.js

```jsx
// 引入组件
import LoadingComponent from './loading.vue'
// 定义 Loading 对象
const Loading={
    // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
    install:function(Vue){
        Vue.component('Loading',LoadingComponent)
    }
}
// 导出
export default Loading
```

use后，组件可以在vue项目全局使用，而仅仅是import的组件，只能在局部使用

## 知识汇总

- Vue.config.productionTip = false; 隐藏vue生产信息
- Vue.prototype.$message = Message; 意味着全局注册组件，以后用this.message 就可以使用
- @/model/webData  路径,@意味着src路径,也可以自己配置
- mixins是混入的意思,引入后的内容与父组件合并

