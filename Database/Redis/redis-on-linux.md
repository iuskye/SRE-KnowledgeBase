<h1 align="center">安装 Redis 数据库</h1>

[TOC]

## 1 编译安装

### 1.1 安装 C 编译器

```shell
yum install gcc gcc-c++ -y
```

### 1.2 编译安装 Redis

```shell
curl -O https://download.redis.io/releases/redis-6.2.7.tar.gz
tar zxf redis-6.2.7.tar.gz
cd redis-6.2.7/
make MALLOC=libc
make install
```

### 1.3 配置文件

```shell
vi /etc/redis_6379.conf

bind 0.0.0.0
protected-mode yes
port 6379
tcp-backlog 511
timeout 0
tcp-keepalive 300
daemonize yes
pidfile /var/run/redis_6379.pid
loglevel notice
logfile "/var/log/redis_6379.log"
databases 16
always-show-logo no
set-proc-title yes
proc-title-template "{title} {listen-addr} {server-mode}"
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
rdb-del-sync-files no
dir "/var/lib/redis_6379"
replica-serve-stale-data yes
replica-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-diskless-load disabled
repl-disable-tcp-nodelay no
replica-priority 100
acllog-max-len 128
requirepass 123456
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no
lazyfree-lazy-user-del no
lazyfree-lazy-user-flush no
oom-score-adj no
oom-score-adj-values 0 200 800
disable-thp yes
appendonly no
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
lua-time-limit 5000
slowlog-log-slower-than 10000
slowlog-max-len 128
latency-monitor-threshold 0
notify-keyspace-events ""
hash-max-ziplist-entries 512
hash-max-ziplist-value 64
list-max-ziplist-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64
hll-sparse-max-bytes 3000
stream-node-max-bytes 4096
stream-node-max-entries 100
activerehashing yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
hz 10
dynamic-hz yes
aof-rewrite-incremental-fsync yes
rdb-save-incremental-fsync yes
jemalloc-bg-thread yes
```

### 1.4 启动服务

```shell
## 创建相关目录
mkdir -p /var/lib/redis_6379 /var/log/redis_6379
## 启动服务
/usr/local/bin/redis-server /etc/redis_6379.conf
## 加入开机自启动
echo "/usr/local/bin/redis-server /etc/redis_6379.conf" >> /etc/rc.d/rc.local
chmod a+x /etc/rc.d/rc.local
## 连接测试
redis-cli -a 123456
127.0.0.1:6379> info
```

## 2 主从配置

### 2.1 配置文件

```shell
vi /etc/redis_6380.conf

bind 0.0.0.0
protected-mode yes
port 6380
tcp-backlog 511
timeout 0
tcp-keepalive 300
daemonize yes
pidfile /var/run/redis_6380.pid
loglevel notice
logfile "/var/log/redis_6380/redis.log"
databases 16
always-show-logo no
set-proc-title yes
proc-title-template "{title} {listen-addr} {server-mode}"
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
rdb-del-sync-files no
dir "/var/lib/redis_6380"
replica-serve-stale-data yes
replica-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-diskless-load disabled
repl-disable-tcp-nodelay no
replica-priority 100
acllog-max-len 128
requirepass 123456
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no
lazyfree-lazy-user-del no
lazyfree-lazy-user-flush no
oom-score-adj no
oom-score-adj-values 0 200 800
disable-thp yes
appendonly no
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
lua-time-limit 5000
slowlog-log-slower-than 10000
slowlog-max-len 128
latency-monitor-threshold 0
notify-keyspace-events ""
hash-max-ziplist-entries 512
hash-max-ziplist-value 64
list-max-ziplist-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64
hll-sparse-max-bytes 3000
stream-node-max-bytes 4096
stream-node-max-entries 100
activerehashing yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
hz 10
dynamic-hz yes
aof-rewrite-incremental-fsync yes
rdb-save-incremental-fsync yes
jemalloc-bg-thread yes
slaveof 192.168.2.131 6379
```

### 2.2 启动服务

