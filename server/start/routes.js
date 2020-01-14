"use strict";

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.group(() => {
  Route.post("/login", "AuthController.login");
  Route.post("/logout", "AuthController.logout").middleware(["auth"]);
  Route.get("/users", "UserController.index");
  Route.get("/users/:id", "UserController.show");
  Route.post("/users", "UserController.store").validator("StoreUser");
  Route.put("/users/:id", "UserController.update").validator("UpdateUser");
  Route.delete("/users/:id", "UserController.destroy");
}).prefix("api");
