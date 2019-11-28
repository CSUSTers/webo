const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');

class JwtTokenGen {
    constructor() {
    }

    /**
     *
     * @param {string} secret the secret.
     * @param {number} expireAfter the expireTime.
     * @param refreshConfig
     * @returns {JwtTokenGen} the class.
     */
    static withSecretAndExpireTime(secret, expireAfter, refreshConfig = {
        refreshTokens: new Set(),
        refreshTokenValidTime: 60 * 60 * 24 * 14 //14 days.
    }) {
        const j = new JwtTokenGen();
        j.secret = secret;
        j.expireAfter = expireAfter;
        j.refreshConfig = refreshConfig;
        return j;
    }

    static elapsedFromNow(after) {
        return Math.floor(Date.now() / 1000) + after;
    }

    async tokenGen(user) {
        let createTime = Date.now();
        let myToken = jwt.sign({
            exp: JwtTokenGen.elapsedFromNow(this.expireAfter),
            id: user.id,
            createTime
        }, this.secret);
        let refreshTokenId = uuid();
        let refreshToken = jwt.sign({
            exp: JwtTokenGen.elapsedFromNow(this.refreshConfig.refreshTokenValidTime),
            id: user.id,
            createTime,
            refreshTokenId
        }, this.secret);
        this.refreshConfig.refreshTokens.add(refreshTokenId);
        return {myToken, refreshToken};
    }

    async refresh(token) {
        const {id, refreshTokenId} = jwt.verify(token, this.secret);
        if (!this.refreshConfig.refreshTokens.has(refreshTokenId)) {
            throw {
                status: 403,
                message: "Invalid Refresh Token: it's used."
            }
        }
        this.refreshConfig.refreshTokens.delete(refreshTokenId);
        return this.tokenGen({id})
    }

    async verify(token) {
        const {id, createTime} = jwt.verify(token, this.secret);
        return {id, createTime};
    }
}

module.exports = JwtTokenGen;