# 内置对象的方法和属性

## Number

### 实例方法

valueOf()  , toLocaleString()  , toString() 

toFixed() 

toExponential()

toPrecision()

### 内置方法和属性

Number.isInteger()

Number.isSafeInteger()

Number.MAX_SAFE_INTEGER

 Number.MIN_SAFE_INTEGER

### 全局方法(属于global对象,但跟数字相关)

isNaN()

Number() 

parseInt() 

parseFloat() 

## String

### 实例属性

length

### 实例方法

valueOf()  , toLcaleString()  ,  toString() 

charAt()

编码相关:

​	charCodeAt()

​	fromCharCode() 

​	等等

concat()

slice() 、 substr() 、substring()

indexOf() 和 lastIndexOf() 

startsWith() 、 endsWith() 和 includes() 

trim() 、trimeLeft() 和 trimRight()

repeat()

padStart() 和 padEnd() 

toLowerCase() 、 toLocaleLowerCase() 、 toUpperCase() 和 toLocaleUpperCase()

模式匹配相关方法

localeCompare() 

### 全局方法(属于global对象)

String()

## Array

生成新数组

Array.prototype.slice(start,end) : 返回一个新数组

Array.prototype.concat([可选的数组or元素列表]) ：返回一个新数组

改变原数组

Array.prototype.splice(index,howmany[,item[,item2]]) 改变原始数组

Array.prototype.reverse()

Array.prototype.sort(compare(value1,value2))   value1和value2的顺序，交换返回1，不交换返回-1，相等返回0 

数组查找

Array.prototype.indexOf(searchvalue,fromIndex) 返回index,没有则返回-1

# DOM

## document

是window对象的属性，HTMLDocument的实例，HTMLDocument继承Document，实现Node接口， 表示根节点

Document.prototype.documentElement 指向html元素 **script必须出现在<html>之后才可以指向**

HTMLDocument.prototype.body 指向body元素

HTMLDocument.prototype.head指向head元素

### 反映文档信息

HTMLDocument.prototype.title 可以修改和读取文档的标题

HTMLDocument.prototype.URL 完整的URL，地址栏里的内容

HTMLDocument.prototype.domain 域名。可以修改这个属性，但是有限制

HTMLDocument.prototype.referrer 上一个页面的URL

document.characterSet = "UTF-8" 页面使用的字符集默认是UTF-16

#### 实现页面和frame的通信

在frame的页面设置document.domain 为页面一样，即可进行同源通信，互相访问js对象

### 定位元素

Document.prototype.getElementById(id) 只返回第一个id结果

Document.prototype.getElementByTagName(name) 在HTML文档中，返回一个HTMLCollection对象

Document.prototype.getElementByName(name)  返回一个HTMLCollection对象，查找name属性

Document.prototype.getElementByClassName(name)

### 创建节点

document.creatElement(tagName)

document.creatTextNode(text)

### HTMLCollection

和NodeList基本相同，方法一样，额外方法：

HTMLCollection.prototype.namedItem(name) 获得name属性为name的元素

HTMLCollection["name"] 是上个方法的简化版

而HTMLCollection[数字] 会返回索引对应的元素 

### 文档是否加载完成

document.readyState 属性有两个可能的值：

 loading，表示文档正在加载；

 complete，表示文档加载完成。

## Node

所有节点都继承Node类型

### 反映节点信息

- Node.prototype.nodeType 节点类型，1为元素，3为文本节点

- Node.prototype.nodeName 元素的话为元素名

- Node.prototype.nodeValue 元素的话默认为null

### 返回子节点

- Node.prototype.childNodes 返回子节点NodeList类型
- Node.prototype.firstChild
- Node.prototype.lastChild
- Node.prototyoe.hasChildNodes() 有子节点返回true，比length方便
- Node.prototype.children 返回element子节点

### 查找是否含节点

- Node.prototype.contain() 查询是否含节点
- Node.prototype.compareDocumentPosition()

第二种，使用位掩码的方式，可以得出目标节点与节点的多种dom关系

### 返回父节点、兄弟节点