```shell
## 创建相关目录
mkdir -p /var/lib/redis_6380 /var/log/redis_6380
## 启动服务
/usr/local/bin/redis-server /etc/redis_6380.conf
## 加入开机自启动
echo "/usr/local/bin/redis-server /etc/redis_6380.conf" >> /etc/rc.d/rc.local
chmod a+x /etc/rc.d/rc.local
## 查看从库信息
redis-cli -a 123456 -p 6380
127.0.0.1:6380> info Replication
# Replication
role:slave
master_host:192.168.2.131
master_port:6379
master_link_status:down
master_last_io_seconds_ago:-1
master_sync_in_progress:0
slave_read_repl_offset:1
slave_repl_offset:1
master_link_down_since_seconds:-1
slave_priority:100
slave_read_only:1
replica_announced:1
connected_slaves:0
master_failover_state:no-failover
master_replid:8b7d7d9456e61557d2d911be598fa2bdeaefb6c4
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
```

### 2.3 服务管理脚本

```shell
vi redis.sh
```

```shell
#!/bin/sh

function start_redis() {
    /usr/local/bin/redis-server /etc/redis_6379.conf
    sleep 2
    /usr/local/bin/redis-server /etc/redis_6380.conf
}

function stop_redis() {
    redis-cli -a '123456' -p 6380 shutdown
    sleep 2
    redis-cli -a '123456' -p 6379 shutdown
}

function status_redis() {
    ps aux | grep redis-server | grep 6379 | grep -v grep
    ps aux | grep redis-server | grep 6380 | grep -v grep
}

case "$1" in
start)
    start_redis
    ;;
stop)
    stop_redis
    ;;
status)
    status_redis
    ;;
*)
    echo "参数错误."
    exit 1
    ;;
esac
```

## 3 哨兵模式

### 3.1 哨兵节点一

配置：

```shell
## 创建目录
mkdir -p /opt/redis-sentinel/redis-27001/{db,log,conf}
## 创建配置文件
vi /opt/redis-sentinel/redis-27001/conf/sentinel.conf
#-------------------------------------------------
port 27001
daemonize yes
dir "/opt/redis-sentinel/redis-27001/db"
logfile "/opt/redis-sentinel/redis-27001/log/sentinel.log"
pidfile "/opt/redis-sentinel/redis-27001/log/sentinel.pid"
protected-mode no
sentinel myid 11209fee9229ec78214dc7097202ccdc22a770ff
sentinel deny-scripts-reconfig yes
sentinel monitor mymaster 192.168.2.131 6379 2
sentinel auth-pass mymaster 123456
sentinel config-epoch mymaster 0
sentinel leader-epoch mymaster 0
sentinel known-replica mymaster 192.168.2.131 6380
sentinel current-epoch 0
#-------------------------------------------------
```

启动：

```shell
## 启动服务
/usr/local/bin/redis-sentinel /opt/redis-sentinel/redis-27001/conf/sentinel.conf
## 设置开机自启动
echo "/usr/local/bin/redis-sentinel /opt/redis-sentinel/redis-27001/conf/sentinel.conf" >> /etc/rc.local
```

### 3.2 哨兵节点二

配置：

```shell
## 创建目录
mkdir -p /opt/redis-sentinel/redis-27002/{db,log,conf}
## 创建配置文件
vi /opt/redis-sentinel/redis-27002/conf/sentinel.conf
#-------------------------------------------------
port 27002
daemonize yes
dir "/opt/redis-sentinel/redis-27002/db"
logfile "/opt/redis-sentinel/redis-27002/log/sentinel.log"
pidfile "/opt/redis-sentinel/redis-27002/log/sentinel.pid"
protected-mode no
sentinel deny-scripts-reconfig yes
sentinel monitor mymaster 192.168.2.131 6379 2
sentinel auth-pass mymaster 123456
sentinel config-epoch mymaster 0
sentinel leader-epoch mymaster 0
sentinel known-replica mymaster 192.168.2.131 6380
sentinel current-epoch 0
#-------------------------------------------------
```

启动：

```shell
## 启动服务
/usr/local/bin/redis-sentinel /opt/redis-sentinel/redis-27002/conf/sentinel.conf
## 设置开机自启动
echo "/usr/local/bin/redis-sentinel /opt/redis-sentinel/redis-27002/conf/sentinel.conf" >> /etc/rc.local
```

