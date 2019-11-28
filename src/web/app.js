const express = require("express");
const createError = require("http-errors");
const {tryAsync} = require("./utils/asyncio");
const makeUserResource = require('./resources/user');
const makeAuthorizeResource = require('./resources/authorize');

/*
    registry schema: {
        userRepo: Repo[User],
        token: TokenGen,
        status: Map[string] interface{}
    }
 */
function makeApp(registry) {
    const app = express();
    app.set("registry", registry);
    app.use(express.json());
    app.use("/user", makeUserResource(registry.userRepo));
    app.use("/authorize", makeAuthorizeResource(registry.userRepo, registry.token));

    app.get("/", async (req, res) => {
        const promise = Promise.resolve("promise");
        res.send(`Hello, This is '${await promise}' for you.`);
        res.end();
    });

    app.post("/", tryAsync(async (req, res) => {
        const promise = Promise.resolve("promise");
        const body = req.body;
        res.json({...body, promise: await promise});
        res.end()
    }));

    app.use((req, res, next) => {
        next(createError(404));
    });

    app.use((err, req, res, _next) => {
        res.type("text/plain;charset=utf-8");
        res.status(err.status || 500);
        res.send(err.message);
        res.end()
    });
    return app;
}

module.exports = makeApp;