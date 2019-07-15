# Create User

## Request

- Method: `POST`

- URL: `/create`

- Type: `json`

- Body:

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

- Type: `json`

- body:

```json
{
    "status": 0,
    "msg": "success",
}
```
