/**
 * 将接受回调函数风格的函数转化为 async 函数（返回 Promise 的函数）。
 * @param {Function} f 要转换的函数。
 */
function async(f) {
    return new Promise((ok, err) => 
        (...args) => Function.apply(this, [args, (error, data) => error ? err(error) : ok(data)]))
}

/**
 * 将 async 的 handle 转化为遇到错误时调用 next(err) 的函数。
 * @param {Function} f 要转换的 Handler。
 */
function tryAsync(f) {
    return (req, res, next) => {
        f(req, res, next).catch(e => next(e))
    }
}

module.exports = { async, tryAsync };