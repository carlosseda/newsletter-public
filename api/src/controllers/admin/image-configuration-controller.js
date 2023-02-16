const db = require("../../models");
const ImageConfiguration = db.ImageConfiguration;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {

    try{
        let data = await ImageConfiguration.create(req.body);
        res.status(200).send(data);
    }catch(error){
        res.status(500).send({
            message: error.message || "Algún error ha surgido al insertar el dato.",
            errors: error.errors
        });
    }
};

exports.update = (req, res) => {

    const id = req.params.id;

    ImageConfiguration.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "El elemento ha sido actualizado correctamente."
            });
        } else {
            res.status(404).send({
                message: `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento o el cuerpo de la petición está vacío.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Algún error ha surgido al actualiazar la id=" + id
        });
    });
};

exports.delete = (req, res) => {

    const id = req.params.id;

    ImageConfiguration.destroy({
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "El elemento ha sido borrado correctamente"
            });
        } else {
            res.status(404).send({
                message: `No se puede borrar el elemento con la id=${id}. Tal vez no se ha encontrado el elemento.`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Algún error ha surgido al borrar la id=" + id
        });
    });
};