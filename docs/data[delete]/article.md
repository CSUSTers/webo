# Article

Article

|字段  |描述  |类型  |限制  |
|:----|:----|:----|:----|
| _id | 文章ID | 整型 | 唯一，递增，不小于0 |
| user_id | 作者ID | 整型 | 同`user._id` |
| publish_time | 发布时间 | date_time |  |
| last_edit_time | 上次更改时间 | date_time | 可为空 |
| fw | 转发 | 整型 | 转发文章的`_id`[^1] |
| text_type | 文本储存类型 | 枚举 | "pain" "md" "deal_url" (deafult: "pain")[^2]|
| imgs | 图片 | 文件 | 可为空，不大于16个文件[^3] |
| img_urls | 图片链接 | URL | 可为空，不大于16条URL |
| text | 文章文本 | utf-8字符串 |  |

^1: 当非转发时为0，被转发的文章(X)也为转发文时为该文章(X)的`_id`。此时`text`为空字符串，`text_type`无意义储存默认值。

^2: `pain`普通文本;`md`markdown`;deal_url`URL经处理的特殊格式

^3: `imgs`与`img_urls`最多使用一个
