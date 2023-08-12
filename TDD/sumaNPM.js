const sumaNPM = (...numeros) => {
	if (numeros.length === 0) return 0;
	if (!numeros.every((num) => typeof num === "number")) return null;
	return numeros.reduce((totalAcc, num) => (totalAcc += num), 0);
};

module.exports = sumaNPM;
