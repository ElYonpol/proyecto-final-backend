const { Router } = require("express");
const { UsersDaos, TokensDaos } = require("../dao/factory.js");
const sendMailTransport = require("../utils/nodemailer.js");
const { checkValidPassword, createHash } = require("../utils/bcryptPass.js");

const passwordsRouter = Router();

// Endpoint para trabajar con password olvidado
passwordsRouter.post("/forgotPassword", async (req, res) => {
	try {
		const userEmail = req.body.email;
		const user = await UsersDaos.getByEmail(userEmail);
		if (!user.length > 0) throw new Error("El email ingresado es inválido.");
		const { _id, first_name, last_name } = user[0];
		const tokenList = await TokensDaos.getByUserId(_id);
		if (!tokenList.length > 0) {
			const randomTokenSegment = () => {
				Math.random().toString(36).substring(2, 18);
			};
			const firstSegment = randomTokenSegment();
			const secondSegment = randomTokenSegment();
			const randomToken = firstSegment + secondSegment;
            let expireDate = new Date()
            expireDate.setHours(expireDate.getHours() +1)
            const newToken = {
                token: randomToken,
                expireDate,
                user: _id
            }
            await TokensDaos.create(newToken)
            const url = `http://localhost:8080/passwordReset/${_id}?token=${randomToken}`
            const configMail = {
                to: userEmail,
                subject: "Solicitud de restablecimiento de contraseña",
                html: `
                    <h1>${first_name} ${last_name}</h1>
                    <p>Recibimos una solicitud de restablecimiento de contraseña, en caso de que no haya sido usted, simplemente ignore este correo electrónico, en caso de que desee restablecer su contraseña, simplemente siga el siguiente enlace.</p>
                    <a href="${url}">Restablecer contraseña</a>
                `
            }
            await sendMailTransport(configMail)
		}
        res.send({ status: "success", message: "Email enviado con éxito." });
	} catch (error) {
		res.status(404).json({
			status: "error forgotPassword",
			payload: { error: error, message: error.message },
		});
	}
});

passwordsRouter.post("/resetPassword", async (req, res) => {
    try {
        const { newPassword, repeatNewPassword, uid, token } = req.body
        const userToken = await TokensDaos.getByTokenId(token)
        if (!userToken) throw new Error("Token no válida.")
        const stringToken = userToken.user.toString()
        if (uid !== stringToken) throw new Error("Usuario no válido.")
        if (newPassword !== repeatNewPassword) throw new Error("Las contraseñas deben ser iguales.")
        await TokensDaos.delete(userToken._id)
        const presentDate = new Date()
        if (presentDate > userToken.expireDate) throw new Error("Token expirada.")
        const newResettedPassword = createHash(password)
        const update = {
            password: newResettedPassword
        }
        await UsersDaos.update(uid,update)
        res.json({
            status: "success",
            payload: "La contraseña fue actualizada correctamente."
        })
    } catch (error) {
        res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
        });
    }
})

module.exports = passwordsRouter;
