## 第 10 章　函数

> **本章内容**
>
> - 函数表达式、函数声明及箭头函数
> - 默认参数及扩展操作符
> - 使用函数实现递归
> - 使用闭包实现私有变量

函数是ECMAScript中最有意思的部分之一，这主要是因为函数实际上是对象。每个函数都是`Function`类型的实例，而`Function`也有属性和方法，跟其他引用类型一样。因为函数是对象，所以函数名就是指向函数对象的指针，而且不一定与函数本身紧密绑定。函数通常以函数声明的方式定义，比如：

```
function sum (num1, num2) {
  return num1 + num2;
}
```

这里，代码定义了一个变量`sum`并将其初始化为一个函数。注意`function`关键字后面没有名称，因为不需要。这个函数可以通过变量`sum`来引用。注意函数定义最后没有加分号。

另一种定义函数的语法是函数表达式。函数表达式与函数声明几乎是等价的：

```
let sum = function(num1, num2) {
  return num1 + num2;
};
```

注意这里的函数末尾是有分号的，与任何变量初始化语句一样。

还有一种定义函数的方式与函数表达式很像，叫作“箭头函数”（arrow function），如下所示：

```
let sum = (num1, num2) => {
  return num1 + num2;
};
```

最后一种定义函数的方式是使用`Function`构造函数。这个构造函数接收任意多个字符串参数，最后一个参数始终会被当成函数体，而之前的参数都是新函数的参数。来看下面的例子：

```
let sum = new Function("num1", "num2", "return num1 + num2");  // 不推荐
```

我们不推荐使用这种语法来定义函数，因为这段代码会被解释两次：第一次是将它当作常规ECMAScript代码，第二次是解释传给构造函数的字符串。这显然会影响性能。不过，把函数想象为对象，把函数名想象为指针是很重要的。而上面这种语法很好地诠释了这些概念。

> **注意**　这几种实例化函数对象的方式之间存在微妙但重要的差别，本章后面会讨论。无论如何，通过其中任何一种方式都可以创建函数。

## 10.1　箭头函数

ECMAScript 6新增了使用胖箭头（`=>`）语法定义函数表达式的能力。很大程度上，箭头函数实例化的函数对象与正式的函数表达式创建的函数对象行为是相同的。任何可以使用函数表达式的地方，都可以使用箭头函数：

```
let arrowSum = (a, b) => {
  return a + b;
};

let functionExpressionSum = function(a, b) {
  return a + b;
};

console.log(arrowSum(5, 8)); // 13
console.log(functionExpressionSum(5, 8)); // 13
```

箭头函数简洁的语法非常适合嵌入函数的场景：

```
let ints = [1, 2, 3];

console.log(ints.map(function(i) { return i + 1; }));  // [2, 3, 4]
console.log(ints.map((i) => { return i + 1 }));        // [2, 3, 4]
```

如果只有一个参数，那也可以不用括号。只有没有参数，或者多个参数的情况下，才需要使用括号：

```
// 以下两种写法都有效
let double = (x) => { return 2 * x; };
let triple = x => { return 3 * x; };

// 没有参数需要括号
let getRandom = () => { return Math.random(); };

// 多个参数需要括号
let sum = (a, b) => { return a + b; };

// 无效的写法：
let multiply = a, b => { return a * b; };
```

箭头函数也可以不用大括号，但这样会改变函数的行为。使用大括号就说明包含“函数体”，可以在一个函数中包含多条语句，跟常规的函数一样。如果不使用大括号，那么箭头后面就只能有一行代码，比如一个赋值操作，或者一个表达式。而且，省略大括号会隐式返回这行代码的值：

```
// 以下两种写法都有效，而且返回相应的值
let double = (x) => { return 2 * x; };
let triple = (x) => 3 * x;

// 可以赋值
let value = {};
let setName = (x) => x.name = "Matt";
setName(value);
console.log(value.name); // "Matt"

// 无效的写法：
let multiply = (a, b) => return a * b;
```

箭头函数虽然语法简洁，但也有很多场合不适用。箭头函数不能使用`arguments`、`super`和`new.target`，也不能用作构造函数。此外，箭头函数也没有`prototype`属性。

## 10.2　函数名

因为函数名就是指向函数的指针，所以它们跟其他包含对象指针的变量具有相同的行为。这意味着一个函数可以有多个名称，如下所示：

```
function sum(num1, num2) {
  return num1 + num2;
}

console.log(sum(10, 10));         // 20

let anotherSum = sum;
console.log(anotherSum(10, 10));  // 20

sum = null;
console.log(anotherSum(10, 10));  // 20
```

以上代码定义了一个名为`sum()`的函数，用于求两个数之和。然后又声明了一个变量`anotherSum`，并将它的值设置为等于`sum`。注意，使用不带括号的函数名会访问函数指针，而不会执行函数。此时，`anotherSum`和`sum`都指向同一个函数。调用`anotherSum()`也可以返回结果。把`sum`设置为`null`之后，就切断了它与函数之间的关联。而`anotherSum()`还是可以照常调用，没有问题。

ECMAScript 6的所有函数对象都会暴露一个只读的`name`属性，其中包含关于函数的信息。多数情况下，这个属性中保存的就是一个函数标识符，或者说是一个字符串化的变量名。即使函数没有名称，也会如实显示成空字符串。如果它是使用`Function`构造函数创建的，则会标识成`"anonymous"`：

```
function foo() {}
let bar = function() {};
let baz = () => {};

console.log(foo.name);               // foo
console.log(bar.name);               // bar
console.log(baz.name);               // baz
console.log((() => {}).name);        //（空字符串）
console.log((new Function()).name);  // anonymous
```

如果函数是一个获取函数、设置函数，或者使用`bind()`实例化，那么标识符前面会加上一个前缀：

```
function foo() {}

console.log(foo.bind(null).name);    // bound foo

let dog = {
  years: 1,
  get age() {
    return this.years;
  },
  set age(newAge) {
    this.years = newAge;
  }
}

let propertyDescriptor = Object.getOwnPropertyDescriptor(dog, 'age');
console.log(propertyDescriptor.get.name);  // get age
console.log(propertyDescriptor.set.name);  // set age
```

## 10.3　理解参数

ECMAScript函数的参数跟大多数其他语言不同。ECMAScript函数既不关心传入的参数个数，也不关心这些参数的数据类型。定义函数时要接收两个参数，并不意味着调用时就传两个参数。你可以传一个、三个，甚至一个也不传，解释器都不会报错。

之所以会这样，主要是因为ECMAScript函数的参数在内部表现为一个数组。函数被调用时总会接收一个数组，但函数并不关心这个数组中包含什么。如果数组中什么也没有，那没问题；如果数组的元素超出了要求，那也没问题。事实上，在使用`function`关键字定义（非箭头）函数时，可以在函数内部访问`arguments`对象，从中取得传进来的每个参数值。

`arguments`对象是一个类数组对象（但不是`Array`的实例），因此可以使用中括号语法访问其中的元素（第一个参数是`arguments[0]`，第二个参数是`arguments[1]`）。而要确定传进来多少个参数，可以访问`arguments.length`属性。

在下面的例子中，`sayHi()`函数的第一个参数叫`name`：

```
function sayHi(name, message) {
  console.log("Hello " + name + ", " + message);
}
```

可以通过`arguments[0]`取得相同的参数值。因此，把函数重写成不声明参数也可以：

```
function sayHi() {
  console.log("Hello " + arguments[0] + ", " + arguments[1]);
}
```

在重写后的代码中，没有命名参数。`name`和`message`参数都不见了，但函数照样可以调用。这就表明，ECMAScript函数的参数只是为了方便才写出来的，并不是必须写出来的。与其他语言不同，在ECMAScript中的命名参数不会创建让之后的调用必须匹配的函数签名。这是因为根本不存在验证命名参数的机制。

也可以通过`arguments`对象的`length`属性检查传入的参数个数。下面的例子展示了在每调用一个函数时，都会打印出传入的参数个数：

```
function howManyArgs() {
  console.log(arguments.length);
}

howManyArgs("string", 45);  // 2
howManyArgs();              // 0
howManyArgs(12);            // 1
```

这个例子分别打印出2、0和1（按顺序）。既然如此，那么开发者可以想传多少参数就传多少参数。比如：

```
function doAdd() {
  if (arguments.length === 1) {
    console.log(arguments[0] + 10);
  } else if (arguments.length === 2) {
    console.log(arguments[0] + arguments[1]);
  }
}

doAdd(10);      // 20
doAdd(30, 20);  // 50
```

这个函数`doAdd()`在只传一个参数时会加10，在传两个参数时会将它们相加，然后返回。因此`doAdd(10)`返回20，而`doAdd(30,20)`返回50。虽然不像真正的函数重载那么明确，但这已经足以弥补ECMAScript在这方面的缺失了。

还有一个必须理解的重要方面，那就是`arguments`对象可以跟命名参数一起使用，比如：

```
function doAdd(num1, num2) {
  if (arguments.length === 1) {
    console.log(num1 + 10);
  } else if (arguments.length === 2) {
    console.log(arguments[0] + num2);
  }
}
```

在这个`doAdd()`函数中，共同使用了两个命名参数和`arguments`对象。命名参数保存着与`num1 arugments[0]`一样的值，因此使用谁都无所谓。（同样，`num2`也保存着跟`arguments[1]`一样的值。）

`arguments`对象的另一个有意思的地方就是，它的值始终会与对应的命名参数同步。来看下面的例子：

```
function doAdd(num1, num2) {
  arguments[1] = 10;
  console.log(arguments[0] + num2);
}
```

这个`doAdd()`函数把第二个参数的值重写为10。因为`arguments`对象的值会自动同步到对应的命名参数，所以修改`arguments[1]`也会修改`num2`的值，因此两者的值都是10。但这并不意味着它们都访问同一个内存地址，它们在内存中还是分开的，只不过会保持同步而已。但是，这种同步是单向的：修改命名参数的值，**不会**影响`arguments`对象中相应的值。另外还要记住一点：如果只传了一个参数，然后把`arguments[1]`设置为某个值，那么这个值并不会反映到第二个命名参数。这是因为`arguments`对象的长度是根据传入的参数个数，而非定义函数时给出的命名参数个数确定的。

对于命名参数而言，如果调用函数时没有传这个参数，那么它的值就是`undefined`。这就类似于定义了变量而没有初始化。比如，如果只给`doAdd()`传了一个参数，那么`num2`的值就是`undefined`。

严格模式下，`arguments`会有一些变化。首先，像前面那样给`arguments[1]`赋值不会再影响`num2`的值。就算把`arguments[1]`设置为10，`num2`的值仍然还是传入的值。其次，在函数中尝试重写`arguments`对象会导致语法错误。（代码也不会执行。）

### 箭头函数中的参数

如果函数是使用箭头语法定义的，那么传给函数的参数将不能使用`arguments`关键字访问，而只能通过定义的命名参数访问。

```
function foo() {
  console.log(arguments[0]);
}
foo(5); // 5

let bar = () => {
  console.log(arguments[0]);
};
bar(5);  // ReferenceError: arguments is not defined
```

虽然箭头函数中没有`arguments`对象，但可以在包装函数中把它提供给箭头函数：

```
function foo() {
  let bar = () => {
    console.log(arguments[0]); // 5
  };
  bar();
}

foo(5);
```

> **注意**　ECMAScript中的所有参数都按值传递的。不可能按引用传递参数。如果把对象作为参数传递，那么传递的值就是这个对象的引用。

## 10.4　没有重载

ECMAScript函数不能像传统编程那样重载。在其他语言比如Java中，一个函数可以有两个定义，只要签名（接收参数的类型和数量）不同就行。如前所述，ECMAScript函数没有签名，因为参数是由包含零个或多个值的数组表示的。没有函数签名，自然也就没有重载。

如果在ECMAScript中定义了两个同名函数，则后定义的会覆盖先定义的。来看下面的例子：

```
function addSomeNumber(num) {
  return num + 100;
}

function addSomeNumber(num) {
  return num + 200;
}

let result = addSomeNumber(100); // 300
```

这里，函数`addSomeNumber()`被定义了两次。第一个版本给参数加100，第二个版本加200。最后一行调用这个函数时，返回了300，因为第二个定义覆盖了第一个定义。

前面也提到过，可以通过检查参数的类型和数量，然后分别执行不同的逻辑来模拟函数重载。

把函数名当成指针也有助于理解为什么ECMAScript没有函数重载。在前面的例子中，定义两个同名的函数显然会导致后定义的重写先定义的。而那个例子几乎跟下面这个是一样的：

```
let addSomeNumber = function(num) {
    return num + 100;
};

addSomeNumber = function(num) {
    return num + 200;
};

let result = addSomeNumber(100); // 300
```

看这段代码应该更容易理解发生了什么。在创建第二个函数时，变量`addSomeNumber`被重写成保存第二个函数对象了。

## 10.5　默认参数值

在ECMAScript5.1及以前，实现默认参数的一种常用方式就是检测某个参数是否等于`undefined`，如果是则意味着没有传这个参数，那就给它赋一个值：

```
function makeKing(name) {
  name = (typeof name !== 'undefined') ? name : 'Henry';
  return `King ${name} VIII`;
}

console.log(makeKing());         // 'King Henry VIII'
console.log(makeKing('Louis'));  // 'King Louis VIII'
```

ECMAScript 6之后就不用这么麻烦了，因为它支持显式定义默认参数了。下面就是与前面代码等价的ES6写法，只要在函数定义中的参数后面用`=`就可以为参数赋一个默认值：

```
function makeKing(name = 'Henry') {
  return `King ${name} VIII`;
}

console.log(makeKing('Louis'));  // 'King Louis VIII'
console.log(makeKing());         // 'King Henry VIII'
```

给参数传`undefined`相当于没有传值，不过这样可以利用多个独立的默认值：

```
function makeKing(name = 'Henry', numerals = 'VIII') {
  return `King ${name} ${numerals}`;
}

console.log(makeKing());                 // 'King Henry VIII'
console.log(makeKing('Louis'));          // 'King Louis VIII'
console.log(makeKing(undefined, 'VI'));  // 'King Henry VI'
```

在使用默认参数时，`arguments`对象的值不反映参数的默认值，只反映传给函数的参数。当然，跟ES5严格模式一样，修改命名参数也不会影响`arguments`对象，它始终以调用函数时传入的值为准：

```
function makeKing(name = 'Henry') {
  name = 'Louis';
  return `King ${arguments[0]}`;
}

console.log(makeKing());         // 'King undefined'
console.log(makeKing('Louis'));  // 'King Louis'
```

默认参数值并不限于原始值或对象类型，也可以使用调用函数返回的值：

```
let romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
let ordinality = 0;

function getNumerals() {
  // 每次调用后递增
  return romanNumerals[ordinality++];
}

function makeKing(name = 'Henry', numerals = getNumerals()) {
  return `King ${name} ${numerals}`;
}

console.log(makeKing());                // 'King Henry I'
console.log(makeKing('Louis', 'XVI'));  // 'King Louis XVI'
console.log(makeKing());                // 'King Henry II'
console.log(makeKing());                // 'King Henry III'
```

函数的默认参数只有在函数被调用时才会求值，不会在函数定义时求值。而且，计算默认值的函数只有在调用函数但未传相应参数时才会被调用。

箭头函数同样也可以这样使用默认参数，只不过在只有一个参数时，就必须使用括号而不能省略了：

```
let makeKing = (name = 'Henry') => `King ${name}`;

console.log(makeKing()); // King Henry
```

### 默认参数作用域与暂时性死区

因为在求值默认参数时可以定义对象，也可以动态调用函数，所以函数参数肯定是在某个作用域中求值的。

给多个参数定义默认值实际上跟使用`let`关键字顺序声明变量一样。来看下面的例子：

```
function makeKing(name = 'Henry', numerals = 'VIII') {
  return `King ${name} ${numerals}`;
}

console.log(makeKing()); // King Henry VIII
```

这里的默认参数会按照定义它们的顺序依次被初始化。可以依照如下示例想象一下这个过程：

```
function makeKing() {
  let name = 'Henry';
  let numerals = 'VIII';

  return `King ${name} ${numerals}`;
}
```

因为参数是按顺序初始化的，所以后定义默认值的参数可以引用先定义的参数。看下面这个例子：

```
function makeKing(name = 'Henry', numerals = name) {
  return `King ${name} ${numerals}`;
}

console.log(makeKing()); // King Henry Henry
```

参数初始化顺序遵循“暂时性死区”规则，即前面定义的参数不能引用后面定义的。像这样就会抛出错误：

```
// 报错
function makeKing(name = numerals, numerals = 'VIII') {
  return `King ${name} ${numerals}`;
}
```

参数也存在于自己的作用域中，它们不能引用函数体的作用域：

```
// 报错
function makeKing(name = 'Henry', numerals = defaultNumeral) {
  let defaultNumeral = 'VIII';
  return `King ${name} ${numerals}`;
}
```

## 10.6　参数扩展与收集

ECMAScript 6新增了扩展操作符，使用它可以非常简洁地操作和组合集合数据。扩展操作符最有用的场景就是函数定义中的参数列表，在这里它可以充分利用这门语言的弱类型及参数长度可变的特点。扩展操作符既可以用于调用函数时传参，也可以用于定义函数参数。

### 10.6.1　扩展参数

在给函数传参时，有时候可能不需要传一个数组，而是要分别传入数组的元素。

假设有如下函数定义，它会将所有传入的参数累加起来：

```
let values = [1, 2, 3, 4];

function getSum() {
  let sum = 0;
  for (let i = 0; i < arguments.length; ++i) {
    sum += arguments[i];
  }
  return sum;
}
```

这个函数希望将所有加数逐个传进来，然后通过迭代`arguments`对象来实现累加。如果不使用扩展操作符，想把定义在这个函数这面的数组拆分，那么就得求助于`apply()`方法：

```
console.log(getSum.apply(null, values)); // 10
```

但在ECMAScript 6中，可以通过扩展操作符极为简洁地实现这种操作。对可迭代对象应用扩展操作符，并将其作为一个参数传入，可以将可迭代对象拆分，并将迭代返回的每个值单独传入。

比如，使用扩展操作符可以将前面例子中的数组像这样直接传给函数：

```
console.log(getSum(...values)); // 10
```

因为数组的长度已知，所以在使用扩展操作符传参的时候，并不妨碍在其前面或后面再传其他的值，包括使用扩展操作符传其他参数：

```
console.log(getSum(-1, ...values));          // 9
console.log(getSum(...values, 5));           // 15
console.log(getSum(-1, ...values, 5));       // 14
console.log(getSum(...values, ...[5,6,7]));  // 28
```

对函数中的`arguments`对象而言，它并不知道扩展操作符的存在，而是按照调用函数时传入的参数接收每一个值：

```
let values = [1,2,3,4]

function countArguments() {
  console.log(arguments.length);
}

countArguments(-1, ...values);          // 5
countArguments(...values, 5);           // 5
countArguments(-1, ...values, 5);       // 6
countArguments(...values, ...[5,6,7]);  // 7
```

`arguments`对象只是消费扩展操作符的一种方式。在普通函数和箭头函数中，也可以将扩展操作符用于命名参数，当然同时也可以使用默认参数：

```
function getProduct(a, b, c = 1) {
  return a * b * c;
}

let getSum = (a, b, c = 0) => {
  return a + b + c;
}

console.log(getProduct(...[1,2]));      // 2
console.log(getProduct(...[1,2,3]));    // 6
console.log(getProduct(...[1,2,3,4]));  // 6

console.log(getSum(...[0,1]));          // 1
console.log(getSum(...[0,1,2]));        // 3
console.log(getSum(...[0,1,2,3]));      // 3
```

### 10.6.2　收集参数

在构思函数定义时，可以使用扩展操作符把不同长度的独立参数组合为一个数组。这有点类似`arguments`对象的构造机制，只不过收集参数的结果会得到一个`Array`实例。

```
function getSum(...values) {
  // 顺序累加values中的所有值
  // 初始值的总和为0
  return values.reduce((x, y) => x + y, 0);
}

console.log(getSum(1,2,3)); // 6
```

收集参数的前面如果还有命名参数，则只会收集其余的参数；如果没有则会得到空数组。因为收集参数的结果可变，所以只能把它作为最后一个参数：

```
// 不可以
function getProduct(...values, lastValue) {}

// 可以
function ignoreFirst(firstValue, ...values) {
  console.log(values);
}

ignoreFirst();       // []
ignoreFirst(1);      // []
ignoreFirst(1,2);    // [2]
ignoreFirst(1,2,3);  // [2, 3]
```

箭头函数虽然不支持`arguments`对象，但支持收集参数的定义方式，因此也可以实现与使用`arguments`一样的逻辑：

```
let getSum = (...values) => {
  return values.reduce((x, y) => x + y, 0);
}

console.log(getSum(1,2,3)); // 6
```

另外，使用收集参数并不影响`arguments`对象，它仍然反映调用时传给函数的参数：

```
function getSum(...values) {
  console.log(arguments.length);  // 3
  console.log(arguments);         // [1, 2, 3]
  console.log(values);            // [1, 2, 3]
}

console.log(getSum(1,2,3));
```

## 10.7　函数声明与函数表达式

本章到现在一直没有把函数声明和函数表达式区分得很清楚。事实上，JavaScript引擎在加载数据时对它们是区别对待的。JavaScript引擎在任何代码执行之前，会先读取函数声明，并在执行上下文中生成函数定义。而函数表达式必须等到代码执行到它那一行，才会在执行上下文中生成函数定义。来看下面的例子：

```
// 没问题
console.log(sum(10, 10));
function sum(num1, num2) {
  return num1 + num2;
}
```

以上代码可以正常运行，因为函数声明会在任何代码执行之前先被读取并添加到执行上下文。这个过程叫作**函数声明提升**（function declaration hoisting）。在执行代码时，JavaScript引擎会先执行一遍扫描，把发现的函数声明提升到源代码树的顶部。因此即使函数定义出现在调用它们的代码之后，引擎也会把函数声明**提升**到顶部。如果把前面代码中的函数声明改为等价的函数表达式，那么执行的时候就会出错：

```
// 会出错
console.log(sum(10, 10));
let sum = function(num1, num2) {
  return num1 + num2;
};
```

上面的代码之所以会出错，是因为这个函数定义包含在一个变量初始化语句中，而不是函数声明中。这意味着代码如果没有执行到加粗的那一行，那么执行上下文中就没有函数的定义，所以上面的代码会出错。这并不是因为使用`let`而导致的，使用`var`关键字也会碰到同样的问题：

```
console.log(sum(10, 10));
var sum = function(num1, num2) {
  return num1 + num2;
};
```

除了函数什么时候真正有定义这个区别之外，这两种语法是等价的。

> **注意**　在使用函数表达式初始化变量时，也可以给函数一个名称，比如`let sum = function sum() {}`。这一点在10.11节讨论函数表达式时会再讨论。

## 10.8　函数作为值

因为函数名在ECMAScript中就是变量，所以函数可以用在任何可以使用变量的地方。这意味着不仅可以把函数作为参数传给另一个函数，而且还可以在一个函数中返回另一个函数。来看下面的例子：

```
function callSomeFunction(someFunction, someArgument) {
  return someFunction(someArgument);
}
```

这个函数接收两个参数。第一个参数应该是一个函数，第二个参数应该是要传给这个函数的值。任何函数都可以像下面这样作为参数传递：

```
function add10(num) {
  return num + 10;
}

let result1 = callSomeFunction(add10, 10);
console.log(result1);  // 20

function getGreeting(name) {
  return "Hello, " + name;
}

let result2 = callSomeFunction(getGreeting, "Nicholas");
console.log(result2);  // "Hello, Nicholas"
```

`callSomeFunction()`函数是通用的，第一个参数传入的是什么函数都可以，而且它始终返回调用作为第一个参数传入的函数的结果。要注意的是，如果是访问函数而不是调用函数，那就必须不带括号，所以传给`callSomeFunction()`的必须是`add10`和`getGreeting`，而不能是它们的执行结果。

从一个函数中返回另一个函数也是可以的，而且非常有用。例如，假设有一个包含对象的数组，而我们想按照任意对象属性对数组进行排序。为此，可以定义一个`sort()`方法需要的比较函数，它接收两个参数，即要比较的值。但这个比较函数还需要想办法确定根据哪个属性来排序。这个问题可以通过定义一个根据属性名来创建比较函数的函数来解决。比如：

```
function createComparisonFunction(propertyName) {
  return function(object1, object2) {
    let value1 = object1[propertyName];
    let value2 = object2[propertyName];

    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };
}
```

这个函数的语法乍一看比较复杂，但实际上就是在一个函数中返回另一个函数，注意那个`return`操作符。内部函数可以访问`propertyName`参数，并通过中括号语法取得要比较的对象的相应属性值。取得属性值以后，再按照`sort()`方法的需要返回比较值就行了。这个函数可以像下面这样使用：

```
let data = [
  {name: "Zachary", age: 28},
  {name: "Nicholas", age: 29}
];

data.sort(createComparisonFunction("name"));
console.log(data[0].name);  // Nicholas

data.sort(createComparisonFunction("age"));
console.log(data[0].name);  // Zachary
```

在上面的代码中，数组`data`中包含两个结构相同的对象。每个对象都有一个`name`属性和一个`age`属性。默认情况下，`sort()`方法要对这两个对象执行`toString()`，然后再决定它们的顺序，但这样得不到有意义的结果。而通过调用`createComparisonFunction("name")`来创建一个比较函数，就可以根据每个对象`name`属性的值来排序，结果`name`属性值为`"Nicholas"`、`age`属性值为`29`的对象会排在前面。而调用`createComparisonFunction("age")`则会创建一个根据每个对象`age`属性的值来排序的比较函数，结果`name`属性值为`"Zachary"`、`age`属性值为`28`的对象会排在前面。

## 10.9　函数内部

