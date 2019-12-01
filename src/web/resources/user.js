/**
 * User Schema: {
 *     username: String,
 * }
 *
 * with method:
 *  checkPassword(String) : boolean
 *  lastTimePasswordChanged() : number
 */

const express = require('express');

class User {
    constructor(n, p) {
        this.username = n;
        this.password = p;
    }

    checkPassword(pw) {
        return pw === this.password;
    };
}

function stripUser({ id, username }) {
    return { id, username }
}

function makeUserResource(repository, tokenService) {
    const router = express.Router();
    router.get("/:id", async (req, res) => {
        const id = req.params.id;
        const entity = await repository.byId(id);
        res.json(stripUser(entity));
        res.end()
    });
    router.post("/", async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        const newUser = await repository.save(new User(username, password));
        res.statusCode = 201;
        res.json({at: `/user/${newUser.id}`, user: stripUser(newUser)})
    });
    router.patch("/:id", async (req, res, next) => {
        if (req.headers.authorization === undefined) {
            next({
                status: 403,
                message: "No authorization found."
            });
            return;
        }

        const token = await tokenService.token(req.headers.authorization);
        if (!token.isFor(req.params.id)) {
            next({
                status: 403,
                message: "No authorization found."
            });
            return;
        }

        try {
            res.statusCode = 202;
            const id = req.params.id;
            const user = repository.byId(id);
            user.username = req.body.username;
            await repository.save(user);
            res.end();
        } catch (e) {
            next(e)
        }
    });
    return router;
}

module.exports = makeUserResource;