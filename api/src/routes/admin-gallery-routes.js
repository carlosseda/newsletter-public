module.exports = (app, upload) => {

  const router = require("express").Router();
  const authJwt  = require("../middlewares/auth-jwt.js");
  const controller = require("../controllers/admin/image-gallery-controller.js");

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  let uploadFields = upload.fields([
    {name: 'file', maxCount: 1},
  ])

  router.post("/", [authJwt.verifyUserToken, uploadFields], controller.create);
  router.get("/", [authJwt.verifyUserToken], controller.findAll);  
  router.get("/:filename", controller.findOne);  
  router.delete("/:filename", [authJwt.verifyUserToken], controller.delete);

  app.use('/api/admin/image-gallery', router);
};
  