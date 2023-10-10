import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.routes.js";

const app = express();

//Servidor archivos estaticos
app.use(express.static(`${__dirname}/public`));

//Motor plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//Routes
app.use("/", viewsRouter);

const server = app.listen(8080, () => console.log("Listening on server 8080"));

//Socket.io desde lado SERVIDOR
const socketServer = new Server(server);

const messages = [];

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("message", (data) => {
    messages.push(data);
    socketServer.emit("messageLogs", messages);
  });

  socket.on("authenticated", (data) => {
    // enviamos todos los msgs almacenados hasta el momento
    // solo al cliente que se acaba de conectar
    socket.emit("messageLogs", messages);
    socket.broadcast.emit('newUserConnected', data)
  });
});
