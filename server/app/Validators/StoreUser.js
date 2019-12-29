"use strict";

class StoreUser {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      email: "required|email|unique:users,email",
      password: "required"
    };
  }
}

module.exports = StoreUser;
