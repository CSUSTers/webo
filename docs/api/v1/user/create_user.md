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
