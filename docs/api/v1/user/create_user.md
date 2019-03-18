# Create User

## Request

> Method: `POST`
>
> Path: `/create`
>
> Type: `json`

body:

```json
{
    "name": "用户名",
    "password": "password",
    "email": "i@example.com",
    "info": {}
}
```

> `name`: string

用户名

> `password`: string

密码

> `email`: string

注册邮箱

> `info`: Info

用户信息

## Response

> Type: `json`

body:

```json
{
    "status": "",
    "errcode": 0,
    "errmsg": ""
}
```

> `status`: "ok|error"

创建状态

> `errcode`: uint

成功时无视此字段，详见 [`Error Code`](#Error_Code)

> `errmsg`: string

自然语言描述的错误信息

### Error_Code

