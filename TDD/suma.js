const { logger } = require("../src/utils/logger");

// # Primera versión de la fórmula ________________________________________________________________
// const suma = (numero1, numero2) => {
// 	if (!numero1 || !numero2) return 0;
// 	if (typeof numero1 !== "number" || typeof numero2 !== "number") return null;
//     return numero1 + numero2;
// };


// # Segunda versión de la fórmula ________________________________________________________________
// const suma = (...numeros) => {
// 	if (numeros.length === 0) return 0;
// 	let validInput = true;
// 	for (let i = 0; i < numeros.length && validInput; i++) {
// 		if (typeof numeros[i] !== "number") {
// 			validInput = false;
// 		}
// 	}
// 	if (!validInput) return null;

// 	let result = 0;
// 	for (let i = 0; i < numeros.length; i++) {
// 		result += numeros[i];
// 	}
// 	return result;
// };

// # Tercera versión de la fórmula ________________________________________________________________
const suma = (...numeros) => {
	if (numeros.length === 0) return 0;
	if (!numeros.every((num) => typeof num === "number")) return null;
	return numeros.reduce((totalAcc, num) => (totalAcc += num), 0);
};

let testPasados = 0;
const testTotales = 4;
// Debe devolver null si un parámetro no es numérico -> ("2",2) --> null
logger.info(
	"Debe devolver null si un parámetro no es numérico -> ('2',2) --> null"
);

let resultTest1 = suma("2", 2);
if (resultTest1 === null) {
	logger.info("Test 1 pasado.");
	testPasados++;
} else {
	logger.info(
		`Test 1 fallado, se recibió ${typeof resultTest1} pero se esperaba null.`
	);
}

// La función debe devolver 0 si no paso parámetros -> () --> 0
logger.info("La función debe devolver 0 si no paso parámetros -> () --> 0");

let resultTest2 = suma();
if (resultTest2 === 0) {
	logger.info("Test 2 pasado.");
	testPasados++;
} else {
	logger.info(`Test 2 fallado, se recibió ${resultTest2} pero se esperaba 0.`);
}

// La función debe poder realizar la suma correctamente
logger.info("La función debe poder realizar la suma correctamente");

let resultTest3 = suma(2, 3);
if (resultTest3 === 5) {
	logger.info("Test 3 pasado.");
	testPasados++;
} else {
	logger.info(`Test 3 fallado, se recibió ${resultTest3} pero se esperaba 5.`);
}

// Debe poder sumar cualquier cantidad de números
logger.info("Debe poder sumar cualquier cantidad de números");

let resultTest4 = suma(1, 2, 3, 4, 5);
if (resultTest4 === 15) {
	logger.info("Test 4 pasado.");
	testPasados++;
} else {
	logger.info(`Test 4 fallado, se recibió ${resultTest4} pero se esperaba 15.`);
}

logger.info(
	`Pasados ${testPasados} de un total de ${testTotales} test de pruebas.`
);
