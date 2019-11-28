const express = require('express');
require('http-errors');
const {tryAsync} = require('../utils/asyncio');

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

function makeAuthorizeResource(repository, codec) {
    const router = express.Router();
    router.use(nocache);

    router.get("/refreshed", async (req, res, next) => {
        try {
            const {refreshToken} = req.query;
            const token = await codec.refresh(refreshToken);
            res.json({token});
            res.end();
        } catch (e) {
            next(e);
        }
    });

    router.get("/:id", tryAsync(async (req, res, next) => {
        const id = req.params.id;
        const password = req.query.password;
        const entity = await repository.byId(id);
        if (entity.checkPassword(password)) {
            const {myToken, refreshToken} = await codec.tokenGen(entity);
            res.json({token: {myToken, refreshToken}});
            res.end();
        } else {
            next({status: 403, message: "Invalid username or password!"});
        }
    }));

    router.get("/test/:token", async (req, res, next) => {
        const token = req.params.token;
        try {
            const {id: userId, createTime} = await codec.verify(token);
            const user = repository.byId(userId);
            if (user.lastTimePasswordChanged() > createTime) {
                next({
                    status: 403,
                    message: "Invalid token: password changed after token generated."
                });
                return;
            }
            res.json({user});
            res.end();
        } catch (e) {
            next(e);
        }
    });

    return router;
}

module.exports = makeAuthorizeResource;