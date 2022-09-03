<h1 align="center">部署 Ceph 分布式存储平台</h1>

## 1 新建磁盘

给三台虚拟机分别新增一块硬盘 /dev/sdb：

```bash
lsblk 
NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda               8:0    0   60G  0 disk 
├─sda1            8:1    0    1G  0 part /boot
└─sda2            8:2    0   59G  0 part 
  ├─centos-root 253:0    0 38.3G  0 lvm  /
  ├─centos-swap 253:1    0    2G  0 lvm  [SWAP]
  └─centos-home 253:2    0 18.7G  0 lvm  /home
sdb               8:16   0   50G  0 disk
```

## 2 配置 yum 源

在三个节点都执行：

```bash
cat > /etc/yum.repos.d/ceph.repo << EOF
[Ceph]
name=Ceph packages
baseurl=https://mirrors.aliyun.com/ceph/rpm-nautilus/el7/x86_64/
gpgcheck=0

[Ceph-noarch]
name=Ceph noarch packages
baseurl=https://mirrors.aliyun.com/ceph/rpm-nautilus/el7/noarch/
gpgcheck=0
EOF
```

```bash
cat > /etc/yum.repos.d/epel.repo << EOF
[epel]
name=Extra Packages for Enterprise Linux 7 - \$basearch
#baseurl=http://download.fedoraproject.org/pub/epel/7/$basearch
metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-7&arch=\$basearch
failovermethod=priority
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7

[epel-debuginfo]
name=Extra Packages for Enterprise Linux 7 - \$basearch - Debug
#baseurl=http://download.fedoraproject.org/pub/epel/7/\$basearch/debug
metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-debug-7&arch=\$basearch
failovermethod=priority
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
gpgcheck=1

[epel-source]
name=Extra Packages for Enterprise Linux 7 - \$basearch - Source
#baseurl=http://download.fedoraproject.org/pub/epel/7/SRPMS
metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-source-7&arch=\$basearch
failovermethod=priority
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
gpgcheck=1
EOF
```

## 3 创建普通用户并设置 sudo 免密并配置 hosts

在三个节点都执行：

```bash
groupadd -g 3000 ceph
useradd -u 3000 -g ceph ceph
echo "ceph" | passwd --stdin ceph
echo "ceph ALL = (root) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/ceph
chmod 0440 /etc/sudoers.d/ceph
```

```shell
## 主机名提前设置好
cat >> /etc/hosts << EOF
192.168.0.207 envtest-node1
192.168.0.208 envtest-node2
192.168.0.209 envtest-node3
EOF
```

## 4 新建的用户创建 ssh 免密登录

在第一个节点执行：

```bash
su - ceph
ssh-keygen
## 以下步骤需要输出 ceph 用户的密码，见第 3 节
ssh-copy-id ceph@envtest-node1
ssh-copy-id ceph@envtest-node2
ssh-copy-id ceph@envtest-node3
```

## 5 安装软件

在三个节点都执行：

```bash
exit    ## 其中第一个节点要从 ceph 退出到 root 用户下
yum install ceph-deploy -y
curl -o /etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7 https://archive.fedoraproject.org/pub/epel/RPM-GPG-KEY-EPEL-7
yum install python-pip -y
yum install ceph ceph-osd ceph-mds ceph-mon ceph-radosgw -y
```

```bash
yum install ntp -y
systemctl start ntpd
systemctl enable ntpd
```

Tps：安装时间同步服务的目的是为了防止后续集群因为时间不同步导致健康状态从 OK 转变为 WARN。

## 6 创建集群

在第一个节点执行：

```bash
su - ceph
mkdir cephcluster
cd cephcluster/
# 初始化创建 ceph 集群
ceph-deploy new --cluster-network 192.168.0.0/24 --public-network 192.168.0.0/24 envtest-node1 envtest-node2 envtest-node3
# 初始化 monitor 服务
ceph-deploy mon create-initial
# 配置信息拷贝到三台节点
ceph-deploy admin envtest-node1 envtest-node2 envtest-node3
sudo chown -R ceph:ceph /etc/ceph
chown -R ceph:ceph /etc/ceph    # 在其它节点执行
```

