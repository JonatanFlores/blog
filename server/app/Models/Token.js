"use strict";

const moment = require("moment-timezone");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

/** @type {import('@adonisjs/framework/src/Encryption')} */
const Encryption = use("Encryption");

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");

class Token extends Model {
  /**
   * Format dates accross the application
   *
   * @param {string} field field name
   * @param {string} value date value
   */
  static formatDates(field, value) {
    value = moment()
      .tz(Env.get("TZ"))
      .format("YYYY-MM-DD HH:mm:ss");

    return super.formatDates(field, value);
  }

  /**
   * Get a Token record by providing an encrypted Refresh Token string
   *
   * @param {string} refreshToken Encripted refresh token
   */
  static async getByRefreshToken(refreshToken) {
    const decrypted = Encryption.decrypt(refreshToken);
    const token = await this.query()
      .where("token", decrypted)
      .first();

    return token;
  }

  /**
   * Get the minutes since the created_at date of the refresh token
   *
   * @param {string} refreshToken Encripted refresh token
   * @return {Number|false}
   */
  static async refreshTokenCreatedSince(refreshToken) {
    const token = await this.getByRefreshToken(refreshToken);

    if (token) {
      const currentTime = moment()
        .tz(Env.get("TZ"))
        .format("YYYY-MM-DD HH:mm:ss");

      const minutes = moment(currentTime).diff(token.created_at, "minutes");

      return minutes;
    }

    return false;
  }

  /**
   * Check if the refresh token is expired, using the created_at date as basis
   *
   * @param {string} refreshToken Encripted refresh token
   * @return {boolean}
   */
  static async checkRefreshTokenIsExpired(refreshToken) {
    const limitInMinutes = Env.get("APP_REFRESH_TOKEN_TIME_IN_MINUTES");
    const minutesSince = await this.refreshTokenCreatedSince(refreshToken);
    return minutesSince === false || minutesSince > limitInMinutes;
  }

  /**
   * Revoke a refresh token from the tokens table
   *
   * @param {string} refreshToken Encripted refresh token
   * @return {boolean}
   */
  static async revokeRefreshToken(refreshToken) {
    const token = await this.getByRefreshToken(refreshToken);

    if (token) {
      await token.delete();
      return true;
    }

    return false;
  }
}

module.exports = Token;
