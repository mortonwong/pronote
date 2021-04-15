# 例题一

## 题目 重建二叉树（熟悉递归和迭代）
>   输入某二叉树的前序遍历和中序遍历的结果，请重建该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。

    例如，给出

    前序遍历 preorder = [3,9,20,15,7]
    中序遍历 inorder = [9,3,15,20,7]
    返回如下的二叉树：

     3
    / \
    9  20
      /  \
    15   7
     

    限制：

    0 <= 节点个数 <= 5000
## 代码一
```js
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    
    let rebuild = (preorder: number[], inorder: number[]) => {
        let headVal: number = preorder[0]
        let headNode: TreeNode = new TreeNode(headVal)
        let hi: number = inorder.indexOf(headVal)
        if(preorder.length >==1){
            headNode.left = rebuild(preorder.slice(1,1 + hi),inorder.slice(0,hi))
            headNode.right = rebuild(preorder.slice(1 + hi),inorder.slice(hi+1))
            return headNode
        }
        else {
            return null
        }
    }
    return rebuild(preorder,inorder);
};

```
## 代码二（不用slice，空间和时间消耗多）
**用头尾索引值来记录preorder和inorder，不用新数组**

参考代码：

本题，根节点创造左右子树的连线。 而左右子树节点并没有确定。靠继续调用方法来构建连线
但是用 slice 制造新的数组需要额外的空间和时间
记录下头尾之后，可以节省空间和时间

```js
var buildTree = function (preorder, inorder, a, b, c, d) {

  if (typeof a !== "number") {
    a = 0
    b = preorder.length - 1
    c = 0
    d = inorder.length - 1
  }

  if (a > b) return null
  var node = new TreeNode(preorder[a])
  var index = inorder.findIndex((n, i) => {
    if (i >= c && i <= d && n === preorder[a]) return true
    else return false
  })
  node.left = buildTree(preorder, inorder, a + 1, a + index - c, c, index - 1)
  node.right = buildTree(preorder, inorder, a + index - c + 1, b, index + 1, d)
  return node
};
```
## 总结
### 注意对测试用例判空、异形输入
### 注意段错误（数组越界）
### 长度和坐标
涉及 长度、索引（index），容易混淆，导致计算时间长，以后一律使用索引index，不要随意定义length
### 递归分治思想
1. 找到一个**模型**。这道题用的模型是二叉树层次模型，从最高层依次往下建立
2. 找到一个方法，这个方法**创造真实连线**。而子节点并不确定到具体。靠继续创造连线才能确定
3. 知道什么时候停止
