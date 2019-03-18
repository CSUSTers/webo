# Article

## 文章

```json
{
    "_id": 0,
    "author_id": 0,
    "title": "",
    "publish_time": "2020-01-01 00:01",
    "last_edit": "2020-01-01 00:02",
    "draft": false,
    "tags": [],
    "comments": [],
    "like": 0,
    "view": 0
}
```

> `_id`: uint64

文章唯一指定ID

> `author_id`: User._id

作者ID，见 [`User`](./user.md)

> `title`: string

文章标题 _UTF-8_

> `publish_time`: date_time

发布时间

> `last_edit`: date_time

最后修改时间 _未修改时无此字段_

> `draft`: bool

是否为草稿

> `tags`: [string]

标签，第一个为分类

> `comments`: [CommentObject]

评论，见 [`CommentObject`](#CommentObject)

> `like`: uint32

喜欢的数量

> `view`: uint32

阅读量

## CommentObject

```json
{
    "_id": 1,
    "user": 0,
    "reply": 0,
    "text": ""
}
```

> `_id`: uint32

本文评论楼层

> `user`: User._id

评论用户ID，见 [User](./user.md)

> `reply`: uint32

回复楼层，不是回复为0

> `text`: string

文本
