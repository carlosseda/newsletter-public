const db = require("../../models");
const ImageService = require("../../services/image-service");

exports.create = async (req, res) => {

    try{

        let result = await new ImageService().uploadImage(req.files);

        res.status(200).send(result);

    }catch(error){
        res.status(500).send({
            message: error.message || "Algún error ha surgido al insertar el dato.",
            errors: error.errors
        });
    }
};

exports.findOne = async (req, res) => {

    const fileName = req.params.filename;

    var options = {
        root: __dirname + '../../../storage/images/gallery/thumbnail/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile(fileName, options);
};

exports.findAll = async (req, res) => {

    let page = req.query.page || 1;
    let limit = req.query.size || 20;
    let offset = (page - 1) * limit;

    new ImageService().getThumbnails(limit, offset).then(result => {

        result.meta = {
            total: result.count,
            pages: Math.ceil(result.count / limit),
            currentPage: page
        };

        res.status(200).send(result);

    }).catch(err => {
        res.status(500).send({
            message: err.message || "Algún error ha surgido al recuperar los datos."
        });
    });
};

exports.delete = (req, res) => {

    const filename = req.params.filename;

    new ImageService().deleteImages(filename).then(result => {

        if (result == 1) {
            res.status(200).send({
                message: "El elemento ha sido borrado correctamente"
            });
        } else {
            res.status(404).send({
                message: `No se puede borrar el elemento`
            });
        }
        
    }).catch(err => {
        res.status(500).send({
            message: "Algún error ha surgido al borrar"
        });
    });
};