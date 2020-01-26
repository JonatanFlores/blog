"use strict";

const moment = require("moment-timezone");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");

class User extends Model {
  static boot() {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook("beforeSave", async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

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
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany("App/Models/Token");
  }
}

module.exports = User;