查看状态：

```bash
ceph -s
  cluster:
    id:     b02d53fd-fb18-4e03-9dd4-4c6878bac2f5
    health: HEALTH_WARN
            mons are allowing insecure global_id reclaim
 
  services:
    mon: 3 daemons, quorum envtest-node1,envtest-node2,envtest-node3 (age 64s)
    mgr: no daemons active
    osd: 0 osds: 0 up, 0 in
 
  data:
    pools:   0 pools, 0 pgs
    objects: 0 objects, 0 B
    usage:   0 B used, 0 B / 0 B avail
    pgs:
```

## 7 配置 mgr 服务

在第一个节点执行：

```bash
ceph-deploy mgr create envtest-node1 envtest-node2 envtest-node3
```

查看状态：

```bash
ceph -s
  cluster:
    id:     b02d53fd-fb18-4e03-9dd4-4c6878bac2f5
    health: HEALTH_WARN
            mons are allowing insecure global_id reclaim
 
  services:
    mon: 3 daemons, quorum envtest-node1,envtest-node2,envtest-node3 (age 89s)
    mgr: envtest-node1(active, since 5s), standbys: envtest-node2, envtest-node3
    osd: 0 osds: 0 up, 0 in
 
  data:
    pools:   0 pools, 0 pgs
    objects: 0 objects, 0 B
    usage:   0 B used, 0 B / 0 B avail
    pgs:
```

## 8 配置 osd 服务

在第一个节点执行：

```bash
ceph-deploy osd create --data /dev/sdb envtest-node1
ceph-deploy osd create --data /dev/sdb envtest-node2
ceph-deploy osd create --data /dev/sdb envtest-node3
```

## 9 配置 mon 服务

在第一个节点执行：

先查看 Ceph 集群中的 mon 服务状态：

```bash
ceph mon stat

e1: 3 mons at {envtest-node1=[v2:192.168.0.207:3300/0,v1:192.168.0.207:6789/0],envtest-node2=[v2:192.168.0.208:3300/0,v1:192.168.0.208:6789/0],envtest-node3=[v2:192.168.0.209:3300/0,v1:192.168.0.209:6789/0]}, election epoch 6, leader 0 envtest-node1, quorum 0,1,2 envtest-node1,envtest-node2,envtest-node3
```

