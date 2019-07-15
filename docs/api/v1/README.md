# Api-1.0 说明

## 目录说明

- `user`
  - `create` 创建用户
- `webo`

## Request格式说明

## Response格式说明

```json
{
    "status": 0,
    "msg": "success",
    "data": {}
}
```

```json
{
    "status": -1,
    "msg": "password incorrect",
    "data": {}
}
```

- `status` 整数值表示的请求的状态，具体数值说明见 [`Status`](#Status)
- `msg` 对status做出进一步解释的说明文本
- `data` 若响应体携带数据，则在data字段中，若没有数据，则没有data字段

## Status

响应体的status字段说明：

| value | explanation          |
| ----- | -------------------- |
| 0     | 请求成功             |
| -1    | 请求失败             |
| -2    | 用户未登录           |
| -4    | 用户没有该操作的权限 |
| -9    | 服务器异常           |
