"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

const { test, trait } = use("Test/Suite")("User");

trait("DatabaseTransactions");
trait("Test/ApiClient");
trait("Auth/Client");

test("it should create a user with email and password", async ({ client }) => {
  const user = await Factory.model("App/Models/User").create();
  const response = await client
    .post("/api/users")
    .send({
      email: "user01@mailserver.com",
      password: "12345"
    })
    .loginVia(user)
    .end();

  response.assertStatus(201);
});

test("it should not create user without email", async ({ client }) => {
  const user = await Factory.model("App/Models/User").create();
  const response = await client
    .post("/api/users")
    .send({ password: "12345" })
    .loginVia(user)
    .end();

  response.assertStatus(400);
});

test("it should not create user without password", async ({ client }) => {
  const user = await Factory.model("App/Models/User").create();
  const response = await client
    .post("/api/users")
    .send({ email: "user01@mailserver.com" })
    .loginVia(user)
    .end();

  response.assertStatus(400);
});

test("it should not create a duplicated user", async ({ client }) => {
  const password = "12345";
  const user = await Factory.model("App/Models/User").create({ password });
  const response = await client
    .post("/api/users")
    .send({ email: user.email, password })
    .loginVia(user)
    .end();

  response.assertStatus(400);
});

test("it should update a user by id", async ({ client }) => {
  const user = await Factory.model("App/Models/User").create();
  const response = await client
    .put(`/api/users/${user.id}`)
    .send({ email: user.email })
    .loginVia(user)
    .end();

  response.assertStatus(200);
});

test("it should delete a user", async ({ client, assert }) => {
  const user = await Factory.model("App/Models/User").create();
  const response = await client
    .delete(`/api/users/${user.id}`)
    .loginVia(user)
    .end();

  response.assertStatus(204);
  assert.equal(0, response.body.length || 0);
});

test("it should list users", async ({ client, assert }) => {
  const allUsers = await Factory.model("App/Models/User").createMany(3);
  const firstUser = allUsers[0];
  const response = await client
    .get("/api/users")
    .loginVia(firstUser)
    .end();
  const { users } = response.body;

  response.assertStatus(200);
  assert.equal(3, users.data.length || 0);
});

test("it should get one user by its id field", async ({ client, assert }) => {
  const user = await Factory.model("App/Models/User").create();
  const response = await client
    .get(`/api/users/${user.id}`)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.equal(user.id, response.body.id);
});
