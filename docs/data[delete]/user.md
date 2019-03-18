# User

User infomation

|字段  |描述  |类型  |限制  |
|:----|:----|:----|:----|
| _id | 唯一表示id | 整型 | 唯一，递增，不小于0 |
| create_time | 创建时间 | date_time |  |
| name | 用户名 | utf-8字符串 | 唯一，可更改，长度<=10 |
| passw | 密码 | 字符串 | 密码加盐哈希[^1]|

^1: 形如"{salt}${hash}"，其中"salt"为随机生成的盐、"hash"为加盐哈希