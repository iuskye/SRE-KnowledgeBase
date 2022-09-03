<h1 align="center">初识 FastDFS 文件存储系统</h1>

## 1 下载解压源码

### 1.1 安装编译器

```shell
yum -y install gcc gcc-c++ libevent perl wget unzip patch
```

### 1.2 下载源码

```shell
## 全部下载到 fastdfs 目录下
mkdir -p /opt/fastdfs
cd /opt/fastdfs
## 以下这些是必须用到的源码
## 官方地址：https://github.com/happyfish100
wget http://192.168.1.98:8888/PUBLIC/Linux/CentOS/FastDFS/fastdfs-6.08.tar.gz
wget http://192.168.1.98:8888/PUBLIC/Linux/CentOS/FastDFS/fastdfs-nginx-module-1.22.tar.gz
wget http://192.168.1.98:8888/PUBLIC/Linux/CentOS/FastDFS/libfastcommon-1.0.59.tar.gz
## Nginx 相关源码包
wget http://192.168.1.98:8888/PUBLIC/Linux/CentOS/Nginx/nginx-1.22.0.tar.gz  
wget http://192.168.1.98:8888/PUBLIC/Linux/CentOS/Nginx/openssl-1.1.1p.tar.gz  
wget http://192.168.1.98:8888/PUBLIC/Linux/CentOS/Nginx/pcre-8.37.tar.gz  
wget http://192.168.1.98:8888/PUBLIC/Linux/CentOS/Nginx/zlib-1.2.11.tar.gz
wget http://192.168.1.98:8888/PUBLIC/Linux/CentOS/Nginx/headers-more-nginx-module-master.zip  
wget http://192.168.1.98:8888/PUBLIC/Linux/CentOS/Nginx/nginx-upload-module-2.2.zip  
wget http://192.168.1.98:8888/PUBLIC/Linux/CentOS/Nginx/nginx_upstream_check_module-master.zip  
wget http://192.168.1.98:8888/PUBLIC/Linux/CentOS/Nginx/ngx_healthcheck_module.zip  
wget http://192.168.1.98:8888/PUBLIC/Linux/CentOS/Nginx/ngx_http_proxy_connect_module-master.zip
```

### 1.3 解压源码包

```shell
cd /opt/fastdfs/
tar zxf fastdfs-6.08.tar.gz
tar zxf fastdfs-nginx-module-1.22.tar.gz
tar zxf libfastcommon-1.0.59.tar.gz
tar zxf nginx-1.22.0.tar.gz  
tar zxf openssl-1.1.1p.tar.gz  
tar zxf pcre-8.37.tar.gz  
tar zxf zlib-1.2.11.tar.gz
unzip -q headers-more-nginx-module-master.zip
unzip -q nginx-upload-module-2.2.zip
unzip -q nginx_upstream_check_module-master.zip
unzip -q ngx_healthcheck_module.zip
unzip -q ngx_http_proxy_connect_module-master.zip
```

## 2 编译安装 FastDFS

```shell
## 编译安装 libfastcommon
cd libfastcommon-1.0.59/
./make.sh 
./make.sh install
## 编译安装 fastdfs
cd ../fastdfs-6.08
./make.sh 
./make.sh install
## 拷贝配置文件
cp /opt/fastdfs/fastdfs-6.08/conf/http.conf /etc/fdfs/
cp /opt/fastdfs/fastdfs-6.08/conf/mime.types /etc/fdfs/
## 修改配置文件
vi /etc/fdfs/http.conf
http.anti_steal.token_check_fail = /etc/fdfs/anti-steal.jpg
```

## 3 配置