- Node.prototype.parentNode 返回
- Node.prototype.previousSibling 上一个兄弟节点
- Node.prototype.nextSibling 下一个兄弟节点

### 操作子节点（添加，插入，替换，移除）

- Node.prototype.appendChild(Node) 在childNodes的末尾添加一个节点。**添加一个已存在DOM中的节点，意味着移动**
- Node.prototyoe,insertBefore(newNode,fromNode) 在childNodes的参照节点前插入一个节点，如果第二个参数是null，效果与appendChild一样
- Node.prototype.replaceChild(newNode,fromNode) 在childNodes的参照节点上替换 **虽然被替换的节点从技术上说仍然被同一个文档所拥有，但文档中已经没有它的位置。**
- Node.prototype.removeChild(fromNode) 返回被移除的节点  **通过`removeChild()`被移除的节点从技术上说仍然被同一个文档所拥有，但文档中已经没有它的位置。**

### 其它方法（克隆\规范化文本节点）

- Node.prototype.cloneNode() 会返回与调用它的节点一模一样的节点。在传入`true`参数时，会进行深复制，即复制节点及其整个子DOM树。如果传入`false`，则只会复制调用该方法的节点。
- Node.prototype.normalize() 检测这个节点的所有后代，从中搜索上述两种情形。如果发现空文本节点，则将其删除；如果两个同胞节点是相邻的，则将其合并为一个文本节点。

### NodeList

由Node.prototype.childNodes或者getElementsByClassName等返回

**NodeList，NamedNodeMap、HTMLCollection 是实时更新的集合**

- NodeList.prototype.item(index) 返回列表中的项目

- NodeList.prototype.length 返回长度

- myNodeList[index]  返回列表中的项目

## Element

HTMLElement继承Element，不同的标签有各种类型继承HTMLElement

Element.prototype.tagName 大写标签名

### 元素可直接访问和修改属性

- HTMLElement.prototype.id

- HTMLElement.prototype.title

- HTMLElement.prototype.className

返回的东西与getAttribute不一样，比如style和事件属性

设置自定义属性时，对象.属性 的设置，无法用getAttribute返回，不是元素的属性



### 操作多个class的属性

用元素的classList属性

 add(*value*)，向类名列表中添加指定的字符串值 value。如果这个值已经存在，则什么也不做。

 contains(*value*)，返回布尔值，表示给定的 value 是否存在。

 remove(*value*)，从类名列表中删除指定的字符串值 value。 

 toggle(*value*)，如果类名列表中已经存在指定的 value，则删除；如果不存在，则添加。

### 其它操作属性的方法

- HTMLElement.prototype.getAttribute("name")
- HTMLElement.prototype.setAttribute("name"，“value”) 
- HTMLElement.prototype.removeAttribute("name") 

不常用的方法：

![image-20200930014834694](C:\Users\morto\AppData\Roaming\Typora\typora-user-images\image-20200930014834694.png)

## Text

nodeType 为3，nodeValue为文本值

appendData(*text*)，向节点末尾添加文本 *text*； 

 deleteData(*offset, count*)，从位置 *offset* 开始删除 *count* 个字符；

 insertData(*offset, text*)，在位置 *offset* 插入 *text*； 

 replaceData(*offset, count, text*)，用 *text* 替换从位置 *offset* 到 *offset* *+* *count* 的

文本；

 splitText(*offset*)，在位置 *offset* 将当前文本节点拆分为两个文本节点；

 substringData(*offset, count*)，提取从位置 *offset* 到 *offset* *+* *count* 的文本。

除了这些方法，还可以通过 length 属性获取文本节点中包含的字符数量。这个值等于 nodeValue. 

length 和 data.length。

## DocumentFragment

文档片段，把多个节点合并，用来批量合并进行dom操作，减少消耗

document.createDocumentFragment()

## 动态脚本、动态样式的实现

### 动态脚本 - 外部文件

```javascript
1.创建script节点
2.添加src属性
3.append这个节点到body or head
```

### 动态脚本 - js代码

```javascript
1.创建script节点
2.src.text 添加脚本内容
3.append这个节点到body or head
```