在ECMAScript 5中，函数内部存在两个特殊的对象：`arguments`和`this`。ECMAScript 6又新增了`new.target`属性。

### 10.9.1　`arguments`

`arguments`对象前面讨论过多次了，它是一个类数组对象，包含调用函数时传入的所有参数。这个对象只有以`function`关键字定义函数（相对于使用箭头语法创建函数）时才会有。虽然主要用于包含函数参数，但`arguments`对象其实还有一个`callee`属性，是一个指向`arguments`对象所在函数的指针。来看下面这个经典的阶乘函数：

```
function factorial(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * factorial(num - 1);
  }
}
```

阶乘函数一般定义成递归调用的，就像上面这个例子一样。只要给函数一个名称，而且这个名称不会变，这样定义就没有问题。但是，这个函数要正确执行就必须保证函数名是`factorial`，从而导致了紧密耦合。使用`arguments.callee`就可以让函数逻辑与函数名解耦：

```
function factorial(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * arguments.callee(num - 1);
  }
}
```

这个重写之后的`factorial()`函数已经用`arguments.callee`代替了之前硬编码的`factorial`。这意味着无论函数叫什么名称，都可以引用正确的函数。考虑下面的情况：

```
let trueFactorial = factorial;

factorial = function() {
  return 0;
};

console.log(trueFactorial(5));  // 120
console.log(factorial(5));      // 0
```

这里，`trueFactorial`变量被赋值为`factorial`，实际上把同一个函数的指针又保存到了另一个位置。然后，`factorial`函数又被重写为一个返回`0`的函数。如果像`factorial()`最初的版本那样不使用`arguments.callee`，那么像上面这样调用`trueFactorial()`就会返回`0`。不过，通过将函数与名称解耦，`trueFactorial()`就可以正确计算阶乘，而`factorial()`则只能返回0。

### 10.9.2　`this`

另一个特殊的对象是`this`，它在标准函数和箭头函数中有不同的行为。

在标准函数中，`this`引用的是把函数当成方法调用的上下文对象，这时候通常称其为`this`值（在网页的全局上下文中调用函数时，`this`指向`windows`）。来看下面的例子：

```
window.color = 'red';
let o = {
  color: 'blue'
};

function sayColor() {
  console.log(this.color);
}

sayColor();    // 'red'

o.sayColor = sayColor;
o.sayColor();  // 'blue'
```

定义在全局上下文中的函数`sayColor()`引用了`this`对象。这个`this`到底引用哪个对象必须到函数被调用时才能确定。因此这个值在代码执行的过程中可能会变。如果在全局上下文中调用`sayColor()`，这结果会输出`"red"`，因为`this`指向`window`，而`this.color`相当于`window.color`。而在把`sayColor()`赋值给`o`之后再调用`o.sayColor()`，`this`会指向`o`，即`this.color`相当于`o.color`，所以会显示`"blue"`。

在箭头函数中，`this`引用的是定义箭头函数的上下文。下面的例子演示了这一点。在对`sayColor()`的两次调用中，`this`引用的都是`window`对象，因为这个箭头函数是在`window`上下文中定义的：

```
window.color = 'red';
let o = {
  color: 'blue'
};

let sayColor = () => console.log(this.color);

sayColor();    // 'red'

o.sayColor = sayColor;
o.sayColor();  // 'red'
```

有读者知道，在事件回调或定时回调中调用某个函数时，`this`值指向的并非想要的对象。此时将回调函数写成箭头函数就可以解决问题。这是因为箭头函数中的`this`会保留定义该函数时的上下文：

```
function King() {
  this.royaltyName = 'Henry';
  // this引用King的实例
  setTimeout(() => console.log(this.royaltyName), 1000);
}

function Queen() {
  this.royaltyName = 'Elizabeth';

  // this引用window对象
  setTimeout(function() { console.log(this.royaltyName); }, 1000);
}

new King();  // Henry
new Queen(); // undefined
```

> **注意**　函数名只是保存指针的变量。因此全局定义的`sayColor()`函数和`o.sayColor()`是同一个函数，只不过执行的上下文不同。

### 10.9.3　`caller`

ECMAScript 5也会给函数对象上添加一个属性：`caller`。虽然ECMAScript 3中并没有定义，但所有浏览器除了早期版本的Opera都支持这个属性。这个属性引用的是调用当前函数的函数，或者如果是在全局作用域中调用的则为`null`。比如：

```
function outer() {
  inner();
}

function inner() {
  console.log(inner.caller);
}
outer();
```

以上代码会显示`outer()`函数的源代码。这是因为`ourter()`调用了`inner()`，`inner.caller`指向`outer()`。如果要降低耦合度，则可以通过`arguments.callee.caller`来引用同样的值：

```
function outer() {
  inner();
}

function inner() {
  console.log(arguments.callee.caller);
}

outer();
```

在严格模式下访问`arguments.callee`会报错。ECMAScript 5也定义了`arguments.caller`，但在严格模式下访问它会报错，在非严格模式下则始终是`undefined`。这是为了分清`arguments.caller`和函数的`caller`而故意为之的。而作为对这门语言的安全防护，这些改动也让第三方代码无法检测同一上下文中运行的其他代码。

严格模式下还有一个限制，就是不能给函数的`caller`属性赋值，否则会导致错误。

### 10.9.4　`new.target`

ECMAScript中的函数始终可以作为构造函数实例化一个新对象，也可以作为普通函数被调用。ECMAScript 6新增了检测函数是否使用`new`关键字调用的`new.target`属性。如果函数是正常调用的，则`new.target`的值是`undefined`；如果是使用`new`关键字调用的，则`new.target`将引用被调用的构造函数。

```
function King() {
  if (!new.target) {
    throw 'King must be instantiated using "new"'
  }
  console.log('King instantiated using "new"');
}

new King(); // King instantiated using "new"
King();     // Error: King must be instantiated using "new"
```

## 10.10　函数属性与方法

前面提到过，ECMAScript中的函数是对象，因此有属性和方法。每个函数都有两个属性：`length`和`prototype`。其中，`length`属性保存函数定义的命名参数的个数，如下例所示：

```
function sayName(name) {
  console.log(name);
}

function sum(num1, num2) {
  return num1 + num2;
}

function sayHi() {
  console.log("hi");
}

console.log(sayName.length);  // 1
console.log(sum.length);      // 2
console.log(sayHi.length);    // 0
```

以上代码定义了3个函数，每个函数的命名参数个数都不一样。`sayName()`函数有1个命名参数，所以其`length`属性为1。类似地，`sum()`函数有两个命名参数，所以其`length`属性是2。而`sayHi()`没有命名参数，其`length`属性为0。

`prototype`属性也许是ECMAScript核心中最有趣的部分。`prototype`是保存引用类型所有实例方法的地方，这意味着`toString()`、`valueOf()`等方法实际上都保存在`prototype`上，进而由所有实例共享。这个属性在自定义类型时特别重要。（相关内容已经在第8章详细介绍过了。）在ECMAScript 5中，`prototype`属性是不可枚举的，因此使用`for-in`循环不会返回这个属性。

函数还有两个方法：`apply()`和`call()`。这两个方法都会以指定的`this`值来调用函数，即会设置调用函数时函数体内`this`对象的值。`apply()`方法接收两个参数：函数内`this`的值和一个参数数组。第二个参数可以是`Array`的实例，但也可以是`arguments`对象。来看下面的例子：

```
function sum(num1, num2) {
  return num1 + num2;
}

function callSum1(num1, num2) {
  return sum.apply(this, arguments); // 传入arguments对象
}

function callSum2(num1, num2) {
  return sum.apply(this, [num1, num2]); // 传入数组
}

console.log(callSum1(10, 10));  // 20
console.log(callSum2(10, 10));  // 20
```

在这个例子中，`callSum1()`会调用`sum()`函数，将`this`作为函数体内的`this`值（这里等于`window`，因为是在全局作用域中调用的）传入，同时还传入了`arguments`对象。`callSum2()`也会调用`sum()`函数，但会传入参数的数组。这两个函数都会执行并返回正确的结果。

> **注意**　在严格模式下，调用函数时如果没有指定上下文对象，则`this`值不会指向`window`。除非使用`apply()`或`call()`把函数指定给一个对象，否则`this`的值会变成`undefined`。

`call()`方法与`apply()`的作用一样，只是传参的形式不同。第一个参数跟`apply()`一样，也是`this`值，而剩下的要传给被调用函数的参数则是逐个传递的。换句话说，通过`call()`向函数传参时，必须将参数一个一个地列出来，比如：

```
function sum(num1, num2) {
  return num1 + num2;
}

function callSum(num1, num2) {
  return sum.call(this, num1, num2);
}

console.log(callSum(10, 10)); // 20
```

这里的`callSum()`函数必须逐个地把参数传给`call()`方法。结果跟`apply()`的例子一样。到底是使用`apply()`还是`call()`，完全取决于怎么给要调用的函数传参更方便。如果想直接传`arguments`对象或者一个数组，那就用`apply()`；否则，就用`call()`。当然，如果不用给被调用的函数传参，则使用哪个方法都一样。

`apply()`和`call()`真正强大的地方并不是给函数传参，而是控制函数调用上下文即函数体内`this`值的能力。考虑下面的例子：

```
window.color = 'red';
let o = {
  color: 'blue'
};

function sayColor() {
  console.log(this.color);
}

sayColor();             // red

sayColor.call(this);    // red
sayColor.call(window);  // red
sayColor.call(o);       // blue
```

这个例子是在之前那个关于`this`对象的例子基础上修改而成的。同样，`sayColor()`是一个全局函数，如果在全局作用域中调用它，那么会显示`"red"`。这是因为`this.color`会求值为`window.color`。如果在全局作用域中显式调用`sayColor.call(this)`或者`sayColor.call(window)`，则同样都会显示`"red"`。而在使用`sayColor.call(o)`把函数的执行上下文即`this`切换为对象`o`之后，结果就变成了显示`"blue"`了。

使用`call()`或`apply()`的好处是可以将任意对象设置为任意函数的作用域，这样对象可以不用关心方法。在前面例子最初的版本中，为切换上下文需要先把`sayColor()`直接赋值为`o`的属性，然后再调用。而在这个修改后的版本中，就不需要这一步操作了。

ECMAScript 5出于同样的目的定义了一个新方法：`bind()`。`bind()`方法会创建一个新的函数实例，其`this`值会被**绑定**到传给`bind()`的对象。比如：

```
window.color = 'red';
var o = {
  color: 'blue'
};

function sayColor() {
  console.log(this.color);
}
let objectSayColor = sayColor.bind(o);
objectSayColor();  // blue
```

这里，在`sayColor()`上调用`bind()`并传入对象`o`创建了一个新函数`objectSayColor()`。`objectSayColor()`中的`this`值被设置为`o`，因此直接调用这个函数，即使是在全局作用域中调用，也会返回字符串`"blue"`。

对函数而言，继承的方法`toLocaleString()`和`toString()`始终返回函数的代码。返回代码的具体格式因浏览器而异。有的返回源代码，包含注释，而有的只返回代码的内部形式，会删除注释，甚至代码可能被解释器修改过。由于这些差异，因此不能在重要功能中依赖这些方法返回的值，而只应在调试中使用它们。继承的方法`valueOf()`返回函数本身。

## 10.11　函数表达式

函数表达式虽然更强大，但也更容易让人迷惑。我们知道，定义函数有两种方式：函数声明和函数表达式。函数声明是这样的：

```
function functionName(arg0, arg1, arg2) {
  // 函数体
}
```

函数声明的关键特点是**函数声明提升**，即函数声明会在代码执行之前获得定义。这意味着函数声明可以出现在调用它的代码之后：

```
sayHi();
function sayHi() {
  console.log("Hi!");
}
```

这个例子不会抛出错误，因为JavaScript引擎会先读取函数声明，然后再执行代码。

第二种创建函数的方式就是函数表达式。函数表达式有几种不同的形式，最常见的是这样的：

```
let functionName = function(arg0, arg1, arg2) {
  // 函数体
};
```

函数表达式看起来就像一个普通的变量定义和赋值，即创建一个函数再把它赋值给一个变量`functionName`。这样创建的函数叫作**匿名函数**（anonymous funtion），因为`function`关键字后面没有标识符。（匿名函数有也时候也被称为**兰姆达函数**）。未赋值给其他变量的匿名函数的`name`属性是空字符串。

函数表达式跟JavaScript中的其他表达式一样，需要先赋值再使用。下面的例子会导致错误：

```
sayHi();  // Error! function doesn't exist yet
let sayHi = function() {
  console.log("Hi!");
};
```

理解函数声明与函数表达式之间的区别，关键是理解提升。比如，以下代码的执行结果可能会出乎意料：

```
// 千万别这样做！
if (condition) {
  function sayHi() {
    console.log('Hi!');
  }
} else {
  function sayHi() {
    console.log('Yo!');
  }
}
```

这段代码看起来很正常，就是如果`condition`为`true`，则使用第一个`sayHi()`定义；否则，就使用第二个。事实上，这种写法在ECAMScript中不是有效的语法。JavaScript引擎会尝试将其纠正为适当的声明。问题在于浏览器纠正这个问题的方式并不一致。多数浏览器会忽略`condition`直接返回第二个声明。Firefox会在`condition`为`true`时返回第一个声明。这种写法很危险，不要使用。不过，如果把上面的函数声明换成函数表达式就没问题了：

```
// 没问题
let sayHi;
if (condition) {
  sayHi = function() {
    console.log("Hi!");
  };
} else {
  sayHi = function() {
    console.log("Yo!");
  };
}
```

这个例子可以如预期一样，根据`condition`的值为变量`sayHi`赋予相应的函数。

创建函数并赋值给变量的能力也可以用于在一个函数中把另一个函数当作值返回：

```
function createComparisonFunction(propertyName) {
  return function(object1, object2) {
    let value1 = object1[propertyName];
    let value2 = object2[propertyName];

    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };
}
```

这里的`createComparisonFunction()`函数返回一个匿名函数，这个匿名函数要么被赋值给一个变量，要么可以直接调用。但在`createComparisonFunction()`内部，那个函数是匿名的。任何时候，只要函数被当作值来使用，它就是一个函数表达式。本章后面会介绍，这并不是使用函数表达式的唯一方式。

## 10.12　递归

**递归函数**通常的形式是一个函数通过名称调用自己，如下面的例子所示：

```
function factorial(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * factorial(num - 1);
  }
}
```

这是经典的递归阶乘函数。虽然这样写是可以的，但如果把这个函数赋值给其他变量，就会出问题：

```
let anotherFactorial = factorial;
factorial = null;
console.log(anotherFactorial(4));  // 报错
```

这里把`factorial()`函数保存在了另一个变量`anotherFactorial`中，然后将`factorial`设置为`null`，于是只保留了一个对原始函数的引用。而在调用`anotherFactorial()`时，要递归调用`factorial()`，但因为它已经不是函数了，所以会出错。在写递归函数时使用`arguments.callee`可以避免这个问题。

`arguments.callee`就是一个指向正在执行的函数的指针，因此可以在函数内部递归调用，如下所示：

```
function factorial(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * arguments.callee(num - 1);
  }
}
```

像这里加粗的这一行一样，把函数名称替换成`arguments.callee`，可以确保无论通过什么变量调用这个函数都不会出问题。因此在编写递归函数时，`arguments.callee`是引用当前函数的首选。

不过，在严格模式下运行的代码是不能访问`arguments.callee`的，因为访问会出错。此时，可以使用命名函数表达式（named function expression）达到目的。比如：

```
const factorial = (function f(num) {
  if (num <= 1) {
    return 1;
  } else {
    return num * f(num - 1);
  }
});
```

这里创建了一个命名函数表达式`f()`，然后将它赋值给了变量`factorial`。即使把函数赋值给另一个变量，函数表达式的名称`f`也不变，因此递归调用不会有问题。这个模式在严格模式和非严格模式下都可以使用。

## 10.13　尾调用优化

ECMAScript 6规范新增了一项内存管理优化机制，让JavaScript引擎在满足条件时可以重用栈帧。具体来说，这项优化非常适合“尾调用”，即外部函数的返回值是一个内部函数的返回值。比如：

```
function outerFunction() {
  return innerFunction(); // 尾调用
}
```

在ES6优化之前，执行这个例子会在内存中发生如下操作。

(1) 执行到`outerFunction`函数体，第一个栈帧被推到栈上。

(2) 执行`outerFunction`函数体，到`return`语句。计算返回值必须先计算`innerFunction`。

(3) 执行到`innerFunction`函数体，第二个栈帧被推到栈上。

(4) 执行`innerFunction`函数体，计算其返回值。

(5) 将返回值传回`outerFunction`，然后`outerFunction`再返回值。

(6) 将栈帧弹出栈外。

在ES6优化之后，执行这个例子会在内存中发生如下操作。

(1) 执行到`outerFunction`函数体，第一个栈帧被推到栈上。

(2) 执行`outerFunction`函数体，到达`return`语句。为求值返回语句，必须先求值`innerFunction`。

(3) 引擎发现把第一个栈帧弹出栈外也没问题，因为`innerFunction`的返回值也是`outerFunction`的返回值。

(4) 弹出`outerFunction`的栈帧。

(5) 执行到`innerFunction`函数体，栈帧被推到栈上。

(6) 执行`innerFunction`函数体，计算其返回值。

(7) 将`innerFunction`的栈帧弹出栈外。

很明显，第一种情况下每多调用一次嵌套函数，就会多增加一个栈帧。而第二种情况下无论调用多少次嵌套函数，都只有一个栈帧。这就是ES6尾调用优化的关键：如果函数的逻辑允许基于尾调用将其销毁，则引擎就会那么做。

> **注意**　现在还没有办法测试尾调用优化是否起作用。不过，因为这是ES6规范所规定的，兼容的浏览器实现都能保证在代码满足条件的情况下应用这个优化。

### 10.13.1　尾调用优化的条件

尾调用优化的条件就是确定外部栈帧真的没有必要存在了。涉及的条件如下：

- 代码在严格模式下执行；
- 外部函数的返回值是对尾调用函数的调用；
- 尾调用函数返回后不需要执行额外的逻辑；
- 尾调用函数不是引用外部函数作用域中自由变量的闭包。

下面展示了几个违反上述条件的函数，因此都不符号尾调用优化的要求：

```
"use strict";

// 无优化：尾调用没有返回
function outerFunction() {
  innerFunction();
}

// 无优化：尾调用没有直接返回
function outerFunction() {
  let innerFunctionResult = innerFunction();
  return innerFunctionResult;
}

// 无优化：尾调用返回后必须转型为字符串
function outerFunction() {
  return innerFunction().toString();
}

// 无优化：尾调用是一个闭包
function outerFunction() {
  let foo = 'bar';
  function innerFunction() { return foo; }

  return innerFunction();
}
```

下面是几个符合尾调用优化条件的例子：

```
"use strict";

// 有优化：栈帧销毁前执行参数计算
function outerFunction(a, b) {
  return innerFunction(a + b);
}

// 有优化：初始返回值不涉及栈帧
function outerFunction(a, b) {
  if (a < b) {
    return a;
  }
  return innerFunction(a + b);
}

// 有优化：两个内部函数都在尾部
function outerFunction(condition) {
  return condition ? innerFunctionA() : innerFunctionB();
}
```

差异化尾调用和递归尾调用是容易让人混淆的地方。无论是递归尾调用还是非递归尾调用，都可以应用优化。引擎并不区分尾调用中调用的是函数自身还是其他函数。不过，这个优化在递归场景下的效果是最明显的，因为递归代码最容易在栈内存中迅速产生大量栈帧。

> **注意**　之所以要求严格模式，主要因为在非严格模式下函数调用中允许使用`f.arguments`和`f.caller`，而它们都会引用外部函数的栈帧。显然，这意味着不能应用优化了。因此尾调用优化要求必须在严格模式下有效，以防止引用这些属性。

### 10.13.2　尾调用优化的代码

可以通过把简单的递归函数转换为待优化的代码来加深对尾调用优化的理解。下面是一个通过递归计算斐波纳契数列的函数：

```
function fib(n) {
  if (n < 2) {
    return n;
  }

  return fib(n - 1) + fib(n - 2);
}

console.log(fib(0));  // 0
console.log(fib(1));  // 1
console.log(fib(2));  // 1
console.log(fib(3));  // 2
console.log(fib(4));  // 3
console.log(fib(5));  // 5
console.log(fib(6));  // 8
```

