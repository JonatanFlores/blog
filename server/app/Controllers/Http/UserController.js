"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ request, response }) {
    const page = request.input("page", 1);
    const limit = Env.get("APP_PER_PAGE");
    const users = await User.query().paginate(page, limit);
    return response.status(200).send({ users });
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const user = await User.create(request.only(["email", "password"]));
    return response.status(201).send(user);
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show({ params, response }) {
    const { id } = params;
    const user = await User.findOrFail(id);
    return response.json(user);
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const { id } = params;
    const user = await User.findBy("id", id);

    if (!user) {
      return response.status(400).json({ message: "User not found" });
    }

    user.merge(request.only(["email", "password"]));
    user.save();

    return response.status(200).send(user);
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const { id } = params;
    const user = await User.findOrFail(id);
    await user.delete();
    return response.status(204).send();
  }
}

module.exports = UserController;
