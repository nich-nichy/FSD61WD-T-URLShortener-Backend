const { SignupFunction } = require("../controllers/shortner.controller");
const router = require("express").Router();

router.post('/', userVerification)

router.post("/check-user", checkUserFunction)

router.post("/signup", SignupFunction);

router.post('/login', LoginFunction)

router.post("/reset-request", PasswordResetFunction)

router.post("/reset-password/:token", UpdatePasswordFunction)

router.post('/shorten', ShortenUrlFunction)


module.exports = router;