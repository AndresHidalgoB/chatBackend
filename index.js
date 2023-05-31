import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/message.js";
import bodyParser from "body-parser";
import dotenv from 'dotenv'
dotenv.config()

//Mongoose configuration **********************************************************
var url = "mongodb+srv://admin:admin@cluster0.fl7lkub.mongodb.net/";

const PORT = 5000;
//Configuración para evitar fallos en la conexión con mongoDB
mongoose.Promise = global.Promise;

const app = express();
//Creamos el servidor con el módulo http de node
const server = http.createServer(app);
//Utilizamos como servidor el proporcionado por socket.io. Configuramos cors indicando que cualquier servidor se puede conectar
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

io.on('connection', (socket) =>{
  //console.log('user connected')
  //console.log(socket.id)

  socket.on('message', (message, nickname) => {
      console.log(message)
      //Envio al resto de clientes con broadcast.emit
      socket.broadcast.emit('message', {
          body: message,
          from: nickname
      })
  })
})
//**** Ficheros ruta **************************************************************
app.use("/api", router);

//Nos conectamos a mongoDB. Opción { useNewUrlParser: true } para utilizar las últimas funcionalidades de mongoDB
mongoose.connect(url, { useNewUrlParser: true }).then(() => {
  console.log("Conexión con la BDD realizada con éxito!!!");
  server.listen(process.env.PORT, () => {
    console.log("servidor ejecutándose en http://localhost:", process.env.PORT);
  });
});