### 3.3 哨兵节点三

配置：

```shell
## 创建目录
mkdir -p /opt/redis-sentinel/redis-27003/{db,log,conf}
## 创建配置文件
vi /opt/redis-sentinel/redis-27003/conf/sentinel.conf
#-------------------------------------------------
port 27003
daemonize yes
dir "/opt/redis-sentinel/redis-27003/db"
logfile "/opt/redis-sentinel/redis-27003/log/sentinel.log"
pidfile "/opt/redis-sentinel/redis-27003/log/sentinel.pid"
protected-mode no
sentinel deny-scripts-reconfig yes
sentinel monitor mymaster 192.168.2.131 6379 2
sentinel auth-pass mymaster 123456
sentinel config-epoch mymaster 0
sentinel leader-epoch mymaster 0
sentinel known-replica mymaster 192.168.2.131 6380
sentinel current-epoch 0
#-------------------------------------------------
```

启动：

```shell
## 启动服务
/usr/local/bin/redis-sentinel /opt/redis-sentinel/redis-27003/conf/sentinel.conf
## 设置开机自启动
echo "/usr/local/bin/redis-sentinel /opt/redis-sentinel/redis-27003/conf/sentinel.conf" >> /etc/rc.local
```

### 3.4 服务管理脚本

```shell
vi redis_sen.sh
```

```shell
#!/bin/sh

function start_sentinel() {
    /usr/local/bin/redis-sentinel /opt/redis-sentinel/redis-27001/conf/sentinel.conf
    sleep 2
    /usr/local/bin/redis-sentinel /opt/redis-sentinel/redis-27002/conf/sentinel.conf
    sleep 2
    /usr/local/bin/redis-sentinel /opt/redis-sentinel/redis-27003/conf/sentinel.conf
}

function stop_sentinel() {
    ps aux | grep redis-sentinel | grep 27001 | grep -v grep | awk '{print $2}' | xargs kill -9
    sleep 1
    ps aux | grep redis-sentinel | grep 27002 | grep -v grep | awk '{print $2}' | xargs kill -9
    sleep 1
    ps aux | grep redis-sentinel | grep 27003 | grep -v grep | awk '{print $2}' | xargs kill -9
}

function status_sentinel() {
    ps aux | grep redis-sentinel | grep 27001 | grep -v grep
    ps aux | grep redis-sentinel | grep 27002 | grep -v grep
    ps aux | grep redis-sentinel | grep 27003 | grep -v grep
}

case "$1" in
start)
    start_sentinel
    ;;
stop)
    stop_sentinel
    ;;
status)
    status_sentinel
    ;;
*)
    echo "参数错误."
    exit 1
    ;;
esac
```

## 4 集群模式

创建相关目录：

```shell
mkdir -p /opt/redis-cluster/redis-{7001,7002,7003,7004,7005,7006}/{log,db,conf}
```

### 4.1 创建配置文件

#### 4.1.1 节点一

```shell
vi /opt/redis-cluster/redis-7001/conf/redis.conf
```

```shell
bind 0.0.0.0
protected-mode yes
port 7001
tcp-backlog 511
timeout 0
tcp-keepalive 300
daemonize yes
pidfile /opt/redis-cluster/redis-7001/log/redis.pid
loglevel notice
logfile "/opt/redis-cluster/redis-7001/log/redis.log"
databases 16
always-show-logo no
set-proc-title yes
proc-title-template "{title} {listen-addr} {server-mode}"
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
rdb-del-sync-files no
dir "/opt/redis-cluster/redis-7001/db"
replica-serve-stale-data yes
replica-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-diskless-load disabled
repl-disable-tcp-nodelay no
replica-priority 100
acllog-max-len 128
requirepass 123456
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no
lazyfree-lazy-user-del no
lazyfree-lazy-user-flush no
oom-score-adj no
oom-score-adj-values 0 200 800
disable-thp yes
appendonly no
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
lua-time-limit 5000
slowlog-log-slower-than 10000
slowlog-max-len 128
latency-monitor-threshold 0
notify-keyspace-events ""
hash-max-ziplist-entries 512
hash-max-ziplist-value 64
list-max-ziplist-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64
hll-sparse-max-bytes 3000
stream-node-max-bytes 4096
stream-node-max-entries 100
activerehashing yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
hz 10
dynamic-hz yes
aof-rewrite-incremental-fsync yes
rdb-save-incremental-fsync yes
jemalloc-bg-thread yes
cluster-enabled yes
cluster-config-file /opt/redis-cluster/redis-7001/conf/nodes.conf
cluster-node-timeout 15000
```

