# 初步

## 配置

从VS Code运行typescript

https://www.tslang.cn/#download-links

## 编译

`tsc greeter.ts`

## 类型注解

```typescript
function greeter(person:string){
    return...
}
```

函数内的参数可以规定数据类型

ts是强制类型的,舍弃了js的强制类型转换,如果不是对应类型,就会报错,但js能运行.

一般需要判断类型,如果不是目标类型就抛出异常.才能保证不报错。

## 接口

也可以用接口自拟类型

```typescript
interface Person{
    firstName:string;
    lastName:string;
}
function greeter(person:Person){
    return...
}
```

- **接口一般首字母大写**
- 定义的变量，必须属性数目**不少于**，类型相同，形状必须保持一致；*除非使用**可选属性***

### 可选属性

```ts
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom'
};
```

该属性可以不存在

### 任意属性

```typescript
interface Person{
    name: string;
    age: number;
    [propName: string]:any;
}
```

- 一个接口只能有一个**任意属性**
- 约束这个接口的所有属性
- 此时接口属性的数量限制是：**只能多不能少**
- 可以用联合类型来混搭

### 只读属性

只能赋值一次的属性

```ts
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}
```

## 类

写法:

```typescript
class Student{
    fullName:string;
    constructor(public firstName,public lastName){
        this.fullName = firstName + " " + lastName;
    }
}
```

- 类的成员变量和函数使用分号分隔
- ts类有构造函数
- 函数的参数带了public,意味着创建了同名的成员变量

# 基础

## 原始数据类型

- 布尔值boolean
- 数值number：可以使用ES6非十进制写法
- 字符串string：可以使用ES6模板字符串
- 空值void：一般只用在函数声明中，作为没有返回值的函数
- null和undefined：是所有类型的子变量，可以赋值给所有类型

## 任意值类型

- any：可以赋值任何类型的一种类型。可以理解为js变量
- 如果变量没有声明类型来声明，那他就是any类型

```typescript
let a; //这个是any类型
let b = "b"; //这个是string类型，是类型推论的结果
```

## 联合类型

```typescript
let a: string | number;
```

- 联合类型只能访问这些类型的共有属性和方法，例如这个例子length属性访问就会报错

## 数组

- 用类型加一个中括号代表数组`name: number[]`
- 数组内元素必须全是同类型
- 数组的一些方法也会做出改变,会对上一条规则进行约束

#### 类数组表示

```ts
interface IArguments {
    [index: number]: any;
    length: number;
    callee: Function;
}
```

其中 `IArguments` 是 TypeScript 中定义好了的类型，它实际上就是：

```ts
interface IArguments {
    [index: number]: any;
    length: number;
    callee: Function;
}
```

## 函数类型

- 输入多余的参数不被允许

### 函数定义-函数声明

```typescript
function sum(x: number,y: number): number{
    return x + y;
}
```

### 函数定义-函数表达式

```typescript
let mySum : (x: number,y: number) => number = function(x: number,y: number): number{
    return x + y;
}
```

理解：约束mySum的类型，类型写法是 （)=>() 表示函数类型，然后再赋值函数。

如果不写mySum的类型，会类型推断出来mySum的类型，增加计算消耗

可以写成接口形式

```typescript
interface Func{
    (x:number,y:number):number;
}
let mySum:Func = ...
```

### 可选参数

```typescript
function sum(x: number,y: number,z?: number):number{
    ...
}
```

- 可选参数必须在必须参数后面

### 参数默认值

```typescript
function sum(x: number = 12,y:...)
```

### 剩余参数

```typescript
function sum(x: number, ...rest: number[])
```

约束...rest的类型，是一个数组

### 重载

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

比如，我们需要实现一个函数 `reverse`，输入数字 `123` 的时候，输出反转的数字 `321`，输入字符串 `'hello'` 的时候，输出反转的字符串 `'olleh'`。

利用联合类型，我们可以这么实现：

```ts
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

**然而这样有一个缺点，就是不能够精确的表达，输入为数字的时候，输出也应该为数字，输入为字符串的时候，输出也应该为字符串。**

这时，我们可以使用重载定义多个 `reverse` 的函数类型：

```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

上例中，我们重复定义了多次函数 `reverse`，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。

注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

## 类型断言

> 联合类型中,只能访问共同的属性和方法

如果要访问联合类型中的某个类型自己独有的方法

可加个

`(animal as Fish).swim()`

如果animal是Fish类型,运行成功

如果animal是Cat类型,运行报错,因为Cat.swim() 依然会访问

所以**断言**意味着程序相信程序员的判断,使用时要小心.

待续

用途:

- 将一个联合类型断言为其中一个类型
- 将一个父类断言为更加具体的子类
- 将任何一个类型断言为 any
- 将 any 断言为一个具体的类型

## 声明语句

- 声明语句,目的是定义**类型**,用于编译的检查
- 声明文件

