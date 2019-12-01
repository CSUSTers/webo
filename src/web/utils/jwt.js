const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const JwtTokenErrors = require("./jwt-errors");


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
    static withSecretAndExpireTime(secret,
                                   expireAfter,
                                   refreshConfig = {
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

    /**
     * 包装 JsonWebTokenError，为其加上 ErrorCode。
     * @param expect
     */
    errorCodeFor(expect) {
        const name = expect.name;
        if (name === "TokenExpiredError") return JwtTokenErrors.EXPIRED;
        if (name === "JsonWebTokenError") return JwtTokenErrors.INVALID;
        return JwtTokenErrors.OTHER;
    }

    _verify(token) {
        try {
            return jwt.verify(token, this.secret);
        } catch (e) {
            e.errorType = this.errorCodeFor(e);
            throw e;
        }
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

    async refresh(token, config = {
        validAfter: 0
    }) {
        const {id, refreshTokenId, createTime} = this._verify(token, this.secret);
        if (!(config.validAfter < createTime)) {
            throw {
                status: 403,
                message: "Invalid Refresh Token: it's created before current valid time.",
                errorType: JwtTokenErrors.USE_AFTER_DESTROY
            }
        }
        if (!this.refreshConfig.refreshTokens.has(refreshTokenId)) {
            throw {
                status: 403,
                message: "Invalid Refresh Token: it's used.",
                errorType: JwtTokenErrors.USE_USED
            }
        }
        this.refreshConfig.refreshTokens.delete(refreshTokenId);
        return this.tokenGen({id})
    }

    async verify(token) {
        const {id, createTime} = this._verify(token, this.secret);
        return {id, createTime};
    }


}

module.exports = JwtTokenGen;