#### 4.1.2 节点二

```shell
vi /opt/redis-cluster/redis-7002/conf/redis.conf
```

```shell
bind 0.0.0.0
protected-mode yes
port 7002
tcp-backlog 511
timeout 0
tcp-keepalive 300
daemonize yes
pidfile /opt/redis-cluster/redis-7002/log/redis.pid
loglevel notice
logfile "/opt/redis-cluster/redis-7002/log/redis.log"
databases 16
always-show-logo no
set-proc-title yes
proc-title-template "{title} {listen-addr} {server-mode}"
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
rdb-del-sync-files no
dir "/opt/redis-cluster/redis-7002/db"
replica-serve-stale-data yes
replica-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-diskless-load disabled
repl-disable-tcp-nodelay no
replica-priority 100
acllog-max-len 128
requirepass 123456
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no
lazyfree-lazy-user-del no
lazyfree-lazy-user-flush no
oom-score-adj no
oom-score-adj-values 0 200 800
disable-thp yes
appendonly no
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
lua-time-limit 5000
slowlog-log-slower-than 10000
slowlog-max-len 128
latency-monitor-threshold 0
notify-keyspace-events ""
hash-max-ziplist-entries 512
hash-max-ziplist-value 64
list-max-ziplist-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64
hll-sparse-max-bytes 3000
stream-node-max-bytes 4096
stream-node-max-entries 100
activerehashing yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
hz 10
dynamic-hz yes
aof-rewrite-incremental-fsync yes
rdb-save-incremental-fsync yes
jemalloc-bg-thread yes
cluster-enabled yes
cluster-config-file /opt/redis-cluster/redis-7002/conf/nodes.conf
cluster-node-timeout 15000
```

#### 4.1.3 节点三

```shell
vi /opt/redis-cluster/redis-7003/conf/redis.conf
```

```shell
bind 0.0.0.0
protected-mode yes
port 7003
tcp-backlog 511
timeout 0
tcp-keepalive 300
daemonize yes
pidfile /opt/redis-cluster/redis-7003/log/redis.pid
loglevel notice
logfile "/opt/redis-cluster/redis-7003/log/redis.log"
databases 16
always-show-logo no
set-proc-title yes
proc-title-template "{title} {listen-addr} {server-mode}"
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
rdb-del-sync-files no
dir "/opt/redis-cluster/redis-7003/db"
replica-serve-stale-data yes
replica-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-diskless-load disabled
repl-disable-tcp-nodelay no
replica-priority 100
acllog-max-len 128
requirepass 123456
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no
lazyfree-lazy-user-del no
lazyfree-lazy-user-flush no
oom-score-adj no
oom-score-adj-values 0 200 800
disable-thp yes
appendonly no
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
lua-time-limit 5000
slowlog-log-slower-than 10000
slowlog-max-len 128
latency-monitor-threshold 0
notify-keyspace-events ""
hash-max-ziplist-entries 512
hash-max-ziplist-value 64
list-max-ziplist-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64
hll-sparse-max-bytes 3000
stream-node-max-bytes 4096
stream-node-max-entries 100
activerehashing yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
hz 10
dynamic-hz yes
aof-rewrite-incremental-fsync yes
rdb-save-incremental-fsync yes
jemalloc-bg-thread yes
cluster-enabled yes
cluster-config-file /opt/redis-cluster/redis-7003/conf/nodes.conf
cluster-node-timeout 15000
```

#### 4.1.4 节点四

```shell
vi /opt/redis-cluster/redis-7004/conf/redis.conf
```

