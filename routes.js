import express from "express";
import authenticateApiHandler from "./src/controllers/authentications/apiHandler.js";
import adminApiHandler from "./src/controllers/admin/manageVendors/apiHandler.js";
import catApiHandler from "./src/controllers/admin/manageCategory/apiHandler.js";
import subcategory from "./src/controllers/admin/manageSubCategory/apiHandler.js";
import propertyManage from "./src/controllers/manageProperties/apiHandler.js";
import comments from "./src/controllers/comments/apiHandler.js";
import users from "./src/controllers/users/apiHandler.js";
import bookings from "./src/controllers/bookProperty/apiHandler.js";
import analysis from "./src/controllers/admin/analysis/apiHandler.js";

const router = (app) => {
  app.use(express.json());
  app.use("/api/account", authenticateApiHandler);
  app.use("/api/admin", adminApiHandler);
  app.use("/api/category", catApiHandler);
  app.use("/api/subcategory", subcategory);
  app.use("/api/properties", propertyManage);
  app.use("/api/comments", comments);
  app.use("/api/user", users);
  app.use("/api/property", bookings);
  app.use("/api/project", analysis);
};

export default router;
