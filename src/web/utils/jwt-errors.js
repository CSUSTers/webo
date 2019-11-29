const JwtTokenErrors = {
    EXPIRED: 0,
    INVALID: 1,
    USE_AFTER_DESTROY: 2,
    USE_USED: 3,
    OTHER: 255
};

module.exports = JwtTokenErrors;