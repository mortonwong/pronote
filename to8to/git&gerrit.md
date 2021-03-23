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

## gerrit提审流程

1.新建本地分支

`git branch -b feature/分支名@英文名`

2.新建远程分支

`git push origin feature/分支名@英文名:feature/分支名@英文名`

3.暂存更改

可以用vscode直接操作(git add)

4.提交更改

`git commit -m "注解"`

5.推送到gerrit

`git push origin HEAD:refs/for/feature/分支名@英文名`

6.http://gerrit.test.com/dashboard/self 查看提审

7.

### 拉代码流程

- clone
- (待补充)

### 如何使用git从远程拉取分支代码（最直接易懂）

https://blog.csdn.net/weixin_45416217/article/details/100119585

# 命令

repository：版本库，被git管理的目录

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

从远程仓库克隆

```bash
git clone git@repo.we.com:morton.huang/homeapp.git
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

版本回退

- `HEAD`指向的版本就是当前版本，因此，Git允许我们在版本的历史之间穿梭，使用命令`git reset --hard commit_id`。
- 穿梭前，用`git log`可以查看提交历史，以便确定要回退到哪个版本。
- 要重返未来，用`git reflog`查看命令历史，以便确定要回到未来的哪个版本。

