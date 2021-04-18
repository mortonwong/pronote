# 初始配置

https://www.liaoxuefeng.com/wiki/896043488029600/897271968352576

安装完git客户端后，初始配置，global可选

```bash
$ git config --global user.name "Your Name"
$ git config --global user.email "email@example.com"
```

生成ssh公钥

`ssh-keygen -t rsa -C 942422490@qq.com`

`cat id_rsa.pub`

# 本地版本库

创建版本库,将目录转换为repository

`git unit`

添加文件到本地repository

`git add 文件名`

提交**所有已添加**的文件到repository

`git commit -m "message"`

每次commit都会保存一个快照,可以版本回退。

# 远程库

将一个本地库与远程库关联

`git remote add origin git@gitee.com:mortonwong/hello.git`

 把本地库的内容推送到远程库(比如多个commit)

`git push -u origin master`

使用克隆来从远程库新建一个本地库

# 工作流程

### 推送流程

```bash
# 新建
git checkout -b feature/guide_change@morton.huang
git push origin feature/guide_change@morton.huang:feature/guide_change@morton.huang

在vscode操作：
add
commit
push

如果是gerrit项目，自己写push：
git push origin HEAD:refs/for/release/4.10.4-camera.1
 
http://gerrit.test.com/dashboard/self 查看提审

此时，gerrit上已经有自己的分支，提审过了就流到gitlab

将自己分支合并到develop：
git checkout develop
git merge 自己分支名
git push
项目将自动构建
```



### 删除远程分支

### 合并远程分支
git checkout 先切到被合的分支
git merge origin/远程分支名 然后合并 
### Git从远程拉取分支代码

```bash
git fetch origin dev（dev为远程仓库的分支名）

git checkout -b smart_camera(本地分支名称) origin/feature/smart_camera@xiong.zhou(远程分支名称)
git checkout -b smart_camera origin/feature/smart_camera@xiong.zhou

git pull origin dev(远程分支名称)
```

### Git从远程分支更新最新代码到本地

分支拉取：git pull origin “分支名”
主干拉取：git pull

### 子模块代码拉取

git submodule update --init --recursive

or

git submodule init 

git submodule update
### 提示权限不够解决办法
```bash
sudo chown your_user_name your_folder_name -R
  -R表示递归。
```

# 命令
## fetch
fetch只是取回远端的更新，不会影响本地的代码
```bash
# 取回全部更新
git fetch origin
# 取回指定更新 
git fetch 远端主机 远端分支
```

## 基于远端创建本地分支

## 以往总结
### git clone克隆

```bash
git clone git@repo.we.com:morton.huang/homeapp.git
```

如果要指定不同的目录名，可以将目录名作为`git clone`命令的第二个参数。

 ```javascript
 $ git clone <版本库的网址> <本地目录名>
 ```

### 删除本地分支
git branch -d 分知名

### 其他
初始化repository，将当前目录成为repository

```bash
$ git init
Initialized empty Git repository in /Users/michael/learngit/.git/
```

添加文件到git（先将文件放到目录）

```bash
$ git add readme.txt
```

提交到git，一次提交完成的多个操作（删除、添加、修改）

```bash
$ git commit -m "内容说明"
```

从当前节点创建分支

```bash
$ git branch 分支名
```

在当前节点切换到其他分支

``` f
git checkout 分支名
```

创建分支且切换

```bash
git checkout -b 分支名
```

合并分支到main里

```bash
git merge 分支名
```

将当前分支，复制到目标分支上，位置不变

```bash
git rebase 分支名
```



查看有无文件没被提交

```bash
$ git status
```

查看文件修改历史

```bash
$ git diff readme.txt 
```

显示从最近到最远的提交日志，

```bash
$ git log
```

### 版本回退

- `HEAD`指向的版本就是当前版本，因此，Git允许我们在版本的历史之间穿梭，使用命令`git reset --hard commit_id`。
- 穿梭前，用`git log`可以查看提交历史，以便确定要回退到哪个版本。
- 要重返未来，用`git reflog`查看命令历史，以便确定要回到未来的哪个版本。