### 动态样式 - 外部文件

```javascript
let link = document.createElement("link"); 
link.rel = "stylesheet"; 
link.type = "text/css"; 
link.href = "styles.css"; 
let head = document.getElementsByTagName("head")[0]; 
head.appendChild(link);
```

### 动态样式 - css代码

```javascript
1.创建style节点
2.src.cssText 添加脚本内容
3.append这个节点到head
```

## Selectors API

document(Element).querySelector("cssSelector")

document(Element).querySelectorAll("cssSelector") 返回NodeList的快照

document(Element).matche("cssSelector")

## 元素遍历

 childElementCount，返回子元素数量（不包含文本节点和注释）；

 firstElementChild，指向第一个 Element 类型的子元素（Element 版 firstChild）；

 lastElementChild，指向最后一个 Element 类型的子元素（Element 版 lastChild）；

 previousElementSibling ，指向前一个 Element 类型的同胞元素（ Element 版

previousSibling）；

 nextElementSibling，指向后一个 Element 类型的同胞元素（Element 版 nextSibling）。

## 焦点管理

Element.focus() 使元素获得焦点

document.getActiveElement  获得页面当前的焦点。默认值在页面加载完后是document.body

## 自定义数据属性

```html
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```

设置 data-属性名 自定义属性后，用Element.dataset 来访问、修改

## 插入标记

- innerHTML 如果不包含html标签，相对于innerText

- outerHTML 返回元素本身以及后代元素的HTML字符串，可重写

- **insertAdjacentHTML()**与 **insertAdjacentText()**  。

  第一个参数必须是下列值中的一个：

   "beforebegin"，插入当前元素前面，作为前一个同胞节点；

   "afterbegin"，插入当前元素内部，作为新的子节点或放在第一个子节点前面；

   "beforeend"，插入当前元素内部，作为新的子节点或放在最后一个子节点后面；

   "afterend"，插入当前元素后面，作为下一个同胞节点。

  第二个参数会作为 HTML 字符串解析

- innerText 拼接所有文本节点并返回（深度优先），**后代元素**的文本节点也会返回。用写入时，会改变dom树，删去所有元素

- outerText 读取时，和innerText返回一样的内容。写入时，会替换整个元素

### 内存问题

- 事件和元素的一些属性，不会因为innerHTML被删除，会留在内存中。所以应该手动删除这些依赖

- 限制使用innerHTML的次数，减少更新DOM的次数

## scrollIntoView

- alignToTop 是一个布尔值。

 true：窗口滚动后元素的顶部与视口顶部对齐。

 false：窗口滚动后元素的底部与视口底部对齐。

- scrollIntoViewOptions 是一个选项对象。

behavior：定义过渡动画，可取的值为"smooth"和"auto"，默认为"auto"。 

 block：定义垂直方向的对齐，可取的值为"start"、"center"、"end"和"nearest"，默

认为 "start"。 

 inline：定义水平方向的对齐，可取的值为"start"、"center"、"end"和"nearest"，默

认为 "nearest"。 

- 不传参数等同于 alignToTop 为 true。

# DOM2和DOM3

## style

### 样式修改

element.style.backgroundColor = "red"

### 样式的属性

cssText，包含 style 属性中的 CSS 代码。

 length，应用给元素的 CSS 属性数量。

 parentRule，表示 CSS 信息的 CSSRule 对象（下一节会讨论 CSSRule 类型）

 getPropertyCSSValue(*propertyName*)，返回包含 CSS 属性 *propertyName* 值的 CSSValue

对象（已废弃）。

 getPropertyPriority(*propertyName*)，如果 CSS 属性 *propertyName* 使用了!important

则返回"important"，否则返回空字符串。

 getPropertyValue(*propertyName*)，返回属性 *propertyName* 的字符串值。

 item(*index*)，返回索引为 *index* 的 CSS 属性名。

 removeProperty(*propertyName*)，从样式中删除 CSS 属性 *propertyName*。 

 setProperty(*propertyName, value, priority*)，设置 CSS 属性 *propertyName* 的值为*value*，*priority* 是"important"或空字符串。

