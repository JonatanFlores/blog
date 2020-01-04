"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

class AuthController {
  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   */
  async login({ auth, request }) {
    const { email, password } = request.only(["email", "password"]);

    return await auth.attempt(email, password);
  }

  async logout() {}
}

module.exports = AuthController;
