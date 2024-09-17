const { userVerification } = require("../middleware/userAuth.middleware")
const {
    SignupFunction,
    LoginFunction,
    PasswordResetFunction,
    UpdatePasswordFunction,
    ShortenUrlFunction,
    GetUrlFunction,
    GetAllUrlsFunction
} = require("../controllers/shortner.controller");
const router = require("express").Router();

router.post('/', userVerification)

router.post("/signup", SignupFunction);

router.post('/login', LoginFunction)

router.post("/reset-request", PasswordResetFunction)

router.post("/reset-password/:token", UpdatePasswordFunction)

router.post('/shorten', ShortenUrlFunction)

router.get('/getUrl/:shortUrl', GetUrlFunction)

router.get('/getAllUrls', GetAllUrlsFunction)

router.get('/getLastGeneratedUrls', GetLastGeneratedUrlsFunction)

module.exports = router;