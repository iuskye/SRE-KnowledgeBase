<h1 align="center">安装 Elasticsearch 数据库</h1>

[TOC]

## 1 安装

>依赖于 JDK，安装参考 JDK 相关章节。

```shell
## 解压安装
wget https://oss.iuskye.com/files/20220723-db/elasticsearch-7.16.3-linux-x86_64.tar.gz
sudo tar zxf elasticsearch-7.16.3-linux-x86_64.tar.gz -C /opt
sudo ln -s /opt/elasticsearch-7.16.3 /opt/elasticsearch
sudo chown -R ${USER}.${USER} /opt/elasticsearch*
sed -i 's/## -Xms4g/-Xms4g/' /opt/elasticsearch/config/jvm.options
sed -i 's/## -Xmx4g/-Xmx4g/' /opt/elasticsearch/config/jvm.options
## 配置证书
wget https://typecho-iuskye.oss-cn-beijing.aliyuncs.com/files/20220723-db/elastic-certificates.p12
wget https://typecho-iuskye.oss-cn-beijing.aliyuncs.com/files/20220723-db/elastic-stack-ca.p12
wget https://typecho-iuskye.oss-cn-beijing.aliyuncs.com/files/20220723-db/elasticsearch.keystore
mv *.p12 *.keystore /opt/elasticsearch/config/

## 配置文件，其中 server1 需要换为实际的 IP 地址；集群状况下先跳过以下步骤
mv /opt/elasticsearch/config/elasticsearch.yml{,.bak}
cat >> /opt/elasticsearch/config/elasticsearch.yml << EOF
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.license.self_generated.type: basic
cluster.name: mbs-elasticsearch
node.name: node-1
path.data: /opt/elasticsearch/data
path.logs: /opt/elasticsearch/logs
bootstrap.memory_lock: false
bootstrap.system_call_filter: false
indices.fielddata.cache.size: 40%
network.host: 0.0.0.0
discovery.zen.minimum_master_nodes: 1
http.cors.enabled: true
http.cors.allow-origin: "*"
thread_pool.write.queue_size: 500
cluster.initial_master_nodes: ["server1:9300"]
ingest.geoip.downloader.enabled: false
EOF
## 启动服务，确保服务启动完全，使用 ps 命令查询进程
/opt/elasticsearch/bin/elasticsearch -d
## 设置密码
echo "y" | /opt/elasticsearch/bin/elasticsearch-setup-passwords auto &> /tmp/xpack.pass
e_p=`grep 'PASSWORD elastic =' /tmp/xpack.pass | awk -F '= ' '{print $2}'`
## 其中如下接口中的 127.0.0.1 需要换为你在上述配置文件中配置的 IP 地址
curl -H "Content-Type:application/json" -XPOST -u elastic:"$e_p" 'http://127.0.0.1:9200/_xpack/security/user/elastic/_password' -d '{ "password" : "12345678" }'
```

## 2 集群配置

```shell
## 在集群配置中首先按照第 1 节步骤进行安装，跳过配置文件、服务启动、密码设置
## 配置文件，分为三个节点，每个节点配置略有不同，如下示例
## 节点1
cat >> /opt/elasticsearch/config/elasticsearch.yml << EOF
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: elastic-certificates.p12
xpack.security.transport.ssl.truststore.path: elastic-certificates.p12
xpack.license.self_generated.type: basic
cluster.name: mbs-elasticsearch
node.name: node-1
path.data: /opt/elasticsearch/data
path.logs: /opt/elasticsearch/logs
bootstrap.memory_lock: false
bootstrap.system_call_filter: false
indices.fielddata.cache.size: 40%
network.bind_host: 0.0.0.0
network.publish_host: server1
discovery.zen.minimum_master_nodes: 1
http.cors.enabled: true
http.cors.allow-origin: "*"
thread_pool.write.queue_size: 500
cluster.initial_master_nodes: ["server1:9300"]
transport.tcp.port: 9300
discovery.zen.ping.unicast.hosts: ["server1:9300","server2:9300","server3:9300"]
ingest.geoip.downloader.enabled: false
EOF
## 节点2
cat >> /opt/elasticsearch/config/elasticsearch.yml << EOF
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: elastic-certificates.p12
xpack.security.transport.ssl.truststore.path: elastic-certificates.p12
xpack.license.self_generated.type: basic
cluster.name: mbs-elasticsearch
node.name: node-2
path.data: /opt/elasticsearch/data
path.logs: /opt/elasticsearch/logs
bootstrap.memory_lock: false
bootstrap.system_call_filter: false
indices.fielddata.cache.size: 40%
network.bind_host: 0.0.0.0
network.publish_host: server2
discovery.zen.minimum_master_nodes: 1
http.cors.enabled: true
http.cors.allow-origin: "*"
thread_pool.write.queue_size: 500
cluster.initial_master_nodes: ["server1:9300"]
transport.tcp.port: 9300
discovery.zen.ping.unicast.hosts: ["server1:9300","server2:9300","server3:9300"]
ingest.geoip.downloader.enabled: false
EOF
## 节点3
cat >> /opt/elasticsearch/config/elasticsearch.yml << EOF
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.security.transport.ssl.verification_mode: certificate
xpack.security.transport.ssl.keystore.path: elastic-certificates.p12
xpack.security.transport.ssl.truststore.path: elastic-certificates.p12
xpack.license.self_generated.type: basic
cluster.name: mbs-elasticsearch
node.name: node-3
path.data: /opt/elasticsearch/data
path.logs: /opt/elasticsearch/logs
bootstrap.memory_lock: false
bootstrap.system_call_filter: false
indices.fielddata.cache.size: 40%
network.bind_host: 0.0.0.0
network.publish_host: server3
discovery.zen.minimum_master_nodes: 1
http.cors.enabled: true
http.cors.allow-origin: "*"
thread_pool.write.queue_size: 500
cluster.initial_master_nodes: ["server1:9300"]
transport.tcp.port: 9300
discovery.zen.ping.unicast.hosts: ["server1:9300","server2:9300","server3:9300"]
ingest.geoip.downloader.enabled: false
EOF
## 上述配置中的 server1、server2、server3 需要分别改为各自的 IP 地址
## 启动服务，确保服务启动完全，使用 ps 命令查询进程
/opt/elasticsearch/bin/elasticsearch -d
## 待三台服务器的 Elasticsearch 都启动后再设置密码，密码操作只需要在其中一台服务器执行即可
echo "y" | /opt/elasticsearch/bin/elasticsearch-setup-passwords auto &> /tmp/xpack.pass
e_p=`grep 'PASSWORD elastic =' /tmp/xpack.pass | awk -F '= ' '{print $2}'`
## 其中如下接口中的 127.0.0.1 需要换为你在上述配置文件中配置的 IP 地址
curl -H "Content-Type:application/json" -XPOST -u elastic:"$e_p" 'http://127.0.0.1:9200/_xpack/security/user/elastic/_password' -d '{ "password" : "12345678" }'
```

