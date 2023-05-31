import Message from "../models/message.js";

var controller = {
  //Función para guardar un mensaje

  save: (req, res) => {
    var params = req.body;
    var message = new Message();
    message.message = params.message;
    message.from = params.from;
    console.log(message);

    message
      .save()
      .then((messageStored) => {
        return res.status(200).send({
          status: "success",
          messageStored,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          status: "Error",
          message: "No ha sido posible guardar el mensaje",
        });
      });
  },
  //funcion para obtener todos los mensajes
  getMessages: (req, res) => {
    Message.find({}) 
      .sort("-_id")
      .then((messages) => {
        if (!messages) {
          return res.status(404).send({
            status: "error",
            message: "No hay mensajes para mostrar",
          });
        }

        return res.status(200).send({
          status: "success",
          messages,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          status: "error",
          message: "Error al extraer los datos",
        });
      });
  },
};

export default controller;