# 事件

## 事件流

![image-20201002020442614](C:\Users\morto\AppData\Roaming\Typora\typora-user-images\image-20201002020442614.png)

## 事件处理程序

- html事件处理程序： 在html元素标签上指定事件属性 例如onclick

- dom0事件处理程序：在js中给元素的事件属性赋值一个函数

- dom2事件处理程序：element.addEventListener 和 element.removeEventListener

  参数：

  1. 事件名
  2. 函数
  3. 是否在捕获阶段调用，否则在冒泡；（把事件处理程序注册到捕获阶段通常用于在事件到达其指定目标之前拦截事件。如果不需要拦截，则不要使用事件捕获）

  removeEventListener 只能删除同样参数的addEventListener的事件处理程序，所以匿名函数的无法删除

## 事件对象

![image-20201002022318121](C:\Users\morto\AppData\Roaming\Typora\typora-user-images\image-20201002022318121.png)

- this 对象始终等于 currentTarget 的值。target是实际发生事件的目标

- preventDefault()方法用于阻止特定事件的默认动作

- stopPropagation()方法用于立即阻止事件流在 DOM 结构中传播，取消后续的事件捕获或冒泡。

- eventPhase 属性可用于确定事件流当前所处的阶段。如果事件处理程序在捕获阶段被调用，则

  eventPhase 等于 1；如果事件处理程序在目标上被调用，则 eventPhase 等于 2；如果事件处理程序

  在冒泡阶段被调用，则 eventPhase 等于 3

## 事件类型

- 用户界面事件 load、unload、select、resize、scroll

- 焦点事件 focus（不冒泡）、blur（不冒泡）focusin、focusout

- 鼠标和滚轮事件：click、dblclick、mousedown、mouseenter、mouseleave、mousemove、mouseout、mouseover、mouseup（释放按键）

  客户端坐标 clientX，clientY （浏览器）

  页面坐标 pageX，pageY

  屏幕坐标 screenX，screenY

- 键盘输入事件 keydown、keypress、keyup、textInput（可检测拖放等）

- HTML5事件 DOMcontentLoaded事件（比load快） hashchange

## 内存与性能（事件委托，删除事件程序）

### 事件委托

事件委托利用事件冒泡，可以只使用一个事件处理程序来管理一种类型的事件。

### 删除事件处理程序（手动）

导致的原因：1.删除dom树并不会垃圾回收事件处理程序 （innerHTML、removeChild等）.2.浏览器每次加载和卸载页面（比如通过前进、后退或刷新），内存中残留对象的数量都会增加，这是因为事件处理程序不会被回收。

方法：

`btn.onclick = null; //删除事件处理程序`

对于第二种，在onunload事件中执行

## 模拟事件

- 创建事件document.createEvent() ，接收一个参数如下：

  "UIEvents"（DOM3 中是"UIEvent"）：通用用户界面事件（鼠标事件和键盘事件都继承自这

  个事件）。

   "MouseEvents"（DOM3 中是"MouseEvent"）：通用鼠标事件。

   "HTMLEvents"（DOM3 中没有）：通用 HTML 事件（HTML 事件已经分散到了其他事件大类中）。

  "CustomEvent"，自定义事件，有initCustomEvent方法

- 初始化事件

  ```javascript
  let event = document.createEvent("MouseEvents"); 
  
  // 初始化 event 对象
  
  event.initMouseEvent("click", true, true, document.defaultView, 
  
   0, 0, 0, 0, 0, false, false, false, false, 0, null);  
  ```

- 触发事件

  `btn.dispatchEvent(event);

# 客户端存储

## Cookie

https://juejin.im/post/6844903841909964813

# 正则表达式

#### 修饰符

g 全文搜索

m多行搜索

i忽略大小写

#### 类

[^0-5]

#### 边界匹配符

^

$

\b	单词边界

\B	非单词边界

#### 预定义类

\d

\D

.

\s

\S

\w (数字字母和下划线)

\W

#### 量词

？最多出现一次

+（出现一次或多次）

*（任意次）

{n} （n次）

{n，m} （范围次，m可不写）

