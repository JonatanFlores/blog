"use strict";

const { ServiceProvider } = require("@adonisjs/fold");

class ExistProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    //
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot() {
    const Validator = use("Validator");
    const Database = use("Database");

    Validator.extend("exists", async function(data, field, message, args, get) {
      const value = get(data, field);

      if (!value) {
        return;
      }

      const [table, column] = args;
      const row = await Database.table(table)
        .where(column, value)
        .first();

      if (!row) {
        throw message;
      }
    });
  }
}

module.exports = ExistProvider;
