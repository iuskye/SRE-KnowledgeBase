<h1 align="center">在 Win10 系统上安装 MySQL8</h1>

[TOC]

## 1 官网下载安装包

下载地址：`https://dev.mysql.com/downloads/mysql/`

![](https://oss.iuskye.com/article/2021-05-18/mysql-down.png)

## 2 解压配置

### 2.1 解压

解压后如图所示：

![](https://oss.iuskye.com/article/2021-05-18/jieya-win.png)

### 2.2 初始化配置文件

使用记事本创建配置文件 `my.ini` ：

```bash
[mysqld]
# 设置3306端口
port=3306
# 设置mysql的安装目录
basedir=D:\Application\MySQL8\mysql-8.0.25-winx64
# 设置mysql数据库的数据的存放目录
datadir=D:\Application\MySQL8\mysql-8.0.25-winx64\data
# 允许最大连接数
max_connections=200
# 允许连接失败的次数。
max_connect_errors=10
# 服务端使用的字符集默认为utf8mb4
character-set-server=utf8mb4
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
# 默认使用“mysql_native_password”插件认证
#mysql_native_password
default_authentication_plugin=mysql_native_password
[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8mb4
[client]
# 设置mysql客户端连接服务端时默认使用的端口
port=3306
default-character-set=utf8mb4
```

配置文件中的路径要和实际存放的路径一致，其中的数据目录 `data` 不用手动创建，初始化的时候会自动创建。

## 3 初始化 MySQL

使用管理员权限打开 `cmd` 控制台，切换到 `解压路径/bin` ，执行命令：

```bash
C:\Windows\system32>d:
D:\>cd D:\Application\MySQL8\mysql-8.0.25-winx64\bin

D:\Application\MySQL8\mysql-8.0.25-winx64\bin>mysqld --initialize --console
```

![](https://oss.iuskye.com/article/2021-05-18/mysql-init.png)

注意要保存上述显示的密码：

`A temporary password is generated for root@localhost: tRPLIpky:8yr` --> `tRPLIpky:8yr`

## 4 安装并启动 MySQL

安装 MySQL 服务：

```bash
D:\Application\MySQL8\mysql-8.0.25-winx64\bin>mysqld --install [服务名]      ###（服务名可以不加默认为mysql）
```

![](https://oss.iuskye.com/article/2021-05-18/mysql-install.png)

如果出现上述截图所示情况表明成功安装了！

启动 MySQL 服务：

```bash
D:\Application\MySQL8\mysql-8.0.25-winx64\bin>net start mysql
```

![](https://oss.iuskye.com/article/2021-05-18/mysql-start.png)

查看监听端口：

```bash
D:\Application\MySQL8\mysql-8.0.25-winx64\bin>netstat -ano | findstr "3306"

  TCP    0.0.0.0:3306           0.0.0.0:0              LISTENING       55656
  TCP    0.0.0.0:33060          0.0.0.0:0              LISTENING       55656
  TCP    [::]:3306              [::]:0                 LISTENING       55656
  TCP    [::]:33060             [::]:0                 LISTENING       55656
  TCP    [::1]:3306             [::1]:51309            TIME_WAIT       0
  TCP    [::1]:3306             [::1]:51334            TIME_WAIT       0
  TCP    [::1]:3306             [::1]:51338            TIME_WAIT       0
```

## 5 总结安装过程

- 初始化 MySQL
- 创建服务
- 启动服务

## 6 打开 Windows 防火墙

![](https://oss.iuskye.com/article/2021-05-18/win-1.png)

![](https://oss.iuskye.com/article/2021-05-18/win-2.png)

![](https://oss.iuskye.com/article/2021-05-18/win-3.png)

![](https://oss.iuskye.com/article/2021-05-18/win-4.png)

![](https://oss.iuskye.com/article/2021-05-18/win-5.png)

![](https://oss.iuskye.com/article/2021-05-18/win-6.png)

这里需要注意 `浏览` 选择 `MySQL解压路径\bin\mysqld.exe` 。

![](https://oss.iuskye.com/article/2021-05-18/win-7.png)

## 7 使用 Navicat 连接数据库

### 7.1 配置连接信息

![](https://oss.iuskye.com/article/2021-05-18/mysql-login-cofig.png)

### 7.2 测试连接

![](https://oss.iuskye.com/article/2021-05-18/mysql-login-test.png)

### 7.3 修改初始密码

![](https://oss.iuskye.com/article/2021-05-18/mysql-login-pass.png)

![](https://oss.iuskye.com/article/2021-05-18/mysql-login-repass.png)

### 7.4 登录成功

![](https://oss.iuskye.com/article/2021-05-18/mysql-login-already.png)

## 8 授权远程连接

默认 `mysql` 只允许本地连接，如果通过远程连接则需要进行授权，首先我们通过本地连入 `mysql`：

```bash
D:\Application\MySQL8\mysql-8.0.25-winx64\bin>mysql -uroot -p
Enter password: ********
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 19
Server version: 8.0.25 MySQL Community Server - GPL

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```

在 `mysql8` 中将创建用户和授权分开了，不再允许同一条命令执行创建用户和授权：

```bash
mysql> CREATE USER 'root'@'192.168.4.136' IDENTIFIED BY 'a-111111';
Query OK, 0 rows affected (0.05 sec)

mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.4.136' WITH GRANT OPTION;
Query OK, 0 rows affected (0.06 sec)

mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.01 sec)
```

通过 Navicat 远程连接：

![](https://oss.iuskye.com/article/2021-05-18/remote-config.png)

![](https://oss.iuskye.com/article/2021-05-18/remote-test.png)



