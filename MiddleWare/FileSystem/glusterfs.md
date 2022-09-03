<h1 align="center">初识 GlusterFS 文件存储系统</h1>

## 1 安装

```shell
sudo yum install centos-release-gluster -y
sudo yum install glusterfs glusterfs-server glusterfs-fuse glusterfs-rdma -y
sudo systemctl start glusterd.service
sudo systemctl enable glusterd.service
sudo systemctl status glusterd.service
```

## 2 配置

```shell
## 配置主机名解析，IP 更换为实际 IP 地址即可；每台服务器都要执行
sudo bash -c 'cat << EOF >> /etc/hosts
192.168.2.11 server1
192.168.2.12 server2
192.168.2.13 server3
EOF'

## 在 server1 上执行
sudo gluster peer probe server2
sudo gluster peer probe server3
## 查看状态
sudo gluster peer status

## 设置卷组在 server1 上执行
sudo mkdir -p /zzy && sudo chown -R ${USER}. /zzy
## 如果不是单独的分区的话，需要加上 force 参数
sudo gluster volume create zzy replica 3 server1:/zzy server2:/zzy server3:/zzy force
## 启动卷则
sudo gluster volume start zzy
## 查询卷组状态
sudo gluster volume status zzy
```

## 3 客户端挂载

```shell
sudo yum install centos-release-gluster -y
sudo yum install glusterfs glusterfs-fuse -y
sudo mkdir /data
sudo chown -R ${USER}. /data
sudo mount -t glusterfs server1:/zzy /data
sudo mount -t glusterfs server2:/zzy /data
sudo mount -t glusterfs server3:/zzy /data
## 或者
sudo mount -t glusterfs 127.0.0.1:/zzy /data
```

##  4 运维

有时候在三台机器的集群环境下重启了服务器，重启完后发现 GlusterFS 无法正常工作，这时候我们可以手动进行重启。

### 4.1 卸载目录

> 这一步在执行的时候，有些情况下会返回：`umount: /data/ not mounted`，此时我们直接跳过即可。

```shell
sudo umount /data
```

### 4.2 关闭卷组

> 只需要在其中一台服务器执行即可。

```shell
sudo gluster volume stop zzy
```

### 4.3 重启 GlusterFS 守护进程

```shell
## 三台机器依次执行关闭命令
sudo systemctl stop glusterd
## 三台机器依次执行启动命令
sudo systemctl start glusterd
```

### 4.4 启动卷组并查看状态

```shell
## 在其中一台机器执行即可
sudo gluster volume start zzy
sudo gluster volume status zzy
## 如果出现如下类似信息即可表明成功，主要看 TCP Port 字段和 Online 字段 
```

