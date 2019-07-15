# User

## 用户信息文档

```json
{
    "_id": 0,
    "name": "用户名",
    "password": "$seed$sha256",
    "email": "i@example.com",
    "info": {},
    "article": [],
    "webo": [],
    "follower": 0,
    "following": 0
}
```

| Field     | Type                                  | Note                              |
| --------- | ------------------------------------- | --------------------------------- |
| _id       | uint64                                | 用户唯一指定ID                    |
| name      | string                                | 用户名 _UTF-8 无重名，无特殊字符_ |
| password  | string                                | 密码                              |
| email     | string                                | 邮箱                              |
| info      | [`InfoObject`](#InfoObject)           | 用户信息                          |
| article   | list of [`Article._id`](./article.md) | 用户发布的文章的ID                |
| webo      | list of [`WebO._id`](./webo.md)       | 用户发布的WebO的ID                |
| follower  | uint32                                | 关注该用户的人数                  |
| following | uint32                                | 该用户关注的人数                  |

## InfoObject

```json
{
    "favicon": "",
    "birth": "1970-01-01",
    "signup": "2020-01-01 00:01",
    "gender": "male",
    "last_login": "2020-01-01 00:01"
}
```

| Field      | Type                    | Note         |
| ---------- | ----------------------- | ------------ |
| favicon    | image                   | 头像         |
| birth      | date                    | 生日         |
| signup     | date_time               | 注册时间     |
| gender     | "male\| female\| other" | 性别         |
| last_login | date_time               | 最后登录时间 |
