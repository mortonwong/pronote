## 常用函数

包括打印函数和一些数学函数。

```
const _max = Math.max.bind(Math);
const _min = Math.min.bind(Math);
const _pow = Math.pow.bind(Math);
const _floor = Math.floor.bind(Math);
const _round = Math.round.bind(Math);
const _ceil = Math.ceil.bind(Math);
const log = console.log.bind(console);
//const log = _ => {}
```



 log 在提交的代码中当然是用不到的，不过在调试时十分有用。但是当代码里面加了很多 log 的时候，提交时还需要一个个注释掉就相当麻烦了，只要将 log 赋值为空函数就可以了。

举一个简单的例子，下面的代码是可以直接提交的。

```
// 计算 1+2+...+n
// const log = console.log.bind(console);
const log = _ => {}

function sumOneToN(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
        log(`i=${i}: sum=${sum}`);
    }
    return sum;
}

sumOneToN(10);
```

 

## 位运算的一些小技巧

判断一个整数 `x` 的奇偶性： x & 1 = 1 ` (奇数) ， x & 1 = 0 (偶数)`

求一个浮点数 `x` 的整数部分： ~~x ，对于正数相当于 floor(x) 对于负数相当于 ceil(-x) 

计算 2 ^ n ： 1 << n 相当于 pow(2, n) 

计算一个数 `x` 除以 2 的 n 倍： x >> n 相当于 ~~(x / pow(2, n)) 

判断一个数 `x` 是 2 的整数幂（即  x = 2 ^ n ）: x & (x - 1) = 0 

**※注意※：上面的位运算只对32位带符号的整数有效，如果使用的话，一定要注意数！据！范！围！**

记住这些技巧的作用：

提升运行速度 ❌

提升逼格 ✅

举一个实用的例子，快速幂（原理自行google）

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
// 计算x^n n为整数
function qPow(x, n) {
    let result = 1;
    while (n) {
        if (n & 1) result *= x; // 同 if(n%2)
        x = x * x;
        n >>= 1; // 同 n=floor(n/2)
    }
    return result;
}
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

## 链表

刚开始做 LeetCode 的题就遇到了很多链表的题。恶心心。最麻烦的不是写题，是调试啊！！于是总结了一些链表的辅助函数。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
/**
 * 链表节点
 * @param {*} val
 * @param {ListNode} next
 */
function ListNode(val, next = null) {
    this.val = val;
    this.next = next;
}
/**
 * 将一个数组转为链表
 * @param {array} a
 * @return {ListNode}
 */
const getListFromArray = (a) => {
    let dummy = new ListNode()
    let pre = dummy;
    a.forEach(x => pre = pre.next = new ListNode(x));
    return dummy.next;
}
/**
 * 将一个链表转为数组
 * @param {ListNode} node
 * @return {array}
 */
const getArrayFromList = (node) => {
    let a = [];
    while (node) {
        a.push(node.val);
        node = node.next;
    }
    return a;
}
/**
 * 打印一个链表
 * @param {ListNode} node 
 */
const logList = (node) => {
    let str = 'list: ';
    while (node) {
        str += node.val + '->';
        node = node.next;
    }
    str += 'end';
    log(str);
}
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

还有一个常用小技巧，每次写链表的操作，都要注意判断表头，如果创建一个空表头来进行操作会方便很多。

```
let dummy = new ListNode();
// 返回
return dummy.next;
```

