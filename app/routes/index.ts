import userRoutes from "./user";
import organizationRoutes from "./organization";

const routing = (app: any) => {
  app.use("/astrium/api/user", userRoutes);
  app.use("/astrium/api/organization", organizationRoutes);
};

export default routing;