```bash
ceph mon_status --format json-pretty

{
    "name": "envtest-node1",
    "rank": 0,
    "state": "leader",
    "election_epoch": 6,
    "quorum": [
        0,
        1,
        2
    ],
    "quorum_age": 263,
    "features": {
        "required_con": "2449958747315912708",
        "required_mon": [
            "kraken",
            "luminous",
            "mimic",
            "osdmap-prune",
            "nautilus"
        ],
        "quorum_con": "4611087854035861503",
        "quorum_mon": [
            "kraken",
            "luminous",
            "mimic",
            "osdmap-prune",
            "nautilus"
        ]
    },
    "outside_quorum": [],
    "extra_probe_peers": [
        {
            "addrvec": [
                {
                    "type": "v2",
                    "addr": "192.168.0.208:3300",
                    "nonce": 0
                },
                {
                    "type": "v1",
                    "addr": "192.168.0.208:6789",
                    "nonce": 0
                }
            ]
        },
        {
            "addrvec": [
                {
                    "type": "v2",
                    "addr": "192.168.0.209:3300",
                    "nonce": 0
                },
                {
                    "type": "v1",
                    "addr": "192.168.0.209:6789",
                    "nonce": 0
                }
            ]
        }
    ],
    "sync_provider": [],
    "monmap": {
        "epoch": 1,
        "fsid": "b02d53fd-fb18-4e03-9dd4-4c6878bac2f5",
        "modified": "2022-09-01 15:53:49.436686",
        "created": "2022-09-01 15:53:49.436686",
        "min_mon_release": 14,
        "min_mon_release_name": "nautilus",
        "features": {
            "persistent": [
                "kraken",
                "luminous",
                "mimic",
                "osdmap-prune",
                "nautilus"
            ],
            "optional": []
        },
        "mons": [
            {
                "rank": 0,
                "name": "envtest-node1",
                "public_addrs": {
                    "addrvec": [
                        {
                            "type": "v2",
                            "addr": "192.168.0.207:3300",
                            "nonce": 0
                        },
                        {
                            "type": "v1",
                            "addr": "192.168.0.207:6789",
                            "nonce": 0
                        }
                    ]
                },
                "addr": "192.168.0.207:6789/0",
                "public_addr": "192.168.0.207:6789/0"
            },
            {
                "rank": 1,
                "name": "envtest-node2",
                "public_addrs": {
                    "addrvec": [
                        {
                            "type": "v2",
                            "addr": "192.168.0.208:3300",
                            "nonce": 0
                        },
                        {
                            "type": "v1",
                            "addr": "192.168.0.208:6789",
                            "nonce": 0
                        }
                    ]
                },
                "addr": "192.168.0.208:6789/0",
                "public_addr": "192.168.0.208:6789/0"
            },
            {
                "rank": 2,
                "name": "envtest-node3",
                "public_addrs": {
                    "addrvec": [
                        {
                            "type": "v2",
                            "addr": "192.168.0.209:3300",
                            "nonce": 0
                        },
                        {
                            "type": "v1",
                            "addr": "192.168.0.209:6789",
                            "nonce": 0
                        }
                    ]
                },
                "addr": "192.168.0.209:6789/0",
                "public_addr": "192.168.0.209:6789/0"
            }
        ]
    },
    "feature_map": {
        "mon": [
            {
                "features": "0x3ffddff8ffecffff",
                "release": "luminous",
                "num": 1
            }
        ],
        "osd": [
            {
                "features": "0x3ffddff8ffecffff",
                "release": "luminous",
                "num": 1
            }
        ],
        "client": [
            {
                "features": "0x3ffddff8ffecffff",
                "release": "luminous",
                "num": 2
            }
        ]
    }
}
```

发现有 3 个 mon 服务，所以不必再次配置。

## 10 配置 mds 服务

```shell
ceph-deploy mds create envtest-node1 envtest-node2 envtest-node3
## 报如下错误
[ceph_deploy][ERROR ] RuntimeError: bootstrap-mds keyring not found; run 'gatherkeys'
## 则执行
ceph-deploy gatherkeys envtest-node1 envtest-node2 envtest-node3
## 再次执行
ceph-deploy mds create envtest-node1 envtest-node2 envtest-node3
## 查询状态
ceph mds stat
 3 up:standby
## 创建存储池
ceph osd pool create cephfs_data 64
ceph osd pool create cephfs_metadata 60
## 创建文件系统
ceph fs new cephfs cephfs_metadata cephfs_data
## 查看状态
ceph fs ls
ceph -s
  cluster:
    id:     b02d53fd-fb18-4e03-9dd4-4c6878bac2f5
    health: HEALTH_OK
 
  services:
    mon: 3 daemons, quorum envtest-node1,envtest-node2,envtest-node3 (age 54s)
    mgr: envtest-node1(active, since 117m), standbys: envtest-node3, envtest-node2
    mds: cephfs:1 {0=envtest-node3=up:active} 2 up:standby
    osd: 3 osds: 3 up (since 2h), 3 in (since 2h)
 
  data:
    pools:   2 pools, 188 pgs
    objects: 22 objects, 2.2 KiB
    usage:   3.1 GiB used, 147 GiB / 150 GiB avail
    pgs:     188 active+clean
```

```shell
## 其它命令
ceph osd pool get cephfs_data pg_num
ceph osd pool set cephfs_data pg_num 64
```

