
  class TreeNode {
      val: number
      left: TreeNode | null
      right: TreeNode | null
      constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
          this.val = (val===undefined ? 0 : val)
          this.left = (left===undefined ? null : left)
          this.right = (right===undefined ? null : right)
      }
  }


  
let preorder: number[] = [3,9,20,15,7]
let inorder: number[] = [9,3,15,20,7]
console.log(buildTree(preorder,inorder))

/* 程序代码*/
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    let rebuild = (preorder: number[], inorder: number[]) => {
        let headVal: number = preorder[0]
        let headNode: TreeNode = new TreeNode(headVal)
        let hi: number = inorder.indexOf(headVal)
        console.log('hi:',hi)
        if(hi !== 0){
        headNode.left = rebuild(preorder.slice(1,1 + hi),inorder.slice(0,hi))
        headNode.right = rebuild(preorder.slice(1 + hi),inorder.slice(hi+1))
        }
        return headNode
    }
    return rebuild(preorder,inorder);
};