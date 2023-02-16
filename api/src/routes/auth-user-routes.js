module.exports = (app, upload) => {

    const auth = require("../controllers/auth/user-auth-controller.js");

    app.use(function(req, res, next) {

        res.header(
            "Access-Control-Allow-Headers",
            "Authorization, Origin, Content-Type, Accept"
        );

        next();
    });

    app.post("/api/auth/users/signin", auth.signin);
};