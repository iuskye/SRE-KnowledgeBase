<h1 align="center">安装 MySQL 数据库</h1>

[TOC]

> 本文安装 MySQL 5.7.x 系列预编译二进制版本；
>
> 下载页面：https://dev.mysql.com/downloads/mysql/
>
> 5.7.38 版本：https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.38-linux-glibc2.12-x86_64.tar.gz

## 1 系统环境

```shell
uname -rv
3.10.0-957.el7.x86_64 #1 SMP Thu Nov 8 23:39:32 UTC 2018
cat /etc/redhat-release 
CentOS Linux release 7.6.1810 (Core)
```

## 2 解压

```shell
tar zxf mysql-5.7.38-linux-glibc2.12-x86_64.tar.gz -C /opt
ln -s /opt/mysql-5.7.38-linux-glibc2.12-x86_64/ /opt/mysql
```

## 3 配置

### 3.1 配置文件

```shell
vi /etc/my.cnf
```

```shell
[mysqld]
#****************************** basic ******************************
user = root
datadir                             = /db/mysql
basedir                             = /opt/mysql
tmpdir                              = /tmp/tmp_mysql
port                                = 3306
socket                              = /db/mysql/mysql.sock
pid-file                            = /db/mysql/mysql.pid
#****************************** connection ******************************
max_connections                     = 8000
max_connect_errors                  = 100000
max_user_connections                = 3000
check_proxy_users                   = on
mysql_native_password_proxy_users   = on
local_infile                        = OFF
symbolic-links                      = FALSE
#****************************** sql timeout & limits ******************************
group_concat_max_len                = 4294967295
max_join_size                       = 18446744073709551615
max_execution_time                  = 0
lock_wait_timeout                   = 60
autocommit                          = 1
lower_case_table_names              = 1
thread_cache_size                   = 64
disabled_storage_engines            = "MyISAM,FEDERATED"
character_set_server                = utf8mb4
character-set-client-handshake = FALSE
collation_server = utf8mb4_general_ci
init_connect='SET NAMES utf8mb4'

transaction-isolation               = "READ-COMMITTED"
skip_name_resolve                   = ON
explicit_defaults_for_timestamp     = ON
log_timestamps                      = SYSTEM
local_infile                        = OFF
event_scheduler                     = OFF
query_cache_type                    = OFF
query_cache_size                    = 0
#lc_messages                        = en_US
#lc_messages_dir                    = /db/mysql/share
#init_connect                        = "set names utf8"
#sql_mode                           = NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO
sql_mode                            = NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
#init_file                           = /db/mysql/init_file.sql
#init_slave
#****************************** err & slow & general ******************************
log_error                               = /db/mysql/mysql.err
slave_skip_errors                       = 1032,1062
#log_output                             = "TABLE,FILE"
slow_query_log                          = ON
slow_query_log_file                     = /db/mysql/slow.log
long_query_time                         = 1
#log_queries_not_using_indexes           = ON
#log_throttle_queries_not_using_indexes  = 10
general_log                             = OFF
general_log_file                        = /db/mysql/general.log
#****************************** binlog & relaylog ******************************
expire_logs_days                    = 15
#sync_binlog                         = 1
log-bin                            = /db/mysql/mysql-bin
log-bin-index                      = /db/mysql/mysql-bin.index
max_binlog_size                     = 500M
binlog_format                       = ROW
binlog_rows_query_log_events        = ON
binlog_cache_size                   = 128k
binlog_stmt_cache_size              = 128k
log-bin-trust-function-creators     = 1
max_binlog_cache_size               = 2G
max_binlog_stmt_cache_size          = 2G
relay_log                          = /db/mysql/relay
relay_log_index                    = /db/mysql/relay.index
max_relay_log_size                  = 500M
relay_log_purge                     = ON
relay_log_recovery                  = ON
#auto-increment-increment            = 2
#auto-increment-offset               = 10001
#****************************** rpl_semi_sync ******************************
plugin-load="rpl_semi_sync_master=semisync_master.so;rpl_semi_sync_slave=semisync_slave.so"
rpl_semi_sync_master_enabled         = 1
rpl_semi_sync_slave_enabled          = 1
#rpl_semi_sync_master_timeout                = 1000
#rpl_semi_sync_master_trace_level            = 32
#rpl_semi_sync_master_wait_for_slave_count   = 1
#rpl_semi_sync_master_wait_no_slave          = ON
#rpl_semi_sync_master_wait_point             = AFTER_SYNC
#rpl_semi_sync_slave_trace_level             = 32
#****************************** group commit ******************************
#binlog_group_commit_sync_delay              =1
#binlog_group_commit_sync_no_delay_count     =1000
#****************************** gtid ******************************
#gtid_mode                          = ON
#enforce_gtid_consistency           = ON
#master_verify_checksum             = ON
#sync_master_info                   = 1
#****************************** slave ******************************
#skip-slave-start                   = 1
##read_only                         = ON
##super_read_only                   = ON
#log_slave_updates                  = ON
server_id                          = 1
#report_host                        = 172.31.40.45
#report_port                        = 3360
#slave_load_tmpdir                  = /db/mysql/tmp
#slave_sql_verify_checksum          = ON
#slave_preserve_commit_order        = 1
#****************************** muti thread slave ******************************
#slave_parallel_type                = LOGICAL_CLOCK
#slave_parallel_workers             = 4
#master_info_repository             = TABLE
#relay_log_info_repository          = TABLE
#****************************** buffer & timeout ******************************
read_buffer_size                    = 1M
read_rnd_buffer_size                = 2M
sort_buffer_size                    = 2M
join_buffer_size                    = 2M
tmp_table_size                      = 64M
max_allowed_packet                  = 128M
max_heap_table_size                 = 64M
connect_timeout                     = 43200
wait_timeout                        = 600
back_log                            = 512
interactive_timeout                 = 600
net_read_timeout                    = 30
net_write_timeout                   = 30
#****************************** myisam ******************************
skip_external_locking               = ON
key_buffer_size                     = 16M
bulk_insert_buffer_size             = 16M
concurrent_insert                   = ALWAYS
open_files_limit                    = 65000
table_open_cache                    = 16000
table_definition_cache              = 16000
#****************************** innodb ******************************
default_storage_engine              = InnoDB
default_tmp_storage_engine          = InnoDB
internal_tmp_disk_storage_engine    = InnoDB
innodb_data_home_dir                = /db/mysql
#innodb_log_group_home_dir          = /db/mysql/rlog
innodb_log_file_size                = 512M
innodb_log_files_in_group           = 3
#innodb_undo_directory              = /db/mysql/ulog
innodb_undo_log_truncate            = on
innodb_max_undo_log_size            = 1024M
innodb_read_io_threads              = 8
innodb_undo_tablespaces             = 0
innodb_flush_log_at_trx_commit      = 2
innodb_fast_shutdown                = 1
#innodb_flush_method                = O_DIRECT
innodb_io_capacity                  = 1000
innodb_io_capacity_max              = 4000
innodb_buffer_pool_size             = 4G
innodb_buffer_pool_instances        = 8
innodb_buffer_pool_chunk_size       = 128M
innodb_log_buffer_size              = 512M
innodb_autoinc_lock_mode            = 2
innodb_buffer_pool_load_at_startup  = ON
innodb_buffer_pool_dump_at_shutdown = ON
innodb_buffer_pool_dump_pct         = 15
innodb_max_dirty_pages_pct          = 85
innodb_lock_wait_timeout            = 10
#innodb_locks_unsafe_for_binlog     = 1
innodb_old_blocks_time              = 1000
innodb_open_files                   = 63000
innodb_page_cleaners                = 4
innodb_strict_mode                  = ON
innodb_thread_concurrency           = 128
innodb_sort_buffer_size             = 64M
innodb_print_all_deadlocks          = 1
innodb_rollback_on_timeout          = ON
#****************************** safe ******************************
#ssl-ca = /opt/mysql/ca-pem/ca.pem
#ssl-cert = /opt/mysql/ca-pem/server-cert.pem
#ssl-key = /opt/mysql/ca-pem/server-key.pem
[client]
socket                              = /db/mysql/mysql.sock
#default_character_set              = utf8mb4
[mysql]
#default_character_set              = utf8mb4
[ndbd default]
TransactionDeadLockDetectionTimeOut = 20000
```

