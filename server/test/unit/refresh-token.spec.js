"use strict";

const { test, trait } = use("Test/Suite")("UNIT: Refresh Token");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use("App/Models/Token");

const {
  generateFakeRefreshToken,
  generateExpiredRefreshToken
} = require("../common/refresh-token-helpers");

trait("DatabaseTransactions");

test("it should be able to find a token record by a refresh token string", async ({
  assert
}) => {
  const fakeToken = "123456";
  const refreshToken = await generateFakeRefreshToken(fakeToken);
  const record = await Token.getByRefreshToken(refreshToken);
  assert.equal(record.token, fakeToken);
});

test("it should get an object with the hours and minutes since the refresh token was created", async ({
  assert
}) => {
  const fakeToken = "123456";
  const refreshToken = await generateExpiredRefreshToken(fakeToken);
  const minutes = await Token.refreshTokenCreatedSince(refreshToken);
  assert.equal(minutes, 70);
});

test("it should check if the refresh token is expired", async ({ assert }) => {
  const fakeToken = "123456";
  const refreshToken = await generateExpiredRefreshToken(fakeToken);
  const isExpired = await Token.checkRefreshTokenIsExpired(refreshToken);
  assert.isTrue(isExpired, true);
});

test("it should delete a given refresh token from the tokens table", async ({
  assert
}) => {
  const fakeToken = "123456";
  const refreshToken = await generateExpiredRefreshToken(fakeToken);
  const isRevoked = await Token.revokeRefreshToken(refreshToken);
  const token = await Token.findBy("token", fakeToken);

  assert.isTrue(isRevoked, true);
  assert.isNull(token);
});
