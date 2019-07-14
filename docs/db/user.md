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

> `_id`: uint64

用户唯一指定ID

> `name`: string

用户名 _UTF-8 无重名，无特殊字符_

> `password`: string

密码

> `email`: string

注册邮箱

> `info`: InfoObject

用户信息，见 [`InfoObject`](#InfoObject)

> `article`: [Article._id]

用户发布的文章的ID，见 [`Article`](./article.md)

> `webo`: [WebO._id]

用户发布的WebO的ID，见 [`WebO`](./webo.md)

> `follower`: uint32

关注该用户的人数

> `following`: uint32

该用户关注的人数

## InfoObject

```json
{
    "favicon": "",
    "birth": "1970-01-01",
    "signup": "2020-01-01 00:01",
    "sex": "male",
    "last_login": "2020-01-01 00:01"
}
```

> `favicon`: image

头像

> `birth`: date

生日

> `signup`: date_time

注册时间

> `sex`: "male|female|other"

性别

> `last_login`: date_time

最后登陆时间
