"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Token = use("App/Models/Token");

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

    await auth.authenticator("jwt").revokeTokens([refreshToken], true);

    return response.status(204).send();
  }

  /**
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async refresh({ auth, request, response }) {
    const refreshToken = request.header("RefreshToken");
    const expired = await Token.checkRefreshTokenIsExpired(refreshToken);

    if (expired === true) {
      await Token.revokeRefreshToken(refreshToken);
      return response.status(401).json({ error: "invalid token" });
    }

    const result = await auth
      .newRefreshToken()
      .generateForRefreshToken(refreshToken);

    return result;
  }
}

module.exports = AuthController;
