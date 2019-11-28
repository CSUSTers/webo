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

function makeUserResource(repository) {
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
    return router;
}

module.exports = makeUserResource;