```shell
## 创建用户和存储目录
useradd fastdfs
su - "fastdfs" -c "mkdir -p /home/fastdfs/fastdfs/{tracker,storage,client}"
## 配置 tracker，使用搜索功能搜索修改原值
vi /etc/fdfs/tracker.conf
base_path = /home/fastdfs/fastdfs/tracker
## 启动 tracker
/usr/bin/fdfs_trackerd /etc/fdfs/tracker.conf
## 设置开机自启动
echo "/usr/bin/fdfs_trackerd /etc/fdfs/tracker.conf" | tee -a /etc/rc.d/rc.local
chmod +x /etc/rc.d/rc.local

## 配置 storage，使用搜索功能搜索修改原值
vi /etc/fdfs/storage.conf
base_path = /home/fastdfs/fastdfs/storage
store_path0 = /home/fastdfs/fastdfs/storage
## 将其中一个 IP 地址改为本机 IP 地址，第二个注释掉
tracker_server = 192.168.0.181:22122
# tracker_server = 192.168.209.122:22122
## 启动 storage
/usr/bin/fdfs_storaged /etc/fdfs/storage.conf
## 设置开机自启动
echo "/usr/bin/fdfs_storaged /etc/fdfs/storage.conf" | tee -a /etc/rc.d/rc.local

## 查询进程
ps -ef | grep fdfs
```

## 4 客户端测试

```shell
## 配置 Client，使用搜索功能搜索修改原值
vi /etc/fdfs/client.conf
base_path = /home/fastdfs/fastdfs/client
## 将其中一个 IP 地址改为本机 IP 地址，第二个注释掉
tracker_server = 192.168.0.181:22122
# tracker_server = 192.168.0.197:22122

## 创建测试文件
echo "<h1>Hello</h1>" > /opt/fastdfs/a.html

## 上传文件
/usr/bin/fdfs_test /etc/fdfs/client.conf upload /opt/fastdfs/a.html

This is FastDFS client test program v6.08

Copyright (C) 2008, Happy Fish / YuQing

FastDFS may be copied only under the terms of the GNU General
Public License V3, which may be found in the FastDFS source kit.
Please visit the FastDFS Home Page http://www.fastken.com/ 
for more detail.

[2022-08-17 20:49:27] DEBUG - base_path=/home/fastdfs/fastdfs/client, connect_timeout=5, network_timeout=60, tracker_server_count=1, anti_steal_token=0, anti_steal_secret_key length=0, use_connection_pool=0, g_connection_pool_max_idle_time=3600s, use_storage_id=0, storage server id count: 0

tracker_query_storage_store_list_without_group: 
        server 1. group_name=, ip_addr=192.168.0.181, port=23000

group_name=group1, ip_addr=192.168.0.181, port=23000
storage_upload_by_filename
group_name=group1, remote_filename=M00/00/00/wKgAtWL849eAFwFBAAAAD5dYWoA69.html
source ip address: 192.168.0.181
file timestamp=2022-08-17 20:49:27
file size=15
file crc32=2539149952
example file url: http://192.168.0.181/group1/M00/00/00/wKgAtWL849eAFwFBAAAAD5dYWoA69.html
storage_upload_slave_by_filename
group_name=group1, remote_filename=M00/00/00/wKgAtWL849eAFwFBAAAAD5dYWoA69_big.html
source ip address: 192.168.0.181
file timestamp=2022-08-17 20:49:27
file size=15
file crc32=2539149952
example file url: http://192.168.0.181/group1/M00/00/00/wKgAtWL849eAFwFBAAAAD5dYWoA69_big.html
```

`注意上述 URL 地址，后面我们会用到！`

## 5 配置 http 协议

### 5.1 编译安装 Nginx

