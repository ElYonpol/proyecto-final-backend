const { connect } = require("mongoose");

//Nota para Tutor: Link de la URL está en el mensaje de la entrega
// let URL ="//colocar aquí la URL del mensaje de la entrega";


const objConfig = {
	connectDB: async () => {
		try {
			await connect(URL);
			console.log("Base de datos Mongo conectada");
		} catch (error) {
			console.log(error);
		}
	},
};

module.exports = { objConfig };
