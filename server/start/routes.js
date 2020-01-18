"use strict";

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.group(() => {
  Route.post("/login", "AuthController.login");
  Route.post("/logout", "AuthController.logout").middleware(["auth"]);
  Route.resource("users", "UserController")
    .apiOnly()
    .middleware(["auth"])
    .validator(
      new Map([
        [["users.store"], ["StoreUser"]],
        [["users.update"], ["UpdateUser"]]
      ])
    );
}).prefix("api");
