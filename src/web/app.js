const express = require("express")
const createError = require("http-errors")
const { tryAsync } = require("./utils/asyncio")
const app = express();

app.get("/", async (req, res) => {
    const promise = Promise.resolve("promise");
    res.send(`Hello, This is '${await promise}' for you.`);
    res.end();
})

app.post("/", tryAsync(async (req, res) => {
    const promise = Promise.resolve("promise");
    const body = JSON.parse(req.body)
    res.json({ ...body, promise: await promise })
    res.end()
}))

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.type("text/plain;charset=utf-8")
    res.status(err.status || 500);
    res.send(err.message)
    res.end()
});

module.exports = app