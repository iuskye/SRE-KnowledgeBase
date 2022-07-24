<h1 align="center">安装 Etcd 数据库</h1>

[TOC]

## 1 安装

### 1.1 下载解压

```shell
## Etcd 分为单节点部署和集群部署
## 下载软件
wget https://github.com/etcd-io/etcd/releases/download/v3.5.1/etcd-v3.5.1-linux-amd64.tar.gz
## 解压
THIRD_DIR=/opt
sudo tar zxf  etcd-v3.5.1-linux-amd64.tar.gz -C ${THIRD_DIR}/
sudo ln -s ${THIRD_DIR}/etcd-v3.5.1-linux-amd64 $THIRD_DIR/etcd
sudo chown -R ${USER}.${USER} ${THIRD_DIR}/etcd-v3.5.1-linux-amd64
chmod a+x ${THIRD_DIR}/etcd/etcd ${THIRD_DIR}/etcd/etcdctl
mkdir ${THIRD_DIR}/etcd/etcd-data
```

### 1.2 单节点配置

```shell
cat >> ${THIRD_DIR}/etcd/config/etcd.conf < EOF
#[Member]
ETCD_NAME="etcd01"
ETCD_DATA_DIR="${THIRD_DIR}/etcd/etcd-data"
#本节点访问地址，地址写法是 scheme://IP:port，可以多个并用逗号隔开，如果配置是http://0.0.0.0:2379,将不限制node访问地址
ETCD_LISTEN_CLIENT_URLS="http://0.0.0.0:2379"
#本节点与其他节点进行数据交换(选举，数据同步)的监听地址，地址写法是 scheme://IP:port，可以多个并用逗号隔开，如果配置是http://0.0.0.0:2380,将不限制node访问地址
ETCD_LISTEN_PEER_URLS="http://0.0.0.0:2380"
#用于通知其他ETCD节点，客户端接入本节点的监听地址，一般来说advertise-client-urls是listen-client-urls子集
ETCD_ADVERTISE_CLIENT_URLS="http://0.0.0.0:2379"
ETCD_ENABLE_V2="true"
ETCD_QUOTA_BACKEND_BYTES=8589934592
EOF
```

### 1.3 集群配置

