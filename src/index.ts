require('dotenv').config();
import Server from "./Server";
new Server(parseInt(process.env.PORT) || 4000);