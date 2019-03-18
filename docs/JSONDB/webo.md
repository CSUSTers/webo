# WebO

## WebO 文档

```json
{
    "_id": 0,
    "user": 0,
    "publish_time": "2020-01-01 00:01",
    "fw_id": 0,
    "text": "",
    "images": [],
    "tags": [],
    "comments": [],
    "fw": 0,
    "like": 0,
    "view": 0
}
```

> `_id`: uint64

WebO ID

> `user`: User._id

发布者

> `publish_time`: date_time

发布时间

> `fw_id`: WebO._id

转发的WebO的ID _非转发为0_

> `text`: string

文本 _转发无此字段_

> `image`: [Picture]

图片 _转发无此字段_

> `tags`: [string]

标签

> `comments`: [CommentObject]

评论，见 [`CommentObject`](./article.md#CommentObject)

> `fw`: uint32

被转发量

> `like`: uint32

喜欢的数量

> `view`: uint32

阅读量