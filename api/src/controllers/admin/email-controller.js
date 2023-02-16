const EmailService = require("../../services/email-service");
const ImageService = require("../../services/image-service");
const db = require("../../models");
const Email = db.Email;
const Customer = db.Customer;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

    Email.create(req.body).then(async data => {

        await new ImageService().resizeImages('email', data.id, req.body.images);

        res.status(200).send(data);
        
    }).catch(err => {
        res.status(500).send({
            message: err.errors || "Algún error ha surgido al insertar el dato."
        });
    });
};

exports.findAll = (req, res) => {

    let page = req.query.page || 1;
    let limit = parseInt(req.query.size) || 10;
    let offset = (page - 1) * limit;
    let whereStatement = {};

    for (let key in req.query) {
        if (req.query[key] != "" && key != "page" && key != "size") {
            whereStatement[key] = {[Op.substring]: req.query[key]};
        }
    }

    let condition = Object.keys(whereStatement).length > 0 ? {[Op.and]: [whereStatement]} : {};

    Email.findAndCountAll({
        where: condition, 
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']]
    })
    .then(result => {

        result.meta = {
            total: result.count,
            pages: Math.ceil(result.count / limit),
            currentPage: page
        };

        res.status(200).send(result);

    }).catch(err => {
        res.status(500).send({
            message: err.errors || "Algún error ha surgido al recuperar los datos."
        });
    });
};

exports.findOne = (req, res) => {

    const id = req.params.id;

    Email.findByPk(id).then(async data => {

        if (data) {

            let images = await new ImageService().getAdminImages('email', data.id);

            data.dataValues.images = images;

            res.status(200).send(data);

        } else {
            res.status(404).send({
                message: `No se puede encontrar el elemento con la id=${id}.`
            });
        }

    }).catch(err => {
        res.status(500).send({
            message: "Algún error ha surgido al recuperar la id=" + id
        });
    });
};

exports.update = (req, res) => {

    const id = req.params.id;

    Email.update(req.body, {
        where: { id: id }
    }).then(async num => {

        if (num == 1) {

            if(req.body.images && req.body.images.length > 0){
                await new ImageService().deleteImages('email', id);
                await new ImageService().resizeImages('email', id, req.body.images);
            }

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

    Email.destroy({
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            
            new ImageService('email', id).deleteImages();

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

exports.sendEmail = async (req, res) => {
    
    let email = await Email.findByPk(req.body.id);
    let whereStatement = {};

    whereStatement.onService = true;

    if(req.body.postalCode)
        whereStatement.postalCode = {[Op.like]: `%${req.body.postalCode}%`};

    if(req.body.city)
        whereStatement.city = {[Op.like]: `%${req.body.city}%`};

    if(req.body.startingServiceDate)
        whereStatement.startingServiceDate = {[Op.gte]: req.body.startingServiceDate};

    let condition = Object.keys(whereStatement).length > 0 ? {[Op.and]: [whereStatement]} : {};

    Customer.findAll({ where: condition }).then(data => {
        
        data.forEach(customer => {
            new EmailService("gmail").sendEmail(email, customer);
        });
 
        res.status(200).send({
            message: "Emails enviados correctamente."
        });

    }).catch(err => {
        res.status(500).send({
            message: err.errors || "Algún error ha surgido al enviar los emails."
        });
    });
};