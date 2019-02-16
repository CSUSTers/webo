# Article

Article

|字段  |描述  |类型  |限制  |
|:----|:----|:----|:----|
| _id | 文章ID | 整型 | 唯一，递增，不小于0 |
| user_id | 作者ID | 整型 | 同`user._id` |
| text_type | 文本储存类型 | 枚举 | "pain" "md" "deal_url" (deafult: "pain") [^1]|
| imgs | 图片 | 文件 | 可为空，不大于16个文件[^2] |
| img_urls | 图片链接 | URL | 可为空，不大于16条URL |
| text | 文章文本 | utf-8字符串 |  |

[^1]: `pain`普通文本;`md`markdown`;deal_url`URL经处理的特殊格式
[^2]: `imgs`与`img_urls`最多使用一个
