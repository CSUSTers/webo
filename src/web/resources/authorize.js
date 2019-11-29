const express = require('express');
const {tryAsync} = require('../utils/asyncio');
const JwtErrors = require('../utils/jwt-errors');

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

function errorHandle(error, _req, res, next) {
    const message = {
        [JwtErrors.USE_AFTER_DESTROY]: "令牌已经被撤销",
        [JwtErrors.INVALID]: "令牌无效",
        [JwtErrors.EXPIRED]: "令牌已经过期",
        [JwtErrors.USE_USED]: "刷新令牌已经被使用",
        [JwtErrors.OTHER]: "意外发生了"
    };

    if (error.errorType === undefined) {
        next(error);
        return;
    }

    const errorInfo = {
        errorType: error.errorType,
        message: error.message,
        description: message[error.errorType]
    };

    res.statusCode = 403;
    res.json(errorInfo);
}

function makeAuthorizeResource(repository, codec) {
    const router = express.Router();
    router.use(nocache);

    router.get("/refreshed", async (req, res, next) => {
        try {
            const {refreshToken} = req.query;
            const {id: userId} = await codec.verify(refreshToken);
            const user = repository.byId(userId);
            const token = await codec.refresh(refreshToken, {validAfter: user.lastTimePasswordChanged()});
            res.json({token});
            res.end();
        } catch (e) {
            next(e);
        }
    });

    router.get("/:id", tryAsync(async (req, res, next) => {
        try {
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
        } catch (e) {
            next(e)
        }
    }));

    router.get("/test/:token", async (req, res, next) => {
        try {
            const token = req.params.token;
            const {id: userId} = await codec.verify(token);
            const user = repository.byId(userId);
            codec.verify(token, {validAfter: user.lastTimePasswordChanged()});
            res.json({user});
            res.end();
        } catch (e) {
            next(e)
        }
    });

    router.use(errorHandle);

    return router;
}

module.exports = makeAuthorizeResource;