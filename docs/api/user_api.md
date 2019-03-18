# User API

[TOC]

## Create user

- path: `/api/user/create`
- method: `POST`
- content type: `json`

### Request

- post data

```json
{
    "name": "{user_name}",
    "password": "{passwd}"
}
```

`user_name`: 用户名

`passwd`: 密码

### Response

- OK

```json
{
    "ok": true,
    "id": {id}
}
```

`id`: 用户ID

- not Ok:

```json
{
    "ok": false,
    "error_code": {error_code},
    "msg": "{error_msg}"
}
```

`error_code`: 
