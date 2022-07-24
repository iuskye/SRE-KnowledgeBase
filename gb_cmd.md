<h1 align="center">基本命令</h1>

## 1 Gitbook 命令行

```bash
# 初始化文件和目录
gitbook init
# 首次运行会报错，解决方案：http://events.jianshu.io/p/ecc6ef859ccd，注释即可
// fs.stat = statFix(fs.stat)
// fs.fstat = statFix(fs.fstat)
// fs.lstat = statFix(fs.lstat)

# 启动本地 server
gitbook serve

# 编译本地文件
gitbook build

# 安装插件
gitbook install
```

## 2 安装 Gitbook

```bash
# npm version: v12.18.3 以下
sudo npm install gitbook-cli -g
```

