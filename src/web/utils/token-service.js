// Begin implementation of TokenService.
// TokenService :
//      - Token(token) returning TokenAuthorizeResult.
// TokenAuthorizeResult :
//      - isOk() returning boolean
//      - isError() returning boolean
//      - errorCode returning number
//      - isFor(id) returning boolean

const Errors = require("./jwt-errors");

class TokenAuthorizeResult {
    static fromError(code) {
        const result = new TokenAuthorizeResult();
        result.errorCode = code;
        return result;
    }

    static fromOk(id) {
        const result = new TokenAuthorizeResult();
        result.id = id;
        return result;
    }

    isError() {
        return !!this.errorCode;
    }

    isOk() {
        return !this.isError();
    }

    isFor(id) {
        return String(id) === String(this.id);
    }
}

class TokenService {
    constructor(tokenGen, userRepository) {
        this.tokenGen = tokenGen;
        this.userRepository = userRepository;
    }

    async token(token) {
        try {
            const {id, createTime} = await this.tokenGen.verify(token);
            const user = await this.userRepository.byId(id);
            if (createTime < user.lastTimePasswordChanged()) {
                return TokenAuthorizeResult.fromError(Errors.USE_AFTER_DESTROY)
            }
            return TokenAuthorizeResult.fromOk(id);
        } catch (e) {
            return TokenAuthorizeResult.fromError(e.errorType || Errors.OTHER)
        }
    }

    allowIf(f) {
        return async (req, res, next) => {
            if (req.headers.authorization === undefined) {
                res.statusCode = 401;
                res.json({
                    status: 401,
                    message: "No authorization found."
                });
                res.end();
                return;
            }

            const token = await this.token(req.headers.authorization);
            if (token.isError() || !f(token, req)) {
                res.statusCode = 403;
                res.json({
                    status: 403,
                    errorType: token.errorCode,
                    message: "Failed to Authorization."
                });
                res.end();
                return;
            }

            next()
        }
    }

    allowIfIsFor(f) {
        return this.allowIf((t, req) => t.isFor(f(req)));
    }
}

module.exports = TokenService;