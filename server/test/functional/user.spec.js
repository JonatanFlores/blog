"use strict";

const { test, trait } = use("Test/Suite")("User");
const User = use("App/Models/User");

trait("Test/ApiClient");
trait("DatabaseTransactions");

test("it should register a user with email and password", async ({
  client
}) => {
  const response = await client
    .post("/api/users")
    .send({
      email: "user01@mailserver.com",
      password: "12345"
    })
    .end();

  response.assertStatus(201);
});

test("it should not register user without email", async ({ client }) => {
  const response = await client
    .post("/api/users")
    .send({
      password: "12345"
    })
    .end();
  response.assertStatus(400);
});

test("it should not register user without password", async ({ client }) => {
  const response = await client
    .post("/api/users")
    .send({
      email: "user01@mailserver.com"
    })
    .end();
  response.assertStatus(400);
});

test("it should not register a duplicated user", async ({ client }) => {
  await User.create({
    email: "user01@mailserver.com",
    password: "12345"
  });

  const response = await client
    .post("/api/users")
    .send({
      email: "user01@mailserver.com",
      password: "12345"
    })
    .end();
  response.assertStatus(400);
});

test("it should update a user by id", async ({ client }) => {
  const user = await User.create({
    email: "user01@mailserver.com",
    password: "12345"
  });

  const response = await client
    .put(`/api/users/${user.id}`)
    .send({
      email: "test@gmail.com"
    })
    .end();

  response.assertStatus(200);
});

test("it should delete a user", async ({ client, assert }) => {
  const user = await User.create({
    email: "user01@mailserver.com",
    password: "12345"
  });

  const response = await client.delete(`/api/users/${user.id}`).end();

  response.assertStatus(204);
  assert.equal(0, response.body.length || 0);
});

test("it should list users", async ({ client, assert }) => {
  await User.createMany([
    {
      email: "user01@mailserver.com",
      password: "12345"
    },
    {
      email: "user02@mailserver.com",
      password: "54321"
    },
    {
      email: "user03@mailserver.com",
      password: "23154"
    }
  ]);

  const { body } = await client.get("/api/users").end();
  const { users } = body;

  assert.equal(3, users.data.length || 0);
});

test("it should get one user by its id field", async ({ client, assert }) => {
  const user = await User.create({
    email: "user01@mailserver.com",
    password: "12345"
  });

  const response = await client.get(`/api/users/${user.id}`).end();

  response.assertStatus(200);
  assert.equal(user.id, response.body.id);
});
