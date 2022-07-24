<h1 align="center">安装达梦数据库</h1>

[TOC]

## 1 初始化操作系统

```shell
## 操作系统要求
CentOS 7.x，建议：CentOS 7.6
## 创建用户
groupadd dinstall
useradd -g dinstall -m -d /home/dmdba -s /bin/bash dmdba
## 设置密码
passwd dmdba
## 配置最大进程数和文件描述符
cat >> /etc/security/limits.conf << EOF
*    hard    nofile    1024000
*    soft    nofile    1024000
*    hard    nproc    1024000
*    soft    nproc    1024000
EOF
## 创建挂载点
mkdir -p /mnt/cdrom
## 下载软件
curl -o /tmp/dm8_setup_rh7_64_ent_8.1.0.147_20190328.iso https://oss.iuskye.com/files/20220723-db/dm8_setup_rh7_64_ent_8.1.0.147_20190328.iso
## 挂载 ISO 映像文件
mount -o loop /tmp/dm8_setup_rh7_64_ent_8.1.0.147_20190328.iso /mnt/cdrom
## 切换至 dmdba 用户
su - dmdba
```

## 2 安装数据库

```shell
cd /mnt/cdrom/
./DMInstall.bin -i
Please select the installer's language (E/e:English C/c:Chinese) [E/e]:C
解压安装程序..........
欢迎使用达梦数据库安装程序

是否输入Key文件路径? (Y/y:是 N/n:否) [Y/y]:n

是否设置时区? (Y/y:是 N/n:否) [Y/y]:y
设置时区:
[ 1]: GTM-12=日界线西
[ 2]: GTM-11=萨摩亚群岛
[ 3]: GTM-10=夏威夷
[ 4]: GTM-09=阿拉斯加
[ 5]: GTM-08=太平洋时间（美国和加拿大）
[ 6]: GTM-07=亚利桑那
[ 7]: GTM-06=中部时间（美国和加拿大）
[ 8]: GTM-05=东部部时间（美国和加拿大）
[ 9]: GTM-04=大西洋时间（美国和加拿大）
[10]: GTM-03=巴西利亚
[11]: GTM-02=中大西洋
[12]: GTM-01=亚速尔群岛
[13]: GTM=格林威治标准时间
[14]: GTM+01=萨拉热窝
[15]: GTM+02=开罗
[16]: GTM+03=莫斯科
[17]: GTM+04=阿布扎比
[18]: GTM+05=伊斯兰堡
[19]: GTM+06=达卡
[20]: GTM+07=曼谷，河内
[21]: GTM+08=中国标准时间
[22]: GTM+09=汉城
[23]: GTM+10=关岛
[24]: GTM+11=所罗门群岛
[25]: GTM+12=斐济
[26]: GTM+13=努库阿勒法
[27]: GTM+14=基里巴斯
请选择设置时区 [21]:21

安装类型:
1 典型安装
2 服务器
3 客户端
4 自定义
请选择安装类型的数字序号 [1 典型安装]:4
1 服务器组件
2 客户端组件
  2.1 DM管理工具
  2.2 DM性能监视工具
  2.3 DM数据迁移工具
  2.4 DM控制台工具
  2.5 DM审计分析工具
  2.6 SQL交互式查询工具
3 驱动
4 用户手册
5 数据库服务
  5.1 实时审计服务
  5.2 作业服务
  5.3 实例监控服务
  5.4 辅助插件服务
请选择安装组件的序号 (使用空格间隔) [1 2 3 4 5]:1 2 3 4 5
所需空间: 947M

请选择安装目录 [/home/dmdba/dmdbms]:
可用空间: 18G
是否确认安装路径(/home/dmdba/dmdbms)? (Y/y:是 N/n:否)  [Y/y]:y

安装前小结
安装位置: /home/dmdba/dmdbms
所需空间: 947M
可用空间: 18G
版本信息: 
有效日期: 
安装类型: 自定义
是否确认安装? (Y/y:是 N/n:否):y
2022-06-29 17:11:55 
[INFO] 安装达梦数据库...
2022-06-29 17:11:56 
[INFO] 安装 基础 模块...
2022-06-29 17:11:57 
[INFO] 安装 服务器 模块...
2022-06-29 17:11:58 
[INFO] 安装 客户端 模块...
2022-06-29 17:11:58 
[INFO] 安装 驱动 模块...
2022-06-29 17:11:58 
[INFO] 安装 手册 模块...
2022-06-29 17:11:58 
[INFO] 安装 服务 模块...
2022-06-29 17:11:59 
[INFO] 移动ant日志文件。
2022-06-29 17:12:00 
[INFO] 安装达梦数据库完成。

请以root系统用户执行命令:
/home/dmdba/dmdbms/script/root/root_installer.sh

安装结束
```

## 3 移动配置文件

```shell
## 从 dmdba 用户退出到 root 用户
exit
sh /home/dmdba/dmdbms/script/root/root_installer.sh
```

## 4 初始化数据库

```shell
## 切换至 dmdba 用户
su - dmdba
## 进行初始化
mkdir ~/dmdbms/data
cd dmdbms/bin/
./dminit path=/home/dmdba/dmdbms/data db_name=dm_dbtest instance_name=DMSERVER port_num=5236 sysdba_pwd=Dameng123 LOG_SIZE=128
initdb V8.1.0.147-Build(2019.03.27-104581)ENT 
db version: 0x7000a
file dm.key not found, use default license!
License will expire on 2022-07-13

 log file path: /home/dmdba/dmdbms/data/dm_dbtest/dm_dbtest01.log


 log file path: /home/dmdba/dmdbms/data/dm_dbtest/dm_dbtest02.log

write to dir [/home/dmdba/dmdbms/data/dm_dbtest].
create dm database success. 2022-06-29 18:06:14
```

## 5 注册和启动服务

```shell
## 从 dmdba 用户退出到 root 用户
exit
## 进行注册
cd /home/dmdba/dmdbms/script/root/
./dm_service_installer.sh -t dmserver -p DMSERVER -i /home/dmdba/dmdbms/data/dm_dbtest/dm.ini
## 启动服务
systemctl start DmServiceDMSERVER.service
```

## 6 查询进程和端口

```shell
ps -ef | grep dmserver | grep -v grep
dmdba     9718     1  4 17:52 ?        00:00:03 /home/dmdba/dmdbms/bin/dmserver /home/dmdba/dmdbms/data/DAMENG/dm.ini -noconsole
ss -tnl | grep 5236
LISTEN     0      128         :::5236                    :::*
```

## 7 查询状态

```shell
systemctl status DmServiceDMSERVER.service
```

## 8 开通防火墙端口

```shell
firewall-cmd --zone=public --add-port=5236/tcp --permanent
firewall-cmd --reload
```

## 9 安装 Windows 客户端

```shell
## 下载地址
https://oss.iuskye.com/files/20220723-db/dm8_setup_win64_ent_8.1.0.147_20190328.iso
```

![image-20220629182541314](https://oss.iuskye.com/blog-image/image-20220629182541314.png)

![image-20220629182602433](https://oss.iuskye.com/blog-image/image-20220629182602433.png)

## 10 参考文献

https://blog.csdn.net/qq_43535666/article/details/124015313

