const multer = require("multer");
const { logger } = require("./logger");
const { dirname } = require("node:path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, `${dirname(dirname(__dirname))}/public/uploads`);
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const uploader = multer({
	storage,
	onError: (err, next) => {
		logger.error(err);
		next;
	},
});

module.exports = { uploader };