使用起来超爽哒~举个例子。@leetcode 82。题意就是删除链表中连续相同值的节点。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
/*
 * @lc app=leetcode id=82 lang=javascript
 *
 * [82] Remove Duplicates from Sorted List II
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function(head) {
    // 空指针或者只有一个节点不需要处理
    if (head === null || head.next === null) return head;

    let dummy = new ListNode();
    let oldLinkCurrent = head;
    let newLinkCurrent = dummy;

    while (oldLinkCurrent) {
        let next = oldLinkCurrent.next;
        // 如果当前节点和下一个节点的值相同 就要一直向前直到出现不同的值
        if (next && oldLinkCurrent.val === next.val) {
            while (next && oldLinkCurrent.val === next.val) {
                next = next.next;
            }
            oldLinkCurrent = next;
        } else {
            newLinkCurrent = newLinkCurrent.next = oldLinkCurrent;
            oldLinkCurrent = oldLinkCurrent.next;
        }
    }
    newLinkCurrent.next = null; // 记得结尾置空~
    logList(dummy.next);
    return dummy.next;
};

deleteDuplicates(getListFromArray([1,2,3,3,4,4,5]));
deleteDuplicates(getListFromArray([1,1,2,2,3,3,4,4,5]));
deleteDuplicates(getListFromArray([1,1]));
deleteDuplicates(getListFromArray([1,2,2,3,3]));
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

本地运行结果

```
list: 1->2->5->end
list: 5->end
list: end
list: 1->end
```

是不是很方便！

## 矩阵（二维数组）

矩阵的题目也有很多，基本每一个需要用到二维数组的题，都涉及到初始化，求行数列数，遍历的代码。于是简单提取出来几个函数。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
/**
 * 初始化一个二维数组
 * @param {number} r 行数
 * @param {number} c 列数
 * @param {*} init 初始值
 */
const initMatrix = (r, c, init = 0) => new Array(r).fill().map(_ => new Array(c).fill(init));
/**
 * 获取一个二维数组的行数和列数
 * @param {any[][]} matrix
 * @return [row, col]
 */
const getMatrixRowAndCol = (matrix) => matrix.length === 0 ? [0, 0] : [matrix.length, matrix[0].length];
/**
 * 遍历一个二维数组
 * @param {any[][]} matrix 
 * @param {Function} func 
 */
const matrixFor = (matrix, func) => {
    matrix.forEach((row, i) => {
        row.forEach((item, j) => {
            func(item, i, j, row, matrix);
        });
    })
}
/**
 * 获取矩阵第index个元素 从0开始
 * @param {any[][]} matrix 
 * @param {number} index 
 */
function getMatrix(matrix, index) {
    let col = matrix[0].length;
    let i = ~~(index / col);
    let j = index - i * col;
    return matrix[i][j];
}
/**
 * 设置矩阵第index个元素 从0开始
 * @param {any[][]} matrix 
 * @param {number} index 
 */
function setMatrix(matrix, index, value) {
    let col = matrix[0].length;
    let i = ~~(index / col);
    let j = index - i * col;
    return matrix[i][j] = value;
}
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

找一个简单的矩阵的题示范一下用法。@leetcode 566。题意就是将一个矩阵重新排列为r行c列。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
/*
 * @lc app=leetcode id=566 lang=javascript
 *
 * [566] Reshape the Matrix
 */
/**
 * @param {number[][]} nums
 * @param {number} r
 * @param {number} c
 * @return {number[][]}
 */
var matrixReshape = function(nums, r, c) {
    // 将一个矩阵重新排列为r行c列
    // 首先获取原来的行数和列数
    let [r1, c1] = getMatrixRowAndCol(nums);
    log(r1, c1);
    // 不合法的话就返回原矩阵
    if (!r1 || r1 * c1 !== r * c) return nums;
    // 初始化新矩阵
    let matrix = initMatrix(r, c);
    // 遍历原矩阵生成新矩阵
    matrixFor(nums, (val, i, j) => {
        let index = i * c1 + j; // 计算是第几个元素
        log(index);
        setMatrix(matrix, index, val); // 在新矩阵的对应位置赋值
    });
    return matrix;
};

let x = matrixReshape([[1],[2],[3],[4]], 2, 2);
log(x)
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

## 二叉树

当我做到二叉树相关的题目，我发现，我错怪链表了，呜呜呜这个更恶心。