```shell
bind 0.0.0.0
protected-mode yes
port 7004
tcp-backlog 511
timeout 0
tcp-keepalive 300
daemonize yes
pidfile /opt/redis-cluster/redis-7004/log/redis.pid
loglevel notice
logfile "/opt/redis-cluster/redis-7004/log/redis.log"
databases 16
always-show-logo no
set-proc-title yes
proc-title-template "{title} {listen-addr} {server-mode}"
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
rdb-del-sync-files no
dir "/opt/redis-cluster/redis-7004/db"
replica-serve-stale-data yes
replica-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-diskless-load disabled
repl-disable-tcp-nodelay no
replica-priority 100
acllog-max-len 128
requirepass 123456
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no
lazyfree-lazy-user-del no
lazyfree-lazy-user-flush no
oom-score-adj no
oom-score-adj-values 0 200 800
disable-thp yes
appendonly no
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
lua-time-limit 5000
slowlog-log-slower-than 10000
slowlog-max-len 128
latency-monitor-threshold 0
notify-keyspace-events ""
hash-max-ziplist-entries 512
hash-max-ziplist-value 64
list-max-ziplist-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64
hll-sparse-max-bytes 3000
stream-node-max-bytes 4096
stream-node-max-entries 100
activerehashing yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
hz 10
dynamic-hz yes
aof-rewrite-incremental-fsync yes
rdb-save-incremental-fsync yes
jemalloc-bg-thread yes
cluster-enabled yes
cluster-config-file /opt/redis-cluster/redis-7004/conf/nodes.conf
cluster-node-timeout 15000
```

#### 4.1.5 节点五

```shell
vi /opt/redis-cluster/redis-7005/conf/redis.conf
```

```shell
bind 0.0.0.0
protected-mode yes
port 7005
tcp-backlog 511
timeout 0
tcp-keepalive 300
daemonize yes
pidfile /opt/redis-cluster/redis-7005/log/redis.pid
loglevel notice
logfile "/opt/redis-cluster/redis-7005/log/redis.log"
databases 16
always-show-logo no
set-proc-title yes
proc-title-template "{title} {listen-addr} {server-mode}"
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
rdb-del-sync-files no
dir "/opt/redis-cluster/redis-7005/db"
replica-serve-stale-data yes
replica-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-diskless-load disabled
repl-disable-tcp-nodelay no
replica-priority 100
acllog-max-len 128
requirepass 123456
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no
lazyfree-lazy-user-del no
lazyfree-lazy-user-flush no
oom-score-adj no
oom-score-adj-values 0 200 800
disable-thp yes
appendonly no
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
lua-time-limit 5000
slowlog-log-slower-than 10000
slowlog-max-len 128
latency-monitor-threshold 0
notify-keyspace-events ""
hash-max-ziplist-entries 512
hash-max-ziplist-value 64
list-max-ziplist-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64
hll-sparse-max-bytes 3000
stream-node-max-bytes 4096
stream-node-max-entries 100
activerehashing yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
hz 10
dynamic-hz yes
aof-rewrite-incremental-fsync yes
rdb-save-incremental-fsync yes
jemalloc-bg-thread yes
cluster-enabled yes
cluster-config-file /opt/redis-cluster/redis-7005/conf/nodes.conf
cluster-node-timeout 15000
```

#### 4.1.6 节点六

```shell
vi /opt/redis-cluster/redis-7006/conf/redis.conf
```

