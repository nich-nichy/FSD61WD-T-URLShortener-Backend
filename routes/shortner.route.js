const { userVerification } = require("../middleware/user.middleware")
const {
    SignupFunction,
    LoginFunction,
    PasswordResetFunction,
    UpdatePasswordFunction,
    ShortenUrlFunction,
    GetUrlFunction,
    GetAllUrlsFunction,
    GetLastGeneratedUrlsFunction
} = require("../controllers/shortner.controller");
const router = require("express").Router();

router.post('/', userVerification)

router.post("/signup", SignupFunction);

router.post('/login', LoginFunction)

router.post("/reset-request", PasswordResetFunction)

router.post("/reset-password/:token", UpdatePasswordFunction)

router.post('/shortenUrl', ShortenUrlFunction)

router.get('/getUrl/:shortUrl', GetUrlFunction)

router.get('/getAllUrls', GetAllUrlsFunction)

router.get('/getLastGeneratedUrls', GetLastGeneratedUrlsFunction)

module.exports = router;