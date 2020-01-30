const app = require('../src/app');
const request = require('supertest');
const Task = require('../src/models/task');
const User = require('../src/models/user');
const { userOneId, userTwo, userOne, setupDB, taskOne, taskTwo } = require('./fixtures/db');

beforeEach(setupDB);

test('Create Task for User', async () => {
    const response = await request(app)
        .post('/tasks').set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From My Test Case'
        })
        .expect(201);
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
});

test('Get User Tasks', async () => {
   const response = await request(app)
       .get('/tasks')
       .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
       .send()
       .expect(200);
   expect(response.body).toHaveLength(2);
});

test('Failed to Delete Task of other User', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404);
    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});
