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
    const { email, password } = request.all();

    return await auth.withRefreshToken().attempt(email, password);
  }

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async logout({ auth, request, response }) {
    const refreshToken = request.header("RefreshToken");

    if (!refreshToken) {
      return response.status(400).json({ error: "Refresh token not informed" });
    }

    await auth.authenticator("jwt").revokeTokens([refreshToken]);

    return response.status(204).send();
  }
}

module.exports = AuthController;
