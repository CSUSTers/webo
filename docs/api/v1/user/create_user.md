# Create User

## Request

-   Method: `POST`

-   URL: `/create`

-   Type: `json`

-   Body:


```json
{
    "name": "name",
    "password": "password",
    "email": "i@example.com",
    "info": {}
}
```

| Field    | Type   | Required | Note     |
| -------- | ------ | -------- | -------- |
| name     | string | true     | 用户名   |
| password | string | true     | 密码     |
| email    | string | true     | 邮箱     |
| info     | info   |          | 用户信息 |


## Response

-   Type: `json`

-   body:

```json
{
    "status": "",
    "errcode": 0,
    "errmsg": ""
}
```

| Field   | Type    | Note                                               |
| ------- | ------- | -------------------------------------------------- |
| status  | string  | 创建状态                                           |
| errcode | integer | 成功时无视此字段，详见 [`Error Code`](#Error_Code) |
| errmsg  | string  | 自然语言描述的错误信息                             |



### Error_Code
