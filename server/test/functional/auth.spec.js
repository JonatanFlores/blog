"use strict";

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const { test, trait } = use("Test/Suite")("Auth");

trait("Test/ApiClient");
trait("DatabaseTransactions");

test("it should return JWT token when successfully log in", async ({
  assert,
  client
}) => {
  const password = "12345";
  const user = await Factory.model("App/Models/User").create({ password });
  const response = await client
    .post("/api/login")
    .send({ email: user.email, password })
    .end();

  response.assertStatus(200);
  assert.isDefined(response.body.token);
  assert.isDefined(response.body.type);
});

test("it should fail when wrong credentials were informed", async ({
  assert,
  client
}) => {
  await Factory.model("App/Models/User").create();
  const response = await client
    .post("/api/login")
    .send({ email: "wrong-email@mailserver.com", password: "123" })
    .end();

  response.assertStatus(401);
});
