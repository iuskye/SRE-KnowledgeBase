<h1 align="center">安装人大金仓数据库</h1>

[TOC]

## 1 初始化操作系统

```shell
## 创建用户
useradd kingbase
## 更改安装包对应的目录权限
mkdir -p /home/kingbase/soft/V8
chown -R kingbase:kingbase /home/kingbase/soft
## 创建数据目录
mkdir -p /var/lib/kingbase
chown kingbase:kingbase /var/lib/kingbase
## 内核参数调整
cat >> /etc/sysctl.conf << EOF
fs.aio-max-nr= 1048576
fs.file-max= 6815744
kernel.shmall= 2097152
kernel.shmmax= 4294967295    # 建议最大内存的一半
kernel.shmmni= 4096
kernel.sem= 250 32000 100 128
net.ipv4.ip_local_port_range= 9000 65500
net.core.rmem_default= 262144
net.core.rmem_max= 4194304
net.core.wmem_default= 262144
net.core.wmem_max= 1048576
EOF
## 创建安装目录
su - kingbase
mkdir -p /home/kingbase/kdb
```

## 2 下载解压安装

```shell
## 下载软件
curl -o /home/kingbase/soft/V8/KingbaseES_V008R003C002B0061_Lin64_install.tar.gz https://oss.iuskye.com/files/20220723-db/KingbaseES_V008R003C002B0061_Lin64_install.tar.gz
curl -o /home/kingbase/soft/V8/license_V8R3-企业版.dat license_V8R3-企业版.dat https://oss.iuskye.com/files/20220723-db/license_V8R3-%E4%BC%81%E4%B8%9A%E7%89%88.dat
## 解压文件
cd /home/kingbase/soft/V8/
tar zxf KingbaseES_V008R003C002B0061_Lin64_install.tar.gz
## 安装部署
cd KingbaseES_V008R003C002B0061_Lin64_install/
sh setup.sh -i console
```

![image-20220629192701593](https://oss.iuskye.com/blog-image/image-20220629192701593.png)

直接回车！

![image-20220629192736303](https://oss.iuskye.com/blog-image/image-20220629192736303.png)

直接回车！

![image-20220629192815495](https://oss.iuskye.com/blog-image/image-20220629192815495.png)

直接回车！

![image-20220629192853179](https://oss.iuskye.com/blog-image/image-20220629192853179.png)

直接回车！

![image-20220629193011297](https://oss.iuskye.com/blog-image/image-20220629193011297.png)

直接回车！

![image-20220629193212200](https://oss.iuskye.com/blog-image/image-20220629193212200.png)

直接回车！

![image-20220629193252385](https://oss.iuskye.com/blog-image/image-20220629193252385.png)

直接回车！

![image-20220629193318483](https://oss.iuskye.com/blog-image/image-20220629193318483.png)

直接回车！

![image-20220629193341416](https://oss.iuskye.com/blog-image/image-20220629193341416.png)

直接回车！

![image-20220629193404454](https://oss.iuskye.com/blog-image/image-20220629193404454.png)

直接回车！

![image-20220629193443276](https://oss.iuskye.com/blog-image/image-20220629193443276.png)

输入"Y"！

![image-20220629193518994](https://oss.iuskye.com/blog-image/image-20220629193518994.png)

输入"1"！

![image-20220629193612604](https://oss.iuskye.com/blog-image/image-20220629193612604.png)

输入 License 文件路径"/home/kingbase/soft/V8/license_V8R3-企业版.dat"！

![image-20220629193743688](https://oss.iuskye.com/blog-image/image-20220629193743688.png)

输入安装路径"/home/kingbase/kdb"！

![image-20220629193828631](https://oss.iuskye.com/blog-image/image-20220629193828631.png)

输入"Y"确认安装的路径！

![image-20220629193911558](https://oss.iuskye.com/blog-image/image-20220629193911558.png)

直接回车！

![image-20220629193940888](https://oss.iuskye.com/blog-image/image-20220629193940888.png)

直接回车，再次确认安装路径！

![image-20220629194044494](https://oss.iuskye.com/blog-image/image-20220629194044494.png)

输入数据目录"/var/lib/kingbase"！

![image-20220629194142853](https://oss.iuskye.com/blog-image/image-20220629194142853.png)

直接回车，默认指定端口"54321"！

![image-20220629194211514](https://oss.iuskye.com/blog-image/image-20220629194211514.png)

直接回车，默认指定管理员用户为"SYSTEM"！

![image-20220629194257660](https://oss.iuskye.com/blog-image/image-20220629194257660.png)

输入"123456"设定管理员密码！

![image-20220629194334666](https://oss.iuskye.com/blog-image/image-20220629194334666.png)

再次确认密码！

![image-20220629195326189](https://oss.iuskye.com/blog-image/image-20220629195326189.png)

选择服务器编码，输入"1"！

![image-20220629195413437](https://oss.iuskye.com/blog-image/image-20220629195413437.png)

字符串比较是否区分大小写，输入"1"！

![image-20220629195450001](https://oss.iuskye.com/blog-image/image-20220629195450001.png)

直接回车！

![image-20220629195710852](https://oss.iuskye.com/blog-image/image-20220629195710852.png)

此时再开一个终端，切换到 root 执行 root.sh 脚本 (设定服务自启动)！

![image-20220629200232488](https://oss.iuskye.com/blog-image/image-20220629200232488.png)

![image-20220629200310865](https://oss.iuskye.com/blog-image/image-20220629200310865.png)

执行完后，回到此终端回车完成安装！

## 3 启停数据库实例

```shell
cd /home/kingbase/kdb/Server/bin/
## 启动数据库
./kingbase -D /var/lib/kingbase/ >/var/lib/kingbase/logfile 2>&1 &
## 关闭数据库
./sys_ctl stop -D /var/lib/kingbase/
```

## 4 访问数据库

```shell
cd /home/kingbase/kdb/Server/bin/
## ./ksql -Usystem -W123456 -p54321 db_name
./ksql -Usystem -W123456 -p54321 test

## -U: 指定数据库用户名
## -W: 指定数据库用户的密码
## -p: 指定数据库的监听端口
## db_name: 指定要访问的数据库,不指定默认访问跟用户名相同的数据库

## 创建数据库
/ksql -Usystem -W123456 test
ksql (V008R003C002B0061)
Type "help" for help.

test=# create database kb_testdb;
CREATE DATABASE
```