## 11 查看服务状态

在第一个节点执行：

```bash
systemctl list-units | grep ceph-mon

ceph-mon@envtest-node1.service                                                                   loaded active running   Ceph cluster monitor daemon
ceph-mon.target                                                                                  loaded active active    ceph target allowing to start/stop all ceph-mon@.service instances at once
```

```shell
systemctl list-units | grep ceph-mgr

ceph-mgr@envtest-node1.service                                                                   loaded active running   Ceph cluster manager daemon
ceph-mgr.target                                                                                  loaded active active    ceph target allowing to start/stop all ceph-mgr@.service instances at once
```

```shell
systemctl list-units | grep ceph-osd

ceph-osd@0.service                                                                               loaded active running   Ceph object storage daemon osd.0
ceph-osd.target                                                                                  loaded active active    ceph target allowing to start/stop all ceph-osd@.service instances at once
```

```shell
systemctl list-units | grep ceph-mds

ceph-mds@envtest-node1.service                                                                   loaded active running   Ceph metadata server daemon
ceph-mds.target                                                                                  loaded active active    ceph target allowing to start/stop all ceph-mds@.service instances at once
```

查看状态：

```bash
  cluster:
    id:     b02d53fd-fb18-4e03-9dd4-4c6878bac2f5
    health: HEALTH_WARN
            1 pool(s) have non-power-of-two pg_num
 
  services:
    mon: 3 daemons, quorum envtest-node1,envtest-node2,envtest-node3 (age 101m)
    mgr: envtest-node1(active, since 96m), standbys: envtest-node3, envtest-node2
    mds: cephfs:1 {0=envtest-node3=up:active} 2 up:standby
    osd: 3 osds: 3 up (since 107m), 3 in (since 107m)
 
  data:
    pools:   2 pools, 188 pgs
    objects: 22 objects, 2.2 KiB
    usage:   3.0 GiB used, 147 GiB / 150 GiB avail
    pgs:     188 active+clean
```
发现 health: HEALTH_WARN，解决方案：

```bash
su - ceph
cd ~/cephcluster/
echo "mon clock drift allowed = 2" >> ~/cephcluster/ceph.conf
echo "mon clock drift warn backoff = 30" >> ~/cephcluster/ceph.conf
echo "mon_warn_on_pool_pg_num_not_power_of_two = false" >> ~/cephcluster/ceph.conf
ceph-deploy --overwrite-conf config push envtest-node1 envtest-node2 envtest-node3
sudo systemctl restart ceph-mon.target
```

如果还不能解决，就执行如下命令禁用不安全模式：

```shell
ceph config set mon auth_allow_insecure_global_id_reclaim false
```

再次查看状态：

```bash
ceph -s
  cluster:
    id:     b02d53fd-fb18-4e03-9dd4-4c6878bac2f5
    health: HEALTH_OK
 
  services:
    mon: 3 daemons, quorum envtest-node1,envtest-node2,envtest-node3 (age 4m)
    mgr: envtest-node1(active, since 2h), standbys: envtest-node3, envtest-node2
    mds: cephfs:1 {0=envtest-node3=up:active} 2 up:standby
    osd: 3 osds: 3 up (since 2h), 3 in (since 2h)
 
  data:
    pools:   2 pools, 135 pgs
    objects: 22 objects, 2.6 KiB
    usage:   3.1 GiB used, 147 GiB / 150 GiB avail
    pgs:     0.741% pgs not active
             134 active+clean
             1   peering
```

这次状态正常了。

## 12 配置 dashboard

在三个节点都执行：

```shell
exit    ## 在第一个节点从 ceph 用户退出到 root 用户
yum -y install ceph-mgr-dashboard    ## 此步骤三个节点都要执行安装操作
```

在第一个节点执行：

