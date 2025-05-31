import userRoutes from "./routes/private/user.route.js";
import roomRoutes from "./routes/private/room.route.js";
import privateMessageRoutes from "./routes/private/privateMessage.route.js";
import publicRoutes from "./routes/public/auth.route.js";
import authentication from "./middlewares/authentication.js";
import authPrivateRoutes from "./routes/private/auth.private.route.js";


const appRoutes = (app) => {
  app.use("/api/auth", publicRoutes);
  app.use("/api",authentication, userRoutes);
  app.use("/api", authentication, roomRoutes);
  app.use("/api", authentication, privateMessageRoutes);
  app.use("/api", authentication, authPrivateRoutes);
};

export default appRoutes;






