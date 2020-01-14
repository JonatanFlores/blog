"use strict";

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const { test, trait } = use("Test/Suite")("Auth");

trait("DatabaseTransactions");
trait("Test/ApiClient");
trait("Auth/Client");

const Token = use("App/Models/Token");

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

test("it should revoke the user token only when user is authenticated", async ({
  client,
  assert
}) => {
  const password = "12345";
  const user = await Factory.model("App/Models/User").create({ password });

  const loginResponse = await client
    .post("/api/login")
    .send({ email: user.email, password })
    .end();

  const response = await client
    .post("/api/logout")
    .header("RefreshToken", loginResponse.body.refreshToken)
    .loginVia(user)
    .end();

  const tokens = await user.tokens().fetch();
  const token = tokens.first();

  response.assertStatus(204);
  assert.equal(tokens.size(), 1);
  assert.isTrue(Boolean(token.is_revoked));
});

test("it should not be able to revoke a user without the refresh token", async ({
  client,
  assert
}) => {
  const password = "12345";
  const user = await Factory.model("App/Models/User").create({ password });

  const response = await client
    .post("/api/logout")
    .loginVia(user)
    .end();

  response.assertStatus(400);
  assert.equal(response.body.error, "Refresh token not informed");
});

test("it should not be able to revoke token when not authenticated", async ({
  client,
  assert
}) => {
  const password = "12345";
  const user = await Factory.model("App/Models/User").create({ password });

  await client
    .post("/api/login")
    .send({ email: user.email, password })
    .end();

  const response = await client.post("/api/logout").end();
  const tokens = await user.tokens().fetch();

  response.assertStatus(401);
  assert.equal(tokens.size(), 1);
});
