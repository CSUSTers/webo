const JwtTokenGen = require("../../src/web/utils/jwt");
const request = require('supertest');
const makeApp = require('../../src/web/app');
const Repo = require('../../src/domain/user/inmemrepo');
const JwtErrors = require("../../src/web/utils/jwt-errors");

const registery = {
    userRepo: new Repo({
        1: {
            id: 1,
            username: '小明',
            checkPassword(pw) {
                return pw === "123456"
            },
            lastTimePasswordChanged: () => 0
        }
    }),
    token: JwtTokenGen.withSecretAndExpireTime("hello", 1)
};
const app = makeApp(registery);
app.set("env", "development");

describe("用户实体资源的测试", () => {
    test("可以通过 Id 获得用户", (done) => {
        request(app)
            .get('/user/1')
            .expect("Content-Type", /json/)
            .expect(200)
            .then(resp => expect(resp.body.id).toBe(1))
            .then(done)
    });

    test("可以通过用户名和密码获得鉴权 Token", (done) => {
        request(app)
            .get('/authorize/1?password=123456')
            .expect("Content-Type", /json/)
            .expect(200)
            .then(resp => expect(resp.body.token).not.toBeUndefined())
            .then(done)
    });

    test("用户名或者密码错误的时候，返回 403。", (done) => {
        request(app)
            .get('/authorize/1?password=654321')
            .then(resp => expect(resp.status).toBe(403))
            .then(done)
    });

    test("可以通过用户名和初始密码注册用户", (done) => {
        request(app)
            .post('/user')
            .send('{"username": "大五", "password": "654321"}')
            .set("Content-Type", "application/json")
            .expect(201)
            .expect("Content-Type", /json/)
            .then(resp => {
                const at = resp.body.at;
                const {id, username} = resp.body.user;
                return request(app)
                    .get(at)
                    .expect(200)
                    .then(res => {
                        expect(res.body.id).toBe(id);
                        expect(res.body.username).toBe(username)
                    })
            })
            .then(done)
    });

    test("获得鉴权 Token 后，应该可以向服务器发起特权请求", (done) => {
        request(app)
            .get("/authorize/1?password=123456")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                const {myToken} = response.body.token;
                request(app)
                    .get(`/authorize/test/${myToken}`)
                    .expect(200)
                    .expect("Content-Type", /json/)
                    .then(response => expect(response.body.user.id).toBe(1))
                    .then(done)
            })
    });

    test("鉴权 Token 过期之后不能使用。", (done) => {
        request(app)
            .get("/authorize/1?password=123456")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                return new Promise(ok => setTimeout(ok, 1100))
                    .then(() => {
                            const {myToken} = response.body.token;
                            request(app)
                                .get(`/authorize/test/${myToken}`)
                                .then(response => {
                                    expect(response.status).toBe(403);
                                    expect(response.body.errorType).toBe(JwtErrors.EXPIRED)
                                })
                                .then(done);
                        }
                    )
            })
    });

    test("获得鉴权 Token 后，可以刷新 Token。", (done) => {
        request(app)
            .get("/authorize/1?password=123456")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                const {myToken, refreshToken} = response.body.token;
                request(app)
                    .get(`/authorize/refreshed?refreshToken=${refreshToken}`)
                    .expect(200)
                    .expect("Content-Type", /json/)
                    .then(response => {
                        expect(response.body.token).not.toBeUndefined();
                        expect(response.body.token.myToken).not.toBeUndefined();
                        expect(response.body.token.myToken).not.toEqual(myToken);
                        expect(response.body.token.refreshToken).not.toBeUndefined();
                        expect(response.body.token.refreshToken).not.toEqual(refreshToken);
                    })
                    .then(done)
            })
    });

    test("获得鉴权 Token 后，不能两次刷新 Token。", (done) => {
        request(app)
            .get("/authorize/1?password=123456")
            .expect(200)
            .expect("Content-Type", /json/)
            .then(response => {
                const {myToken, refreshToken} = response.body.token;
                request(app)
                    .get(`/authorize/refreshed?refreshToken=${refreshToken}`)
                    .expect(200)
                    .expect("Content-Type", /json/)
                    .then(response => {
                        expect(response.body.token).not.toBeUndefined();
                        expect(response.body.token.myToken).not.toBeUndefined();
                        expect(response.body.token.myToken).not.toEqual(myToken);
                        expect(response.body.token.refreshToken).not.toBeUndefined();
                        expect(response.body.token.refreshToken).not.toEqual(refreshToken);
                    })
                    .then(() => request(app)
                        .get(`/authorize/refreshed?refreshToken=${refreshToken}`)
                        .then(response => {
                            expect(response.status).toBe(403);
                            expect(response.body.errorType).toBe(JwtErrors.USE_USED);
                        })
                        .then(done))
            })
    });

    test("用户可以使用 token 来修改个人信息", done => {
        const newName = Math.random().toString();
        request(app)
            .get("/authorize/1?password=123456")
            .expect(200)
            .expect("Content-Type", /json/).then(res => {
            request(app)
                .patch(`/user/${1}`)
                .set("Authorization", res.body.token.myToken)
                .send({username: newName})
                .expect(202)
                .then(() =>
                    request(app)
                        .get("/user/1")
                        .expect(200)
                        .expect("Content-Type", /json/)
                        .then(result => {
                            expect(result.body.username).toBe(newName);
                            done();
                        })
                )
        });
    });

    test("用户没有 token 就不能修改信息", done => {
        const newName = Math.random().toString();
        request(app)
            .patch(`/user/${1}`)
            .send({username: newName})
            .expect(403)
            .then(() =>
                request(app)
                    .get("/user/1")
                    .expect(200)
                    .expect("Content-Type", /json/)
                    .then(result => {
                        expect(result.body.username).not.toBe(newName);
                        done();
                    })
            )
    });

    test("用户使用错误的 token 不能修改信息", done => {
        const newName = Math.random().toString();
        request(app)
            .patch(`/user/${1}`)
            .send({username: newName})
            .set("Authorization", "meow~")
            .expect(403)
            .then(() =>
                request(app)
                    .get("/user/1")
                    .expect(200)
                    .expect("Content-Type", /json/)
                    .then(result => {
                        expect(result.body.username).not.toBe(newName);
                        done();
                    })
            )
    })
});