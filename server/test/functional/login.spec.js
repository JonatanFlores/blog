"use strict";

const { test, trait } = use("Test/Suite")("FUNCTIONAL: Login");

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use("App/Models/Token");

trait("DatabaseTransactions");
trait("Test/ApiClient");
trait("Auth/Client");

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
  assert.isDefined(response.body.refreshToken);
  assert.isDefined(response.body.type);
});

test("it should fail when wrong credentials were informed", async ({
  client
}) => {
  await Factory.model("App/Models/User").create();
  const response = await client
    .post("/api/login")
    .send({ email: "wrong-email@mailserver.com", password: "123" })
    .end();

  response.assertStatus(401);
});