```shell
bind 0.0.0.0
protected-mode yes
port 7006
tcp-backlog 511
timeout 0
tcp-keepalive 300
daemonize yes
pidfile /opt/redis-cluster/redis-7006/log/redis.pid
loglevel notice
logfile "/opt/redis-cluster/redis-7006/log/redis.log"
databases 16
always-show-logo no
set-proc-title yes
proc-title-template "{title} {listen-addr} {server-mode}"
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
rdb-del-sync-files no
dir "/opt/redis-cluster/redis-7006/db"
replica-serve-stale-data yes
replica-read-only yes
repl-diskless-sync no
repl-diskless-sync-delay 5
repl-diskless-load disabled
repl-disable-tcp-nodelay no
replica-priority 100
acllog-max-len 128
requirepass 123456
lazyfree-lazy-eviction no
lazyfree-lazy-expire no
lazyfree-lazy-server-del no
replica-lazy-flush no
lazyfree-lazy-user-del no
lazyfree-lazy-user-flush no
oom-score-adj no
oom-score-adj-values 0 200 800
disable-thp yes
appendonly no
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
aof-use-rdb-preamble yes
lua-time-limit 5000
slowlog-log-slower-than 10000
slowlog-max-len 128
latency-monitor-threshold 0
notify-keyspace-events ""
hash-max-ziplist-entries 512
hash-max-ziplist-value 64
list-max-ziplist-size -2
list-compress-depth 0
set-max-intset-entries 512
zset-max-ziplist-entries 128
zset-max-ziplist-value 64
hll-sparse-max-bytes 3000
stream-node-max-bytes 4096
stream-node-max-entries 100
activerehashing yes
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit replica 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
hz 10
dynamic-hz yes
aof-rewrite-incremental-fsync yes
rdb-save-incremental-fsync yes
jemalloc-bg-thread yes
cluster-enabled yes
cluster-config-file /opt/redis-cluster/redis-7006/conf/nodes.conf
cluster-node-timeout 15000
```

### 4.2 启动服务

```shell
/usr/local/bin/redis-server /opt/redis-cluster/redis-7001/conf/redis.conf
/usr/local/bin/redis-server /opt/redis-cluster/redis-7002/conf/redis.conf
/usr/local/bin/redis-server /opt/redis-cluster/redis-7003/conf/redis.conf
/usr/local/bin/redis-server /opt/redis-cluster/redis-7004/conf/redis.conf
/usr/local/bin/redis-server /opt/redis-cluster/redis-7005/conf/redis.conf
/usr/local/bin/redis-server /opt/redis-cluster/redis-7006/conf/redis.conf
```

### 4.3 初始化集群

```shell
redis-cli --cluster create 192.168.2.131:7001 192.168.2.131:7002 192.168.2.131:7003 192.168.2.131:7004 192.168.2.131:7005 192.168.2.131:7006 --cluster-replicas 1 -a 123456

Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
>>> Performing hash slots allocation on 6 nodes...
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383
Adding replica 192.168.2.131:7005 to 192.168.2.131:7001
Adding replica 192.168.2.131:7006 to 192.168.2.131:7002
Adding replica 192.168.2.131:7004 to 192.168.2.131:7003
>>> Trying to optimize slaves allocation for anti-affinity
[WARNING] Some slaves are in the same host as their master
M: c0297a0f0c28dd4428c1ece7e3adb06bac683cfc 192.168.2.131:7001
   slots:[0-5460] (5461 slots) master
M: 6c53cf59903ac0d861ab239d2d262173607f7c29 192.168.2.131:7002
   slots:[5461-10922] (5462 slots) master
M: 59af396b3a172d6fb87f19fc668aef99571671cd 192.168.2.131:7003
   slots:[10923-16383] (5461 slots) master
S: e1bb6d9bcdb074df897eb5ba14c4a83849c0aada 192.168.2.131:7004
   replicates c0297a0f0c28dd4428c1ece7e3adb06bac683cfc
S: da1b9d9890fe840457146a455dc7b3356b5ecd54 192.168.2.131:7005
   replicates 6c53cf59903ac0d861ab239d2d262173607f7c29
S: 3a862535d1a7aae8b12906878b5fe4f777d2eb06 192.168.2.131:7006
   replicates 59af396b3a172d6fb87f19fc668aef99571671cd
Can I set the above configuration? (type 'yes' to accept): yes
>>> Nodes configuration updated
>>> Assign a different config epoch to each node
>>> Sending CLUSTER MEET messages to join the cluster
Waiting for the cluster to join
.
>>> Performing Cluster Check (using node 192.168.2.131:7001)
M: c0297a0f0c28dd4428c1ece7e3adb06bac683cfc 192.168.2.131:7001
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
M: 6c53cf59903ac0d861ab239d2d262173607f7c29 192.168.2.131:7002
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
M: 59af396b3a172d6fb87f19fc668aef99571671cd 192.168.2.131:7003
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
S: 3a862535d1a7aae8b12906878b5fe4f777d2eb06 192.168.2.131:7006
   slots: (0 slots) slave
   replicates 59af396b3a172d6fb87f19fc668aef99571671cd
S: e1bb6d9bcdb074df897eb5ba14c4a83849c0aada 192.168.2.131:7004
   slots: (0 slots) slave
   replicates c0297a0f0c28dd4428c1ece7e3adb06bac683cfc
S: da1b9d9890fe840457146a455dc7b3356b5ecd54 192.168.2.131:7005
   slots: (0 slots) slave
   replicates 6c53cf59903ac0d861ab239d2d262173607f7c29
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```