### 3.2 配置启动脚本

```shell
cp /opt/mysql/support-files/mysql.server /etc/init.d/mysqld
chmod a+x /etc/init.d/mysqld
```

## 4 创建用户并赋予相关文件权限

```shell
groupadd mysql
useradd -r -g mysql -s /bin/false mysql
mkdir -p /db/mysql
mkdir -p /tmp/tmp_mysql
chown -R mysql.mysql /opt/mysql*
chown -R mysql.mysql /db/
chown -R mysql.mysql /etc/my*
chown -R mysql.mysql /tmp/tmp_mysql
```

## 5 初始化

```shell
/opt/mysql/bin/mysqld --initialize --user=mysql --basedir=/opt/mysql --datadir=/db/mysql

## 过滤出密码
grep "password" /db/mysql/mysql.err | awk '{print $NF}'
%TOTapk=b4.2
```

## 6 启动服务

```shell
## 修改启动脚本
vi /etc/init.d/mysqld
basedir=/opt/mysql
datadir=/db/mysql

## 启动服务
/etc/init.d/mysqld start

## 配置开机自启动
echo "/etc/init.d/mysqld start" >> /etc/rc.d/rc.local 
chmod a+x /etc/rc.d/rc.local
```

## 7 修改密码并赋予相关权限

