<h1 align="center">安装 Mariadb 数据库</h1>

[TOC]

## 1 安装

```shell
## 下载软件
wget https://oss.iuskye.com/files/20220723-db/mariadb-10.1.9-linux-glibc_214-x86_64.tar.gz
## 创建用户
groupadd mysql
useradd -s /sbin/nologin -M mysql -g mysql
## 下载软件，注意后期可能版本号会递进
curl -O mariadb-10.1.9-linux-glibc_214-x86_64.tar.gz
## 安装依赖
yum install gperftools-libs jemalloc -y
## 解压
tar zxf mariadb-10.1.9-linux-glibc_214-x86_64.tar.gz -C /usr/local/
ln -s /usr/local/mariadb-10.1.9-linux-glibc_214-x86_64/ /usr/local/mariadb
## 修改权限
mkdir /data
chown mysql:mysql -R /data
chown mysql:mysql -R /usr/local/mariadb*
## 初始化
cd /usr/local/mariadb
./scripts/mysql_install_db --user=mysql --datadir=/data
## 配置启动脚本
cp ./support-files/mysql.server /etc/init.d/mysqld
chmod +x /etc/init.d/mysqld
## 配置启动脚本
vi /etc/init.d/mysqld
basedir=/usr/local/mariadb
datadir=/data
## 配置文件
vi /etc/my.cnf
datadir=/data
```

## 2 运维

### 2.1 启停维护

启动服务：

```bash
cd /usr/local/mariadb
bin/mysqld_safe --datadir=/data
```

客户端连接：

```shell
/usr/local/mariadb/bin/mysql -S /var/lib/mysql/mysql.sock
```

授权修改密码：

```shell
grant all privileges on *.* to 'root'@'%' identified by '12345678';
flush privileges;
```

查询服务状态：

```bash
/etc/init.d/mysqld status
```

查询服务进程：

```bash
ps aux | grep mysqld | grep -v grep    ## 一般有两个进程
```

关闭服务：

```bash
/etc/init.d/mysqld stop
```

端口查询：

```bash
ss -tnl | grep 3306
```

### 2.2 日志排查

日志路径：

```bash
cd /data
```

## 3 附录

官方网站：https://mariadb.org/documentation/

