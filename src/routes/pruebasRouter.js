const { Router } = require("express");
const passport = require("passport");
const { passportCall } = require("../passport-jwt/passportCall.js");
const { authorization } = require("../middleware/auth.middleware.js");

const router = Router();

//localhost:8080/pruebas
// Versión anterior con passport
// router.get(
// 	"/current",
// 	passport.authenticate("jwt", { session: false }),
// 	(req, res) => {
// 		res.send(req.user);
// 	}
// );

router.get(
	"/current",
	passportCall("jwt"),
	authorization("user"),
	(req, res) => {
		res.send(req.user);
	}
);

//localhost:8080/pruebas
// router.get("/:word([a-zA-Z]+)", async (req, res) => {
// 	%C3%A1 --> á
// 	%C3%A9 --> é
// 	%C3%AD --> í
// 	%C3%B3 --> ó
// 	%C3%BA --> ú
// 	%C3%BC --> ü

let words = ["Fede", "fede", "juan", "hola"];

router.param("word", async (req, res, next, word) => {
	// let searchWord = await diccionarioMOdel.findWord(word)
	let searchWord = words.find((w) => w === word);
	if (!searchWord) {
		req.word = null;
	} else {
		req.word = searchWord;
	}
	next();
});

router.get(
	"/:word([a-z%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA%C3%BC]+)",
	async (req, res) => {
		const word = req.word;
		res.send({
			word,
		});
	}
);

router.get("*", async (req, res) => {
	res.status(404).send("Ruta no encontrada.");
});

module.exports = router;
