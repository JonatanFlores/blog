"use strict";

const { test, trait } = use("Test/Suite")("FUNCTIONAL: Logout");

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use("App/Models/Token");

trait("DatabaseTransactions");
trait("Test/ApiClient");
trait("Auth/Client");

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

  response.assertStatus(204);
  assert.equal(tokens.size(), 0);
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
