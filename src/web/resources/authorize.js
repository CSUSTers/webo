const express = require('express')
const makeError = require('http-errors')
const { tryAsync } = require('../utils/asyncio')

function makeAuthorizeResource(repository, tokenGen) {
    const router = express.Router();
    router.get("/:id", tryAsync(async (req, res, next) => {
        const id = req.params.id;
        const password = req.query.password;
        const entity = await repository.byId(id);
        if (entity.checkPassword(password)) {
            token = tokenGen(entity)
            res.json({ token });
            res.end();
        } else {
            next(makeError(403));
        }
    }))
    return router;
}

module.exports = makeAuthorizeResource