![image-20220701175949498](https://oss.iuskye.com/blog-image/image-20220701175949498.png)

### 4.5 挂载目录

```shell
## 三台机器依次执行启动命令
sudo mount -t gluster 127.0.0.1:/zzy /data
```

## 5 FAQ

>GlusterFS 服务总结一下就是启动守护进程一个、卷组进程两个，挂载进程一个；端口分别是守护进程端口24007，卷组进程端口49152，后续端口 `+1`。

### 5.1 GlusterFS 守护进程

```bash
/usr/sbin/glusterd -p /var/run/glusterd.pid --log-level INFO
```

端口：24007，111

### 5.1 启动一个zzy卷组后，进程为

```bash
/usr/sbin/glusterfsd -s glusterfs-nodes-01 --volfile-id zzy.glusterfs-nodes-01.glusterfs-zzy -p /var/run/gluster/vols/zzy/glusterfs-nodes-01-glusterfs-zzy.pid -S /var/run/gluster/31c02248ffc86608.socket --brick-name /glusterfs/zzy -l /var/log/glusterfs/bricks/glusterfs-zzy.log --xlator-option *-posix.glusterd-uuid=f2295e80-8b9a-4cc1-bdc2-1ae5c89fdafc --process-name brick --brick-port 49152 --xlator-option zzy-server.listen-port=49152
```

端口：49152

```bash
/usr/sbin/glusterfs -s localhost --volfile-id shd/zzy -p /var/run/gluster/shd/zzy/zzy-shd.pid -l /var/log/glusterfs/glustershd.log -S /var/run/gluster/78e6d8ba530b2cec.socket --xlator-option *replicate*.node-uuid=f2295e80-8b9a-4cc1-bdc2-1ae5c89fdafc --process-name glustershd --client-pid=-6
```

这是一个监控进程！

### 5.3 再启动一个uusafe卷组后，进程为

```bash
/usr/sbin/glusterfsd -s glusterfs-nodes-01 --volfile-id uusafe.glusterfs-nodes-01.glusterfs-uusafe -p /var/run/gluster/vols/uusafe/glusterfs-nodes-01-glusterfs-uusafe.pid -S /var/run/gluster/04672df42c2d0842.socket --brick-name /glusterfs/uusafe -l /var/log/glusterfs/bricks/glusterfs-uusafe.log --xlator-option *-posix.glusterd-uuid=f2295e80-8b9a-4cc1-bdc2-1ae5c89fdafc --process-name brick --brick-port 49153 --xlator-option uusafe-server.listen-port=49153
```

端口：49153

### 5.4 挂载后启动的进程为

```bash
/usr/sbin/glusterfs --process-name fuse --volfile-server=glusterfs-nodes-01 --volfile-id=zzy /zzy
/usr/sbin/glusterfs --process-name fuse --volfile-server=glusterfs-nodes-01 --volfile-id=uusafe /uusafe
```

### 5.5 状态信息

```bash
gluster volume status all
Status of volume: uusafe
Gluster process                             TCP Port  RDMA Port  Online  Pid
------------------------------------------------------------------------------
Brick glusterfs-nodes-01:/glusterfs/uusafe  49153     0          Y       3738
Brick glusterfs-nodes-02:/glusterfs/uusafe  49153     0          Y       3495
Self-heal Daemon on localhost               N/A       N/A        Y       3706
Self-heal Daemon on glusterfs-nodes-02      N/A       N/A        Y       3469

Task Status of Volume uusafe
------------------------------------------------------------------------------
There are no active volume tasks

Status of volume: zzy
Gluster process                             TCP Port  RDMA Port  Online  Pid
------------------------------------------------------------------------------
Brick glusterfs-nodes-01:/glusterfs/zzy     49152     0          Y       3685
Brick glusterfs-nodes-02:/glusterfs/zzy     49152     0          Y       3448
Self-heal Daemon on localhost               N/A       N/A        Y       3706
Self-heal Daemon on glusterfs-nodes-02      N/A       N/A        Y       3469

Task Status of Volume zzy
------------------------------------------------------------------------------
There are no active volume tasks
```

```bash
gluster volume info

Volume Name: uusafe
Type: Replicate
Volume ID: 77b5eb26-1be9-4edd-ace2-8505f8b6051d
Status: Started
Snapshot Count: 0
Number of Bricks: 1 x 2 = 2
Transport-type: tcp
Bricks:
Brick1: glusterfs-nodes-01:/glusterfs/uusafe
Brick2: glusterfs-nodes-02:/glusterfs/uusafe
Options Reconfigured:
performance.client-io-threads: off
nfs.disable: on
storage.fips-mode-rchecksum: on
transport.address-family: inet

Volume Name: zzy
Type: Replicate
Volume ID: 1c85cc79-9aec-4267-90be-bd6b12900d4c
Status: Started
Snapshot Count: 0
Number of Bricks: 1 x 2 = 2
Transport-type: tcp
Bricks:
Brick1: glusterfs-nodes-01:/glusterfs/zzy
Brick2: glusterfs-nodes-02:/glusterfs/zzy
Options Reconfigured:
performance.client-io-threads: off
nfs.disable: on
storage.fips-mode-rchecksum: on
transport.address-family: inet
```

### 5.6 堆栈结构

- gluster：是cli命令执行工具，主要功能是解析命令行参数，然后把命令发送给glusterd模块执行。
- glusterd:是一个管理模块，处理gluster发过来的命令，处理集群管理、存储池管理、brick管理、负载均衡、快照管理等。集群信息、存储池信息和快照信息等都是以配置文件的形式存放在服务器中，当客户端挂载存储时，glusterd会把存储池的配置文件发送给客户端。
- glusterfsd：是服务端模块，存储池中的每个brick都会启动一个glusterfsd进程。此模块主要是处理客户端的读写请求，从关联的brick所在磁盘中读写数据，然后返回给客户端。
- glusterfs：是客户端模块，负责通过mount挂载集群中某台服务器的存储池，以目录的形式呈现给用户。当用户从此目录读写数据时，客户端根据从glusterd模块获取的存储池的配置文件信息，通过DHT算法计算文件所在服务器的brick位置，然后通过Infiniband RDMA 或Tcp/Ip 方式把数据发送给brick，等brick处理完，给用户返回结果。存储池的副本、条带、hash、EC等逻辑都在客户端处理。

![](https://oss.iuskye.com/blog-image/glusterfs-process-port-rel.png)

## 6 附录

官方网站：https://docs.gluster.org/en/latest/Quick-Start-Guide/Quickstart/

官方文档：https://docs.gluster.org/en/latest/Administrator-Guide/Setting-Up-Volumes/#systems-other-than-red-hat-and-debian

