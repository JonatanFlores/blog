"use strict";

const { test, trait } = use("Test/Suite")("FUNCTIONAL: Refresh Token");

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

const {
  generateExpiredRefreshToken,
  generateFakeRefreshToken,
  getRefreshTokenUser
} = require("../common/refresh-token-helpers");

trait("DatabaseTransactions");
trait("Test/ApiClient");
trait("Auth/Client");

test("it should give a new JWT token and a new Refresh Token", async ({
  client,
  assert
}) => {
  const password = "123456";
  const user = await Factory.model("App/Models/User").create({ password });
  const loginResponse = await client
    .post("/api/login")
    .send({ email: user.email, password })
    .end();

  const response = await client
    .post("/api/refresh")
    .header("RefreshToken", loginResponse.body.refreshToken)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.containsAllKeys(response.body, ["token", "refreshToken"]);
});

test("it should not refresh token when the current Refresh Token is expired", async ({
  client,
  assert
}) => {
  const fakeToken = "123456";
  const refreshToken = await generateExpiredRefreshToken(fakeToken);
  const user = await getRefreshTokenUser(refreshToken);
  const response = await client
    .post("/api/refresh")
    .header("RefreshToken", refreshToken)
    .loginVia(user)
    .end();

  response.assertStatus(401);
  assert.containsAllKeys(response.body, ["error"]);
});

test("it should not refresh token when the current Refresh Token is invalid", async ({
  assert,
  client
}) => {
  const refreshToken1 = await generateFakeRefreshToken("123456");
  const user = await getRefreshTokenUser(refreshToken1);
  const refreshToken2 = await generateFakeRefreshToken("654321");

  const response = await client
    .post("/api/refresh")
    .header("RefreshToken", refreshToken2)
    .loginVia(user)
    .end();

  response.assertStatus(401);
  assert.isEmpty(response.body);
});
