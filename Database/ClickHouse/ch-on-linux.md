<h1 align="center">安装 ClickHouse 数据库</h1>

[TOC]

## 1 安装

> 本次部署以两台服务器安装四个实例节点组成集群，两分片两副本模式。

### 1.1 下载安装

```shell
## 下载软件
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://packages.clickhouse.com/rpm/clickhouse.repo
## 安装 server 端和 client 端
sudo yum install -y clickhouse-server clickhouse-client
## 下载配置文件
wget https://typecho-iuskye.oss-cn-beijing.aliyuncs.com/files/20220723-db/clickhouse_conf.tar.gz
## 解压配置文件
tar zxf clickhouse_conf.tar.gz
## 创建相关目录，在两台服务器执行
sudo mkdir -p /opt/clickhouse1/{conf,db,log,run}
sudo mkdir -p /opt/clickhouse2/{conf,db,log,run}
sudo touch /etc/cron.d/clickhouse-server
```

### 1.2 配置文件

```shell
## 配置文件服务器一实例一
sudo mv clickhouse/node1_conf1/config.xml /opt/clickhouse1/conf/
sudo mv clickhouse/node1_conf1/metrika.xml /opt/clickhouse1/conf/
sudo mv clickhouse/node1_conf1/users.xml /opt/clickhouse1/conf/
## 配置文件服务器一实例二
sudo mv clickhouse/node1_conf2/config.xml /opt/clickhouse2/conf/
sudo mv clickhouse/node1_conf2/metrika.xml /opt/clickhouse2/conf/
sudo mv clickhouse/node1_conf2/users.xml /opt/clickhouse2/conf/
## 配置文件服务器二实例一
sudo mv clickhouse/node2_conf1/config.xml /opt/clickhouse1/conf/
sudo mv clickhouse/node2_conf1/metrika.xml /opt/clickhouse1/conf/
sudo mv clickhouse/node2_conf1/users.xml /opt/clickhouse1/conf/
## 配置文件服务器二实例二
sudo mv clickhouse/node2_conf2/config.xml /opt/clickhouse2/conf/
sudo mv clickhouse/node2_conf2/metrika.xml /opt/clickhouse2/conf/
sudo mv clickhouse/node2_conf2/users.xml /opt/clickhouse2/conf/
```

### 1.3 配置启动脚本

```shell
## 配置服务器一
sudo mv clickhouse/node1_init1/clickhouse-server1 /etc/init.d/
sudo mv clickhouse/node1_init2/clickhouse-server2 /etc/init.d/
## 配置服务器二
sudo mv clickhouse/node2_init1/clickhouse-server1 /etc/init.d/
sudo mv clickhouse/node2_init2/clickhouse-server2 /etc/init.d/
```

### 1.4 修改目录属组和属主

```shell
sudo chmod +x /etc/init.d/clickhouse-server*
sudo chown -R clickhouse. /opt/clickhouse*
sudo chown -R clickhouse. /etc/init.d/clickhouse-server*
sudo rm -f /etc/init.d/clickhouse-server
```

### 1.5 添加 hosts 解析

```shell
## 配置 IP 地址，其中 LOCAL_IP 和 PEER_IP 在两台服务器分别代表本机和对端，因此分别执行时区别对待
## 其中 Zookeeper 的搭建请参照 <Zookeeper> 这一篇
LOCAL_IP=192.168.1.5
PEER_IP=192.168.1.6
ZK1_IP=192.168.1.7
ZK2_IP=192.168.1.8
ZK3_IP=192.168.1.9
cat << EOF | sudo tee -a /etc/hosts
${LOCAL_IP} iuskye-ch1
${PEER_IP} iuskye-ch2
${ZK1_IP} iuskye-zk1
${ZK2_IP} iuskye-zk2
${ZK3_IP} iuskye-zk3
EOF
```

### 1.6 数据库初始化

```shell
sudo su -s /bin/sh 'clickhouse' -c '/usr/bin/clickhouse-server --config-file /opt/clickhouse1/conf/config.xml --pid-file /opt/clickhouse1/run/clickhouse-server.pid'
## 间隔 15s
sudo su -s /bin/sh 'clickhouse' -c '/usr/bin/clickhouse-server --config-file /opt/clickhouse2/conf/config.xml --pid-file /opt/clickhouse2/run/clickhouse-server.pid'

```

如果长时间不自动退出，可 `Ctrl+C` 退出。然后使用脚本后台启动：

```shell
sudo /etc/init.d/clickhouse-server1 start
sudo /etc/init.d/clickhouse-server2 start
```

待两台服务器全部安装完毕后初始化数据表，安装是否成功可使用如下方法检验：

```shell
## 使用客户端工具连入 ClickHouse 数据库
clickhouse-client -h 192.168.1.5 --password 12345678' --port 9000
## 查看集群节点
select * from system.clusters;
```

## 2 运维

```shell
## 启动服务
sudo /etc/init.d/clickhouse-server1 start
sudo /etc/init.d/clickhouse-server2 start
## 关闭服务
sudo /etc/init.d/clickhouse-server1 stop
sudo /etc/init.d/clickhouse-server2 stop
## 查看服务状态
sudo /etc/init.d/clickhouse-server1 status
sudo /etc/init.d/clickhouse-server2 status
```

## 3 附录

官方网站：https://clickhouse.com/docs/zh/getting-started/install