```bash
su - ceph
cd ~/cephcluster/
echo "mgr initial modules = dashboard" >> ~/cephcluster/ceph.conf
ceph-deploy --overwrite-conf config push envtest-node1 envtest-node2 envtest-node3
sudo systemctl restart ceph-mgr@envtest-node1
ceph mgr module enable dashboard
ceph dashboard create-self-signed-cert
```

```bash
## 将密码写入文件
echo 'ceph@123' > dashboard-passwd
## 创建用户
ceph dashboard set-login-credentials admin -i dashboard-passwd
******************************************************************
***          WARNING: this command is deprecated.              ***
*** Please use the ac-user-* related commands to manage users. ***
******************************************************************
Username and password updated
```

```bash
ceph mgr services
{
    "dashboard": "https://envtest-node1:8443/"
}
```

打开浏览器，输入地址 `https://192.168.0.207:8443/`：

![image-20220901161443099](https://oss.iuskye.com/blog-image/image-20220901161443099.png)

输入账号面：admin，ceph@123：

![](https://picture-bed-iuskye.oss-cn-beijing.aliyuncs.com/ceph/ceph-dash.png)

## 13 使用 fuse 进行客户端挂载

在一台客户端机器操作：

```shell
## 配置 yum 源
cat > /etc/yum.repos.d/ceph.repo << EOF
[Ceph]
name=Ceph packages
baseurl=https://mirrors.aliyun.com/ceph/rpm-nautilus/el7/x86_64/
gpgcheck=0

[Ceph-noarch]
name=Ceph noarch packages
baseurl=https://mirrors.aliyun.com/ceph/rpm-nautilus/el7/noarch/
gpgcheck=0
EOF

cat > /etc/yum.repos.d/epel.repo << EOF
[epel]
name=Extra Packages for Enterprise Linux 7 - \$basearch
#baseurl=http://download.fedoraproject.org/pub/epel/7/$basearch
metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-7&arch=\$basearch
failovermethod=priority
enabled=1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7

[epel-debuginfo]
name=Extra Packages for Enterprise Linux 7 - \$basearch - Debug
#baseurl=http://download.fedoraproject.org/pub/epel/7/\$basearch/debug
metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-debug-7&arch=\$basearch
failovermethod=priority
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
gpgcheck=1

[epel-source]
name=Extra Packages for Enterprise Linux 7 - \$basearch - Source
#baseurl=http://download.fedoraproject.org/pub/epel/7/SRPMS
metalink=https://mirrors.fedoraproject.org/metalink?repo=epel-source-7&arch=\$basearch
failovermethod=priority
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
gpgcheck=1
EOF
```

```shell
## 安装客户端软件
yum install ceph-fuse ceph -y
```

```shell
## 配置 hosts
cat >> /etc/hosts << EOF
192.168.0.207 envtest-node1
192.168.0.208 envtest-node2
192.168.0.209 envtest-node3
EOF
```

```shell
## 配置开机自动挂载
echo "id=admin,conf=/etc/ceph/ceph.conf /mnt/ceph fuse.ceph defaults 0 0" >> /etc/fstab
## 拷贝密钥和配置文件
scp ceph@envtest-node1:/etc/ceph/ceph.conf /etc/ceph/
scp ceph@envtest-node1:/etc/ceph/ceph.client.admin.keyring /etc/ceph/
## 挂载生效
mount -a
## 验证
df -Th
ceph-fuse                           fuse.ceph-fuse   47G     0   47G    0% /mnt/ceph
```

## 14 使用示例

`https://kubernetes.io/zh/docs/concepts/storage/volumes/#cephfs`

`https://github.com/kubernetes/examples/tree/master/volumes/cephfs`

`https://github.com/kubernetes/examples/blob/master/volumes/cephfs/cephfs.yam`

## 15 参考链接

`https://www.cnblogs.com/weiwei2021/p/14060186.html`

`https://blog.csdn.net/weixin_43902588/article/details/109147778`

`https://www.cnblogs.com/huchong/p/12435957.html`

`https://www.cnblogs.com/sisimi/p/7700608.html`