### 4.4 验证集群

#### 4.4.1 查询集群信息
```shell
## -c 代表连接集群
redis-cli -c -h 192.168.2.131 -p 7001 -a 123456

192.168.2.131:7001> cluster info
cluster_state:ok
cluster_slots_assigned:16384
cluster_slots_ok:16384
cluster_slots_pfail:0
cluster_slots_fail:0
cluster_known_nodes:6
cluster_size:3
cluster_current_epoch:6
cluster_my_epoch:1
cluster_stats_messages_ping_sent:160
cluster_stats_messages_pong_sent:163
cluster_stats_messages_sent:323
cluster_stats_messages_ping_received:158
cluster_stats_messages_pong_received:160
cluster_stats_messages_meet_received:5
cluster_stats_messages_received:323
```

#### 4.4.2 测试读写

```shell
## 连接到第一个节点
redis-cli -c -h 192.168.2.131 -p 7001 -a 123456
192.168.2.131:7001> set foo bar
-> Redirected to slot [12182] located at 192.168.2.131:7003
OK

## 连接到第三个节点
redis-cli -c -h 192.168.2.131 -p 7003 -a 123456
192.168.2.131:7003> get foo
"bar"
```

### 4.5 服务管理脚本

```shell
vi redis_cluster.sh
```

```shell
#!/bin/sh

function start_cluster() {
    /usr/local/bin/redis-server /opt/redis-cluster/redis-7001/conf/redis.conf
    sleep 2
    /usr/local/bin/redis-server /opt/redis-cluster/redis-7002/conf/redis.conf
    sleep 2
    /usr/local/bin/redis-server /opt/redis-cluster/redis-7003/conf/redis.conf
    sleep 2
    /usr/local/bin/redis-server /opt/redis-cluster/redis-7004/conf/redis.conf
    sleep 2
    /usr/local/bin/redis-server /opt/redis-cluster/redis-7005/conf/redis.conf
    sleep 2
    /usr/local/bin/redis-server /opt/redis-cluster/redis-7006/conf/redis.conf
}

function stop_cluster() {
    ps aux | grep cluster | grep 7006 | grep -v grep | awk '{print $2}' | xargs kill -9
    sleep 1
    ps aux | grep cluster | grep 7005 | grep -v grep | awk '{print $2}' | xargs kill -9
    sleep 1
    ps aux | grep cluster | grep 7004 | grep -v grep | awk '{print $2}' | xargs kill -9
    sleep 1
    ps aux | grep cluster | grep 7003 | grep -v grep | awk '{print $2}' | xargs kill -9
    sleep 1
    ps aux | grep cluster | grep 7002 | grep -v grep | awk '{print $2}' | xargs kill -9
    sleep 1
    ps aux | grep cluster | grep 7001 | grep -v grep | awk '{print $2}' | xargs kill -9
}

function status_cluster() {
    ps aux | grep cluster | grep 7001 | grep -v grep
    ps aux | grep cluster | grep 7002 | grep -v grep
    ps aux | grep cluster | grep 7003 | grep -v grep
    ps aux | grep cluster | grep 7004 | grep -v grep
    ps aux | grep cluster | grep 7005 | grep -v grep
    ps aux | grep cluster | grep 7006 | grep -v grep
}

case "$1" in
start)
    start_cluster
    ;;
stop)
    stop_cluster
    ;;
status)
    status_cluster
    ;;
*)
    echo "参数错误."
    exit 1
    ;;
esac
```

