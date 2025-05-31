import { ConnectDb } from "./config/db.js";
import cookieParser from "cookie-parser";
import { server, io, app } from "./config/socket.js";
import expressConfig from "./config/express.config.js";

import { config } from "dotenv";
import appRoutes from "./app.routes.js";

import { setupSocket } from "./controllers/socket/index.js";

config();

ConnectDb();
app.use(cookieParser());
expressConfig(app);
appRoutes(app);
app.get("/",(req,res)=>{
  res.send("app is running");
})

setupSocket(io);

server.listen(5000,"0.0.0.0", () =>
  console.log("Server running on port 5000")
);