当然对于二叉树，只要你掌握先序遍历，后序遍历，中序遍历，层序遍历，递归以及非递归版，先序中序求二叉树，先序后序求二叉树，基本就能AC大部分二叉树的题目了（我瞎说的）。

二叉树的题目 input 一般都是层序遍历的数组，所以写了层序遍历数组和二叉树的转换，方便调试。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
function TreeNode(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
}
/**
 * 通过一个层次遍历的数组生成一棵二叉树
 * @param {any[]} array
 * @return {TreeNode}
 */
function getTreeFromLayerOrderArray(array) {
    let n = array.length;
    if (!n) return null;
    let index = 0;
    let root = new TreeNode(array[index++]);
    let queue = [root];
    while(index < n) {
        let top = queue.shift();
        let v = array[index++];
        top.left = v == null ? null : new TreeNode(v);
        if (index < n) {
            let v = array[index++];
            top.right = v == null ? null : new TreeNode(v);
        }
        if (top.left) queue.push(top.left);
        if (top.right) queue.push(top.right);
    }
    return root;
}
/**
 * 层序遍历一棵二叉树 生成一个数组
 * @param {TreeNode} root 
 * @return {any[]}
 */
function getLayerOrderArrayFromTree(root) {
    let res = [];
    let que = [root];
    while (que.length) {
        let len = que.length;
        for (let i = 0; i < len; i++) {
            let cur = que.shift();
            if (cur) {
                res.push(cur.val);
                que.push(cur.left, cur.right);
            } else {
                res.push(null);
            }
        }
    }
    while (res.length > 1 && res[res.length - 1] == null) res.pop(); // 删掉结尾的 null
    return res;
}
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

一个例子，@leetcode 110，判断一棵二叉树是不是平衡二叉树。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function(root) {
    if (!root) return true; // 认为空指针也是平衡树吧

    // 获取一个二叉树的深度
    const d = (root) => {
        if (!root) return 0;
        return _max(d(root.left), d(root.right)) + 1;
    }

    let leftDepth = d(root.left);
    let rightDepth = d(root.right);

    // 深度差不超过 1 且子树都是平衡树
    if (_min(leftDepth, rightDepth) + 1 >= _max(leftDepth, rightDepth)
        && isBalanced(root.left) && isBalanced(root.right)) return true;

    return false;
};

log(isBalanced(getTreeFromLayerOrderArray([3,9,20,null,null,15,7])));
log(isBalanced(getTreeFromLayerOrderArray([1,2,2,3,3,null,null,4,4])));
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 

## 二分查找

参考 C++ STL 中的 lower_bound 和 upper_bound 。这两个函数真的很好用的！

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
/**
 * 寻找>=target的最小下标
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function lower_bound(nums, target) {
    let first = 0;
    let len = nums.length;

    while (len > 0) {
        let half = len >> 1;
        let middle = first + half;
        if (nums[middle] < target) {
            first = middle + 1;
            len = len - half - 1;
        } else {
            len = half;
        }
    }
    return first;
}

/**
 * 寻找>target的最小下标
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function upper_bound(nums, target) {
    let first = 0;
    let len = nums.length;

    while (len > 0) {
        let half = len >> 1;
        let middle = first + half;
        if (nums[middle] > target) {
            len = half;
        } else {
            first = middle + 1;
            len = len - half - 1;
        }
    }
    return first;
}
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

照例，举个例子，@leetcode 34。题意是给一个排好序的数组和一个目标数字，求数组中等于目标数字的元素最小下标和最大下标。不存在就返回 -1。

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
/*
 * @lc app=leetcode id=34 lang=javascript
 *
 * [34] Find First and Last Position of Element in Sorted Array
 */
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
  let lower = lower_bound(nums, target);
  let upper = upper_bound(nums, target);
  let size = nums.length;
  // 不存在返回 [-1, -1]
  if (lower >= size || nums[lower] !== target) return [-1, -1];
  return [lower, upper - 1];
};
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

 