```shell
## 将客户端拷贝到系统命令目录下
cp /opt/mysql/bin/mysql /usr/bin/mysql
chmod a+x /usr/bin/mysql
## 连接数据库
mysql -uroot -p'%TOTapk=b4.2'
## 修改用户授权
mysql> alter user user() identified by "12345678";
mysql> grant all on *.* to 'root'@'127.0.0.1' identified by '12345678' with grant option;
mysql> grant all on *.* to 'root'@'%' identified by '12345678' with grant option;FLUSH PRIVILEGES;
```

## 8 创建数据库表

```shell
## 创建数据库
mysql> CREATE DATABASE testdb DEFAULT CHARSET UTF8;
## 创建表
mysql> USE testdb;
mysql> CREATE TABLE IF NOT EXISTS `student`(
  `id` INT(4) NOT NULL AUTO_INCREMENT COMMENT '学号',
  `name` VARCHAR(30) NOT NULL DEFAULT '匿名' COMMENT '姓名',
  `pwd` VARCHAR(20) NOT NULL DEFAULT '123456' COMMENT '密码',
  `sex` VARCHAR(2) NOT NULL DEFAULT '女' COMMENT '性别',
  `birthday` DATETIME DEFAULT NULL COMMENT '出生日期',
  `address` VARCHAR(100) DEFAULT NULL COMMENT '家庭住址',
  `email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
  PRIMARY KEY(`id`)
  )ENGINE=INNODB DEFAULT CHARSET=utf8;
## 查看表
show tables;
+------------------+
| Tables_in_testdb |
+------------------+
| student          |
+------------------+
## 查看表结构
desc student;
+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| id       | int(4)       | NO   | PRI | NULL    | auto_increment |
| name     | varchar(30)  | NO   |     | 匿名    |                |
| pwd      | varchar(20)  | NO   |     | 123456  |                |
| sex      | varchar(2)   | NO   |     | 女      |                |
| birthday | datetime     | YES  |     | NULL    |                |
| address  | varchar(100) | YES  |     | NULL    |                |
| email    | varchar(50)  | YES  |     | NULL    |                |
+----------+--------------+------+-----+---------+----------------+
```

## 9 服务运维

```shell
## 启动服务
/etc/init.d/mysqld start
## 关闭服务
/etc/init.d/mysqld stop
## 查询服务状态
/etc/init.d/mysqld status
```
