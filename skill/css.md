#### 资料

[Web前端基础知识整理-CSS篇](https://segmentfault.com/a/1190000014833437?utm_source=sf-related)

面试题：
 https://segmentfault.com/a/1190000013325778
 flex：
 https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html
 BFC：
 http://47.98.159.95/my_blog/css/008.html
 校招总结：
 https://github.com/CavsZhouyou/Front-End-Interview-Notebook/blob/master/Css/Css.md

#### CSS 选择符有哪些？

#### 伪类与伪元素的区别

伪类一般匹配的是元素的一些特殊**状态**，如hover、link等，而伪元素一般匹配的特殊的位置，比如after、before等。

#### CSS 中哪些属性可以继承？

文本类、字体类、表格布局类、元素可见性等

#### CSS 优先级算法如何计算？

1. 先看是否有权重 ！important
2. 计算四个等级的相加（0,0,0,0）
   1. 标签内选择器
   2. id选择器
   3. css、属性、伪类选择器
   4. 元素、伪元素选择器
3. 从左到右比较

#### 关于伪类 LVHA 的解释?

a标签有四种状态：链接访问前、链接访问后、鼠标滑过、激活（点击），分别对应四种伪类:link、:visited、:hover、:active；

要注意覆盖的问题，只应用最后一个读取到的css伪类

```
（1）当鼠标滑过a链接时，满足:link和:hover两种状态，要改变a标签的颜色，就必须将:hover伪类在:link伪
类后面声明；
（2）当鼠标点击激活a链接时，同时满足:link、:hover、:active三种状态，要显示a标签激活时的样式（:active），
必须将:active声明放到:link和:hover之后。因此得出LVHA这个顺序。
```

#### 解释margin：auto

设置了auto的地方，将分配到父级容器的**剩余空间** ，即用父级容器宽度（or高度） - 子容器宽度（or高度）后剩余的空间，来分配给margin的取值。所以 0 auto，是上下margin为0，左右平摊剩余空间。所以居中了。还可用在**右对齐**

#### 解释absolute的left和top等

相对于“封口线”的左边距、上边距。 同时设置margin：auto时。auto分配的是left等剩下的部分

默认值：如果不指定，则left和top与原文档流的位置一致，但是不占位

```
absolute定位的元素，是相对于它的第一个position值不为static的祖先元素的padding box来进行定位的
```

#### Flex布局

https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html

http://www.ruanyifeng.com/blog/2015/07/flex-examples.html

指定：

```css
.box{
  display: -webkit-flex; /* Safari */
  display: flex;
}

/*行内元素也可以使用 Flex 布局。*/
.box{
  display: inline-flex;
}
```

设为 Flex 布局以后，子元素的`float`、`clear`和`vertical-align`属性将失效。

容器属性：

- flex-direction
- flex-wrap
- flex-flow
- justify-content（项目在主轴上的对齐方式）：flex-start | flex-end | center | space-between | space-around;
- align-items （定义项目在交叉轴上如何对齐）：flex-start | flex-end | center | baseline | stretch;
- align-content（定义了多根轴线的对齐方式）：align-content: flex-start | flex-end | center | space-between | space-around | stretch;

项目属性：

- `order` 定义项目的排列顺序。数值越小，排列越靠前，默认为0
- `flex-grow` 定义项目的放大比例，默认为`0`
- `flex-shrink` 定义了项目的缩小比例
- `flex-basis` 在分配多余空间之前，项目占据的主轴空间，默认auto
- `flex` 是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写
- `align-self  ` 可覆盖`align-items`属性

#### 如何居中 div？

几种方法：2种水平，三种垂直

##### 设置div

给宽度和margin：0 auto

##### 设置父容器

text-align：center

##### 设置绝对定位的div

- margin：auto，left和right、top、bottom为0

- left：50%和top：50%，使左上角到中心。再用margin负值使内容到中心
- left：50%和top：50%，使左上角到中心。再用translate使内容到中心

##### Flex布局（考虑兼容性）

```css
.container {
  display: flex;
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
}
```

##### vertical-align:middle

vertical-align:middle是基线对齐。一个容器中可能有多个基线。所以要使容器只有一条基线

```css
.container::after {
  content: '';
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
```

然后再在父容器设置text-align，在项目设置inline-block和vertical-align

##### 项目高度宽度不确定时，用哪种方法

Flex和vertical两种

#### 用纯 CSS 创建一个三角形的原理是什么？

```
 #demo {
  width: 0;
  height: 0;
  border-width: 20px;
  border-style: solid;
  border-color: transparent transparent red transparent;
}
```

<img src="C:\Users\morto\AppData\Roaming\Typora\typora-user-images\image-20201004012941769.png" alt="image-20201004012941769" style="zoom:50%;float:left" />

边框其实是红色的部分，是等腰梯形的。当宽度和高度都是0时，每个边框都是三角形

#### 一个满屏品字布局如何设计?

```
简单的方式：
	上面的div宽100%，
	下面的两个div分别宽50%，
	然后用float或者inline使其不换行即可
```

#### CSS 多列等高如何实现？

```
（1）利用padding-bottom|margin-bottom正负值相抵，不会影响页面布局的特点。设置父容器设置超出隐藏（overflow:
hidden），这样父容器的高度就还是它里面的列没有设定padding-bottom时的高度，当它里面的任一列高度增加了，则
父容器的高度被撑到里面最高那列的高度，其他比这列矮的列会用它们的padding-bottom补偿这部分高度差。

（2）利用table-cell所有单元格高度都相等的特性，来实现多列等高。

（3）利用flex布局中项目align-items属性默认为stretch，如果项目未设置高度或设为auto，将占满整个容器的高度
的特性，来实现多列等高。
```

负margin技术原理与运用https://juejin.im/post/6847902222106230797

margin-bottom为负值的时候不会位移,而是会减少自身供**css读取的高度**.

padding区域也有背景颜色

#### li 与 li 之间有看不见的空白间隔是什么原因引起的？有什么解决办法？

```
浏览器会把inline元素间的空白字符（空格、换行、Tab等）渲染成一个空格。而为了美观。我们通常是一个<li>放在一行，
这导致<li>换行后产生换行字符，它变成一个空格，占用了一个字符的宽度。

解决办法：

（1）为<li>设置float:left。不足：有些容器是不能设置浮动，如左右切换的焦点图等。

（2）将所有<li>写在同一行。不足：代码不美观。

（3）将<ul>内的字符尺寸直接设为0，即font-size:0。不足：<ul>中的其他字符尺寸也被设为0，需要额外重新设定其他
字符尺寸，且在Safari浏览器依然会出现空白间隔。

（4）消除<ul>的字符间隔letter-spacing:-8px，不足：这也设置了<li>内的字符间隔，因此需要将<li>内的字符
间隔设为默认letter-spacing:normal。
```

#### 为什么要初始化 CSS 样式？

```
-因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。

-当然，初始化样式会对SEO有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。

最简单的初始化方法：*{padding:0;margin:0;}（强烈不建议）

淘宝的样式初始化代码：
body,h1,h2,h3,h4,h5,h6,hr,p,blockquote,dl,dt,dd,ul,ol,li,pre,form,fieldset,legend
,button,input,textarea,th,td{margin:0;padding:0;}
body,button,input,select,textarea{font:12px/1.5tahoma,arial,\5b8b\4f53;}
h1,h2,h3,h4,h5,h6{font-size:100%;}
address,cite,dfn,em,var{font-style:normal;}
code,kbd,pre,samp{font-family:couriernew,courier,monospace;}
small{font-size:12px;}
ul,ol{list-style:none;}
a{text-decoration:none;}
a:hover{text-decoration:underline;}
sup{vertical-align:text-top;}
sub{vertical-align:text-bottom;}
legend{color:#000;}
fieldset,img{border:0;}
button,input,select,textarea{font-size:100%;}
table{border-collapse:collapse;border-spacing:0;}
```

#### BFC的触发条件、规则、应用场景

http://47.98.159.95/my_blog/css/008.html

触发条件：

```
（1）根元素或包含根元素的元素
（2）浮动元素float＝left|right或inherit（≠none）
（3）绝对定位元素position＝absolute或fixed
（4）display＝inline-block|flex|inline-flex|table-cell或table-caption
（5）overflow＝hidden|auto或scroll(≠visible)
```

规则：1.bfc内重叠，bfc之间不重叠 2.和浮动不重叠 3.内部不影响外部 4.浮动元素参与计算bfc高度

应用场景：

1. 清除浮动，例如子元素是浮动，父级不是bfc，会发生重叠。此时把父级设为bfc解决

2. 外边距重叠。设置多个bfc就不会重叠

3. #### 什么是包含块，对于包含块的理解?

   ```
   包含块（containing block）就是元素用来计算和定位的一个框。
   
   （1）根元素（很多场景下可以看成是<html>）被称为“初始包含块”，其尺寸等同于浏览器可视窗口的大小。
   
   （2）对于其他元素，如果该元素的position是relative或者static，则“包含块”由其最近的块容器祖先盒的content box
   边界形成。
   
   （3）如果元素position:fixed，则“包含块”是“初始包含块”。
   
   （4）如果元素position:absolute，则“包含块”由最近的position不为static的祖先元素建立，具体方式如下：
   
   如果该祖先元素是纯inline元素，则规则略复杂：
   •假设给内联元素的前后各生成一个宽度为0的内联盒子（inline box），则这两个内联盒子的padding box外面的包
   围盒就是内联元素的“包含块”；
   •如果该内联元素被跨行分割了，那么“包含块”是未定义的，也就是CSS2.1规范并没有明确定义，浏览器自行发挥
   否则，“包含块”由该祖先的padding box边界形成。
   
   如果没有符合条件的祖先元素，则“包含块”是“初始包含块”。
   ```

#### CSS 里的 visibility 属性有个 collapse 属性值是干嘛用的？在不同浏览器下以后什么区别

```
（1）对于一般的元素，它的表现跟visibility：hidden;是一样的。元素是不可见的，但此时仍占用页面空间。

（2）但例外的是，如果这个元素是table相关的元素，例如table行，table group，table列，table column group，它的
表现却跟display:none一样，也就是说，它们占用的空间也会释放。

在不同浏览器下的区别：

在谷歌浏览器里，使用collapse值和使用hidden值没有什么区别。

在火狐浏览器、Opera和IE11里，使用collapse值的效果就如它的字面意思：table的行会消失，它的下面一行会补充它的位
置。
```

#### width:auto 和 width:100%的区别

```
一般而言

width:100%会使元素box的宽度等于父元素的content box的宽度。

width:auto会使元素填充整个父元素，margin、border、padding、content区域会自动分配水平空间。
```

#### 简单介绍使用图片 base64 编码的优点和缺点。

https://www.cnblogs.com/coco1s/p/4375774.html

优点：

1. 无额外请求
2. 没有跨域问题

缺点：

1. 大图片体积大
2. css文件体积增大，导致CRP阻塞。导致用户长时间看空白屏幕。HTML和CSS会阻塞渲染，而图片不会
3. 大大增加CSSOM生成时间增加。**CSSOM 阻止任何东西渲染**
4. 无法缓存

#### 'display'、'position'和'float'的相互关系？

```
（1）首先我们判断display属性是否为none，如果为none，则position和float属性的值不影响元素最后的表现。

（2）然后判断position的值是否为absolute或者fixed，如果是，则float属性失效，并且display的值应该被
设置为table或者block，具体转换需要看初始转换值。

（3）如果position的值不为absolute或者fixed，则判断float属性的值是否为none，如果不是，则display
的值则按上面的规则转换。注意，如果position的值为relative并且float属性的值存在，则relative相对
于浮动后的最终位置定位。

（4）如果float的值为none，则判断元素是否为根元素，如果是根元素则display属性按照上面的规则转换，如果不是，
则保持指定的display属性值不变。

总的来说，可以把它看作是一个类似优先级的机制，"position:absolute"和"position:fixed"优先级最高，有它存在
的时候，浮动不起作用，'display'的值也需要调整；其次，元素的'float'特性的值不是"none"的时候或者它是根元素
的时候，调整'display'的值；最后，非根元素，并且非浮动元素，并且非绝对定位的元素，'display'特性值同设置值。
```

#### margin 哪些情况会重叠，怎么解决

```
margin重叠指的是在垂直方向上，两个相邻元素的margin发生重叠的情况。

一般来说可以分为四种情形：

第一种是相邻兄弟元素的marin-bottom和margin-top的值发生重叠。这种情况下我们可以通过设置其中一个元素为BFC
来解决。

第二种是父元素的margin-top和子元素的margin-top发生重叠。它们发生重叠是因为它们是相邻的，所以我们可以通过这
一点来解决这个问题。我们可以为父元素设置border-top、padding-top值来分隔它们，当然我们也可以将父元素设置为BFC
来解决。

第三种是高度为auto的父元素的margin-bottom和子元素的margin-bottom发生重叠。它们发生重叠一个是因为它们相
邻，一个是因为父元素的高度不固定。因此我们可以为父元素设置border-bottom、padding-bottom来分隔它们，也可以为
父元素设置一个高度，max-height和min-height也能解决这个问题。当然将父元素设置为BFC是最简单的方法。

第四种情况，是没有内容的元素，自身的margin-top和margin-bottom发生的重叠。我们可以通过为其设置border、pa
dding或者高度来解决这个问题。
```

#### IFC 是什么？

```
IFC指的是行级格式化上下文，它有这样的一些布局规则：

（1）行级上下文内部的盒子会在水平方向，一个接一个地放置。
（2）当一行不够的时候会自动切换到下一行。
（3）行级上下文的高度由内部最高的内联盒子的高度决定。
```

#### 清除浮动的方式

```
（1）使用clear属性清除浮动。
如果是父子清除，用伪元素after来设置clear

（2）使用BFC块级格式化上下文来清除浮动。
```

#### SASS有哪些用处

1. 嵌套
2. 父选择器&
3. 属性嵌套
4. SassScript

https://www.sass.hk/docs/

#### 提高css性能、优化的方法

加载过程：

1. css压缩
2. 减少@import，多用link（link是和页面一起加载的）

选择器过程：

1. 不用通配符，少用属性选择器
2. 少用后代选择器
3. 多用class，少用标签
4. 多用继承

渲染过程：

1. 浮动和定位是高性能属性
2. 减少重排和重绘

#### 浏览器是怎样解析 CSS 选择器的？

```
样式系统从关键选择器开始匹配，然后左移查找规则选择器的祖先元素。只要选择器的子树一直在工作，样式系统就会持续左移，直
到和规则匹配，或者是因为不匹配而放弃该规则。

试想一下，如果采用从左至右的方式读取CSS规则，那么大多数规则读到最后（最右）才会发现是不匹配的，这样做会费时耗能，
最后有很多都是无用的；而如果采取从右向左的方式，那么只要发现最右边选择器不匹配，就可以直接舍弃了，避免了许多无效匹配。
```

#### 在网页中应该使用奇数还是偶数的字体？为什么呢？

```
（1）偶数字号相对更容易和web设计的其他部分构成比例关系。比如：当我用了14px的正文字号，我可能会在一些地方用14
×0.5=7px的margin，在另一些地方用14×1.5=21px的标题字号。
（2）浏览器缘故，低版本的浏览器ie6会把奇数字体强制转化为偶数，即13px渲染为14px。
（3）系统差别，早期的Windows里，中易宋体点阵只有12和14、15、16px，唯独缺少13px。
```

#### 简单说一下 css3 的 all 属性。

```
all属性实际上是所有CSS属性的缩写，表示，所有的CSS属性都怎样怎样，但是，不包括unicode-bidi和direction
这两个CSS属性。支持三个CSS通用属性值，initial,inherit,unset。

initial是初始值的意思，也就是该元素元素都除了unicode-bidi和direction以外的CSS属性都使用属性的默认初始
值。

inherit是继承的意思，也就是该元素除了unicode-bidi和direction以外的CSS属性都继承父元素的属性值。

unset是取消设置的意思，也就是当前元素浏览器或用户设置的CSS忽略，然后如果是具有继承特性的CSS，如color，则
使用继承值；如果是没有继承特性的CSS属性，如background-color，则使用初始值。
```

#### 元素竖向的百分比设定是相对于容器的高度吗？

```
如果是height的话，是相对于包含块的高度。

如果是padding或者margin竖直方向的属性则是相对于包含块的宽度。
```

#### 全屏滚动的原理是什么？用到了 CSS 的哪些属性？（待深入实践）

```
原理：有点类似于轮播，整体的元素一直排列下去，假设有5个需要展示的全屏页面，那么高度是500%，只是展示100%，容器及容
器内的页面取当前可视区高度，同时容器的父级元素overflow属性值设为hidden，通过更改容器可视区的位置来实现全
屏滚动效果。主要是响应鼠标事件，页面通过CSS的动画效果，进行移动。

overflow：hidden；transition：all 1000 ms ease；
```

[《用 ES6 写全屏滚动插件》](https://juejin.im/post/5aeef41cf265da0ba0630de0)

#### 什么是响应式设计？响应式设计的基本原理是什么？如何兼容低版本的 IE？（待深入了解）

```
响应式网站设计是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。基本原理是通过媒体查询检测不同的设备屏
幕尺寸做处理。页面头部必须有meta声明的viewport。
```

详细资料可以参考：[《响应式布局原理》](https://blog.csdn.net/dreamerframework/article/details/8994741) [《响应式布局的实现方法和原理》](http://www.mahaixiang.cn/wzsj/278.html)

#### 视差滚动效果，如何给每页做不同的动画？（回到顶部，向下滑动要再次出现，和只出现一次分别怎么做？）

```
视差滚动是指多层背景以不同的速度移动，形成立体的运动效果，带来非常出色的视觉体验。
```

详细资料可以参考： [《如何实现视差滚动效果的网页？》](https://www.zhihu.com/question/20990029)

#### 层叠上下文

https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/

**创建**

1. 根元素
2. relative、absolute 且z-index不为auto
3. fixed和sticky
4. CSS3属性：
   1. 父元素为flex或flex-inline的**项目**，且z-index不为auto
   2. opacity不为1。透明的元素
   3. transform不为none。做了变换的元素
   4. mix-blend-mode 。用了混合模式
   5. filter 。用了滤镜
   6. isolation:isolate
   7. **will-change**不为none



**层叠顺序**

1. 层叠上下文（background、border）
2. 负z-index
3. block
4. float
5. inline、inline-block
6. z-index：auto或0 **不依赖z-index的层叠上下文**
7. 正z-index

**为什么层叠上下文元素，比普通元素高层**？

获得层叠上下文的元素，自动生效 z-index：auto，就到了第六层级别

#### viewport

https://www.cnblogs.com/2050/p/3877280.html

三种viewport

layout viewport、visual viewport、ideal viewport（layout的宽度是设备宽度）

获得ideal：

1. width=device-width
2. initial-scale=1.0 （这个1.0是相对于ideal的，默认值是不确定的

#### sticky的特性

特性：

1. sticky不会触发BFC，
2. z-index无效，
3. 当父元素的height：100%时，页面滑动到一定高度之后sticky属性会失效。
4. 父元素不能有overflow:hidden或者overflow:auto属性。
5. 父元素高度不能低于sticky高度
6. 必须指定top、bottom、left、right4个值之一。

#### 如何修改 chrome 记住密码后自动填充表单的黄色背景？

```
input:-webkit-autofill
```

给这个属性添加内阴影来覆盖

#### font-style 属性中 italic 和 oblique 的区别？

```
italic和oblique这两个关键字都表示“斜体”的意思。

它们的区别在于，italic是使用当前字体的斜体字体，而oblique只是单纯地让文字倾斜。如果当前字体没有对应的斜体字体，
则退而求其次，解析为oblique，也就是单纯形状倾斜。
```