## 3 运维

### 3.1 启停维护

启动服务：

```bash
/opt/elasticsearch/bin/elasticsearch -d
```

关闭服务：

```bash
ps aux | grep elasticsearch | grep -v grep | awk '{print $2}' | xargs kill -9
```

进程查询：

```bash
ps aux | grep elasticsearch | grep -v grep
```

端口查询：

```bash
ss -tnl | grep 9200    ## http 通信端口
ss -tnl | grep 9300    ## 集群通信端口
```

### 3.2 相关配置介绍

配置文件路径：

```bash
/opt/elasticsearch/config/elasticsearch.yml
```

配置部分字段解释：

```shell
xpack.security.enabled: true    ## xpack安全增强配置
xpack.security.transport.ssl.enabled: true    ## xpack安全增强配置
xpack.license.self_generated.type: basic    ## xpack安全增强配置
cluster.name: mbs-elasticsearch    ## 集群名字，自定义
node.name: node-1    ## 集群内节点名称
path.data: /opt/elasticsearch/data    ## 数据存储路径
path.logs: /opt/elasticsearch/logs    ## 日志存储路径
bootstrap.memory_lock: false
bootstrap.system_call_filter: false
indices.fielddata.cache.size: 40%
network.host: 127.0.0.1    ## bind 地址
discovery.zen.minimum_master_nodes: 1
http.cors.enabled: true
http.cors.allow-origin: "*"
thread_pool.write.queue_size: 500
cluster.initial_master_nodes: ["127.0.0.1:9300"]    ## 集群内 master 节点
# transport.tcp.port: 9300    ## 集群通信端口
# discovery.zen.ping.unicast.hosts: ["127.0.0.1:9300","server2:9300"]    ## 集群内所有节点
```

## 4 常用 API 查询

查询集群健康状况：

```bash
curl -u 'elastic:12345678' http://127.0.0.1:9200/_cat/health?pretty
```

查询集群节点列表：

```bash
curl -u 'elastic:12345678' http://127.0.0.1:9200/_cat/nodes?v
```

查询所有索引列表：

```bash
curl -u 'elastic:12345678' http://127.0.0.1:9200/_cat/indices?v
```

查询某个索引：

```bash
curl -u 'elastic:12345678' -XGET http://127.0.0.1:9200/chat_message_detail?pretty
## chat_message_detail 是索引名
```

解除 Elasticsearch 只读模式：

```bash
curl -XPUT -H "Content-Type: application/json" -u 'elastic:12345678' http://127.0.0.1:9200/_all/_settings -d '{"index.blocks.read_only_allow_delete": false}'
```

- 一般发生只读模式的原因是 ElasticSearch 所在磁盘分区空间占用超过了 95%。ElasticSearch 解除只读状态后，需要重启下业务服务，例如 MMBA 或者 AMM 等。

查看某个索引的 doc 数量：

```bash
curl -s -u 'elastic:12345678' -XGET 'http://127.0.0.1:9200/_cat/indices/data_api_service_log?v' | awk -F ' ' {'print $7'} | grep -v docs.count
```

查询总 doc 数量：

```bash
# 安装 epel 源
sudo yum install epel-release -y

# 安装 jq 工具，一个 json 分割工具
sudo yum install jq -y

# 查询总 doc 数量
curl -u 'elastic:12345678' -s 'http://172.16.10.11:9200/_all/_search' -H 'Content-Type: application/json' --data-binary '{"track_total_hits": true,"query": {"bool": {"must": [],"must_not": [],"should": [{"match_all": {}}]}},"from": 0,"sort": [],"aggs": {},"version": true}' --compressed --insecure | jq '.hits.total.value'
```

## 5 Elasticsearch 重置密码

```shell
echo "y" | /opt/elasticsearch/bin/elasticsearch-setup-passwords auto &> /tmp/xpack.pass
e_p=`grep 'PASSWORD elastic =' /tmp/xpack.pass | awk -F '= ' '{print $2}'`
## 其中如下接口中的 127.0.0.1 需要换为你在上述配置文件中配置的 IP 地址
curl -H "Content-Type:application/json" -XPOST -u elastic:"$e_p" 'http://127.0.0.1:9200/_xpack/security/user/elastic/_password' -d '{ "password" : "12345678" }'
```

