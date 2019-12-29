"use strict";

class UpdateUser {
  get validateAll() {
    return true;
  }

  get rules() {
    const userId = this.ctx.params.id;

    return {
      email: `email|unique:users,email,id,${userId}`
    };
  }
}

module.exports = UpdateUser;
