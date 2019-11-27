const request = require('supertest')
const makeApp = require('../../src/web/app')
const Repo = require('../../src/domain/user/inmemrepo')

const registery = {
    userRepo: new Repo({
        1: {id: 1, 
            username: '小明',
            checkPassword(pw) {
                return pw === "123456"
            }}
    }),
    tokenGen({ username }) {
        return username + " is a lolicon, hentai!"
    }
};
const app = makeApp(registery)

describe("用户实体资源的测试", () => {
    test("可以通过 Id 获得用户", (done) => {
        request(app)
            .get('/user/1')
            .expect("Content-Type", /json/)
            .expect(200)
            .then(resp => expect(resp.body.id).toBe(1))
            .then(done)
    })

    test("可以通过用户名和密码获得鉴权 Token", (done) => {
        request(app)
            .get('/authorize/1?password=123456')
            .expect("Content-Type", /json/)
            .expect(200)
            .then(resp => expect(resp.body.token).not.toBeUndefined())
            .then(done)
    })

    test("可以通过用户名和初始密码注册用户", (done) => {
        request(app)
            .post('/user')
            .send('{"username": "大五", "password": "654321"}')
            .set("Content-Type", "application/json")
            .expect(201)
            .expect("Content-Type", /json/)
            .then( resp => {
                const at = resp.body.at;
                const { id, username } = resp.body.user;
                return request(app)
                    .get(at)
                    .expect(200)
                    .then(res => {
                        expect(res.body.id).toBe(id)
                        expect(res.body.username).toBe(username)
                    })
             })
             .then(done)
    })
});