显然这个函数不符合尾调用优化的条件，因为返回语句中有一个相加的操作。结果，`fib(n)`的栈帧数的内存复杂度是![O(2^n)](https://private.codecogs.com/gif.latex?O(2^n%29)。因此，即使这么一个简单的调用也可以给浏览器带来麻烦：

```
fib(1000);
```

当然，解决这个问题也有不同的策略，比如把递归改写成迭代循环形式。不过，也可以保持递归实现，但将其重构为满足优化条件的形式。为此可以使用两个嵌套的函数，外部函数作为基础框架，内部函数执行递归：

```
"use strict";

// 基础框架
function fib(n) {
  return fibImpl(0, 1, n);
}

// 执行递归
function fibImpl(a, b, n) {
  if (n === 0) {
    return a;
  }
  return fibImpl(b, a + b, n - 1);
}
```

这样重构之后，就可以满足尾调用优化的所有条件，再调用`fib(1000)`就不会对浏览器造成威胁了。

## 10.14　闭包

匿名函数经常被人误认为是闭包（closure）。**闭包**指的是那些引用了另一个函数作用域中变量的函数，通常是在嵌套函数中实现的。比如，下面是之前展示的`createComparisonFunction()`函数，注意其中加粗的代码：

```
function createComparisonFunction(propertyName) {
  return function(object1, object2) {
    let value1 = object1[propertyName];
    let value2 = object2[propertyName];

    if (value1 < value2) {
      return -1;
    } else if (value1 > value2) {
      return 1;
    } else {
      return 0;
    }
  };
}
```

这里加粗的代码位于内部函数（匿名函数）中，其中引用了外部函数的变量`propertyName`。在这个内部函数被返回并在其他地方被使用后，它仍然引用着那个变量。这是因为内部函数的作用域链包含`createComparisonFunction()`函数的作用域。要理解为什么会这样，可以想想第一次调用这个函数时会发生什么。

本书在第4章曾介绍过作用域链的概念。理解作用域链创建和使用的细节对理解闭包非常重要。在调用一个函数时，会为这个函数调用创建一个执行上下文，并创建一个作用域链。然后用`arguments`和其他命名参数来初始化这个函数的活动对象。外部函数的活动对象是内部函数作用域链上的第二个对象。这个作用域链一直向外串起了所有包含函数的活动对象，直到全局执行上下文才终止。

在函数执行时，要从作用域链中查找变量，以便读、写值。来看下面的代码：

```
function compare(value1, value2) {
  if (value1 < value2) {
    return -1;
  } else if (value1 > value2) {
    return 1;
  } else {
    return 0;
  }
}

let result = compare(5, 10);
```

这里定义的`compare()`函数是在全局上下文中调用的。第一次调用`compare()`时，会为它创建一个包含`arguments`、`value1`和`value2`的活动对象，这个对象是其作用域链上的第一个对象。而全局上下文的变量对象则是`compare()`作用域链上的第二个对象，其中包含`this`、`result`和`compare`。图10-1展示了以上关系。

![{%}](http://www.ituring.com.cn/figures/2020/JavaScriptWebDeve4th/016.png)

**图　10-1**

函数执行时，每个执行上文中都会有一个包含其中变量的对象。全局上下文中的叫变量对象，它会在代码执行期间始终存在。而函数局部上下文中的叫活动对象，只在函数执行期间存在。在定义`compare()`函数时，就会为它创建作用域链，预装载全局变量对象，并保存在内部的`[[Scope]]`中。在调用这个函数时，会创建相应的执行上下文，然后通过复制函数的`[[Scope]]`来创建其作用域链。接着会创建函数的活动对象（用作变量对象）并将其推入作用域链的前端。在这个例子中，这意味着`compare()`函数执行上下文的作用域链中有两个变量对象：局部变量对象和全局变量对象。作用域链其实是一个包含指针的列表，每个指针分别指向一个变量对象，但物理上并不会包含相应的对象。

函数内部的代码在访问变量时，就会使用给定的名称从作用域链中查找变量。函数执行完毕后，局部活动对象会被销毁，内存中就只剩下全局作用域。不过，闭包就不一样了。

在一个函数内部定义的函数会把其包含函数的活动对象添加到自己的作用域链中。因此，在`createComparisonFunction()`函数中，匿名函数的作用域链中实际上包含`createComparisonFunction()`的活动对象。图10-2展示了以下代码执行后的结果。

```
let compare = createComparisonFunction('name');
let result = compare({ name: 'Nicholas' }, { name: 'Matt' });
```

![{%}](http://www.ituring.com.cn/figures/2020/JavaScriptWebDeve4th/017.png)

**图　10-2**

在`createComparisonFunction()`返回匿名函数后，它的作用域链被初始化为包含`createComparisonFunction()`的活动对象和全局变量对象。这样，匿名函数就可以访问到`createComparisonFunction()`可以访问的所有变量。另一个有意思的副作用就是，`createComparisonFunction()`的活动对象并不能在它执行完毕后销毁，因为匿名函数的作用域链中仍然有对它的引用。在`createComparisonFunction()`执行完毕后，其执行上下文的作用域链会销毁，但它的活动对象仍然会保留在内存中，直到匿名函数被销毁后才会被销毁：

```
// 创建比较函数
let compareNames = createComparisonFunction('name');

// 调用函数
let result = compareNames({ name: 'Nicholas' }, { name: 'Matt' });

// 解除对函数的引用，这样就可以释放内存了
compareNames = null;
```

这里，创建的比较函数被保存在变量`compareNames`中。把`compareNames`设置为等于`null`会解除对函数的引用，从而让垃圾回收程序可以将内存释放掉。作用域链也会被销毁，其他作用域（除全局作用域之外）也可以销毁。图10-2展示了调用`compareNames()`之后作用域链之间的关系。

> **注意**　因为闭包会保留它们包含函数的作用域，所以比其他函数更占用内存。过度使用闭包可能导致内存过度占用，因此建议仅在十分必要时使用。V8等优化的JavaScript引擎会努力回收被闭包困住的内存，不过我们还是建议在使用闭包时要谨慎。

### 10.14.1　`this`对象

在闭包中使用`this`会让代码变复杂。如果内部函数没有使用箭头函数定义，则`this`对象会在运行时绑定到执行函数的上下文。如果在全局函数中调用，则`this`在非严格模式下等于`window`，在严格模式下等于`undefined`。如果作为某个对象的方法调用，则`this`等于这个对象。匿名函数在这种情况下不会绑定到某个对象，这就意味着`this`会指向`window`，除非在严格模式下`this`是`undefined`。不过，由于闭包的写法所致，这个事实有时候没有那么容易看出来。来看下面的例子：

```
window.identity = 'The Window';

let object = {
  identity: 'My Object',
  getIdentityFunc() {
    return function() {
      return this.identity;
    };
  }
};

console.log(object.getIdentityFunc()()); // 'The Window'
```

这里先创建了一个全局变量`identity`，之后又创建一个包含`identity`属性的对象。这个对象还包含一个`getIdentityFunc()`方法，返回一个匿名函数。这个匿名函数返回`this.identity`。因为`getIdentityFunc()`返回函数，所以`object.getIdentityFunc()()`会立即调用这个返回的函数，从而得到一个字符串。可是，此时返回的字符串是`"The Winodw"`，即全局变量`identity`的值。为什么匿名函数没有使用其包含作用域（`getIdentityFunc()`）的`this`对象呢？

前面介绍过，每个函数在被调用时都会自动创建两个特殊变量：`this`和`arguments`。内部函数永远不可能直接访问外部函数的这两个变量。但是，如果把`this`保存到闭包可以访问的另一个变量中，则是行得通的。比如：

```
window.identity = 'The Window';

let object = {
  identity: 'My Object',
  getIdentityFunc() {
    let that = this;
    return function() {
      return that.identity;
    };
  }
};

console.log(object.getIdentityFunc()()); // 'My Object'
```

这里加粗的代码展示了与前面那个例子的区别。在定义匿名函数之前，先把外部函数的`this`保存到变量`that`中。然后在定义闭包时，就可以让它访问`that`，因为这是包含函数中名称没有任何冲突的一个变量。即使在外部函数返回之后，`that`仍然指向`object`，所以调用`object.getIdentityFunc()()`就会返回`"My Object"`。

> **注意**　`this`和`arguments`都是不能直接在内部函数中访问的。如果想访问包含作用域中的`arguments`对象，则同样需要将其引用先保存到闭包能访问的另一个变量中。

在一些特殊情况下，`this`值可能并不是我们所期待的值。比如下面这个修改后的例子：

```
window.identity = 'The Window';
let object = {
  identity: 'My Object',
  getIdentity () {
    return this.identity;
  }
};
```

`getIdentity()`方法就是返回`this.identity`的值。以下是几种调用`object.getIdentity()`的方式及返回值：

```
object.getIdentity();                         // 'My Object'
(object.getIdentity)();                       // 'My Object'
(object.getIdentity = object.getIdentity)();  // 'The Window'
```

第一行调用`object.getIdentity()`是正常调用，会返回`"My Object"`，因为`this.identity`就是`object.identity`。第二行在调用时把`object.getIdentity`放在了括号里。虽然加了括号之后看起来是对一个函数的引用，但`this`值并没有变。这是因为按照规范，`object.getIdentity`和`(object.getIdentity)`是相等的。第三行执行了一次赋值，然后再调用赋值后的结果。因为赋值表达式的值是函数本身，`this`值不再与任何对象绑定，所以返回的是`"The Window"`。

一般情况下，不大可能像第二行和第三行这样调用对象上的方法。但通过这个例子，我们可以知道，即使语法稍有不同，也可能影响`this`的值。

### 10.14.2　内存泄漏

由于IE在IE9之前对JScript对象和COM对象使用了不同的垃圾回收机制（第4章讨论过），所以闭包在这些旧版本IE中可能会导致问题。在这些版本的IE中，把HTML元素保存在某个闭包的作用域中，就相当于宣布该元素不能被销毁。来看下面的例子：

```
function assignHandler() {
  let element = document.getElementById('someElement');
  element.onclick = () => console.log(element.id);
}
```

以上代码创建了一个闭包，即`element`元素的事件处理程序（事件处理程序将在第13章讨论）。而这个处理程序又创建了一个循环引用。匿名函数引用着`assignHandler()`的活动对象，阻止了对`element`的引用计数归零。只要这个匿名函数存在，`element`的引用计数就至少等于1。也就是说，内存不会被回收。其实只要这个例子稍加修改，就可以避免这种情况，比如：

```
function assignHandler() {
  let element = document.getElementById('someElement');
  let id = element.id;

  element.onclick = () => console.log(id);

  element = null;
}
```

在这个修改后的版本中，闭包改为引用一个保存着`element.id`的变量`id`，从而消除了循环引用。不过，光有这一步还不足以解决内存问题。因为闭包还是会引用包含函数的活动对象，而其中包含`element`。即使闭包没有直接引用`element`，包含函数的活动对象上还是保存着对它的引用。因此，必须再把`element`设置为`null`。这样就解除了对这个COM对象的引用，其引用计数也会减少，从而确保其内存可以在适当的时候被回收。

## 10.15　立即调用的函数表达式

立即调用的匿名函数又被称作**立即调用的函数表达式**（IIFE，Immediately Invoked Function Expression）。它类似于函数声明，但由于被包含在括号中，所以会被解释为函数表达式。紧跟在第一组括号后面的第二组括号会立即调用前面的函数表达式。下面是一个简单的例子：

```
(function() {
  // 块级作用域
})();
```

使用IIFE可以模拟块级作用域，即在一个函数表达式内部声明变量，然后立即调用这个函数。这样位于函数体作用域的变量就像是在块级作用域中一样。ECMAScript 5尚未支持块级作用域，使用IIFE模拟块级作用域是相当普遍的。比如下面的例子：

```
// IIFE
(function () {
  for (var i = 0; i < count; i++) {
    console.log(i);
  }
})();

console.log(i);  // 抛出错误
```

前面的代码在执行到IIFE外部的`console.log()`时会出错，因为它访问的变量是在IIFE内部定义的，在外部访问不到。在ECMAScript 5.1及以前，为了防止变量定义外泄，IIFE是个非常有效的方式。这样也不会导致闭包相关的内存问题，因为不存在对这个匿名函数的引用。为此，只要函数执行完毕，其作用域链就可以被销毁。

在ECMAScript 6以后，IIFE就没有那么必要了，因为块级作用域中的变量无须IIFE就可以实现同样的隔离。下面展示了两种不同的块级作用域形式：

```
// 内嵌块级作用域
{
  let i;
  for (i = 0; i < count; i++) {
    console.log(i);
  }
}
console.log(i); // 抛出错误

// 循环的块级作用域
for (let i = 0; i < count; i++) {
  console.log(i);
}

console.log(i); // 抛出错误
```

说明IIFE用途的一个实际的例子，就是可以用它锁定参数值。比如：

```
let divs = document.querySelectorAll('div');

// 达不到目的！
for (var i = 0; i < divs.length; ++i) {
  divs[i].addEventListener('click', function() {
    console.log(i);
  });
}
```

这里使用`var`关键字声明了循环迭代变量`i`，但这个变量并不会被限制在`for`循环的块级作用域内。因此，渲染到页面上之后，点击每个`<div>`都会弹出元素总数。这是因为在执行单击处理程序时，迭代变量的值是循环结束时的最终值，即元素的个数。而且，这个变量`i`存在于循环体外部，随时可以访问。

以前，为了实现点击第几个`<div>`就显示相应的索引值，需要借助IIFE来执行一个函数表达式，传入每次循环的当前索引，从而“锁定”点击时应该显示的索引值：

```
let divs = document.querySelectorAll('div');

for (var i = 0; i < divs.length; ++i) {
  divs[i].addEventListener('click', (function(frozenCounter) {
    return function() {
      console.log(frozenCounter);
    };
  })(i));
}
```

而使用ECMAScript块级作用域变量，就不用这么大动干戈了：

```
let divs = document.querySelectorAll('div');

for (let i = 0; i < divs.length; ++i) {
  divs[i].addEventListener('click', function() {
    console.log(i);
  });
}
```

这样就可以让每次点击都显示正确的索引了。这里，事件处理程序执行时就会引用`for`循环块级作用域中的索引值。这是因为在ECMAScript 6中，如果对`for`循环使用块级作用域变量关键字，在这里就是`let`，那么循环就会为每个循环创建独立的变量，从而让每个单击处理程序都能引用特定的索引。

但要注意，如果把变量声明拿到`for`循环外部，那就不行了。下面这种写法会碰到跟在循环中使用`var i = 0`同样的问题：

```
let divs = document.querySelectorAll('div');

// 达不到目的！
let i;
for (i = 0; i < divs.length; ++i) {
  divs[i].addEventListener('click', function() {
    console.log(i);
  });
}
```

## 10.16　私有变量

严格来讲，JavaScript没有私有成员的概念，所有对象属性都公有的。不过，倒是有**私有变量**的概念。任何定义在函数或块中的变量，都可以认为是私有的，因为在这个函数或块的外部无法访问其中的变量。私有变量包括函数参数、局部变量，以及函数内部定义的其他函数。来看下面的例子：

```
function add(num1, num2) {
  let sum = num1 + num2;
  return sum;
}
```

在这个函数中，函数`add()`有3个私有变量：`num1`、`num2`和`sum`。这几个变量只能在函数内部使用，不能在函数外部访问。如果这个函数中创建了一个闭包，则这个闭包能通过其作用域链访问其外部的这3个变量。基于这一点，就可以创建出能够访问私有变量的公有方法。

**特权方法**（privileged method）是能够访问函数私有变量（及私有函数）的公有方法。在对象上有两种方式创建特权方法。第一种是在构造函数中实现，比如：

```
function MyObject() {
  // 私有变量和私有函数
  let privateVariable = 10;

  function privateFunction() {
    return false;
  }

  // 特权方法
  this.publicMethod = function() {
    privateVariable++;
    return privateFunction();
  };
}
```

这个模式是把所有私有变量和私有函数都定义在构造函数中。然后，再创建一个能够访问这些私有成员的特权方法。这样做之所以可行，是因为定义在构造函数中的特权方法其实是一个闭包，它具有访问构造函数中定义的所有变量和函数的能力。在这个例子中，变量`privateVariable`和函数`privateFunction()`只能通过`publicMethod()`方法来访问。在创建`MyObject`的实例后，没有办法直接访问`privateVariable`和`privateFunction()`，唯一的办法是使用`publicMethod()`。

如下面的例子所示，可以定义私有变量和特权方法，以隐藏不能被直接修改的数据：

```
function Person(name) {
  this.getName = function() {
    return name;
  };

  this.setName = function (value) {
    name = value;
  };
}

let person = new Person('Nicholas');
console.log(person.getName());  // 'Nicholas'
person.setName('Greg');
console.log(person.getName());  // 'Greg'
```

这段代码中的构造函数定义了两个特权方法：`getName()`和`setName()`。每个方法都可以构造函数外部调用，并通过它们来读写私有的`name`变量。在`Person`构造函数外部，没有别的办法访问`name`。因为两个方法都定义在构造函数内部，所以它们都是能够通过作用域链访问`name`的闭包。私有变量`name`对每个`Person`实例而言都是独一无二的，因为每次调用构造函数都会重新创建一套变量和方法。不过这样也有个问题：必须通过构造函数来实现这种隔离。正如第8章所讨论的，构造函数模式的缺点是每个实例都会重新创建一遍新方法。使用静态私有变量实现特权方法可以避免这个问题。

### 10.16.1　静态私有变量

特权方法也可以通过使用私有作用域定义私有变量和函数来实现。这个模式如下所示：

```
(function() {
  // 私有变量和私有函数
  let privateVariable = 10;

  function privateFunction() {
    return false;
  }

  // 构造函数
  MyObject = function() {};

  // 公有和特权方法
  MyObject.prototype.publicMethod = function() {
    privateVariable++;
    return privateFunction();
  };
})();
```

在这个模式中，匿名函数表达式创建了一个包含构造函数及其方法的私有作用域。首先定义的是私有变量和私有函数，然后又定义了构造函数和公有方法。公有方法定义在构造函数的原型上，与典型的原型模式一样。注意，这个模式定义的构造函数没有使用函数声明，使用的是函数表达式。函数声明会创建内部函数，在这里并不是必需的。基于同样的原因（但操作相反），这里声明`MyObject`并没有使用任何关键字。因为不使用关键字声明的变量会创建在全局作用域中，所以`MyObject`变成了全局变量，可以在这个私有作用域外部被访问。注意在严格模式下给未声明的变量赋值会导致错误。

这个模式与前一个模式的主要区别就是，私有变量和私有函数是由实例共享的。因为特权方法定义在原型上，所以同样是由实例共享的。特权方法作为一个闭包，始终引用着包含它的作用域。来看下面的例子：

```
(function() {
  let name = '';

  Person = function(value) {
    name = value;
  };

  Person.prototype.getName = function() {
    return name;
  };

  Person.prototype.setName = function(value) {
    name = value;
  };
})();

let person1 = new Person('Nicholas');
console.log(person1.getName());  // 'Nicholas'
person1.setName('Matt');
console.log(person1.getName());  // 'Matt'

let person2 = new Person('Michael');
console.log(person1.getName());  // 'Michael'
console.log(person2.getName());  // 'Michael'
```

这里的`Person`构造函数可以访问私有变量`name`，跟`getName()`和`setName()`方法一样。使用这种模式，`name`变成了静态变量，可供所有实例使用。这意味着在任何实例上调用`setName()`修改这个变量都会影响其他实例。调用 `setName()`或创建新的`Person`实例都要把`name`变量设置为一个新值。而所有实例都会返回相同的值。

像这样创建静态私有变量可以利用原型更好地重用代码，只是每个实例没有了自己的私有变量。最终，到底是把私有变量放在实例中，还是作为静态私有变量，都需要根据自己的需求来确定。

> **注意**　使用闭包和私有变量会导致作用域链变长，作用域链越长，则查找变量所需的时间也越多。

### 10.16.2　模块模式

前面的模式通过自定义类型创建了私有变量和特权方法。而下面要讨论的Douglas Crockford所说的模块模式，则在一个单例对象上实现了相同的隔离和封装。单例对象（singleton）就是只有一个实例的对象。按照惯例，JavaScript是通过对象字面量来创建单例对象的，如下面的例子所示：

```
let singleton = {
  name: value,
  method() {
    // 方法的代码
  }
};
```

模块模式是在单例对象基础上加以扩展，使其通过作用域链来关联私有变量和特权方法。模块模式的样板代码如下：

```
let singleton = function() {
  // 私有变量和私有函数
  let privateVariable = 10;

  function privateFunction() {
    return false;
  }

  // 特权/公有方法和属性
  return {
    publicProperty: true,

    publicMethod() {
      privateVariable++;
      return privateFunction();
    }
  };
}();
```

模块模式使用了匿名函数返回一个对象。在匿名函数内部，首先定义私有变量和私有函数。之后，创建一个要通过匿名函数返回的对象字面量。这个对象字面量中只包含可以公开访问的属性和方法。因为这个对象定义在匿名函数内部，所以它的所有公有方法都可以访问同一个作用域的私有变量和私有函数。本质上，对象字面量定义了单例对象的公共接口。如果单例对象需要进行某种初始化，并且需要访问私有变量时，那就可以采用这个模式：

```
let application = function() {
  // 私有变量和私有函数
  let components = new Array();

  // 初始化
  components.push(new BaseComponent());

  // 公共接口
  return {
    getComponentCount() {
      return components.length;
    },
    registerComponent(component) {
      if (typeof component == 'object') {
        components.push(component);
      }
    }
  };
}();
```

在Web开发中，经常需要使用单例对象管理应用程序级的信息。上面这个简单的例子创建了一个`application`对象用于管理组件。在创建这个对象之后，内部就会创建一个私有的数组`components`，然后将一个`BaseComponent`组件的新实例添加到数组中。（`BaseComponent`组件的代码并不重要，在这里用它只是为了说明模块模式的用法。）对象字面量中定义的`getComponentCount()`和`registerComponent()`方法都是可以访问`components`私有数组的特权方法。前一个方法返回注册组件的数量，后一个方法负责注册新组件。

在模块模式中，单例对象作为一个模块，经过初始化可以包含某些私有的数据，而这些数据又可以通过其暴露的公共方法来访问。以这种方式创建的每个单例对象都是`Object`的实例，因为最终单例都由一个对象字面量来表示。不过这无关紧要，因为单例对象通常是可以全局访问的，而不是作为参数传给函数的，所以可以避免使用`instanceof`操作符确定参数是不是对象类型的需求。

### 10.16.3　模块增强模式

另一个利用模块模式的做法是在返回对象之前先对其进行增强。这适合单例对象需要是某个特定类型的实例，但又必须给它添加额外属性或方法的场景。来看下面的例子：

```
let singleton = function() {
  // 私有变量和私有函数
  let privateVariable = 10;

  function privateFunction() {
    return false;
  }

  // 创建对象
  let object = new CustomType();

  // 添加特权/公有属性和方法
  object.publicProperty = true;

  object.publicMethod = function() {
    privateVariable++;
    return privateFunction();
  };

  // 返回对象
  return object;
}();
```

如果前一节的`application`对象必须是`BaseComponent`的实例，那么就可以使用下面的代码来创建它：

```
let application = function() {
  // 私有变量和私有函数
  let components = new Array();

  // 初始化
  components.push(new BaseComponent());

  // 创建局部变量保存实例
  let app = new BaseComponent();

  // 公共接口
  app.getComponentCount = function() {
    return components.length;
  };

  app.registerComponent = function(component) {
    if (typeof component == "object") {
      components.push(component);
    }
  };

  // 返回实例
  return app;
}();
```

在这个重写的`application`单例对象的例子中，首先定义了私有变量和私有函数，跟之前例子中一样。主要区别在于这里创建了一个名为`app`的变量，其中保存了`BaseComponent`组件的实例。这是最终要变成`application`的那个对象的局部版本。在给这个局部变量`app`添加了能够访问私有变量的公共方法之后，匿名函数返回了这个对象。然后，这个对象被赋值给`application`。

## 10.17　小结

函数是JavaScript编程中最有用也最通用的工具。ECMAScript 6新增了更加强大的语法特性，从而让开发者可以更有效地使用函数。

- 函数表达式与函数声明是不一样的。函数声明要求写出函数名称，而函数表达式并不需要。没有名称的函数表达式也被称为匿名函数。
- ES6新增了类似于函数表达式的箭头函数语法，但两者也有一些重要区别。
- JavaScript中函数定义与调用时的参数极其灵活。`arguments`对象，以及ES6新增的扩展操作符，可以实现函数定义和调用的完全动态化。
- 函数内部也暴露了很多对象和引用，涵盖了函数被谁调用、使用什么调用，以及调用时传入了什么参数等信息。
- JavaScript引擎可以优化符合尾调用条件的函数，以节省栈空间。
- 闭包的作用域链中包含自己的一个变量对象，然后是包含函数的变量对象，直到全局上下文的变量对象。
- 通常，函数作用域及其中的所有变量在函数执行完毕后都会被销毁。
- 闭包在被函数返回之后，其作用域会一直保存在内存中，直到闭包被销毁。
- 函数可以在创建之后立即调用，执行其中代码之后却不留下对函数的引用。
- 立即调用的函数表达式如果不在包含作用域中将返回值赋给一个变量，则其包含的所有变量都会被销毁。
- 虽然JavaScript没有私有对象属性的概念，但可以使用闭包实现公共方法，访问位于包含作用域中定义的变量。
- 可以访问私有变量的公共方法叫作特权方法。
- 特权方法可以使用构造函数或原型模式通过自定义类型中实现，也可以使用模块模式或模块增强模式在单例对象上实现。

## 第 11 章　期约与异步函数

> **本章内容**
>
> - 异步编程
> - 期约
> - 异步函数

ECMAScript 6及之后的几个版本逐步加大了对异步编程机制的支持，提供了令人眼前一亮的新特性。ECMAScript 6新增了正式的`Promise`（期约）引用类型，支持优雅地定义和组织异步逻辑。接下来几个版本增加了使用`async`和`await`关键字定义异步函数的机制。

> **注意**　本章示例将大量使用异步日志输出的方式`setTimeout(console.log, 0, .. params)`，旨在演示执行顺序及其他异步行为。异步输出的内容看起来虽然像是同步输出的，但实际上是异步打印的。这样可以让期约等返回的值达到其最终状态。
>
> 此外，浏览器控制台的输出经常能打印出JavaScript运行中无法获取的对象信息（比如期约的状态）。这个特性在示例中广泛使用，以便辅助读者理解相关概念。

## 11.1　异步编程

同步行为和异步行为的对立统一是计算机科学的一个基本概念。特别是在JavaScript这种单线程事件循环模型中，同步操作与异步操作更是代码所要依赖的核心机制。异步行为是为了优化因计算量大而时间长的操作。如果在等待其他操作完成的同时，即使运行其他指令，系统也能保持稳定，那么这样做就是务实的。

重要的是，异步操作并不一定计算量大或要等很长时间。只要你不想为等待某个异步操作而阻塞线程执行，那么任何时候都可以使用。

### 11.1.1　同步与异步

**同步行为**对应内存中顺序执行的处理器指令。每条指令都会严格按照它们出现的顺序来执行，而每条指令执行后也能立即获得存储在系统本地（如寄存器或系统内存）的信息。这样的执行流程容易分析程序在执行到代码任意位置时的状态（比如变量的值）。

同步操作的例子可以是执行一次简单的数学计算：

```
let x = 3;
x = x + 4;
```

在程序执行的每一步，都可以推断出程序的状态。这是因为后面的指令总是在前面的指令完成后才会执行。等到最后一条指定执行完毕，存储在`x`的值就立即可以使用。

这两行JavaScript代码对应的低级指令（从JavaScript到x86）并不难想象。首先，操作系统会在栈内存上分配一个存储浮点数值的空间，然后针对这个值做一次数学计算，再把计算结果写回之前分配的内存中。所有这些指令都是在单个线程中按顺序执行的。在低级指令的层面，有充足的工具可以确定系统状态。

相对地，**异步行为**类似于系统中断，即当前进程外部的实体可以触发代码执行。异步操作经常是必要的，因为强制进程等待一个长时间的操作通常是不可行的（同步操作则必须要等）。如果代码要访问一些高延迟的资源，比如向远程服务器发送请求并等待响应，那么就会出现长时间的等待。

异步操作的例子可以是在定时回调中执行一次简单的数学计算：

```
let x = 3;
setTimeout(() => x = x + 4, 1000);
```

这段程序最终与同步代码执行的任务一样，都是把两个数加在一起，但这一次执行线程不知道`x`值何时会改变，因为这取决于回调何时从消息队列出列并执行。

异步代码不容易推断。虽然这个例子对应的低级代码最终跟前面的例子没什么区别，但第二个指令块（加操作及赋值操作）是由系统计时器触发的，这会生成一个入队执行的中断。到底什么时候会触发这个中断，这对JavaScript运行时来说是一个黑盒，因此实际上无法预知（尽管可以保证这发生在当前线程的同步代码执行**之后**，否则回调都没有机会出列被执行）。无论如何，在排定回调以后基本没办法知道系统状态何时变化。

为了让后续代码能够使用`x`，异步执行的函数需要在更新`x`的值以后通知其他代码。如果程序不需要这个值，那么就只管继续执行，不必等待这个结果了。

设计一个能够知道`x`什么时候可以读取的系统是非常难的。JavaScript在实现这样一个系统的过程中也经历了几次迭代。

### 11.1.2　以往的异步编程模式

异步行为是JavaScript的基础，但以前的实现不理想。在早期的JavaScript中，只支持定义回调函数来表明异步操作完成。串联多个异步操作是一个常见的问题，通常需要深度嵌套的回调函数（俗称“回调地狱”）来解决。

假设有以下异步函数，使用了`setTimeout`在一秒钟之后执行某些操作：

```
function double(value) {
  setTimeout(() => setTimeout(console.log, 0, value * 2), 1000);
}

double(3);
// 6（大约1000毫秒之后）
```

这里的代码没什么神秘的，但关键是理解为什么说它是一个异步函数。`setTimeout`可以定义一个在指定时间之后会被调度执行的回调函数。对这个例子而言，1000毫秒之后，JavaScript运行时会把回调函数推到自己的消息队列上去等待执行。推到队列之后，回调什么时候出列被执行对JavaScript代码就完全不可见了。还有一点，`double()`函数在`setTimeout`成功调度异步操作之后会立即退出。

1. **异步返回值**

   假设`setTimeout`操作会返回一个有用的值。有什么好办法把这个值传给需要它的地方？广泛接受的一个策略是给异步操作提供一个回调，这个回调中包含要使用异步返回值的代码（作为回调的参数）。

   ```
   function double(value, callback) {
     setTimeout(() => callback(value * 2), 1000);
   }
   
   double(3, (x) => console.log(`I was given: ${x}`));
   // I was given: 6（大约1000毫秒之后）
   ```

   这里的`setTimeout`调用告诉JavaScript运行时在1000毫秒之后把一个函数推到消息队列上。这个函数会由运行时负责异步调度执行。而位于函数闭包中的回调及其参数在异步执行时仍然是可用的。
   
2. **失败处理**

   异步操作的失败处理在回调模型中也要考虑，因此自然就出现了成功回调和失败回调：

   ```
   function double(value, success, failure) {
     setTimeout(() => {
       try {
         if (typeof value !== 'number') {
           throw 'Must provide number as first argument';
         }
         success(2 * value);
       } catch (e) {
         failure(e);
       }
     }, 1000);
   }
   
   const successCallback = (x) => console.log(`Success: ${x}`);
   const failureCallback = (e) => console.log(`Failure: ${e}`);
   
   double(3, successCallback, failureCallback);
   double('b', successCallback, failureCallback);
   
   // Success: 6（大约1000毫秒之后）
   // Failure: Must provide number as first argument（大约1000毫秒之后）
   ```

   这种模式已经不可取了，因为必须在初始化异步操作时定义回调。异步函数的返回值只在短时间内存在，只有预备好将这个短时间内存在的值作为参数的回调才能接收到它。
   
3. **嵌套异步回调**

   如果异步返值又依赖另一个异步返回值，那么回调的情况还会进一步变复杂。在实际的代码中，这就要求嵌套回调：

   ```
   function double(value, success, failure) {
     setTimeout(() => {
       try {
         if (typeof value !== 'number') {
           throw 'Must provide number as first argument';
         }
         success(2 * value);
       } catch (e) {
         failure(e);
       }
     }, 1000);
   }
   
   const successCallback = (x) => {
     double(x, (y) => console.log(`Success: ${y}`));
   };
   const failureCallback = (e) => console.log(`Failure: ${e}`);
   
   double(3, successCallback, failureCallback);
   
   // Success: 12（大约1000毫秒之后）
   ```

   显然，随着代码越来越复杂，回调策略是不具有扩展性的。“回调地狱”这个称呼可谓名至实归。嵌套回调的代码维护起来就是噩梦。

## 11.2　期约

期约是对尚不存在结果的一个替身。期约（promise）这个名字最早是由Daniel Friedman和David Wise在他们于1976年发表的论文“The Impact of Applicative Programming on Multiprocessing”中提出来的。但直到十几年以后，Barbara Liskov和Liuba Shrira在1988年发表了论文“Promises—Linguistic Support for Efficient Asynchronous Procedure Calls in Distributed Systems”，这个概念才真正确立下来。同一时期的计算机科学家还使用了“终局”（eventual）、“期许”（future）、“延迟”（delay）和“迟付”（deferred）等术语指代同样的概念。所有这些概念描述的都是一种异步程序执行的机制。

### 11.2.1　Promises/A+规范

早期的期约机制在jQuery和Dojo中是以Deferred API的形式出现的。到了2010年，CommonJS项目实现的Promises/A规范日益流行起来。Q和Bluebird等第三方JavaScript期约库也越来越得到社区认可，虽然这些库的实现多少都有些不同。为弥合现有实现之间的差异，2012年Promises/A+组织分叉（fork）了CommonJS的Promises/A建议，并以相同的名字制定了Promises/A+规范。这个规范最终成为了ECMAScript 6规范实现的范本。

ECMAScript 6增加了对Promises/A+规范的完善支持，即`Promise`类型。一经推出，`Promise`就大受欢迎，成为了主导性的异步编程机制。所有现代浏览器都支持ES6期约，很多其他浏览器API（如`fetch()`和电池API）也以期约为基础。

### 11.2.2　期约基础

ECMAScript 6新增的引用类型`Promise`，可以通过`new`操作符来实例化。创建新期约时需要传入执行器（executor）函数作为参数（后面马上会介绍），下面的例子使用了一个空函数对象来应付一下解释器：

```
let p = new Promise(() => {});
setTimeout(console.log, 0, p);  // Promise <pending>
```

之所以说是应付解释器，是因为如果不提供执行器函数，就会抛出`SyntaxError`。

1. **期约状态机**

   在把一个期约实例传给`console.log()`时，控制台输出（可能因浏览器不同而略有差异）表明该实例处于**待定**（pending）状态。如前所述，期约是一个有状态的对象，可能处于如下3种状态之一：

   - 待定（pending）
   - 兑现（fulfilled，有时候也称为“解决”，resolved）
   - 拒绝（rejected）

   **待定**（pending）是期约的最初始状态。在待定状态下，期约可以**落定**（settled）为代表成功的**兑现**（fulfilled）状态，或者代表失败的**拒绝**（rejected）状态。无论落定为哪种状态都是不可逆的。只要从待定转换为兑现或拒绝，期约的状态就不再改变。而且，也不能保证期约必然会脱离待定状态。因此，组织合理的代码无论期约解决（resolve）还是拒绝（reject），甚至永远处于待定（pending）状态，都应该具有恰当的行为。

   重要的是，期约的状态是私有的，不能直接通过JavaScript检测到。这主要是为了避免根据读取到的期约状态，以同步方式处理期约对象。另外，期约的状态也不能被外部JavaScript代码修改。这与不能读取该状态的原因是一样的：期约故意将异步行为封装起来，从而隔离外部的同步代码。
   
2. **解决值、拒绝理由及期约用例**

   期约主要有两大用途。首先是抽象地表示一个异步操作。期约的状态代表期约是否完成。“待定”表示尚未开始或者正在执行中。“兑现”表示已经成功完成，而“拒绝”则表示没有成功完成。

   某些情况下，这个状态机就是期约可以提供的最有用的信息。知道一段异步代码已经完成，对于其他代码而言已经足够了。比如，假设期约要向服务器发送一个HTTP请求。请求返回200~299范围内的状态码就足以让期约的状态变为“兑现”。类似地，如果请求返回的状态码不在200~299这个范围内，那么就会把期约状态切换为“拒绝”。

   在另外一些情况下，期约封装的异步操作会实际生成某个值，而程序期待期约状态改变时可以访问这个值。相应地，如果期约被拒绝，程序就会期待期约状态改变时可以拿到拒绝的理由。比如，假设期约向服务器发送一个HTTP请求并预定会返回一个JSON。如果请求返回范围在200~299的状态码，则足以让期约的状态变为兑现。此时期约内部就可以收到一个JSON字符串。类似地，如果请求返回的状态码不在200~299这个范围内，那么就会把期约状态切换为拒绝。此时拒绝的理由可能是一个`Error`对象，包含着HTTP状态码及相关错误消息。

   为了支持这两种用例，每个期约只要状态切换为兑现，就会有一个私有的内部**值**（value）。类似地，每个期约只要状态切换为拒绝，就会有一个私有的内部**理由**（reason）。无论是值还是理由，都是包含原始值或对象的不可修改的引用。二者都是可选的，而且默认值为`undefined`。在期约到达某个落定状态时执行的异步代码始终会收到这个值或理由。
   
3. **通过执行函数控制期约状态**

   由于期约的状态是私有的，所以只能在内部进行操作。内部操作在期约的执行器函数中完成。执行器函数主要有两项职责：初始化期约的异步行为和控制状态的最终转换。其中，控制期约状态的转换是通过调用它的两个函数参数实现的。这两个函数参数通常都命名为`resolve()`和`reject()`。调用`resolve()`会把状态切换为兑现，调用`reject()`会把状态切换为拒绝。另外，调用`reject()`也会抛出错误（后面会讨论这个错误）。

   ```
   let p1 = new Promise((resolve, reject) => resolve());
   setTimeout(console.log, 0, p1); // Promise <resolved>
   
   let p2 = new Promise((resolve, reject) => reject());
   setTimeout(console.log, 0, p2); // Promise <rejected>
   // Uncaught error (in promise)
   ```

   在前面的例子中，并没有什么异步操作，因为在初始化期约时，执行器函数已经改变了每个期约的状态。这里的关键在于，执行器函数是**同步**执行的。这是因为执行器函数是期约的初始化程序。通过下面的例子可以看出上面代码的执行顺序：

   ```
   new Promise(() => setTimeout(console.log, 0, 'executor'));
   setTimeout(console.log, 0, 'promise initialized');
   
   // executor
   // promise initialized
   ```

   添加`setTimeout`可以推迟切换状态：

   ```
   let p = new Promise((resolve, reject) => setTimeout(resolve, 1000));
   
   // 在console.log打印期约实例的时候，还不会执行超时回调（即resolve()）
   setTimeout(console.log, 0, p);  // Promise <pending>
   ```

   无论`resolve()`和`reject()`中的哪个被调用，状态转换都不可撤销了。于是继续修改状态会静默失败，如下所示：

   ```
   let p = new Promise((resolve, reject) => {
     resolve();
     reject(); // 没有效果
   });
   
   setTimeout(console.log, 0, p); // Promise <resolved>
   ```

   为避免期约卡在待定状态，可以添加一个定时退出功能。比如，可以通过`setTimeout`设置一个10秒钟后无论如何都会拒绝期约的回调：

   ```
   let p = new Promise((resolve, reject) => {
     setTimeout(reject, 10000);  // 10秒后调用reject()
     // 执行函数的逻辑
   });
   
   setTimeout(console.log, 0, p);      // Promise <pending>
   setTimeout(console.log, 11000, p);  // 11秒后再检查状态
   
   // (After 10 seconds) Uncaught error
   // (After 11 seconds) Promise <rejected>
   ```

   因为期约的状态只能改变一次，所以这里的超时拒绝逻辑中可以放心地设置让期约处于待定状态的最长时间。如果执行器中的代码在超时之前已经解决或拒绝，那么超时回调再尝试拒绝也会静默失败。
   
4. **`Promise.resolve()`**

   期约并非一开始就必须处于待定状态，然后通过执行器函数才能转换为落定状态。通过调用`Promise.resolve()`静态方法，可以实例化一个解决的期约。下面两个期约实例实际上是一样的：

   ```
   let p1 = new Promise((resolve, reject) => resolve());
   let p2 = Promise.resolve();
   ```

   这个解决的期约的值对应着传给`Promise.resolve()`的第一个参数。使用这个静态方法，实际上可以把任何值都转换为一个期约：

   ```
   setTimeout(console.log, 0, Promise.resolve());
   // Promise <resolved>: undefined
   
   setTimeout(console.log, 0, Promise.resolve(3));
   // Promise <resolved>: 3
   
   // 多余的参数会忽略
   setTimeout(console.log, 0, Promise.resolve(4, 5, 6));
   // Promise <resolved>: 4
   ```

   对这个静态方法而言，如果传入的参数本身是一个期约，那它的行为就类似于一个空包装。因此，`Promise.resolve()`可以说是一个幂等方法，如下所示：

   ```
   let p = Promise.resolve(7);
   
   setTimeout(console.log, 0, p === Promise.resolve(p));
   // true
   
   setTimeout(console.log, 0, p === Promise.resolve(Promise.resolve(p)));
   // true
   ```

   这个幂等性会保留传入期约的状态：

   ```
   let p = new Promise(() => {});
   
   setTimeout(console.log, 0, p);                   // Promise <pending>
   setTimeout(console.log, 0, Promise.resolve(p));  // Promise <pending>
   
   setTimeout(console.log, 0, p === Promise.resolve(p)); // true
   ```

   注意，这个静态方法能够包装任何非期约值，包括错误对象，并将其转换为解决的期约。因此，也可能导致不符合预期的行为：

   ```
   let p = Promise.resolve(new Error('foo'));
   
   setTimeout(console.log, 0, p);
   // Promise <resolved>: Error: foo
   ```

    

5. **`Promise.reject()`**

   与`Promise.resolve()`类似，`Promise.reject()`会实例化一个拒绝的期约并抛出一个异步错误（这个错误不能通过`try`/`catch`捕获，而只能通过拒绝处理程序捕获）。下面的两个期约实例实际上是一样的：

   ```
   let p1 = new Promise((resolve, reject) => reject());
   let p2 = Promise.reject();
   ```

   这个拒绝的期约的理由就是传给`Promise.reject()`的第一个参数。这个参数也会传给后续的拒绝处理程序：

   ```
   let p = Promise.reject(3);
   setTimeout(console.log, 0, p); // Promise <rejected>: 3
   
   p.then(null, (e) => setTimeout(console.log, 0, e)); // 3
   ```

   关键在于，`Promise.reject()`并没有照搬`Promise.resolve()`的幂等逻辑。如果给它传一个期约对象，则这个期约会成为它返回的拒绝期约的理由：

   ```
   setTimeout(console.log, 0, Promise.reject(Promise.resolve()));
   // Promise <rejected>: Promise <resolved>
   ```

    

6. **同步/异步执行的二元性**

   `Promise`的设计很大程度上会导致一种完全不同于JavaScript的计算模式。下面的例子完美地展示了这一点，其中包含了两种模式下抛出错误的情形：

   ```
   try {
     throw new Error('foo');
   } catch(e) {
     console.log(e); // Error: foo
   }
   
   try {
     Promise.reject(new Error('bar'));
   } catch(e) {
     console.log(e);
   }
   // Uncaught (in promise) Error: bar
   ```

   第一个`try`/`catch`抛出并捕获了错误，第二个`try`/`catch`抛出错误却**没有**捕获到。乍一看这可能有点违反直觉，因为代码中确实是同步创建了一个拒绝的期约实例，而这个实例也抛出了包含拒绝理由的错误。这里的同步代码之所以没有捕获期约抛出的错误，是因为它没有通过**异步模式**捕获错误。从这里就可以看出期约真正的异步特性：它们是同步对象（在同步执行模式中使用），但也是**异步**执行模式的媒介。

   在前面的例子中，拒绝期约的错误并没有抛到执行同步代码的线程里，而是通过浏览器异步消息队列来处理的。因此，`try`/`catch`块并不能捕获该错误。代码一旦开始以异步模式执行，则唯一与之交互的方式就是使用异步结构——更具体地说，就是期约的方法。

### 11.2.3　期约的实例方法

期约实例的方法是连接外部同步代码与内部异步代码之间的桥梁。这些方法可以访问异步操作返回的数据，处理期约成功和失败的输出，连续对期约求值，或者添加只有期约进入终止状态时才会执行的代码。

1. **实现`Thenable`接口**

   在ECMAScript暴露的异步结构中，任何对象都有一个`then()`方法。这个方法被认为实现了`Thenable`接口。下面的例子展示了实现这一接口的最简单的类：

   ```
   class MyThenable {
     then() {}
   }
   ```

   ECMAScript的`Promise`类型实现了`Thenable`接口。这个简化的接口跟TypeScript或其他包中的接口或类型定义不同，它们都设定了`Thenbale`接口更具体的形式。

   > **注意**　本章后面再介绍异步函数时还会再谈到`Thenable`接口的用途和目的。

    

2. **`Promise.prototype.then()`**

   `Promise.prototype.then()`是为期约实例添加处理程序的主要方法。这个`then()`方法接收最多两个参数：`onResolved`处理程序和`onRejected`处理程序。这两个参数都是可选的，如果提供的话，则会在期约分别进入“兑现”和“拒绝”状态时执行。

   ```
   function onResolved(id) {
     setTimeout(console.log, 0, id, 'resolved');
   }
   function onRejected(id) {
     setTimeout(console.log, 0, id, 'rejected');
   }
   
   let p1 = new Promise((resolve, reject) => setTimeout(resolve, 3000));
   let p2 = new Promise((resolve, reject) => setTimeout(reject, 3000));
   
   p1.then(() => onResolved('p1'),
           () => onRejected('p1'));
   p2.then(() => onResolved('p2'),
           () => onRejected('p2'));
   
   //（3秒后）
   // p1 resolved
   // p2 rejected
   ```

   因为期约只能转换为最终状态一次，所以这两个操作一定是互斥的。

   如前所述，两个处理程序参数都是可选的。而且，传给`then()`的任何非函数类型的参数都会被静默忽略。如果想只提供`onRejected`参数，那就要在`onResolved`参数的位置上传入`undefined`。这样有助于避免在内存中创建多余的对象，对期待函数参数的类型系统也是一个交代。

   ```
   function onResolved(id) {
     setTimeout(console.log, 0, id, 'resolved');
   }
   function onRejected(id) {
     setTimeout(console.log, 0, id, 'rejected');
   }
   
   let p1 = new Promise((resolve, reject) => setTimeout(resolve, 3000));
   let p2 = new Promise((resolve, reject) => setTimeout(reject, 3000));
   
   // 非函数处理程序会被静默忽略，不推荐
   p1.then('gobbeltygook');
   
   // 不传onResolved处理程序的规范写法
   p2.then(null, () => onRejected('p2'));
   
   // p2 rejected（3秒后）
   ```

   `Promise.prototype.then()`方法返回一个新的期约实例：

   ```
   let p1 = new Promise(() => {});
   let p2 = p1.then();
   setTimeout(console.log, 0, p1);         // Promise <pending>
   setTimeout(console.log, 0, p2);         // Promise <pending>
   setTimeout(console.log, 0, p1 === p2);  // false
   ```

   这个新期约实例基于`onResovled`处理程序的返回值构建。换句话说，该处理程序的返回值会通过`Promise.resolve()`包装来生成新期约。如果没有提供这个处理程序，则`Promise.resolve()`就会包装上一个期约解决之后值。如果没有显式的返回语句，则`Promise.resolve()`会包装默认的返回值`undefined`。

   ```
   let p1 = Promise.resolve('foo');
   
   // 若调用then()时不传处理程序，则原样向后传
   let p2 = p1.then();
   setTimeout(console.log, 0, p2); // Promise <resolved>: foo
   
   // 这些都一样
   let p3 = p1.then(() => undefined);
   let p4 = p1.then(() => {});
   let p5 = p1.then(() => Promise.resolve());
   
   setTimeout(console.log, 0, p3);  // Promise <resolved>: undefined
   setTimeout(console.log, 0, p4);  // Promise <resolved>: undefined
   setTimeout(console.log, 0, p5);  // Promise <resolved>: undefined
   ```

   如果有显式的返回值，则`Promise.resolve()`会包装这个值：

   ```
   ...
   
   // 这些都一样
   let p6 = p1.then(() => 'bar');
   let p7 = p1.then(() => Promise.resolve('bar'));
   
   setTimeout(console.log, 0, p6);  // Promise <resolved>: bar
   setTimeout(console.log, 0, p7);  // Promise <resolved>: bar
   
   // Promise.resolve()保留返回的期约
   let p8 = p1.then(() => new Promise(() => {}));
   let p9 = p1.then(() => Promise.reject());
   // Uncaught (in promise): undefined
   
   setTimeout(console.log, 0, p8);  // Promise <pending>
   setTimeout(console.log, 0, p9);  // Promise <rejected>: undefined
   ```

   抛出异常会返回拒绝的期约：

   ```
   ...
   
   let p10 = p1.then(() => { throw 'baz'; });
   // Uncaught (in promise) baz
   
   setTimeout(console.log, 0, p10);  // Promise <rejected> baz
   ```

   注意，返回错误值不会触发上面的拒绝行为，而会把错误对象包装在一个解决的期约中：

   ```
   ...
   
   let p11 = p1.then(() => Error('qux'));
   
   setTimeout(console.log, 0, p11); // Promise <resolved>: Error: qux
   ```

   `onRejected`处理程序也与之类似：`onRejected`处理程序返回的值也会被`Promise.resolve()`包装。乍一看这可能有点违反直觉，但是想一想，`onRejected`处理程序的任务不就是捕获异步错误吗？因此，拒绝处理程序在捕获错误后不抛出异常是符合期约的行为，应该返回一个解决期约。

   下面的代码片段展示了用`Promise.reject()`替代之前例子中的`Promise.resolve()`之后的结果：

   ```
   let p1 = Promise.reject('foo');
   
   // 调用then()时不传处理程序则原样向后传
   let p2 = p1.then();
   // Uncaught (in promise) foo
   
   setTimeout(console.log, 0, p2);  // Promise <rejected>: foo
   
   // 这些都一样
   let p3 = p1.then(null, () => undefined);
   let p4 = p1.then(null, () => {});
   let p5 = p1.then(null, () => Promise.resolve());
   
   setTimeout(console.log, 0, p3); // Promise <resolved>: undefined
   setTimeout(console.log, 0, p4); // Promise <resolved>: undefined
   setTimeout(console.log, 0, p5); // Promise <resolved>: undefined
   　
   　
   　
   // 这些都一样
   let p6 = p1.then(null, () => 'bar');
   let p7 = p1.then(null, () => Promise.resolve('bar'));
   
   setTimeout(console.log, 0, p6); // Promise <resolved>: bar
   setTimeout(console.log, 0, p7); // Promise <resolved>: bar
   
   // Promise.resolve()保留返回的期约
   let p8 = p1.then(null, () => new Promise(() => {}));
   let p9 = p1.then(null, () => Promise.reject());
   // Uncaught (in promise): undefined
   
   setTimeout(console.log, 0, p8); // Promise <pending>
   setTimeout(console.log, 0, p9); // Promise <rejected>: undefined
   　
   　
   　
   let p10 = p1.then(null, () => { throw 'baz'; });
   // Uncaught (in promise) baz
   
   setTimeout(console.log, 0, p10); // Promise <rejected>: baz
   　
   　
   　
   let p11 = p1.then(null, () => Error('qux'));
   
   setTimeout(console.log, 0, p11); // Promise <resolved>: Error: qux
   ```

    

3. **`Promise.prototype.catch()`**

   `Promise.prototype.catch()`方法用于给期约添加拒绝处理程序。这个方法只接收一个参数：`onRejected`处理程序。事实上，这个方法就是一个语法糖，调用它就相当于调用`Promise.prototype.then(null, onRejected)`。

   下面的代码展示了这两种同样的情况：

   ```
   let p = Promise.reject();
   let onRejected = function(e) {
     setTimeout(console.log, 0, 'rejected');
   };
   
   // 这两种添加拒绝处理程序的方式是一样的：
   p.then(null, onRejected);  // rejected
   p.catch(onRejected);       // rejected
   ```

   `Promise.prototype.catch()`返回一个新的期约实例：

   ```
   let p1 = new Promise(() => {});
   let p2 = p1.catch();
   setTimeout(console.log, 0, p1);         // Promise <pending>
   setTimeout(console.log, 0, p2);         // Promise <pending>
   setTimeout(console.log, 0, p1 === p2);  // false
   ```

   在返回新期约实例方面，`Promise.prototype.catch()`的行为与`Promise.prototype.then()`的`onRejected`处理程序是一样的。
   
4. **`Promise.prototype.finally()`**

   `Promise.prototype.finally()`方法用于给期约添加`onFinally`处理程序，这个处理程序在期约转换为解决**或**拒绝状态时都会执行。这个方法可以避免`onResolved`和`onRejected`处理程序中出现冗余代码。但`onFinally`处理程序没有办法知道期约的状态是解决还是拒绝，所以这个方法主要用于添加清理代码。

   ```
   let p1 = Promise.resolve();
   let p2 = Promise.reject();
   let onFinally = function() {
     setTimeout(console.log, 0, 'Finally!')
   }
   
   p1.finally(onFinally); // Finally
   p2.finally(onFinally); // Finally
   ```

   `Promise.prototype.finally()`方法返回一个新的期约实例：

   ```
   let p1 = new Promise(() => {});
   let p2 = p1.finally();
   setTimeout(console.log, 0, p1);         // Promise <pending>
   setTimeout(console.log, 0, p2);         // Promise <pending>
   setTimeout(console.log, 0, p1 === p2);  // false
   ```

   这个新期约实例不同于`then()`或`catch()`方式返回的实例。因为`onFinally`被设计为一个状态无关的方法，所以多数情况下它都会原样后传父期约。无论父期约是解决还是拒绝，都会原样后传。

   ```
   let p1 = Promise.resolve('foo');
   
   // 这里都会原样后传
   let p2 = p1.finally();
   let p3 = p1.finally(() => undefined);
   let p4 = p1.finally(() => {});
   let p5 = p1.finally(() => Promise.resolve());
   let p6 = p1.finally(() => 'bar');
   let p7 = p1.finally(() => Promise.resolve('bar'));
   let p8 = p1.finally(() => Error('qux'));
   
   setTimeout(console.log, 0, p2);  // Promise <resolved>: foo
   setTimeout(console.log, 0, p3);  // Promise <resolved>: foo
   setTimeout(console.log, 0, p4);  // Promise <resolved>: foo
   setTimeout(console.log, 0, p5);  // Promise <resolved>: foo
   setTimeout(console.log, 0, p6);  // Promise <resolved>: foo
   setTimeout(console.log, 0, p7);  // Promise <resolved>: foo
   setTimeout(console.log, 0, p8);  // Promise <resolved>: foo
   ```

   如果返回的是一个待定的期约，或者`onFinally`处理程序抛出了错误（显式抛出或返回了一个拒绝期约），则会返回相应的期约（待定或拒绝），如下所示：

   ```
   ...
   
   // Promise.resolve()保留返回的期约
   let p9 = p1.finally(() => new Promise(() => {}));
   let p10 = p1.finally(() => Promise.reject());
   // Uncaught (in promise): undefined
   
   setTimeout(console.log, 0, p9);  // Promise <pending>
   setTimeout(console.log, 0, p10); // Promise <rejected>: undefined
   
   let p11 = p1.finally(() => { throw 'baz'; });
   // Uncaught (in promise) baz
   
   setTimeout(console.log, 0, p11); // Promise <rejected>: baz
   ```

   返回待定期约的情形并不常见，这是因为只要期约一解决，新期约仍然会原样后传初始的期约：

   ```
   let p1 = Promise.resolve('foo');
   
   // 忽略解决的值
   let p2 = p1.finally(
     () => new Promise((resolve, reject) => setTimeout(() => resolve('bar'), 100)));
   
   setTimeout(console.log, 0, p2); // Promise <pending>
   
   setTimeout(() => setTimeout(console.log, 0, p2), 200);
   
   // 200毫秒后：
   // Promise <resolved>: foo
   ```

    

5. **非重入期约方法**

   当期约进入落定状态时，与该状态相关的处理程序仅仅会被**排期**，而非立即执行。跟在添加这个处理程序的代码之后的同步代码一定会在处理程序之前先执行。即使期约一开始就是与附加处理程序关联的状态，执行顺序也是这样的。这个特性由JavaScript运行时保证，被称为“非重入”（non-reentrancy）特性。下面的例子演示了这个特性：

   ```
   // 创建解决的期约
   let p = Promise.resolve();
   
   // 添加解决处理程序
   // 直觉上，这个处理程序会等期约一解决就执行
   p.then(() => console.log('onResolved handler'));
   
   // 同步输出，证明then()已经返回
   console.log('then() returns');
   
   // 实际的输出：
   // then() returns
   // onResolved handler
   ```

   在这个例子中，在一个解决期约上调用`then()`会把`onResolved`处理程序推进消息队列。但这个处理程序在当前线程上的同步代码执行完成前不会执行。因此，跟在`then()`后面的同步代码一定先于处理程序执行。

   先添加处理程序后解决期约也是一样的。如果添加处理程序后，同步代码才改变期约状态，那么处理程序仍然会基于该状态变化表现出非重入特性。下面的例子展示了即使先添加了`onResolved`处理程序，再同步调用`resolve()`，处理程序也不会进入同步线程执行：

   ```
   let synchronousResolve;
   
   // 创建一个期约并将解决函数保存在一个局部变量中
   let p = new Promise((resolve) => {
     synchronousResolve = function() {
       console.log('1: invoking resolve()');
       resolve();
       console.log('2: resolve() returns');
     };
   });
   
   p.then(() => console.log('4: then() handler executes'));
   
   synchronousResolve();
   console.log('3: synchronousResolve() returns');
   
   // 实际的输出：
   // 1: invoking resolve()
   // 2: resolve() returns
   // 3: synchronousResolve() returns
   // 4: then() handler executes
   ```

   在这个例子中，即使期约状态变化发生在添加处理程序之后，处理程序也会等到运行的消息队列让它出列时才会执行。

   非重入适用于`onResolved`/`onRejected`处理程序、`catch()`处理程序和`finally()`处理程序。下面的例子演示了这些处理程序都只能异步执行：

   ```
   let p1 = Promise.resolve();
   p1.then(() => console.log('p1.then() onResolved'));
   console.log('p1.then() returns');
   
   let p2 = Promise.reject();
   p2.then(null, () => console.log('p2.then() onRejected'));
   console.log('p2.then() returns');
   
   let p3 = Promise.reject();
   p3.catch(() => console.log('p3.catch() onRejected'));
   console.log('p3.catch() returns');
   
   let p4 = Promise.resolve();
   p4.finally(() => console.log('p4.finally() onFinally'));
   
   console.log('p4.finally() returns');
   
   // p1.then() returns
   // p2.then() returns
   // p3.catch() returns
   // p4.finally() returns
   // p1.then() onResolved
   // p2.then() onRejected
   // p3.catch() onRejected
   // p4.finally() onFinally
   ```

    

6. **邻近处理程序的执行顺序**

   如果给期约添加了多个处理程序，当期约状态变化时，相关处理程序会按照添加它们的顺序依次执行。无论是`then()`、`catch()`还是`finally()`添加的处理程序都是如此。

   ```
   let p1 = Promise.resolve();
   let p2 = Promise.reject();
   
   p1.then(() => setTimeout(console.log, 0, 1));
   p1.then(() => setTimeout(console.log, 0, 2));
   // 1
   // 2
   
   p2.then(null, () => setTimeout(console.log, 0, 3));
   p2.then(null, () => setTimeout(console.log, 0, 4));
   // 3
   // 4
   
   p2.catch(() => setTimeout(console.log, 0, 5));
   p2.catch(() => setTimeout(console.log, 0, 6));
   // 5
   // 6
   
   p1.finally(() => setTimeout(console.log, 0, 7));
   p1.finally(() => setTimeout(console.log, 0, 8));
   // 7
   // 8
   ```

    

7. **传递解决值和拒绝理由**

   到了落定状态后，期约会提供其解决值（如果兑现）或其拒绝理由（如果拒绝）给相关状态的处理程序。拿到返回值后，就可以进一步对这个值进行操作。比如，第一次网络请求返回的JSON是发送第二次请求必需的数据，那么第一次请求返回的值就应该传给`onResolved`处理程序继续处理。当然，失败的网络请求也应该把HTTP状态码传给`onRejected`处理程序。

   在执行函数中，解决的值和拒绝的理由是分别作为`resolve()`和`reject()`的第一个参数往后传的。然后，这些值又会传给它们各自的处理程序，作为`onResolved`或`onRejected`处理程序的唯一参数。下面的例子展示了上述传递过程：

   ```
   let p1 = new Promise((resolve, reject) => resolve('foo'));
   p1.then((value) => console.log(value));    // foo
   
   let p2 = new Promise((resolve, reject) => reject('bar'));
   p2.catch((reason) => console.log(reason));  // bar
   ```

   `Promise.resolve()`和`Promise.reject()`在被调用时就会接收解决值和拒绝理由。同样地，它们返回的期约也会像执行器一样把这些值传给`onResolved`或`onRejected`处理程序：

   ```
   let p1 = Promise.resolve('foo');
   p1.then((value) => console.log(value));   // foo
   
   let p2 = Promise.reject('bar');
   p2.catch((reason) => console.log(reason)); // bar
   ```

    

8. **拒绝期约与拒绝错误处理**

   拒绝期约类似于`throw()`表达式，因为它们都代表一种程序状态，即需要中断或者特殊处理。在期约的执行函数或处理程序中抛出错误会导致拒绝，对应的错误对象会成为拒绝的理由。因此以下这些期约都会以一个错误对象为由被拒绝：

   ```
   let p1 = new Promise((resolve, reject) => reject(Error('foo')));
   let p2 = new Promise((resolve, reject) => { throw Error('foo'); });
   let p3 = Promise.resolve().then(() => { throw Error('foo'); });
   let p4 = Promise.reject(Error('foo'));
   
   setTimeout(console.log, 0, p1);  // Promise <rejected>: Error: foo
   setTimeout(console.log, 0, p2);  // Promise <rejected>: Error: foo
   setTimeout(console.log, 0, p3);  // Promise <rejected>: Error: foo
   setTimeout(console.log, 0, p4);  // Promise <rejected>: Error: foo
   　
   　
   // 也会抛出4个未捕获错误
   ```

   期约可以以任何理由拒绝，包括`undefined`，但最好统一使用错误对象。这样做主要是因为创建错误对象可以让浏览器捕获错误对象中的栈追踪信息，而这些信息对调试是非常关键的。例如，前面例子中抛出的4个错误的栈追踪信息如下：

   ```
   Uncaught (in promise) Error: foo
       at Promise (test.html:5)
       at new Promise (<anonymous>)
       at test.html:5
   Uncaught (in promise) Error: foo
       at Promise (test.html:6)
       at new Promise (<anonymous>)
       at test.html:6
   Uncaught (in promise) Error: foo
       at test.html:8
   Uncaught (in promise) Error: foo
       at Promise.resolve.then (test.html:7)
   ```

   所有错误都是异步抛出且未处理的，通过错误对象捕获的栈追踪信息展示了错误发生的路径。注意错误的顺序：`Promise.resolve().then()`的错误最后才出现，这是因为它需要在运行时消息队列中**添加**处理程序；也就是说，在最终抛出未捕获错误之前它还会创建另一个期约。

   这个例子同样揭示了异步错误有意思的副作用。正常情况下，在通过`throw()`关键字抛出错误时，JavaScript运行时的错误处理机制会停止执行抛出错误之后的任何指令：

   ```
   throw Error('foo');
   console.log('bar'); // 这一行不会执行
   
   // Uncaught Error: foo
   ```

   但是，在期约中抛出错误时，因为错误实际上是从消息队列中异步抛出的，所以并不会阻止运行时继续执行同步指令：

   ```
   Promise.reject(Error('foo'));
   console.log('bar');
   // bar
   
   // Uncaught (in promise) Error: foo
   ```

   如本章前面的`Promise.reject()`示例所示，异步错误只能通过异步的`onRejected`处理程序捕获：

   ```
   // 正确
   Promise.reject(Error('foo')).catch((e) => {});
   
   // 不正确
   try {
     Promise.reject(Error('foo'));
   } catch(e) {}
   ```

   这不包括捕获执行函数中的错误，在解决或拒绝期约之前，仍然可以使用`try`/`catch`在执行函数中捕获错误：

   ```
   let p = new Promise((resolve, reject) => {
     try {
       throw Error('foo');
     } catch(e) {}
   
     resolve('bar');
   });
   
   setTimeout(console.log, 0, p); // Promise <resolved>: bar
   ```

   `then()`和`catch()`的`onRejected`处理程序在语义上相当于`try`/`catch`。出发点都是捕获错误之后将其隔离，同时不影响正常逻辑执行。为此，`onRejected`处理程序的任务应该是在捕获异步错误之后返回一个**解决**的期约。下面的例子中对比了同步错误处理与异步错误处理：

   ```
   console.log('begin synchronous execution');
   try {
     throw Error('foo');
   } catch(e) {
     console.log('caught error', e);
   }
   console.log('continue synchronous execution');
   
   // begin synchronous execution
   // caught error Error: foo
   // continue synchronous execution
   　
   　
   　
   new Promise((resolve, reject) => {
     console.log('begin asynchronous execution');
     reject(Error('bar'));
   }).catch((e) => {
     console.log('caught error', e);
   }).then(() => {
     console.log('continue asynchronous execution');
   });
   
   // begin asynchronous execution
   // caught error Error: bar
   // continue asynchronous execution
   ```

### 11.2.4　期约连锁与期约合成

多个期约组合在一起可以构成强大的代码逻辑。这种组合可以通过两种方式实现：期约连锁与期约合成。前者就是一个期约接一个期约地拼接，后者则是将多个期约组合为一个期约。

1. **期约连锁**

   把期约逐个地串联起来是一种非常有用的编程模式。之所以可以这样做，是因为每个期约实例的方法（`then()`、`catch()`和`finally()`）都会返回一个**新的**期约对象，而这个新期约又有自己的实例方法。这样连缀方法调用就可以构成所谓的“期约连锁”。比如：

   ```
   let p = new Promise((resolve, reject) => {
     console.log('first');
     resolve();
   });
   p.then(() => console.log('second'))
    .then(() => console.log('third'))
    .then(() => console.log('fourth'));
   
   // first
   // second
   // third
   // fourth
   ```

   这个实现最终执行了一连串**同步**任务。正因为如此，这种方式执行的任务没有那么有用，毕竟分别使用4个同步函数也可以做到：

   ```
   (() => console.log('first'))();
   (() => console.log('second'))();
   (() => console.log('third'))();
   (() => console.log('fourth'))();
   ```

   要真正执行**异步**任务，可以改写前面的例子，让每个执行器都返回一个期约实例。这样就可以让每个后续期约都等待之前的期约，也就是串行化异步任务。比如，可以像下面这样让每个期约在一定时间后解决：

   ```
   let p1 = new Promise((resolve, reject) => {
     console.log('p1 executor');
     setTimeout(resolve, 1000);
   });
   
   p1.then(() => new Promise((resolve, reject) => {
       console.log('p2 executor');
       setTimeout(resolve, 1000);
     }))
     .then(() => new Promise((resolve, reject) => {
       console.log('p3 executor');
       setTimeout(resolve, 1000);
     }))
     .then(() => new Promise((resolve, reject) => {
       console.log('p4 executor');
       setTimeout(resolve, 1000);
     }));
   
   // p1 executor（1秒后）
   // p2 executor（2秒后）
   // p3 executor（3秒后）
   // p4 executor（4秒后）
   ```

   把生成期约的代码提取到一个工厂函数中，就可以写成这样：

   ```
   function delayedResolve(str) {
     return new Promise((resolve, reject) => {
       console.log(str);
       setTimeout(resolve, 1000);
     });
   }
   
   delayedResolve('p1 executor')
     .then(() => delayedResolve('p2 executor'))
     .then(() => delayedResolve('p3 executor'))
     .then(() => delayedResolve('p4 executor'))
   
   // p1 executor（1秒后）
   // p2 executor（2秒后）
   // p3 executor（3秒后）
   // p4 executor（4秒后）
   ```

   每个后续的处理程序都会等待前一个期约解决，然后实例化一个新期约并返回它。这种结构可以简洁地将异步任务串行化，解决之前依赖回调的难题。假如这种情况下不使用期约，那么前面的代码可能就要这样写了：

   ```
   function delayedExecute(str, callback = null) {
     setTimeout(() => {
       console.log(str);
       callback && callback();
     }, 1000)
   }
   
   delayedExecute('p1 callback', () => {
     delayedExecute('p2 callback', () => {
       delayedExecute('p3 callback', () => {
         delayedExecute('p4 callback');
       });
     });
   });
   
   // p1 callback（1秒后）
   // p2 callback（2秒后）
   // p3 callback（3秒后）
   // p4 callback（4秒后）
   ```

   心明眼亮的开发者会发现，这不正是期约所要解决的回调地狱问题吗？

   因为`then()`、`catch()`和`finally()`都返回期约，所以串联这些方法也很直观。下面的例子同时使用这3个实例方法：

   ```
   let p = new Promise((resolve, reject) => {
     console.log('initial promise rejects');
     reject();
   });
   
   p.catch(() => console.log('reject handler'))
    .then(() => console.log('resolve handler'))
    .finally(() => console.log('finally handler'));
   
   // initial promise rejects
   // reject handler
   // resolve handler
   // finally handler
   ```

    

2. **期约图**

   因为一个期约可以有任意多个处理程序，所以期约连锁可以构建**有向非循环图**的结构。这样，每个期约都是图中的一个节点，而使用实例方法添加的处理程序则是有向顶点。因为图中的每个节点都会等待前一个节点落定，所以图的方向就是期约的解决或拒绝顺序。

   下面的例子展示了一种期约有向图，也就是二叉树：

   ```
   //     A
   //    / \
   //   B   C
   //   /\  /\
   //  D  E   F  G
   
   let A = new Promise((resolve, reject) => {
     console.log('A');
     resolve();
   });
   
   let B = A.then(() => console.log('B'));
   let C = A.then(() => console.log('C'));
   
   B.then(() => console.log('D'));
   B.then(() => console.log('E'));
   C.then(() => console.log('F'));
   C.then(() => console.log('G'));
   
   // A
   // B
   // C
   // D
   // E
   // F
   // G
   ```

   注意，日志的输出语句是对二叉树的层序遍历。如前所述，期约的处理程序是按照它们添加的顺序执行的。由于期约的处理程序是**先**添加到消息队列，**然后**才逐个执行，因此构成了层序遍历。

   树只是期约图的一种形式。考虑到根节点不一定唯一，且多个期约也可以组合成一个期约（通过下一节介绍的`Promise.all()`和`Promise.race()`），所以有向非循环图是体现期约连锁可能性的最准确表达。
   
3. **`Promise.all()`和`Promise.race()`**

   Promise类提供两个将多个期约实例组合成一个期约的静态方法：`Promise.all()`和`Promise.race()`。而合成后期约的行为取决于内部期约的行为。

   - **`Promise.all()`**

     `Promise.all()`静态方法创建的期约会在一组期约全部解决之后再解决。这个静态方法接收一个可迭代对象，返回一个新期约：

     ```
     let p1 = Promise.all([
       Promise.resolve(),
       Promise.resolve()
     ]);
     
     // 可迭代对象中的元素会通过Promise.resolve()转换为期约
     let p2 = Promise.all([3, 4]);
     
     // 空的可迭代对象等价于Promise.resolve()
     let p3 = Promise.all([]);
     
     // 无效的语法
     let p4 = Promise.all();
     // TypeError: cannot read Symbol.iterator of undefined
     ```

     合成的期约只会在每个包含的期约都解决之后才解决：

     ```
     let p = Promise.all([
       Promise.resolve(),
       new Promise((resolve, reject) => setTimeout(resolve, 1000))
     ]);
     setTimeout(console.log, 0, p); // Promise <pending>
     
     p.then(() => setTimeout(console.log, 0, 'all() resolved!'));
     
     // all() resolved!（大约1秒后）
     ```

     如果至少有一个包含的期约待定，则合成的期约也会待定。如果有一个包含的期约拒绝，则合成的期约也会拒绝：

     ```
     // 永远待定
     let p1 = Promise.all([new Promise(() => {})]);
     setTimeout(console.log, 0, p1); // Promise <pending>
     
     // 一次拒绝会导致最终期约拒绝
     let p2 = Promise.all([
       Promise.resolve(),
       Promise.reject(),
       Promise.resolve()
     ]);
     setTimeout(console.log, 0, p2); // Promise <rejected>
     
     // Uncaught (in promise) undefined
     ```

     如果所有期约都成功解决，则合成期约的解决值就是所有包含期约解决值的数组，按照迭代器顺序：

     ```
     let p = Promise.all([
       Promise.resolve(3),
       Promise.resolve(),
       Promise.resolve(4)
     ]);
     
     p.then((values) => setTimeout(console.log, 0, values)); // [3, undefined, 4]
     ```

     如果有期约拒绝，则第一个拒绝的期约会将自己的理由作为合成期约的拒绝理由。之后再拒绝的期约不会影响最终期约的拒绝理由。不过，这并不影响所有包含期约正常的拒绝操作。合成的期约**会**静默处理所有包含期约的拒绝操作，如下所示：

     ```
     // 虽然只有第一个期约的拒绝理由会进入
     // 拒绝处理程序，第二个期约的拒绝也
     // 会被静默处理，不会有错误跑掉
     let p = Promise.all([
       Promise.reject(3),
       new Promise((resolve, reject) => setTimeout(reject, 1000))
     ]);
     
     p.catch((reason) => setTimeout(console.log, 0, reason)); // 3
     
     // 没有未处理的错误
     ```

      

   - **`Promise.race()`**

     `Promise.race()`静态方法返回一个包装期约，是一组集合中最先解决或拒绝的期约的镜像。这个方法接收一个可迭代对象，返回一个新期约：

     ```
     let p1 = Promise.race([
       Promise.resolve(),
       Promise.resolve()
     ]);
     
     // 可迭代对象中的元素会通过Promise.resolve()转换为期约
     let p2 = Promise.race([3, 4]);
     
     // 空的可迭代对象等价于new Promise(() => {})
     let p3 = Promise.race([]);
     
     // 无效的语法
     let p4 = Promise.race();
     // TypeError: cannot read Symbol.iterator of undefined
     ```

     `Promise.race()`不会对解决或拒绝的期约区别对待。无论是解决还是拒绝，只要是第一个落定的期约，`Promise.race()`就会包装其解决值或拒绝理由并返回新期约：

     ```
     // 解决先发生，超时后的拒绝被忽略
     let p1 = Promise.race([
       Promise.resolve(3),
       new Promise((resolve, reject) => setTimeout(reject, 1000))
     ]);
     setTimeout(console.log, 0, p1); // Promise <resolved>: 3
     
     // 拒绝先发生，超时后的解决被忽略
     let p2 = Promise.race([
       Promise.reject(4),
       new Promise((resolve, reject) => setTimeout(resolve, 1000))
     ]);
     setTimeout(console.log, 0, p2); // Promise <rejected>: 4
     
     // 迭代顺序决定了落定顺序
     let p3 = Promise.race([
       Promise.resolve(5),
       Promise.resolve(6),
       Promise.resolve(7)
     ]);
     setTimeout(console.log, 0, p3); // Promise <resolved>: 5
     ```

     如果有一个期约拒绝，只要它是第一个落定的，就会成为拒绝合成期约的理由。之后再拒绝的期约不会影响最终期约的拒绝理由。不过，这并不影响所有包含期约正常的拒绝操作。与`Promise.all()`类似，合成的期约**会**静默处理所有包含期约的拒绝操作，如下所示：

     ```
     // 虽然只有第一个期约的拒绝理由会进入
     // 拒绝处理程序，第二个期约的拒绝也
     // 会被静默处理，不会有错误跑掉
     let p = Promise.race([
       Promise.reject(3),
       new Promise((resolve, reject) => setTimeout(reject, 1000))
     ]);
     
     p.catch((reason) => setTimeout(console.log, 0, reason)); // 3
     
     // 没有未处理的错误
     ```

      

4. **串行期约合成**

   到目前为止，我们讨论期约连锁一直围绕期约的串行执行，忽略了期约的另一个主要特性：异步产生值并将其传给处理程序。基于后续期约使用之前期约的返回值来串联期约是期约的基本功能。这很像**函数合成**，即将多个函数合成为一个函数，比如：

   ```
   function addTwo(x) {return x + 2;}
   function addThree(x) {return x + 3;}
   function addFive(x) {return x + 5;}
   
   function addTen(x) {
     return addFive(addTwo(addThree(x)));
   }
   
   console.log(addTen(7)); // 17
   ```

   在这个例子中，有3个函数基于一个值合成为一个函数。类似地，期约也可以像这样合成起来，渐进地消费一个值，并返回一个结果：

   ```
   function addTwo(x) {return x + 2;}
   function addThree(x) {return x + 3;}
   function addFive(x) {return x + 5;}
   
   function addTen(x) {
     return Promise.resolve(x)
       .then(addTwo)
       .then(addThree)
       .then(addFive);
   }
   
   addTen(8).then(console.log); // 18
   ```

   使用`Array.prototype.reduce()`可以写成更简洁的形式：

   ```
   function addTwo(x) {return x + 2;}
   function addThree(x) {return x + 3;}
   function addFive(x) {return x + 5;}
   
   function addTen(x) {
     return [addTwo, addThree, addFive]
         .reduce((promise, fn) => promise.then(fn), Promise.resolve(x));
   }
   
   addTen(8).then(console.log); // 18
   ```

   这种模式可以提炼出一个通用函数，可以把任意多个函数作为处理程序合成一个连续传值的期约连锁。这个通用的合成函数可以这样实现：

   ```
   function addTwo(x) {return x + 2;}
   function addThree(x) {return x + 3;}
   function addFive(x) {return x + 5;}
   
   function compose(...fns) {
     return (x) => fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(x))
   }
   
   let addTen = compose(addTwo, addThree, addFive);
   
   addTen(8).then(console.log); // 18
   ```

   > **注意**　本章后面的11.3节在讨论异步函数时还会涉及这个概念。

### 11.2.5　期约扩展

ES6期约实现是很可靠的，但它也有不足之处。比如，很多第三方期约库实现中具备而ECMAScript规范却未涉及的两个特性：期约取消和进度追踪。

1. **期约取消**

   我们经常会遇到期约正在处理过程中，程序却不再需要其结果的情形。这时候如果能够取消期约就好了。某些第三方库，比如Bluebird，就提供了这个特性。实际上，TC39委员会也曾准备增加这个特性，但相关提案最终被撤回了。结果，ES6期约被认为是“激进的”：只要期约的逻辑开始执行，就没有办法阻止它执行到完成。

   实际上，可以在现有实现基础上提供一种临时性的封装，以实现取消期约的功能。这可以用到Kevin Smith提到的“取消令牌”（cancel token）。生成的令牌实例提供了一个接口，利用这个接口可以取消期约；同时也提供了一个期约的实例，可以用来触发取消后的操作并求值取消状态。

   下面是`CancelToken`类的一个基本实例：

   ```
   class CancelToken {
     constructor(cancelFn) {
       this.promise = new Promise((resolve, reject) => {
         cancelFn(resolve);
       });
     }
   }
   ```

   这个类包装了一个期约，把解决方法暴露给了`cancelFn`参数。这样，外部代码就可以向构造函数中传入一个函数，从而控制什么情况下可以取消期约。这里期约是令牌类的公共成员，因此可以给它添加处理程序以取消期约。

   这个类大概可以这样使用：

   ```
   <button id="start">Start</button>
   <button id="cancel">Cancel</button>
   
   <script>
   class CancelToken {
     constructor(cancelFn) {
       this.promise = new Promise((resolve, reject) => {
         cancelFn(() => {
           setTimeout(console.log, 0, "delay cancelled");
           resolve();
         });
       });
     }
   }
   
   const startButton = document.querySelector('#start');
   const cancelButton = document.querySelector('#cancel');
   
   function cancellableDelayedResolve(delay) {
     setTimeout(console.log, 0, "set delay");
   
     return new Promise((resolve, reject) => {
       const id = setTimeout((() => {
         setTimeout(console.log, 0, "delayed resolve");
         resolve();
       }), delay);
   
       const cancelToken = new CancelToken((cancelCallback) =>
         cancelButton.addEventListener("click", cancelCallback));
   
       cancelToken.promise.then(() => clearTimeout(id));
     });
   }
   
   startButton.addEventListener("click", () => cancellableDelayedResolve(1000));
   </script>
   ```

   每次单击“Start”按钮都会开始计时，并实例化一个新的`CancelToken`的实例。此时，“Cancel”按钮一旦被点击，就会触发令牌实例中的期约解决。而解决之后，单击“Start”按钮设置的超时也会被取消。
   
2. **期约进度通知**

   执行中的期约可能会有不少离散的“阶段”，在最终解决之前必须依次经过。某些情况下，监控期约的执行进度会很有用。ECMAScript 6期约并不支持进度追踪，但是可以通过扩展来实现。

   一种实现方式是扩展`Promise`类，为它添加`notify()`方法，如下所示：

   ```
   class TrackablePromise extends Promise {
     constructor(executor) {
       const notifyHandlers = [];
   
         super((resolve, reject) => {
         return executor(resolve, reject, (status) => {
           notifyHandlers.map((handler) => handler(status));
         });
       });
   
       this.notifyHandlers = notifyHandlers;
     }
   
     notify(notifyHandler) {
       this.notifyHandlers.push(notifyHandler);
       return this;
     }
   }
   ```

   这样，`TrackablePromise`就可以在执行函数中使用`notify()`函数了。可以像下面这样使用这个函数来实例化一个期约：

   ```
   let p = new TrackablePromise((resolve, reject, notify) => {
     function countdown(x) {
       if (x > 0) {
         notify(`${20 * x}% remaining`);
         setTimeout(() => countdown(x - 1), 1000);
       } else {
         resolve();
       }
     }
   
     countdown(5);
   });
   ```

   这个期约会连续5次递归地设置1000毫秒的超时。每个超时回调都会调用`notify()`并传入状态值。假设通知处理程序简单地这样写：

   ```
   ...
   
   let p = new TrackablePromise((resolve, reject, notify) => {
     function countdown(x) {
       if (x > 0) {
         notify(`${20 * x}% remaining`);
         setTimeout(() => countdown(x - 1), 1000);
       } else {
         resolve();
       }
     }
   
     countdown(5);
   });
   
   p.notify((x) => setTimeout(console.log, 0, 'progress:', x));
   
   p.then(() => setTimeout(console.log, 0, 'completed'));
   
   // （约1秒后）80% remaining
   // （约2秒后）60% remaining
   // （约3秒后）40% remaining
   // （约4秒后）20% remaining
   // （约5秒后）completed
   ```

   `notify()`函数会返回期约，所以可以连缀调用，连续添加处理程序。多个处理程序会针对收到的每条消息分别执行一遍，如下所示：

   ```
   ...
   
   p.notify((x) => setTimeout(console.log, 0, 'a:', x))
    .notify((x) => setTimeout(console.log, 0, 'b:', x));
   
   p.then(() => setTimeout(console.log, 0, 'completed'));
   
   // （约1秒后） a: 80% remaining
   // （约1秒后） b: 80% remaining
   // （约2秒后） a: 60% remaining
   // （约2秒后） b: 60% remaining
   // （约3秒后） a: 40% remaining
   // （约3秒后） b: 40% remaining
   // （约4秒后） a: 20% remaining
   // （约4秒后） b: 20% remaining
   // （约5秒后） completed
   ```

   总体来看，这还是一个比较粗糙的实现，但应该可以演示出如何使用通知报告进度了。

   > **注意**　ES6不支持取消期约和进度通知，一个主要原因就是这样会导致期约连锁和期约合成过度复杂化。比如在一个期约连锁中，如果某个被其他期约依赖的期约被取消了或者发出了通知，那么接下来应该发生什么完全说不清楚。毕竟，如果取消了`Promise.all()`中的一个期约，或者期约连锁中前面的期约发送了一个通知，那么接下来应该怎么办才比较合理呢？

## 11.3　异步函数

异步函数，也称为“async/await”（语法关键字），是ES6期约模式在ECMAScript函数中的应用。async/await是ES8规范新增的。这个特性从行为和语法上都增强了JavaScript，让以同步方式写的代码能够异步执行。下面来看一个最简单的例子，这个期约在超时之后会解决为一个值：

```
let p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3));
```

这个期约在1000毫秒之后解决为数值3。如果程序中的其他代码要在这个值可用时访问它，则需要写一个解决处理程序：

```
let p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3));

p.then((x) => console.log(x));  // 3
```

这其实是很不方便的，因为其他代码都必须塞到期约处理程序中。不过可以把处理程序定义为一个函数：

```
function handler(x) { console.log(x); }

let p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3));

p.then(handler); // 3
```

这个改进其实也不大。这是因为任何需要访问这个期约所产生值的代码，都需要以处理程序的形式来接收这个值。也就是说，代码照样还是要放到处理程序里。ES8为此提供了async/await关键字。

### 11.3.1　异步函数

ES8的async/await旨在解决利用异步结构组织代码的问题。为此，ECMAScript对函数进行了扩展，为其增加了两个新关键字：`async`和`await`。

1. **`async`**

   `async`关键字用于声明异步函数。这个关键字可以用在函数声明、函数表达式、箭头函数和方法上：

   ```
   async function foo() {}
   
   let bar = async function() {};
   
   let baz = async () => {};
   
   class Qux {
     async qux() {}
   }
   ```

   使用`async`关键字可以让函数具有异步特征，但总体上其代码仍然是同步求值的。而在参数或闭包方面，异步函数仍然具有普通JavaScript函数的正常行为。正如下面的例子所示，`foo()`函数仍然会在后面的指令之前被求值：

   ```
   async function foo() {
     console.log(1);
   }
   
   foo();
   console.log(2);
   
   // 1
   // 2
   ```

   不过，异步函数如果使用`return`关键字返回了值（如果没有`return`则会返回`undefined`），这个值会被`Promise.resolve()`包装成一个期约对象。异步函数始终返回期约对象。在函数外部调用这个函数可以得到它返回的期约：

   ```
   async function foo() {
     console.log(1);
     return 3;
   }
   
   // 给返回的期约添加一个解决处理程序
   foo().then(console.log);
   
   console.log(2);
   
   // 1
   // 2
   // 3
   ```

   当然，直接返回一个期约对象也是一样的：

   ```
   async function foo() {
     console.log(1);
     return Promise.resolve(3);
   }
   
   // 给返回的期约添加一个解决处理程序
   foo().then(console.log);
   
   console.log(2);
   
   // 1
   // 2
   // 3
   ```

   异步函数的返回值期待（但实际上并不要求）一个实现`thenable`接口的对象，但常规的值也可以。如果返回的是实现`thenable`接口的对象，则这个对象可以由提供给`then()`的处理程序“解包”。如果不是，则返回值就被当作已经解决的期约。下面的代码演示了这些情况：

   ```
   // 返回一个原始值
   async function foo() {
     return 'foo';
   }
   foo().then(console.log);
   // foo
   
   // 返回一个没有实现thenable接口的对象
   async function bar() {
     return ['bar'];
   }
   bar().then(console.log);
   // ['bar']
   
   // 返回一个实现了thenable接口的非期约对象
   async function baz() {
     const thenable = {
       then(callback) { callback('baz'); }
     };
     return thenable;
   }
   baz().then(console.log);
   // baz
   
   // 返回一个期约
   async function qux() {
     return Promise.resolve('qux');
   }
   qux().then(console.log);
   // qux
   ```

   与在期约处理程序中一样，在异步函数中抛出错误会返回拒绝的期约：

   ```
   async function foo() {
     console.log(1);
     throw 3;
   }
   
   // 给返回的期约添加一个拒绝处理程序
   foo().catch(console.log);
   console.log(2);
   
   // 1
   // 2
   // 3
   ```

   不过，拒绝期约的错误不会被异步函数捕获：

   ```
   async function foo() {
     console.log(1);
     Promise.reject(3);
   }
   
   // Attach a rejected handler to the returned promise
   foo().catch(console.log);
   console.log(2);
   
   // 1
   // 2
   // Uncaught (in promise): 3
   ```

    

2. **`await`**

   因为异步函数主要针对不会马上完成的任务，所以自然需要一种暂停和恢复执行的能力。使用`await`关键字可以暂停异步函数代码的执行，等待期约解决。来看下面这个本章开始就出现过的例子：

   ```
   let p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3));
   
   p.then((x) => console.log(x)); // 3
   ```

   使用async/await可以写成这样：

   ```
   async function foo() {
     let p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3));
     console.log(await p);
   }
   
   foo();
   // 3
   ```

   注意，`await`关键字会暂停执行异步函数后面的代码，让出JavaScript运行时的执行线程。这个行为与生成器函数中的`yield`关键字是一样的。`await`关键字同样是尝试“解包”对象的值，然后将这个值传给表达式，再异步恢复异步函数的执行。

   `await`关键字的用法与JavaScript的一元操作一样。它可以单独使用，也可以在表达式中使用，如下面的例子所示：

   ```
   // 异步打印"foo"
   async function foo() {
     console.log(await Promise.resolve('foo'));
   }
   foo();
   // foo
   　
   　
   // 异步打印"bar"
   async function bar() {
     return await Promise.resolve('bar');
   }
   bar().then(console.log);
   // bar
   
   // 1000毫秒后异步打印"baz"
   async function baz() {
     await new Promise((resolve, reject) => setTimeout(resolve, 1000));
     console.log('baz');
   }
   baz();
   // baz（1000毫秒后）
   ```

   `await`关键字期待（但实际上并不要求）一个实现`thenable`接口的对象，但常规的值也可以。如果是实现`thenable`接口的对象，则这个对象可以由`await`来“解包”。如果不是，则这个值就被当作已经解决的期约。下面的代码演示了这些情况：

   ```
   // 等待一个原始值
   async function foo() {
     console.log(await 'foo');
   }
   foo();
   // foo
   
   // 等待一个没有实现thenable接口的对象
   async function bar() {
     console.log(await ['bar']);
   }
   bar();
   // ['bar']
   
   // 等待一个实现了thenable接口的非期约对象
   async function baz() {
     const thenable = {
       then(callback) { callback('baz'); }
     };
     console.log(await thenable);
   }
   baz();
   // baz
   
   // 等待一个期约
   async function qux() {
     console.log(await Promise.resolve('qux'));
   }
   qux();
   // qux
   ```

   等待会抛出错误的同步操作，会返回拒绝的期约：

   ```
   async function foo() {
     console.log(1);
     await (() => { throw 3; })();
   }
   
   // 给返回的期约添加一个拒绝处理程序
   foo().catch(console.log);
   console.log(2);
   
   // 1
   // 2
   // 3
   ```

   如前面的例子所示，单独的`Promise.reject()`不会被异步函数捕获，而会抛出未捕获错误。不过，对拒绝的期约使用`await`则会释放（unwrap）错误值（将拒绝期约返回）：

   ```
   async function foo() {
     console.log(1);
     await Promise.reject(3);
     console.log(4); // 这行代码不会执行
   }
   
   // 给返回的期约添加一个拒绝处理程序
   foo().catch(console.log);
   console.log(2);
   
   // 1
   // 2
   // 3
   ```

    

3. **`await`的限制**

   `await`关键字必须在异步函数中使用，不能在顶级上下文如`<script>`标签或模块中使用。不过，定义并立即调用异步函数是没问题的。下面两段代码实际是相同的：

   ```
   async function foo() {
     console.log(await Promise.resolve(3));
   }
   foo();
   // 3
   
   // 立即调用的异步函数表达式
   (async function() {
     console.log(await Promise.resolve(3));
   })();
   // 3
   ```

   此外，异步函数的特质不会扩展到嵌套函数。因此，`await`关键字也只能直接出现在异步函数的定义中。在同步函数内部使用`await`会抛出`SyntaxError`。

   下面展示了一些会出错的例子：

   ```
   // 不允许：await出现在了箭头函数中
   function foo() {
     const syncFn = () => {
       return await Promise.resolve('foo');
     };
     console.log(syncFn());
   }
   
   // 不允许：await出现在了同步函数声明中
   function bar() {
     function syncFn() {
       return await Promise.resolve('bar');
     }
     console.log(syncFn());
   }
   
   // 不允许：await出现在了同步函数表达式中
   function baz() {
     const syncFn = function() {
       return await Promise.resolve('baz');
     };
     console.log(syncFn());
   }
   
   // 不允许：IIFE使用同步函数表达式或箭头函数
   function qux() {
     (function () { console.log(await Promise.resolve('qux')); })();
     (() => console.log(await Promise.resolve('qux')))();
   }
   ```

### 11.3.2　停止和恢复执行

使用`await`关键字之后的区别其实比看上去的还要微妙一些。比如，下面的例子中按顺序调用了3个函数，但它们的输出结果顺序是相反的：

```
async function foo() {
  console.log(await Promise.resolve('foo'));
}

async function bar() {
  console.log(await 'bar');
}

async function baz() {
  console.log('baz');
}

foo();
bar();
baz();

// baz
// bar
// foo
```

async/await中真正起作用的是`await`。`async`关键字，无论从哪方面来看，都不过是一个标识符。毕竟，异步函数如果不包含`await`关键字，其执行基本上跟普通函数没有什么区别：

```
async function foo() {
  console.log(2);
}

console.log(1);
foo();
console.log(3);

// 1
// 2
// 3
```

要完全理解`await`关键字，必须知道它并非只是等待一个值可用那么简单。JavaScript运行时在碰到`await`关键字时，会记录在哪里暂停执行。等到`await`右边的值可用了，JavaScript运行时会向消息队列中推送一个任务，这个任务会恢复异步函数的执行。

因此，即使`await`后面跟着一个立即可用的值，函数的其余部分也会被**异步**求值。下面的例子演示了这一点：

```
async function foo() {
  console.log(2);
  await null;
  console.log(4);
}

console.log(1);
foo();
console.log(3);

// 1
// 2
// 3
// 4
```

控制台中输出结果的顺序很好地解释了运行时的工作过程：

(1) 打印1；

(2) 调用异步函数`foo()`；

(3)（在`foo()`中）打印2；

(4)（在`foo()`中）`await`关键字暂停执行，为立即可用的值`null`向消息队列中添加一个任务；

(5) foo()退出；

(6) 打印3；

(7) 同步线程的代码执行完毕；

(8) JavaScript运行时从消息队列中取出任务，恢复异步函数执行；

(9)（在`foo()`中）恢复执行，`await`取得`null`值（这里并没有使用）；

(10)（在`foo()`中）打印4；

(11) `foo()`返回。

如果`await`后面是一个期约，则问题会稍微复杂一些。此时，为了执行异步函数，实际上会有两个任务被添加到消息队列并被异步求值。下面的例子虽然看起来很反直觉，但它演示了真正的执行顺序：**1**

**1**TC39 对`await`后面是期约的情况如何处理做过一次修改。修改后，本例中的`Promise.resolve(8)`只会生成一个异步任务。因此在新版浏览器中，这个示例的输出结果为`123458967`。实际开发中，对于并行的异步操作我们通常更关注结果，而不依赖执行顺序。——译者注

```
async function foo() {
  console.log(2);
  console.log(await Promise.resolve(8));
  console.log(9);
}

async function bar() {
  console.log(4);
  console.log(await 6);
  console.log(7);
}

console.log(1);
foo();
console.log(3);
bar();
console.log(5);

// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
```

运行时会像这样执行上面的例子：

(1) 打印1；

(2) 调用异步函数`foo()`；

(3)（在`foo()`中）打印2；

(4)（在`foo()`中）`await`关键字暂停执行，向消息队列中添加一个期约在落定之后执行的任务；

(5) 期约立即落定，把给`await`提供值的任务添加到消息队列；

(6) `foo()`退出；

(7) 打印3；

(8) 调用异步函数`bar()`；

(9)（在`bar()`中）打印4；

(10)（在`bar()`中）`await`关键字暂停执行，为立即可用的值6向消息队列中添加一个任务；

(11) `bar()`退出；

(12) 打印5；

(13) 顶级线程执行完毕；

(14) JavaScript运行时从消息队列中取出解决`await`期约的处理程序，并将解决的值8提供给它；

(15) JavaScript运行时向消息队列中添加一个恢复执行`foo()`函数的任务；

(16) JavaScript运行时从消息队列中取出恢复执行`bar()`的任务及值6；

(17)（在`bar()`中）恢复执行，`await`取得值6；

(18)（在`bar()`中）打印6；

(19)（在`bar()`中）打印7；

(20) `bar()`返回；

(21) 异步任务完成，JavaScript从消息队列中取出恢复执行`foo()`的任务及值8；

(22)（在`foo()`中）打印8；

(23)（在`foo()`中）打印9；

(24) `foo()`返回。

### 11.3.3　异步函数策略

因为简单实用，所以异步函数很快成为JavaScript项目使用最广泛的特性之一。不过，在使用异步函数时，还是有些问题要注意。

1. **实现`sleep()`**

   很多人在刚开始学习JavaScript时，想找到一个类似Java中`Thread.sleep()`之类的函数，好在程序中加入非阻塞的暂停。以前，这个需求基本上都通过`setTimeout()`利用JavaScript运行时的行为来实现的。

   有了异步函数之后，就不一样了。一个简单的箭头函数就可以实现sleep()：

   ```
   async function sleep(delay) {
     return new Promise((resolve) => setTimeout(resolve, delay));
   }
   
   async function foo() {
     const t0 = Date.now();
     await sleep(1500); // 暂停约1500毫秒
     console.log(Date.now() - t0);
   }
   foo();
   // 1502
   ```

    

2. **利用平行执行**

   如果使用`await`时不留心，则很可能错过平行加速的机会。来看下面的例子，其中顺序等待了5个随机的超时：

   ```
   async function randomDelay(id) {
     // 延迟0~1000毫秒
     const delay = Math.random() * 1000;
     return new Promise((resolve) => setTimeout(() => {
       console.log(`${id} finished`);
       resolve();
     }, delay));
   }
   
   async function foo() {
     const t0 = Date.now();
     await randomDelay(0);
     await randomDelay(1);
     await randomDelay(2);
     await randomDelay(3);
     await randomDelay(4);
     console.log(`${Date.now() - t0}ms elapsed`);
   }
   foo();
   
   // 0 finished
   // 1 finished
   // 2 finished
   // 3 finished
   // 4 finished
   // 2219ms elapsed
   ```

   用一个`for`循环重写，就是：

   ```
   async function randomDelay(id) {
     // 延迟0~1000毫秒
     const delay = Math.random() * 1000;
     return new Promise((resolve) => setTimeout(() => {
       console.log(`${id} finished`);
       resolve();
     }, delay));
   }
   
   async function foo() {
     const t0 = Date.now();
     for (let i = 0; i < 5; ++i) {
       await randomDelay(i);
     }
   
     console.log(`${Date.now() - t0}ms elapsed`);
   }
   foo();
   
   // 0 finished
   // 1 finished
   // 2 finished
   // 3 finished
   // 4 finished
   // 2219ms elapsed
   ```

   就算这些期约之间没有依赖，异步函数也会依次暂停，等待每个超时完成。这样可以保证执行顺序，但总执行时间会变长。

   如果顺序不是必需保证的，那么可以先一次性初始化所有期约，然后再分别等待它们的结果。比如：

   ```
   async function randomDelay(id) {
     // 延迟0~1000毫秒
     const delay = Math.random() * 1000;
     return new Promise((resolve) => setTimeout(() => {
       setTimeout(console.log, 0, `${id} finished`);
       resolve();
     }, delay));
   }
   
   async function foo() {
     const t0 = Date.now();
   
     const p0 = randomDelay(0);
     const p1 = randomDelay(1);
     const p2 = randomDelay(2);
     const p3 = randomDelay(3);
     const p4 = randomDelay(4);
   
     await p0;
     await p1;
     await p2;
     await p3;
     await p4;
   
     setTimeout(console.log, 0, `${Date.now() - t0}ms elapsed`);
   }
   foo();
   
   // 1 finished
   // 4 finished
   // 3 finished
   // 0 finished
   // 2 finished
   // 2219ms elapsed
   ```

   用数组和`for`循环再包装一下就是：

   ```
   async function randomDelay(id) {
     // 延迟0~1000毫秒
     const delay = Math.random() * 1000;
     return new Promise((resolve) => setTimeout(() => {
       console.log(`${id} finished`);
       resolve();
     }, delay));
   }
   
   async function foo() {
     const t0 = Date.now();
   
     const promises = Array(5).fill(null).map((_, i) => randomDelay(i));
   
     for (const p of promises) {
       await p;
     }
   
     console.log(`${Date.now() - t0}ms elapsed`);
   }
   foo();
   
   // 4 finished
   // 2 finished
   // 1 finished
   // 0 finished
   // 3 finished
   // 877ms elapsed
   ```

   注意，虽然期约没有按照顺序执行，但`await`**按顺序**收到了每个期约的值：

   ```
   async function randomDelay(id) {
     // 延迟0~1000毫秒
     const delay = Math.random() * 1000;
     return new Promise((resolve) => setTimeout(() => {
       console.log(`${id} finished`);
       resolve(id);
     }, delay));
   }
   
   async function foo() {
     const t0 = Date.now();
   
     const promises = Array(5).fill(null).map((_, i) => randomDelay(i));
   
     for (const p of promises) {
       console.log(`awaited ${await p}`);
     }
   
     console.log(`${Date.now() - t0}ms elapsed`);
   }
   foo();
   
   // 1 finished
   // 2 finished
   // 4 finished
   // 3 finished
   // 0 finished
   // awaited 0
   // awaited 1
   // awaited 2
   // awaited 3
   // awaited 4
   // 645ms elapsed
   ```

    

3. **串行执行期约**

   在11.2节，我们讨论过如何串行执行期约并把值传给后续的期约。使用async/await，期约连锁会变得很简单：

   ```
   function addTwo(x) {return x + 2;}
   function addThree(x) {return x + 3;}
   function addFive(x) {return x + 5;}
   
   async function addTen(x) {
     for (const fn of [addTwo, addThree, addFive]) {
       x = await fn(x);
     }
     return x;
   }
   
   addTen(9).then(console.log); // 19
   ```

   这里，`await`直接传递了每个函数的返回值，结果通过迭代产生。当然，这个例子并没有使用期约，如果要使用期约，则可以把所有函数都改成异步函数。这样它们就都返回期约了：

   ```
   async function addTwo(x) {return x + 2;}
   async function addThree(x) {return x + 3;}
   async function addFive(x) {return x + 5;}
   
   async function addTen(x) {
     for (const fn of [addTwo, addThree, addFive]) {
       x = await fn(x);
     }
     return x;
   }
   
   addTen(9).then(console.log); // 19
   ```

    

4. **栈追踪与内存管理**

   期约与异步函数的功能有相当程度的重叠，但它们在内存中的表示则差别很大。看看下面的例子，它展示了拒绝期约的栈追踪信息：

   ```
   function fooPromiseExecutor(resolve, reject) {
     setTimeout(reject, 1000, 'bar');
   }
   
   function foo() {
     new Promise(fooPromiseExecutor);
   }
   
   foo();
   // Uncaught (in promise) bar
   //   setTimeout
   //   setTimeout (async)
   //   fooPromiseExecutor
   //   foo
   ```

   根据对期约的不同理解程度，以上栈追踪信息可能会让某些读者不解。栈追踪信息应该相当直接地表现JavaScript引擎当前栈内存中函数调用之间的嵌套关系。在超时处理程序执行时和拒绝期约时，我们看到的错误信息包含嵌套函数的标识符，那是被调用以创建最初期约实例的函数。可是，我们知道这些函数**已经返回**了，因此栈追踪信息中不应该看到它们。

   答案很简单，这是因为JavaScript引擎会在创建期约时尽可能保留完整的调用栈。在抛出错误时，调用栈可以由运行时的错误处理逻辑获取，因而就会出现在栈追踪信息中。当然，这意味着栈追踪信息会占用内存，从而带来一些计算和存储成本。

   如果在前面的例子中使用的是异步函数，那又会怎样呢？比如：

   ```
   function fooPromiseExecutor(resolve, reject) {
     setTimeout(reject, 1000, 'bar');
   }
   
   async function foo() {
     await new Promise(fooPromiseExecutor);
   }
   foo();
   
   // Uncaught (in promise) bar
   //   foo
   //   async function (async)
   //   foo
   ```

   这样一改，栈追踪信息就准确地反映了当前的调用栈。`fooPromiseExecutor()`已经返回，所以它不在错误信息中。但`foo()`此时被挂起了，并没有退出。JavaScript运行时可以简单地在嵌套函数中存储指向包含函数的指针，就跟对待同步函数调用栈一样。这个指针实际上存储在内存中，可用于在出错时生成栈追踪信息。这样就不会像之前的例子那样带来额外的消耗，因此在重视性能的应用中是可以优先考虑的。

## 11.4　小结

长期以来，掌握单线程JavaScript运行时的异步行为一直都是个艰巨的任务。随着ES6新增了期约和ES8新增了异步函数，ECMAScript的异步编程特性有了长足的进步。通过期约和async/await，不仅可以实现之前难以实现或不可能实现的任务，而且也能写出更清晰、简洁，并且容易理解、调试的代码。

期约的主要功能是为异步代码提供了清晰的抽象。可以用期约表示异步执行的代码块，也可以用期约表示异步计算的值。在需要串行异步代码时，期约的价值最为突出。作为可塑性极强的一种结构，期约可以被序列化、连锁使用、复合、扩展和重组。

异步函数是将期约应用于JavaScript函数的结果。异步函数可以暂停执行，而不阻塞主线程。无论是编写基于期约的代码，还是组织串行或平行执行的异步代码，使用异步函数都非常得心应手。异步函数可以说是现代JavaScript工具箱中最重要的工具之一。

## 第 12 章　BOM

> **本章内容**
>
> - 理解BOM的核心——`window`对象
> - 控制窗口及弹窗
> - 通过`location`对象获取页面信息
> - 使用`navigator`对象了解浏览器
> - 通过`history`对象操作浏览器历史

虽然ECMAScript把浏览器对象模型（BOM，Browser Object Model）描述为JavaScript的核心，但实际上BOM是使用JavaScript开发Web应用程序的核心。BOM提供了与网页无关的浏览器功能对象。多年来，BOM是在缺乏规范的背景下发展起来的，因此既充满乐趣又问题多多。毕竟，浏览器开发商都按照自己的意愿来为它添砖加瓦。最终，浏览器实现之间共通的部分成为了事实标准，为Web开发提供了浏览器间互操作的基础。HTML5规范中有一部分涵盖了BOM的主要内容，因为W3C希望将JavaScript在浏览器中最基础的部分标准化。

## 12.1　window对象

BOM的核心是`window`对象，表示浏览器的实例。`window`对象在浏览器中有两重身份，一个是ECMAScript中的`Global`对象，另一个就是浏览器窗口的JavaScript接口。这意味着网页中定义的所有对象、变量和函数都以`window`作为其`Global`对象，都可以访问其上定义的`parseInt()`等全局方法。

> **注意**　因为`window`对象的属性在全局作用域中有效，所以很多浏览器API及相关构造函数都以`window`对象属性的形式暴露出来。这些API将在全书各章中介绍，特别是第20章。
>
> 另外，由于实现不同，某些`window`对象的属性在不同浏览器间可能差异很大。本章不会介绍已经废弃的、非标准化或特定于浏览器的`window`属性。

### 12.1.1　`Global`作用域

因为`window`对象被复用为ECMAScript的`Global`对象，所以通过`var`声明的所有全局变量和函数都会变成`window`对象的属性和方法。比如：

```
var age = 29;
var sayAge = () => alert(this.age);

alert(window.age); // 29
sayAge();          // 29
window.sayAge();   // 29
```

这里，变量`age`和函数`sayAge()`被定义在全局作用域中，它们自动成为了`window`对象的成员。因此，变量`age`可以通过`window.age`来访问，而函数`sayAge()`也可以通过`window.sayAge()`来访问。因为`sayAge()`存在于全局作用域，`this.age`映射到`window.age`，所以就可以显示正确的结果了。

如果在这里使用`let`或`const`替代`var`，则不会把变量添加给全局对象：

```
let age = 29;
const sayAge = () => alert(this.age);

alert(window.age);  // undefined
sayAge();           // undefined
window.sayAge();    // TypeError: window.sayAge is not a function
```

另外，访问未声明的变量会抛出错误，但是可以在`window`对象上查询是否存在可能未声明的变量。比如：

```
// 这会导致抛出错误，因为oldValue没有声明
var newValue = oldValue;
// 这不会抛出错误，因为这里是属性查询
// newValue会被设置为undefined
var newValue = window.oldValue;
```

记住，JavaScript中有很多对象都暴露在全局作用域中，比如`location`和`navigator`（本章后面都会讨论），因而它们也是`window`对象的属性。

### 12.1.2　窗口关系

`top`对象始终指向最上层（最外层）窗口，即浏览器窗口本身。而`parent`对象则始终指向当前窗口的父窗口。如果当前窗口是最上层窗口，则`parent`等于`top`（都等于`window`）。最上层的`window`如果不是通过`window.open()`打开的，那么其`name`属性就不会包含值，本章后面会讨论。

还有一个`self`对象，它是终极`window`属性，始终会指向`window`。实际上，`self`和`window`就是同一个对象。之所以还要暴露`self`，就是为了和`top`、`parent`保持一致。

这些属性都是`window`对象的属性，因此访问`window.parent`、`window.top`和`window.self`都可以。这意味着可以把访问多个窗口的`window`对象串联起来，比如`window.parent.parent`。

### 12.1.3　窗口位置与像素比

`window`对象的位置可以通过不同的属性和方法来确定。现代浏览器提供了`screenLeft`和`screenTop`属性，用于表示窗口相对于屏幕左侧和顶部的位置 ，返回值的单位是CSS像素。

可以使用`moveTo()`和`moveBy()`方法移动窗口。这两个方法都接收两个参数，其中`moveTo()`接收要移动到的新位置的绝对坐标![x](https://private.codecogs.com/gif.latex?x)和![y](https://private.codecogs.com/gif.latex?y)；而`moveBy()`则接收相对当前位置在两个方向上移动的像素数。比如：

```
// 把窗口移动到左上角
window.moveTo(0,0);

// 把窗口向下移动100像素
window.moveBy(0, 100);

// 把窗口移动到坐标位置(200, 300)
window.moveTo(200, 300);

// 把窗口向左移动50像素
window.moveBy(-50, 0);
```

依浏览器而定，以上方法可能会被部分或全部禁用。

**像素比**

CSS像素是Web开发中使用的统一像素单位。这个单位的背后其实是一个角度：0.0213°。如果屏幕距离人眼是一臂长，则以这个角度计算的CSS像素大小约为1/96英寸。这样定义像素大小是为了在不同设备上统一标准。比如，低分辨率平板设备上12像素（CSS像素）的文字应该与高清4K屏幕下12像素（CSS像素）的文字具有相同大小。这就带来了一个问题，不同像素密度的屏幕下就会有不同的缩放系数，以便把物理像素（屏幕实际的分辨率）转换为CSS像素（浏览器报告的虚拟分辨率）。

举个例子，手机屏幕的**物理**分辨率可能是1920×1080，但因为其像素可能非常小，所以浏览器就需要将其分辨率降为较低的**逻辑**分辨率，比如640×320。这个物理像素与CSS像素之间的转换比率由`window.devicePixelRatio`属性提供。对于分辨率从1920×1080转换为640×320的设备，`window.devicePixelRatio`的值就是3。这样一来，12像素（CSS像素）的文字实际上就会用36像素的物理像素来显示。

`window.devicePixelRatio`实际上与每英寸像素数（DPI，dots per inch）是对应的。DPI表示单位像素密度，而`window.devicePixelRatio`表示物理像素与逻辑像素之间的缩放系数。

### 12.1.4　窗口大小

在不同浏览器中确定浏览器窗口大小没有想象中那么容易。所有现代浏览器都支持4个属性：`innerWidth`、`innerHeight`、`outerWidth`和`outerHeight`。`outerWidth`和`outerHeight`返回浏览器窗口自身的大小（不管是在最外层`window`上使用，还是在窗格`<frame>`中使用）。`innerWidth`和`innerHeight`返回浏览器窗口中页面视口的大小（不包含浏览器边框和工具栏）。

`document.documentElement.clientWidth`和`document.documentElement.clientHeight`返回页面视口的宽度和高度。

浏览器窗口自身的精确尺寸不好确定，但可以确定页面视口的大小，如下所示：

```
let pageWidth = window.innerWidth,
    pageHeight = window.innerHeight;

if (typeof pageWidth != "number") {
  if (document.compatMode == "CSS1Compat"){
    pageWidth = document.documentElement.clientWidth;
    pageHeight = document.documentElement.clientHeight;
  } else {
    pageWidth = document.body.clientWidth;
    pageHeight = document.body.clientHeight;
  }
}
```

这里，先将`pageWidth`和`pageHeight`的值分别设置为`window.innerWidth`和`window.innerHeight`。然后，检查`pageWidth`是不是一个数值，如果不是则通过`document.compatMode`来检查页面是否处于标准模式。如果是，则使用`document.documentElement.clientWidth`和`document.documentElement.clientHeight`；否则，就使用`document.body.clientWidth`和`document.body.clientHeight`。

在移动设备上，`window.innerWidth`和`window.innerHeight`返回视口的大小，也就是屏幕上页面可视区域的大小。Mobile Internet Explorer支持这些属性，但在`document.documentElement.clientWidth`和`document.documentElement.clientHeight`中提供了相同的信息。在放大或缩小页面时，这些值也会相应变化。

在其他移动浏览器中，`document.documentElement.clientWidth`和`document.documentElement.clientHeight`返回的布局视口的大小，即渲染页面的实际大小。布局视口是相对于可见视口的概念，可见视口只能显示整个页面的一小部分。Mobile Internet Explorer把布局视口的信息保存在`document.body.clientWidth`和`document.body.clientHeight`中。在放大或缩小页面时，这些值也会相应变化。

因为桌面浏览器的差异，所以需要先确定用户是不是在使用移动设备，然后再决定使用哪个属性。

> **注意**　手机视口的概念比较复杂，有各种各样的问题。如果读者在做移动开发，推荐阅读Peter-Paul Koch发表在QuirksMode网站上的文章“A Tale of Two Viewports— Part Two”。

可以使用`resizeTo()`和`resizeBy()`方法调整窗口大小。这两个方法都接收两个参数，`resizeTo()`接收新的宽度和高度值，而`resizeBy()`接收宽度和高度各要缩放多少。下面看个例子：

```
// 缩放到100×100
window.resizeTo(100, 100);

// 缩放到200×150
window.resizeBy(100, 50);

// 缩放到300×300
window.resizeTo(300, 300);
```

与移动窗口的方法一样，缩放窗口的方法可能会被浏览器禁用，而且在某些浏览器中默认是禁用的。同样，缩放窗口的方法只能应用到最上层的`window`对象。

### 12.1.5　视口位置

浏览器窗口尺寸通常无法满足完整显示整个页面，为此用户可以通过滚动在有限的视口中查看文档。度量文档相对于视口滚动距离的属性有两对，返回相等的值：`window.pageXoffset`/`window.scrollX`和`window.pageYoffset`/`window.scrollY`。

可以使用`scroll()`、`scrollTo()`和`scrollBy()`方法滚动页面。这3个方法都接收表示相对视口距离的![x](https://private.codecogs.com/gif.latex?x)和![y](https://private.codecogs.com/gif.latex?y)坐标，这两个参数在前两个方法中表示要滚动到的坐标，在最后一个方法中表示滚动的距离。

```
// 相对于当前视口向下滚动100像素
window.scrollBy(0, 100);

// 相对于当前视口向右滚动40像素
window.scrollBy(40, 0);

// 滚动到页面左上角
window.scrollTo(0, 0);

// 滚动到距离屏幕左边及顶边各100像素的位置
window.scrollTo(100, 100);
```

这几个方法也都接收一个`ScrollToOptions`字典，除了提供偏移值，还可以通过`behavior`属性告诉浏览器是否平滑滚动。

```
// 正常滚动
window.scrollTo({
  left: 100,
  top: 100,
  behavior: 'auto'
});

// 平滑滚动
window.scrollTo({
  left: 100,
  top: 100,
  behavior: 'smooth'
});
```

### 12.1.6　导航与打开新窗口

`window.open()`方法可以用于导航到指定URL，也可以用于打开新浏览器窗口。这个方法接收4个参数：要加载的URL、目标窗口、特性字符串和表示新窗口在浏览器历史记录中是否替代当前加载页面的布尔值。通常，调用这个方法时只传前3个参数，最后一个参数只有在不打开新窗口时才会使用。

如果`window.open()`的第二个参数是一个已经存在的窗口或窗格（frame）的名字，则会在对应的窗口或窗格中打开URL。下面是一个例子：

```
// 与<a href="http://www.wrox.com" target="topFrame"/>相同
window.open("http://www.wrox.com/", "topFrame");
```

执行这行代码的结果就如同用户点击了一个`href`属性为`"http://www.wrox.com"`，`target`属性为`"topFrame"`的链接。如果有一个窗口名叫`"topFrame"`，则这个窗口就会打开这个URL；否则就会打开一个新窗口并将其命名为`"topFrame"`。第二个参数也可以是一个特殊的窗口名，比如`_self`、`_parent`、`_top`或`_blank`。

1. **弹出窗口**

   如果`window.open()`的第二个参数不是已有窗口，则会打开一个新窗口或标签页。第三个参数，即特性字符串，用于指定新窗口的配置。如果没有传第三个参数，则新窗口（或标签页）会带有所有默认的浏览器特性（工具栏、地址栏、状态栏等都是默认配置）。如果打开的不是新窗口，则忽略第三个参数。

   特性字符串是一个逗号分隔的设置字符串，用于指定新窗口包含的特性。下表列出了一些选项。

   | 设置         | 值              | 说明                                                         |
   | :----------- | :-------------- | :----------------------------------------------------------- |
   | `fullscreen` | `"yes"`或`"no"` | 表示新窗口是否最大化。仅限IE支持                             |
   | `height`     | 数值            | 新窗口高度。这个值不能小于100                                |
   | `left`       | 数值            | 新窗口的*x*轴坐标。这个值不能是负值                          |
   | `location`   | `"yes"`或`"no"` | 表示是否显示地址栏。不同浏览器的默认值也不一样。在设置为`"no"`时，地址栏可能隐藏或禁用（取决于浏览器） |
   | `Menubar`    | `"yes"`或`"no"` | 表示是否显示菜单栏。默认为`"no"`                             |
   | `resizable`  | `"yes"`或`"no"` | 表示是否可以拖动改变新窗口大小。默认为`"no"`                 |
   | `scrollbars` | `"yes"`或`"no"` | 表示是否可以在内容过长时滚动。默认为`"no"`                   |
   | `status`     | `"yes"`或`"no"` | 表示是否显示状态栏。不同浏览器的默认值也不一样               |
   | `toolbar`    | `"yes"`或`"no"` | 表示是否显示工具栏。默认为`"no"`                             |
   | `top`        | 数值            | 新窗口的*y*轴坐标。这个值不能是负值                          |
   | `width`      | 数值            | 新窗口的宽度。这个值不能小于100                              |

   这些设置需要以逗号分隔的名值对形式出现，其中名值对以等号连接。（特性字符串中不能包含空格。）来看下面的例子：

   ```
   window.open("http://www.wrox.com/",
               "wroxWindow",
               "height=400,width=400,top=10,left=10,resizable=yes");
   ```

   这行代码会打开一个可缩放的新窗口，大小为400像素×400像素，位于离屏幕左边及顶边各10像素的位置。

   `window.open()`方法返回一个对新建窗口的引用。这个对象与普通`window`对象没有区别，只是为控制新窗口提供了方便。例如，某些浏览器默认不允许缩放或移动主窗口，但可能允许缩放或移动通过`window.open()`创建的窗口。跟使用任何`window`对象一样，可以使用这个对象操纵新打开的窗口。

   ```
   let wroxWin = window.open("http://www.wrox.com/",
                 "wroxWindow",
                 "height=400,width=400,top=10,left=10,resizable=yes");
   
   // 缩放
   wroxWin.resizeTo(500, 500);
   
   // 移动
   wroxWin.moveTo(100, 100);
   ```

   还可以使用`close()`方法像这样关闭新打开的窗口：

   ```
   wroxWin.close();
   ```

   这个方法只能用于`window.open()`创建的弹出窗口。虽然不可能不经用户确认就关闭主窗口，但弹出窗口可以调用`top.close()`来关闭自己。关闭窗口以后，窗口的引用虽然还在，但只能用于检查其`closed`属性了：

   ```
   wroxWin.close();
   alert(wroxWin.closed); // true
   ```

   新创建窗口的`window`对象有一个属性`opener`，指向打开它的窗口。这个属性只在弹出窗口的最上层`window`对象（`top`）有定义，是指向调用`window.open()`打开它的窗口或窗格的指针。例如：

   ```
   let wroxWin = window.open("http://www.wrox.com/",
                 "wroxWindow",
                 "height=400,width=400,top=10,left=10,resizable=yes");
   
   alert(wroxWin.opener === window); // true
   ```

   虽然新建窗口中有指向打开它的窗口的指针，但反之则不然。窗口不会跟踪记录自己打开的新窗口，因此开发者需要自己记录。

   在某些浏览器中，每个标签页会运行在独立的进程中。如果一个标签页打开了另一个，而`window`对象需要跟另一个标签页通信，那么标签便不能运行在独立的进程中。在这些浏览器中，可以将新打开的标签页的`opener`属性设置为`null`，表示新打开的标签页可以运行在独立的进程中。比如：

   ```
   let wroxWin = window.open("http://www.wrox.com/",
                 "wroxWindow",
                 "height=400,width=400,top=10,left=10,resizable=yes");
   
   wroxWin.opener = null;
   ```

   把`opener`设置为`null`表示新打开的标签页不需要与打开它的标签页通信，因此可以在独立进程中运行。这个连接一旦切断，就无法恢复了。
   
2. **安全限制**

   弹出窗口有段时间被在线广告用滥了。很多在线广告会把弹出窗口伪装成系统对话框，诱导用户点击。因为长得像系统对话框，所以用户很难分清这些弹窗的来源。为了让用户能够区分清楚，浏览器开始对弹窗施加限制。

   IE的早期版本实现针对弹窗的多重安全限制，包括不允许创建弹窗或把弹窗移出屏幕之外，以及不允许隐藏状态栏等。从IE7开始，地址栏也不能隐藏了，而且弹窗默认是不能移动或缩放的。Firefox 1禁用了隐藏状态栏的功能，因此无论`window.open()`的特性字符串是什么，都不会隐藏弹窗的状态栏。Firefox 3强制弹窗始终显示地址栏。Opera只会在主窗口中打开新窗口，但不允许它们出现在系统对话框的位置。

   此外，浏览器会在用户操作下才允许创建弹窗。在网页加载过程中调用`window.open()`没有效果，而且还可能导致向用户显示错误。弹窗通常可能在鼠标点击或按下键盘中某个键的情况下才能打开。

   > **注意**　IE对打开本地网页的窗口再弹窗解除了某些限制。同样的代码如果来自服务器，则会施加弹窗限制。

    

3. **弹窗屏蔽程序**

   所有现代浏览器都内置了屏蔽弹窗的程序，因此大多数意料之外的弹窗都会被屏蔽。在浏览器屏蔽弹窗时，可能会发生一些事。如果浏览器内置的弹窗屏蔽程序阻止了弹窗，那么`window.open()`很可能会返回`null`。此时，只要检查这个方法的返回值就可以知道弹窗是否被屏蔽了，比如：

   ```
   let wroxWin = window.open("http://www.wrox.com", "_blank");
   if (wroxWin == null){
     alert("The popup was blocked!");
   }
   ```

   在浏览器扩展或其他程序屏蔽弹窗时，`window.open()`通常会抛出错误。因此要准确检测弹窗是否被屏蔽，除了检测`window.open()`的返回值，还要把它用`try`/`catch`包装起来，像这样：

   ```
   let blocked = false;
   
   try {
     let wroxWin = window.open("http://www.wrox.com", "_blank");
     if (wroxWin == null){
       blocked = true;
     }
   } catch (ex){
     blocked = true;
   }
   if (blocked){
     alert("The popup was blocked!");
   }
   ```

   无论弹窗是用什么方法屏蔽的，以上代码都可以准确判断调用`window.open()`的弹窗是否被屏蔽了。

   > **注意**　检查弹窗是否被屏蔽，不影响浏览器显示关于弹窗被屏蔽的消息。

### 12.1.7　定时器

JavaScript在浏览器中是单线程执行的，但允许使用定时器指定在某个时间之后或每隔一段时间就执行相应的代码。`setTimeout()`用于指定在一定时间后执行某些代码，而`setInterval()`用于指定每隔一段时间执行某些代码。

`setTimeout()`方法通常接收两个参数：要执行的代码和在执行回调函数前等待的时间（毫秒）。第一个参数可以是包含JavaScript代码的字符串（类似于传给`eval()`的字符串）或者一个函数，比如：

```
// 在1秒后显示警告框
setTimeout(() => alert("Hello world!"), 1000);
```

第二个参数是要等待的毫秒数，而不是要执行代码的确切时间。JavaScript是单线程的，所以每次只能执行一段代码。为了调度不同代码的执行，JavaScript维护了一个任务队列。其中的任务会按照添加到队列的先后顺序执行。`setTimeout()`的第二个参数只是告诉JavaScript引擎在指定的毫秒数过后把任务添加到这个队列。如果队列是空的，则会立即执行该代码。如果队列不是空的，则代码必须等待前面的任务执行完才能执行。

调用`setTimeout()`时，会返回一个表示该超时排期的数值ID。这个超时ID是被排期执行代码的唯一标识符，可用于取消该任务。要取消等待中的排期任务，可以调用`clearTimeout()`方法并传入超时ID，如下面的例子所示：

```
// 设置超时任务
let timeoutId = setTimeout(() => alert("Hello world!"), 1000);

// 取消超时任务
clearTimeout(timeoutId);
```

只要是在指定时间到达之前调用`clearTimeout()`，就可以取消超时任务。在任务执行后再调用`clearTimeout()`没有效果。

> **注意**　所有超时执行的代码（函数）都会在全局作用域中的一个匿名函数中运行，因此函数中的`this`值在非严格模式下始终指向`window`，而在严格模式下是`undefined`。如果给`setTimeout()`提供了一个箭头函数，那么`this`会保留为定义它时所在的词汇作用域。

`setInterval()`与`setTimeout()`的使用方法类似，只不过指定的任务会每隔指定时间就执行一次，直到取消循环定时或者页面卸载。`setInterval()`同样可以接收两个参数：要执行的代码（字符串或函数），以及把下一次执行定时代码的任务添加到队列要等待的时间（毫秒）。下面是一个例子：

```
setInterval(() => alert("Hello world!"), 10000);
```

> **注意**　这里的关键点是，第二个参数，也就是间隔时间，指的是向队列添加新任务之前等待的时间。比如，调用`setInterval()`的时间为01:00:00，间隔时间为3000毫秒。这意味着01:00:03时，浏览器会把任务添加到执行队列。浏览器不关心这个任务什么时候执行或者执行要花多长时间。因此，到了01:00:06，它会再向队列中添加一个任务。由此可看出，执行时间短、非阻塞的回调函数比较适合`setInterval()`。

`setInterval()`方法也会返回一个循环定时ID，可以用于在未来某个时间点上取消循环定时。要取消循环定时，可以调用`clearInterval()`并传入定时ID。相对于`setTimeout()`而言，取消定时的能力对`setInterval()`更加重要。毕竟，如果一直不管它，那么定时任务会一直执行到页面卸载。下面是一个常见的例子：

```
let num = 0, intervalId = null;
let max = 10;

let incrementNumber = function() {
  num++;

  // 如果达到最大值，则取消所有未执行的任务
  if (num == max) {
    clearInterval(intervalId);
    alert("Done");
  }
}

intervalId = setInterval(incrementNumber, 500);
```

在这个例子中，变量`num`会每半秒递增一次，直至达到最大限制值。此时循环定时会被取消。这个模式也可以使用`setTimeout()`来实现，比如：

```
let num = 0;
let max = 10;
let incrementNumber = function() {
  num++;

  // 如果还没有达到最大值，再设置一个超时任务
  if (num < max) {
    setTimeout(incrementNumber, 500);
  } else {
    alert("Done");
  }
}

setTimeout(incrementNumber, 500);
```

注意在使用`setTimeout()`时，不一定要记录超时ID，因为它会在条件满足时自动停止，否则会自动设置另一个超时任务。这个模式是设置循环任务的推荐做法。`setIntervale()`在实践中很少会在生产环境下使用，因为一个任务结束和下一个任务开始之间的时间间隔是无法保证的，有些循环定时任务可能会因此而被跳过。而像前面这个例子中一样使用`setTimeout()`则能确保不会出现这种情况。一般来说，最好不要使用`setInterval()`。

### 12.1.8　系统对话框

使用`alert()`、`confirm()`和`promt()`方法，可以让浏览器调用系统对话框向用户显示消息。这些对话框与浏览器中显示的网页无关，而且也不包含HTML。它们的外观由操作系统或者浏览器决定，无法使用CSS设置。此外，这些对话框都是同步的模态对话框，即在它们显示的时候，代码会停止执行，在它们消失以后，代码才会恢复执行。

`alert()`方法在本书示例中经常用到。它接收一个要显示给用户的字符串。与`console.log`可以接收任意数量的参数且能一次性打印这些参数不同，`alert()`只接收一个参数。调用`alert()`时，传入的字符串会显示在一个系统对话框中。对话框只有一个“OK”（确定）按钮。如果传给`alert()`的参数不是一个原始字符串，则会调用这个值的`toString()`方法将其转换为字符串。

警告框（alert）通常用于向用户显示一些他们无法控制的消息，比如报错。用户唯一的选择就是在看到警告框之后把它关闭。图12-1展示了一个警告框。

![img](http://www.ituring.com.cn/figures/2020/JavaScriptWebDeve4th/018.png)

**图　12-1**

第二种对话框叫确认框，通过调用`confirm()`来显示。确认框跟警告框类似，都会向用户显示消息。但不同之处在于，确认框有两个按钮：“Cancel”（取消）和“OK”（确定）。用户通过单击不同的按钮表明希望接下来执行什么操作。比如，`confirm("Are you sure?")`会显示图12-2所示的确认框。

![img](http://www.ituring.com.cn/figures/2020/JavaScriptWebDeve4th/019.png)

**图　12-2**

要知道用户单击了OK按钮还是Cancel按钮，可以判断`confirm()`方法的返回值：`true`表示单击了OK按钮，`false`表示单击了Cancel按钮或者通过单击某一角上的X图标关闭了确认框。确认框的典型用法如下所示：

```
if (confirm("Are you sure?")) {
  alert("I'm so glad you're sure!");
} else {
  alert("I'm sorry to hear you're not sure.");
}
```

在这个例子中，第一行代码向用户显示了确认框，也就是`if`语句的条件。如果用户单击了OK按钮，则会弹出警告框显示`"I'm so glad you're sure!"`。如果单击了Cancel，则会显示`"I'm sorry to hear you're not sure."`。确认框通常用于让用户确认执行某个操作，比如删除邮件等。因为这种对话框会完全打断正在浏览网页的用户，所以应该在必要时再使用。

最后一种对话框是提示框，通过调用`prompt()`方法来显示。提示框的用途是提示用户输入消息。除了OK和Cancel按钮，提示框还会显示一个文本框，让用户输入内容。`prompt()`方法接收两个参数：要显示给用户的文本，以及文本框的默认值（可以是空字符串）。调用`prompt("What is your name?", "Jake")`会显示图12-3所示的提示框。

![img](http://www.ituring.com.cn/figures/2020/JavaScriptWebDeve4th/020.png)

**图　12-3**

如果用户单击了OK按钮，则`prompt()`会返回文本框中的值。如果用户单击了Cancel按钮，或者对话框被关闭，则`prompt()`会返回`null`。下面是一个例子：

```
let result = prompt("What is your name? ", "");
if (result !== null) {
  alert("Welcome, " + result);
}
```

这些系统对话框可以向用户显示消息、确认操作和获取输入。由于不需要HTML和CSS，所以系统对话框是Web应用程序最简单快捷的沟通手段。

很多浏览器针对这些系统对话框添加了特殊功能。如果网页中的脚本生成了两个或更多系统对话框，则除第一个之外所有后续的对话框上都会显示一个复选框，如果用户选中则会禁用后续的弹框，直到页面刷新。

如果用户选中了复选框并关闭了对话框，在页面刷新之前，所有系统对话框（警告框、确认框、提示框）都会被屏蔽。开发者无法获悉这些对话框是否显示了。对话框计数器会在浏览器空闲时重置，因此如果两次独立的用户操作分别产生了两个警告框，则两个警告框上都不会显示屏蔽复选框。如果一次独立的用户操作连续产生了两个警告框，则第二个警告框会显示复选框。

JavaScript还可以显示另外两种对话框：`find()`和`print()`。这两种对话框都是异步显示的，即控制权会立即返回给脚本。用户在浏览器菜单上选择“查找”（find）和“打印”（print）时显示的就是这两种对话框。通过在`window`对象上调用`find()`和`print()`可以显示它们，比如：

```
// 显示打印对话框
window.print();

// 显示查找对话框
window.find();
```

这两个方法不会返回任何有关用户在对话框中执行了什么操作的信息，因此很难加以利用。此外，因为这两种对话框是异步的，所以浏览器的对话框计数器不会涉及它们，而且用户选择禁用对话框对它们也没有影响。

## 12.2　`location`对象

`location`是最有用的BOM对象之一，提供了当前窗口中加载文档的信息，以及通常的导航功能。这个对象独特的地方在于，它既是`window`的属性，也是`document`的属性。也就是说，`window.location`和`document.location`指向同一个对象。`location`对象不仅保存着当前加载文档的信息，也保存着把URL解析为离散片段后能够通过属性访问的信息。这些解析后的属性在下表中有详细说明（`location`前缀是必需的）。

假设浏览器当前加载的URL是http://foouser:barpassword@www.wrox.com:80/WileyCDA/?q=javascript#contents，`location`对象的内容如下表所示。

| 属性                | 值                                                         | 说明                                                         |
| :------------------ | :--------------------------------------------------------- | :----------------------------------------------------------- |
| `location.hash`     | `"#contents"`                                              | URL散列值（井号后跟零或多个字符），如果没有则为空字符串      |
| `location.host`     | `"www.wrox.com:80"`                                        | 服务器名及端口号                                             |
| `location.hostname` | `"www.wrox.com"`                                           | 服务器名                                                     |
| `location.href`     | `"http://www.wrox.com:80/WileyCDA/?q=javascript#contents"` | 当前加载页面的完整URL。`location`的`toString()`方法返回这个值 |
| `location.pathname` | `"/WileyCDA/"`                                             | URL中的路径和（或）文件名                                    |
| `location.port`     | `"80"`                                                     | 请求的端口。如果URL中没有端口，则返回空字符串                |
| `location.protocol` | `"http:"`                                                  | 页面使用的协议。通常是`"http:"`或`"https:"`                  |
| `location.search`   | `"?q=javascript"`                                          | URL的查询字符串。这个字符串以问号开头                        |
| `location.username` | `"foouser"`                                                | 域名前指定的用户名                                           |
| `location.password` | `"barpassword"`                                            | 域名前指定的密码                                             |
| `location.origin`   | `"http://www.wrox.com"`                                    | URL的源地址。只读                                            |

### 12.2.1　查询字符串

`location`的多数信息都可以通过上面的属性获取。但是URL中的查询字符串并不容易使用。虽然`location.search`返回了从问号开始直到URL末尾的所有内容，但没有办法逐个访问每个查询参数。下面的函数解析了查询字符串，并返回一个以每个查询参数为属性的对象：

```
let getQueryStringArgs = function() {
  // 取得没有开头问号的查询字符串
  let qs = (location.search.length > 0 ? location.search.substring(1) : ""),
    // 保存数据的对象
    args = {};

  // 把每个参数添加到args对象
  for (let item of qs.split("&").map(kv => kv.split("="))) {
    let name = decodeURIComponent(item[0]),
      value = decodeURIComponent(item[1]);
    if (name.length) {
      args[name] = value;
    }
  }

  return args;
}
```

这个函数首先删除了查询字符串开头的问号，当然前提是`location.search`必须有内容。解析后的参数将被保存到`args`对象，这个对象以字面量形式创建。接着，先把查询字符串按照`&`分割成数组，每个元素的形式为`name=value`。`for`循环迭代这个数组，将每一个元素按照`=`分割成数组，这个数组第一项是参数名，第二项是参数值。参数名和参数值在使用`decodeURIComponent()`解码后（这是因为查询字符串通常是被编码后的格式）分别保存在`name`和`value`变量中。最后，`name`作为属性而`value`作为该属性的值被添加到`args`对象。这个函数可以像下面这样使用：

```
// 假设查询字符串为?q=javascript&num=10

let args = getQueryStringArgs();

alert(args["q"]);    // "javascript"
alert(args["num"]);  // "10"
```

现在，查询字符串中的每个参数都是返回对象的一个属性，这样使用起来就方便了。

**`URLSearchParams`**

`URLSearchParams`提供了一组标准API方法，通过它们可以检查和修改查询字符串。给`URLSearchParams`构造函数传入一个查询字符串，就可以创建一个实例。这个实例上暴露了`get()`、`set()`和`delete()`等方法，可以对查询字符串执行相应操作。下面来看一个例子：

```
let qs = "?q=javascript&num=10";

let searchParams = new URLSearchParams(qs);

alert(searchParams.toString());  // " q=javascript&num=10"
searchParams.has("num");         // true
searchParams.get("num");         // 10

searchParams.set("page", "3");
alert(searchParams.toString());  // " q=javascript&num=10&page=3"

searchParams.delete("q");
alert(searchParams.toString());  // " num=10&page=3"
```

大多数支持`URLSearchParams`的浏览器也支持将`URLSearchParams`的实例用作可迭代对象：

```
let qs = "?q=javascript&num=10";

let searchParams = new URLSearchParams(qs);

for (let param of searchParams) {
  console.log(param);
}
// ["q", "javascript"]
// ["num", "10"]
```

### 12.2.2　操作地址

可以通过修改`location`对象修改浏览器的地址。首先，最常见的是使用`assign()`方法并传入一个URL，如下所示：

```
location.assign("http://www.wrox.com");
```

这行代码会立即启动导航到新URL的操作，同时在浏览器历史记录中增加一条记录。如果给`location.href`或`window.location`设置一个URL，也会以同一个URL值调用`assign()`方法。比如，下面两行代码都会执行与显式调用`assign()`一样的操作：

```
window.location = "http://www.wrox.com";
location.href = "http://www.wrox.com";
```

在这3种修改浏览器地址的方法中，设置`location.href`是最常见的。

修改`location`对象的属性也会修改当前加载的页面。其中，`hash`、`search`、`hostname`、`pathname`和`port`属性被设置为新值之后都会修改当前URL，如下面的例子所示：

```
// 假设当前URL为http://www.wrox.com/WileyCDA/

// 把URL修改为http://www.wrox.com/WileyCDA/#section1
location.hash = "#section1";

// 把URL修改为http://www.wrox.com/WileyCDA/?q=javascript
location.search = "?q=javascript";

// 把URL修改为http://www.somewhere.com/WileyCDA/
location.hostname = "www.somewhere.com";

// 把URL修改为http://www.somewhere.com/mydir/
location.pathname = "mydir";

// 把URL修改为http://www.somewhere.com:8080/WileyCDA/
Location.port = 8080;
```

除了`hash`之外，只要修改`location`的一个属性，就会导致页面重新加载新URL。

> **注意**　修改`hash`的值会在浏览器历史中增加一条新记录。在早期的IE中，点击“后退”和“前进”按钮不会更新`hash`属性，只有点击包含散列的URL才会更新`hash`的值。

在以前面提到的方式修改URL之后，浏览器历史记录中就会增加相应的记录。当用户单击“后退”按钮时，就会导航到前一个页面。如果不希望增加历史记录，可以使用`replace()`方法。这个方法接收一个URL参数，但重新加载后不会增加历史记录。调用`replace()`之后，用户不能回到前一页。比如下面的例子：

```
<!DOCTYPE html>
<html>
<head>
  <title>You won't be able to get back here</title>
</head>
<body>
  <p>Enjoy this page for a second, because you won't be coming back here.</p>
  <script>
    setTimeout(() => location.replace("http://www.wrox.com/"), 1000);
  </script>
</body>
</html>
```

浏览器加载这个页面1秒之后会重定向到www.wrox.com。此时，“后退”按钮是禁用状态，即不能返回这个示例页面，除非手动输入完整的URL。

最后一个修改地址的方法是`reload()`，它能重新加载当前显示的页面。调用`reload()`而不传参数，页面会以最有效的方式重新加载。也就是说，如果页面自上次请求以来没有修改过，浏览器可能会从缓存中加载页面。如果想强制从服务器重新加载，可以像下面这样给`reload()`传个`true`：

```
location.reload();     // 重新加载，可能是从缓存加载
location.reload(true); // 重新加载，从服务器加载
```

脚本中位于`reload()`调用之后的代码可能执行也可能不执行，这取决于网络延迟和系统资源等因素。为此，最好把`reload()`作为最后一行代码。

## 12.3　`navigator`对象

`navigator`是由Netscape Navigator 2最早引入浏览器的，现在已经成为客户端标识浏览器的标准。只要浏览器启用JavaScript，`navigator`对象就一定存在。但是与其他BOM对象一样，每个浏览器都支持自己的属性。

> **注意**　`navigator`对象中关于系统能力的属性将在第13章详细介绍。

`navigator`对象实现了`NavigatorID`、`NavigatorLanguage`、`NavigatorOnLine`、`NavigatorContentUtils`、`NavigatorStorage`、`NavigatorStorageUtils`、`NavigatorConcurrentHardware`、`NavigatorPlugins`和`NavigatorUserMedia`接口定义的属性和方法。

下表列出了这些接口定义的属性和方法：

| 属性/方法                       | 说明                                                         |
| :------------------------------ | :----------------------------------------------------------- |
| `activeVrDisplays`              | 返回数组，包含`ispresenting`属性为`true`的`VRDisplay`实例    |
| `appCodeName`                   | 即使在非Mozilla浏览器中也会返回`"Mozilla"`                   |
| `appName`                       | 浏览器全名                                                   |
| `appVersion`                    | 浏览器版本。通常与实际的浏览器版本不一致                     |
| `battery`                       | 返回暴露Battery Status API的`BatteryManager`对象             |
| `buildId`                       | 浏览器的构建编号                                             |
| `connection`                    | 返回暴露Network Information API的`NetworkInformation`对象    |
| `cookieEnabled`                 | 返回布尔值，表示是否启用了cookie                             |
| `credentials`                   | 返回暴露Credentials Management API的`CredentialsContainer`对象 |
| `deviceMemory`                  | 返回单位为GB的设备内存容量                                   |
| `doNotTrack`                    | 返回用户的“不跟踪”（do-not-track）设置                       |
| `geolocation`                   | 返回暴露Geolocation API的`Geolocation`对象                   |
| `getVRDisplays()`               | 返回数组，包含可用的每个`VRDisplay`实例                      |
| `getUserMedia()`                | 返回与可用媒体设备硬件关联的流                               |
| `hardwareConcurrency`           | 返回设备的处理器核心数量                                     |
| `javaEnabled`                   | 返回布尔值，表示浏览器是否启用了Java                         |
| `language`                      | 返回浏览器的主语言                                           |
| `languages`                     | 返回浏览器偏好的语言数组                                     |
| `locks`                         | 返回暴露Web Locks API的`LockManager`对象                     |
| `mediaCapabilities`             | 返回暴露Media Capabilities API的`MediaCapabilities`对象      |
| `mediaDevices`                  | 返回可用的媒体设备                                           |
| `maxTouchPoints`                | 返回设备触摸屏支持的最大触点数                               |
| `mimeTypes`                     | 返回浏览器中注册的MIME类型数组                               |
| `onLine`                        | 返回布尔值，表示浏览器是否联网                               |
| `oscpu`                         | 返回浏览器运行设备的操作系统和（或）CPU                      |
| `permissions`                   | 返回暴露Permissions API的`Permissions`对象                   |
| `platform`                      | 返回浏览器运行的系统平台                                     |
| `plugins`                       | 返回浏览器安装的插件数组。在IE中，这个数组包含页面中所有`<embed>`元素 |
| `product`                       | 返回产品名称（通常是`"Gecko"`）                              |
| `productSub`                    | 返回产品的额外信息（通常是Gecko的版本）                      |
| `registerProtocolHandler()`     | 将一个网站注册为特定协议的处理程序                           |
| `requestMediaKeySystemAccess()` | 返回一个期约，解决为`MediaKeySystemAccess`对象               |
| `sendBeacon()`                  | 异步传输一些小数据                                           |
| `serviceWorker`                 | 返回用来与`ServiceWorker`实例交互的`ServiceWorkerContainer`  |
| `share()`                       | 返回当前平台的原生共享机制                                   |
| `storage`                       | 返回暴露Storage API的`StorageManager`对象                    |
| `userAgent`                     | 返回浏览器的用户代理字符串                                   |
| `vendor`                        | 返回浏览器的厂商名称                                         |
| `vendorSub`                     | 返回浏览器厂商的更多信息                                     |
| `vibrate()`                     | 触发设备振动                                                 |
| `webdriver`                     | 返回浏览器当前是否被自动化程序控制                           |

`navigator`对象的属性通常用于确定浏览器的类型。

### 12.3.1　检测插件

检测浏览器是否安装了某个插件是开发中常见的需求。除IE10及更低版本外的浏览器，都可以通过`plugins`数组来确定。这个数组中的每一项都包含如下属性。

- `name`：插件名称。
- `description`：插件介绍。
- `filename`：插件的文件名。
- `length`：由当前插件处理的MIME类型数量。

通常，`name`属性包含识别插件所需的必要信息，尽管不是特别准确。检测插件就是遍历浏览器中可用的插件，并逐个比较插件的名称，如下所示：

```
// 插件检测，IE10及更低版本无效
let hasPlugin = function(name) {
  name = name.toLowerCase();
  for (let plugin of window.navigator.plugins){
    if (plugin.name.toLowerCase().indexOf(name) > -1){
      return true;
    }
  }

  return false;
}

// 检测Flash
alert(hasPlugin("Flash"));

// 检测QuickTime
alert(hasPlugin("QuickTime"));
```

这个`hasPlugin()`方法接收一个参数，即待检测插件的名称。第一步是把插件名称转换为小写形式，以便于比较。然后，遍历`plugins`数组，通过`indexOf()`方法检测每个`name`属性，看传入的名称是不是存在于某个数组中。比较的字符串全部小写，可以避免大小写问题。传入的参数应该尽可能独一无二，以避免混淆。像`"Flash"`、`"QuickTime"`这样的字符串就可以避免混淆。这个方法可以在Firefox、Safari、Opera和Chrome中检测插件。

> **注意**　`plugins`数组中的每个插件对象还有一个`MimeType`对象，可以通过中括号访问。每个`MimeType`对象有4个属性：`description`描述MIME类型，`enabledPlugin`是指向插件对象的指针，`suffixes`是该MIME类型对应扩展名的逗号分隔的字符串，`type`是完整的MIME类型字符串。

IE11的`window.navigator`对象开始支持`plugins`和`mimeTypes`属性。这意味着前面定义的函数可以适用于所有较新版本的浏览器。而且，IE11中的`ActiveXObject`也从DOM中隐身了，意味着不能再用它来作为检测特性的手段。

**旧版本IE中的插件检测**

IE10及更低版本中检测插件的问题比较多，因为这些浏览器不支持Netscape式的插件。在这些IE中检测插件要使用专有的`ActiveXObject`，并尝试实例化特定的插件。IE中的插件是实现为COM对象的，由唯一的字符串标识。因此，要检测某个插件就必须知道其COM标识符。例如，Flash的标识符是`"ShockwaveFlash.ShockwaveFlash"`。知道了这个信息后，就可以像这样检测IE中是否安装了Flash：

```
// 在旧版本IE中检测插件
function hasIEPlugin(name) {
  try {
    new ActiveXObject(name);
    return true;
  } catch (ex) {
    return false;
  }
}

// 检测Flash
alert(hasIEPlugin("ShockwaveFlash.ShockwaveFlash"));

// 检测QuickTime
alert(hasIEPlugin("QuickTime.QuickTime"));
```

在这个例子中，`hasIEPlugin()`函数接收一个DOM标识符参数。为检测插件，这个函数会使用传入的标识符创建一个新`ActiveXObject`实例。相应代码封装在一个`try`/`catch`语句中，因此如果创建的插件不存在则会抛出错误。如果创建成功则返回`true`，如果失败则在`catch`块中返回`false`。上面的例子还演示了如何检测Flash和QuickTime插件。

因为检测插件涉及两种方式，所以一般要针对特定插件写一个函数，而不是使用通常的检测函数。比如下面的例子：

```
// 在所有浏览器中检测Flash
function hasFlash() {
  var result = hasPlugin("Flash");
  if (!result){
    result = hasIEPlugin("ShockwaveFlash.ShockwaveFlash");
  }
  return result;
}

// 在所有浏览器中检测QuickTime
function hasQuickTime() {
  var result = hasPlugin("QuickTime");
  if (!result){
    result = hasIEPlugin("QuickTime.QuickTime");
  }
  return result;
}

// 检测Flash
alert(hasFlash());

// 检测QuickTime
alert(hasQuickTime());
```

以上代码定义了两个函数`hasFlash()`和`hasQuickTime()`。每个函数都先尝试使用非IE插件检测方式，如果返回`false`（对IE可能会），则再使用IE插件检测方式。如果IE插件检测方式再返回`false`，整个检测方法也返回`false`。只要有一种方式返回`true`，检测方法就会返回`true`。

> **注意**　`plugins`有一个`refresh()`方法，用于刷新`plugins`属性以反映新安装的插件。这个方法接收一个布尔值参数，表示刷新时是否重新加载页面。如果传入`true`，则所有包含插件的页面都会重新加载。否则，只有`plugins`会更新，但页面不会重新加载。

### 12.3.2　注册处理程序

现代浏览器支持`navigator`上的（在HTML5中定义的）`registerProtocolHandler()`方法。这个方法可以把一个网站注册为处理某种特定类型信息应用程序。随着在线RSS阅读器和电子邮件客户端的流行，可以借助这个方法将Web应用程序注册为像桌面软件一样的默认应用程序。

要使用`registerProtocolHandler()`方法，必须传入3个参数：要处理的协议（如`"mailto"`或`"ftp"`）、处理该协议的URL，以及应用名称。比如，要把一个Web应用程序注册为默认邮件客户端，可以这样做：

```
navigator.registerProtocolHandler("mailto",
  "http://www.somemailclient.com?cmd=%s",
  "Some Mail Client");
```

这个例子为`"mailto"`协议注册了一个处理程序，这样邮件地址就可以通过指定的Web应用程序打开。注意，第二个参数是负责处理请求的URL，`%s`表示原始的请求。

## 12.4　`screen`对象

`window`的另一个属性`screen`对象，是为数不多的几个在编程中很少用的JavaScript对象。这个对象中保存的纯粹是客户端能力信息，也就是浏览器窗口外面的客户端显示器的信息，比如像素宽度和像素高度。每个浏览器都会在`screen`对象上暴露不同的属性。下表总结了这些属性。

| 属性          | 说明                                         |
| ------------- | -------------------------------------------- |
| `availHeight` | 屏幕像素高度减去系统组件高度（只读）         |
| `availLeft`   | 没有被系统组件占用的屏幕的最左侧像素（只读） |
| `availTop`    | 没有被系统组件占用的屏幕的最顶端像素（只读） |
| `availWidth`  | 屏幕像素宽度减去系统组件宽度（只读）         |
| `colorDepth`  | 表示屏幕颜色的位数；多数系统是32（只读）     |
| `height`      | 屏幕像素高度                                 |
| `left`        | 当前屏幕左边的像素距离                       |
| `pixelDepth`  | 屏幕的位深（只读）                           |
| `top`         | 当前屏幕顶端的像素距离                       |
| `width`       | 屏幕像素宽度                                 |
| `orientation` | 返回Screen Orientation API中屏幕的朝向       |

## 12.5　`history`对象

`history`对象表示当前窗口首次使用以来用户的导航历史记录。因为`history`是`window`的属性，所以每个`window`都有自己的`history`对象。出于安全考虑，这个对象不会暴露用户访问过的URL，但可以通过它在不知道实际URL的情况下前进和后退。

### 12.5.1　导航

`go()`方法可以在用户历史记录中沿任何方向导航，可以前进也可以后退。这个方法只接收一个参数，这个参数可以是一个整数，表示前进或后退多少步。负值表示在历史记录中后退（类似点击浏览器的“后退”按钮），而正值表示在历史记录中前进（类似点击浏览器的“前进”按钮）。下面来看几个例子：

```
// 后退一页
history.go(-1);

// 前进一页
history.go(1);

// 前进两页
history.go(2);
```

`go()`方法的参数也可以是一个字符串，这种情况下浏览器会导航到历史中包含该字符串的第一个位置。最接近的位置可能涉及后退，也可能涉及前进。如果历史记录中没有匹配的项，则这个方法什么也不做，如下所示：

```
// 导航到最近的wrox.com页面
history.go("wrox.com");

// 导航到最近的nczonline.net页面
history.go("nczonline.net");
```

`go()`有两个简写方法：`back()`和`forward()`。顾名思义，这两个方法模拟了浏览器的后退按钮和前进按钮：

```
// 后退一页
history.back();

// 前进一页
history.forward();
```

`history`对象还有一个`length`属性，表示历史记录中有多个条目。这个属性反映了历史记录的数量，包括可以前进和后退的页面。对于窗口或标签页中加载的第一个页面，`history.length`等于1。通过以下方法测试这个值，可以确定用户浏览器的起点是不是你的页面：

```
if (history.length == 1){
  // 这是用户窗口中的第一个页面
}
```

`history`对象通常被用于创建“后退”和“前进”按钮，以及确定页面是不是用户历史记录中的第一条记录。

> **注意**　如果页面URL发生变化，则会在历史记录中生成一个新条目。对于2009年以来发布的主流浏览器，这包括改变URL的散列值（因此，把`location.hash`设置为一个新值会在这些浏览器的历史记录中增加一条记录）。这个行为常被单页应用程序框架用来模拟前进和后退，这样做是为了不会因导航而触发页面刷新。

### 12.5.2　历史状态管理

现代Web应用程序开发中最难的环节之一就是历史记录管理。用户每次点击都会触发页面刷新的时代早已过去，“后退”和“前进”按钮对用户来说就代表“帮我切换一个状态”的历史也就随之结束了。为解决这个问题，首先出现的是`hashchange`事件（第17章介绍事件时会讨论）。HTML5也为`history`对象增加了方便的状态管理特性。

`hashchange`会在页面URL的散列变化时被触发，开发者可以在此时执行某些操作。而状态管理API则可以让开发者改变浏览器URL而不会加载新页面。为此，可以使用`history.pushState()`方法。这个方法接收3个参数：一个`state`对象、一个新状态的标题和一个（可选的）相对URL。例如：

```
let stateObject = {foo:"bar"};

history.pushState(stateObject, "My title", "baz.html");
```

`pushState()`方法执行后，状态信息就会被推到历史记录中，浏览器地址栏也会改变以反映新的相对URL。除了这些变化之外，即使`location.href`返回的是地址栏中的内容，浏览器页不会向服务器发送请求。第二个参数并未被当前实现所使用，因此既可以传一个空字符串也可以传一个短标题。第一个参数应该包含正确初始化页面状态所必需的信息。为防止滥用，这个状态的对象大小是有限制的，通常在500KB～1MB以内。

因为`pushState()`会创建新的历史记录，所以也会相应地启用“后退”按钮。此时单击“后退”按钮，就会触发`window`对象上的`popstate`事件。`popstate`事件的事件对象有一个`state`属性，其中包含通过`pushState()`第一个参数传入的`state`对象：

```
window.addEventListener("popstate", (event) => {
  let state = event.state;
  if (state) { // 第一个页面加载时状态是null
    processState(state);
  }
});
```

基于这个状态，应该把页面重置为状态对象所表示的状态（因为浏览器不会自动为你做这些）。记住，页面初次加载时没有状态。因此点击“后退”按钮直到返回最初页面时，`event.state`会为`null`。

可以通过`history.state`获取当前的状态对象，也可以使用`replaceState()`并传入与`pushState()`同样的前两个参数来更新状态。更新状态不会创建新历史记录，只会覆盖当前状态：

```
history.replaceState({newFoo: "newBar"}, "New title");
```

传给`pushState()`和`replaceState()`的`state`对象应该只包含可以被序列化的信息。因此，DOM元素之类并不适合放到状态对象里保存。

> **注意**　使用HTML5状态管理时，要确保通过`pushState()`创建的每个“假”URL背后都对应着服务器上一个真实的物理URL。否则，单击“刷新”按钮会导致404错误。所有单页应用程序（SPA，Single Page Application）框架都必须通过服务器或客户端的某些配置解决这个问题。

## 12.6　小结

浏览器对象模型（BOM，Browser Object Model）是以`window`对象为基础的，这个对象代表了浏览器窗口和页面可见的区域。`window`对象也被复用为ECMAScript的`Global`对象，因此所有全局变量和函数都是它的属性，而且所有原生类型的构造函数和普通函数也都从一开始就存在于这个对象之上。本章讨论了BOM的以下内容。

- 要引用其他`window`对象，可以使用几个不同的窗口指针。
- 通过`location`对象可以以编程方式操纵浏览器的导航系统。通过设置这个对象上的属性，可以改变浏览器URL中的某一部分或全部。
- 使用`replace()`方法可以替换浏览器历史记录中当前显示的页面，并导航到新URL。
- `navigator`对象提供关于浏览器的信息。提供的信息类型取决于浏览器，不过有些属性如`userAgent`是所有浏览器都支持的。

BOM中的另外两个对象也提供了一些功能。`screen`对象中保存着客户端显示器的信息。这些信息通常用于评估浏览网站的设备信息。`history`对象提供了操纵浏览器历史记录的能力，开发者可以确定历史记录中包含多少个条目，并以编程方式实现在历史记录中导航，而且也可以修改历史记录。