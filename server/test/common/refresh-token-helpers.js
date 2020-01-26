"use strict";

const moment = require("moment-timezone");

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

/** @type {import('@adonisjs/framework/src/Encryption')} */
const Encryption = use("Encryption");

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");

/** @type {import('@adonisjs/lucid/src/Database')} */
const Database = use("Database");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use("App/Models/Token");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

async function generateFakeRefreshToken(fakeToken) {
  const user = await Factory.model("App/Models/User").create();
  const encrypted = Encryption.encrypt(fakeToken);

  await Token.create({
    user_id: user.id,
    token: fakeToken,
    type: "jwt_refresh_type"
  });

  return encrypted;
}

async function generateExpiredRefreshToken(fakeToken) {
  const user = await Factory.model("App/Models/User").create();
  const encrypted = Encryption.encrypt(fakeToken);
  const fakeDate = moment()
    .tz(Env.get("TZ"))
    .subtract(1, "hour")
    .subtract(10, "minutes")
    .format("YYYY-MM-DD HH:mm:ss");

  const token = await Token.create({
    user_id: user.id,
    token: fakeToken,
    type: "jwt_refresh_type"
  });

  await Database.table("tokens")
    .where("id", token.id)
    .update("created_at", fakeDate);

  return encrypted;
}

async function getRefreshTokenUser(refreshToken) {
  const decrypted = await Encryption.decrypt(refreshToken);
  const user = await User.query()
    .whereHas("tokens", builder => {
      builder.where("token", decrypted);
    })
    .first();

  return user;
}

module.exports = {
  generateFakeRefreshToken,
  generateExpiredRefreshToken,
  getRefreshTokenUser
};