```shell
## 修改插件配置
vi /opt/fastdfs/fastdfs-nginx-module-1.22/src/config
## 输入冒号及后续这一段，目的是删除 local
:%s/local\///g
## 保存退出
:wq

## 拷贝配置文件
cp /opt/fastdfs/fastdfs-nginx-module-1.22/src/mod_fastdfs.conf /etc/fdfs/
## 修改配置文件中追踪器地址、分组和文件存储路径，使用搜索功能搜索修改原值
vi /etc/fdfs/mod_fastdfs.conf
tracker_server=192.168.0.181:22122
url_have_group_name = true
store_path0=/home/fastdfs/fastdfs/storage

## 给 Nginx 打 Patch
cd /opt/fastdfs/nginx-1.22.0
patch -p1 < ../ngx_http_proxy_connect_module-master/patch/proxy_connect_rewrite_102101.patch
patch -p1 < ../ngx_healthcheck_module/nginx_healthcheck_for_nginx_1.19+.patch
## 修改版本号
sed -i 's@nginx/@ZZY_WEB/@' src/core/nginx.h
sed -i 's/define NGINX_VERSION.*/define NGINX_VERSION      "22.07.31"/'  src/core/nginx.h

## 预编译
THIRD_DIR=/opt
sudo ./configure \
--prefix=${THIRD_DIR}/nginx \
--sbin-path=${THIRD_DIR}/nginx/sbin/nginx \
--conf-path=${THIRD_DIR}/nginx/conf/nginx.conf \
--error-log-path=${THIRD_DIR}/nginx/log/error.log \
--http-log-path=${THIRD_DIR}/nginx/log/access.log \
--pid-path=${THIRD_DIR}/nginx/nginx.pid \
--lock-path=${THIRD_DIR}/nginx/nginx.lock \
--user=$USER \
--group=$USER \
--with-http_ssl_module \
--with-http_stub_status_module \
--with-http_gzip_static_module \
--http-client-body-temp-path=${THIRD_DIR}/nginx/client/ \
--http-proxy-temp-path=${THIRD_DIR}/nginx/proxy/ \
--http-fastcgi-temp-path=${THIRD_DIR}/nginx/fcgi/ \
--http-uwsgi-temp-path=${THIRD_DIR}/nginx/uwsgi \
--http-scgi-temp-path=${THIRD_DIR}/nginx/scgi \
--with-stream \
--with-stream_ssl_module \
--with-stream_ssl_preread_module \
--with-stream_realip_module \
--with-http_realip_module \
--with-http_gunzip_module \
--with-http_degradation_module \
--with-mail \
--with-mail_ssl_module \
--with-http_slice_module \
--with-threads \
--with-http_addition_module \
--with-http_auth_request_module \
--with-http_dav_module \
--with-http_flv_module \
--with-http_mp4_module \
--with-http_v2_module \
--with-http_secure_link_module \
--with-pcre-jit \
--with-http_sub_module \
--with-pcre=../pcre-8.37 \
--with-openssl=../openssl-1.1.1p \
--with-zlib=../zlib-1.2.11 \
--add-module=../nginx-upload-module-2.2 \
--add-module=../ngx_healthcheck_module \
--add-module=../headers-more-nginx-module-master \
--add-module=../ngx_http_proxy_connect_module-master \
--add-module=../fastdfs-nginx-module-1.22/src \
--with-debug

## 编译安装
make -j4 && make install
```

### 5.2 修改 Nginx 配置文件

```shell
vi /opt/nginx/conf/nginx.conf
## 新增如下内容
    location /group1/M00/ {
        ngx_fastdfs_module;
    }
```

![image-20220817202907421](https://oss.iuskye.com/blog-image/image-20220817202907421.png)

### 5.3 启动 Nginx

```shell
/opt/nginx/sbin/nginx -c /opt/nginx/conf/nginx.conf
ps -ef | grep nginx
## 设置开机自启动
echo "/opt/nginx/sbin/nginx -c /opt/nginx/conf/nginx.conf" | tee -a /etc/rc.d/rc.local
```

### 5.4 浏览器访问

`http://192.168.0.181/group1/M00/00/00/wKgAtWL849eAFwFBAAAAD5dYWoA69_big.html`

此 URL 为第 4 节中上传过程中返回的地址。

![image-20220817205332680](https://oss.iuskye.com/blog-image/image-20220817205332680.png)

## 6 附录

### 6.1 关闭防火墙

如果浏览器访问不了的话考虑防火墙是否关闭：

```shell
systemctl stop firewalld
systemctl disable firewalld
```

### 6.2 参考链接

https://zhuanlan.zhihu.com/p/108481565