```shell
etcd01=192.168.1.5
etcd02=192.168.1.6
etcd03=192.168.1.7    ## 改为实际 IP 地址
## -----------------------------------------------------------------------------------
cat >> ${THIRD_DIR}/etcd/config/etcd.conf < EOF
#[Member]
ETCD_NAME="etcd01"
ETCD_DATA_DIR="${THIRD_DIR}/etcd/etcd-data"
#本节点访问地址，地址写法是 scheme://IP:port，可以多个并用逗号隔开，如果配置是http://0.0.0.0:2379,将不限制node访问地址
ETCD_LISTEN_CLIENT_URLS="http://0.0.0.0:2379"
#本节点与其他节点进行数据交换(选举，数据同步)的监听地址，地址写法是 scheme://IP:port，可以多个并用逗号隔开，如果配置是http://0.0.0.0:2380,将不限制node访问地址
ETCD_LISTEN_PEER_URLS="http://0.0.0.0:2380"
ETCD_ENABLE_V2="false"
ETCD_QUOTA_BACKEND_BYTES=8589934592
#[Clustering]
#通知其他节点与本节点进行数据交换（选举，同步）的地址，URL可以使用domain地址
ETCD_INITIAL_ADVERTISE_PEER_URLS="http://${etcd01}:2380"
#用于通知其他ETCD节点，客户端接入本节点的监听地址，一般来说advertise-client-urls是listen-client-urls子集
ETCD_ADVERTISE_CLIENT_URLS="http://${etcd01}:2379"
#集群所有节点配置，多个用逗号隔开
ETCD_INITIAL_CLUSTER="etcd01=http://${etcd01}:2380,etcd02=http://${etcd02}:2380,etcd03=http://${etcd03}:2380"
#集群唯一标识，相同标识的节点将视为在一个集群内
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster"
#节点初始化方式，new 表示如果没有集群不存在，创建新集群，existing表示如果集群不存在，节点将处于加入集群失败状态
ETCD_INITIAL_CLUSTER_STATE="new"
EOF
## -----------------------------------------------------------------------------------
cat >> ${THIRD_DIR}/etcd/config/etcd.conf < EOF
#[Member]
ETCD_NAME="etcd02"
ETCD_DATA_DIR="${THIRD_DIR}/etcd/etcd-data"
#本节点访问地址，地址写法是 scheme://IP:port，可以多个并用逗号隔开，如果配置是http://0.0.0.0:2379,将不限制node访问地址
ETCD_LISTEN_CLIENT_URLS="http://0.0.0.0:2379"
#本节点与其他节点进行数据交换(选举，数据同步)的监听地址，地址写法是 scheme://IP:port，可以多个并用逗号隔开，如果配置是http://0.0.0.0:2380,将不限制node访问地址
ETCD_LISTEN_PEER_URLS="http://0.0.0.0:2380"
ETCD_ENABLE_V2="false"
ETCD_QUOTA_BACKEND_BYTES=8589934592

#[Clustering]
#通知其他节点与本节点进行数据交换（选举，同步）的地址，URL可以使用domain地址
ETCD_INITIAL_ADVERTISE_PEER_URLS="http://${etcd02}:2380"
#用于通知其他ETCD节点，客户端接入本节点的监听地址，一般来说advertise-client-urls是listen-client-urls子集
ETCD_ADVERTISE_CLIENT_URLS="http://${etcd02}:2379"
#集群所有节点配置，多个用逗号隔开
ETCD_INITIAL_CLUSTER="etcd01=http://${etcd01}:2380,etcd02=http://${etcd02}:2380,etcd03=http://${etcd03}:2380"
#集群唯一标识，相同标识的节点将视为在一个集群内
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster"
#节点初始化方式，new 表示如果没有集群不存在，创建新集群，existing表示如果集群不存在，节点将处于加入集群失败状态
ETCD_INITIAL_CLUSTER_STATE="new"
EOF
## -----------------------------------------------------------------------------------
cat >> ${THIRD_DIR}/etcd/config/etcd.conf < EOF
#[Member]
ETCD_NAME="etcd03"
ETCD_DATA_DIR="${THIRD_DIR}/etcd/etcd-data"
#本节点访问地址，地址写法是 scheme://IP:port，可以多个并用逗号隔开，如果配置是http://0.0.0.0:2379,将不限制node访问地址
ETCD_LISTEN_CLIENT_URLS="http://0.0.0.0:2379"
#本节点与其他节点进行数据交换(选举，数据同步)的监听地址，地址写法是 scheme://IP:port，可以多个并用逗号隔开，如果配置是http://0.0.0.0:2380,将不限制node访问地址
ETCD_LISTEN_PEER_URLS="http://0.0.0.0:2380"
ETCD_ENABLE_V2="false"
ETCD_QUOTA_BACKEND_BYTES=8589934592

#[Clustering]
#通知其他节点与本节点进行数据交换（选举，同步）的地址，URL可以使用domain地址
ETCD_INITIAL_ADVERTISE_PEER_URLS="http://${etcd03}:2380"
#用于通知其他ETCD节点，客户端接入本节点的监听地址，一般来说advertise-client-urls是listen-client-urls子集
ETCD_ADVERTISE_CLIENT_URLS="http://${etcd03}:2379"
#集群所有节点配置，多个用逗号隔开
ETCD_INITIAL_CLUSTER="etcd01=http://${etcd01}:2380,etcd02=http://${etcd02}:2380,etcd03=http://${etcd03}:2380"
#集群唯一标识，相同标识的节点将视为在一个集群内
ETCD_INITIAL_CLUSTER_TOKEN="etcd-cluster"
#节点初始化方式，new 表示如果没有集群不存在，创建新集群，existing表示如果集群不存在，节点将处于加入集群失败状态
ETCD_INITIAL_CLUSTER_STATE="new"
EOF
## -----------------------------------------------------------------------------------
```

## 2 启动服务并配置密码

```shell
## 配置启动脚本
THIRD_DIR=/opt
cat >> etcd.service << EOF
[Unit]
Description=Etcd Server
After=network.target
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
#WorkingDirectory=${THIRD_DIR}/etcd/
EnvironmentFile=-${THIRD_DIR}/etcd/config/etcd.conf
User=${USER}
# set GOMAXPROCS to number of processors
ExecStart=/bin/bash -c "GOMAXPROCS=$(nproc) ${THIRD_DIR}/etcd/etcd"

Restart=on-failure
RestartSec=10s
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF
## -----------------------------------------------------------------------------------
sudo mv etcd.service /etc/systemd/system/
## 启动服务
sudo systemctl daemon-reload
sudo systemctl enable etcd
sudo systemctl restart etcd &
## 配置密码鉴权；集群状态只在其中一台机器执行即可
## 创建用户
curl -L http://127.0.0.1:2379/v3/auth/user/add -X POST -d '{"name": "root", "password": "密码"}'
## 创建 root 角色
curl -L http://127.0.0.1:2379/v3/auth/role/add -X POST -d '{"name": "root"}'
## 将用户和角色绑定
curl -L http://127.0.0.1:2379/v3/auth/user/grant  -X POST -d '{"user": "root", "role": "root"}'
## 开启鉴权模式
curl -L http://127.0.0.1:2379/v3/auth/enable -X POST -d '{}'
```

## 3 附录

官方网站：https://etcd.io/docs/v3.5/install/
