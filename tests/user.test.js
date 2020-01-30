const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOne, setupDB } = require('./fixtures/db');

beforeEach(setupDB);

test('Creating a new User', async () => {
   await request(app).post('/users').send({
       age: 24,
       name: 'Testirio',
       email: 'testilio@gmail.com',
       password: 'qwerty12345'
   }).expect(201);
});

test('Login existing User', async () => {
   await request(app).post('/users/login').send({
       email: userOne.email,
       password: userOne.password
   }).expect(200);
});

test('Login User failure', async () => {
   await request(app).post('/users/login').send({
       email: 'Jon',
       password: '1234'
   }).expect(400);
});

test('Get User profile', async () => {
   await request(app)
       .get('/users/me')
       .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
       .send()
       .expect(200)
});

test('Failure to get User profile', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
});

test('Delete User', async () => {
   await request(app)
       .delete('/users/me')
       .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
       .send()
       .expect(200)
});

test('Failure Delete User', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
});

test('Upload avatar Image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);
    const user = await User.findById(userOne._id);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Update User', async () => {
   await request(app)
       .patch('/users/me')
       .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
       .send({ name: 'Player2' }).expect(200);
   const user = await User.findById(userOne._id);
   expect(user.name).toBe('Player2');
});

test('Failed Update User', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: 'Konotop' }).expect(400);
});
