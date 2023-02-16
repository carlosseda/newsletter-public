const db = require("../../models");
const OpenAI = require("../../utils/OpenAI");
const fs = require('fs');
const path = require('path');
const Customer = db.Customer;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

    Customer.create(req.body).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Algún error ha surgido al insertar el dato.",
            errors: err.errors
        });
    });
};

exports.findAll = (req, res) => {

    let page = req.query.page || 1;
    let limit = req.query.size || 10;
    let offset = (page - 1) * limit;

    let whereStatement = {};
    whereStatement.onService = true;

    if(req.query.postalCode)
        whereStatement.postalCode = {[Op.like]: `%${req.query.postalCode}%`};

    if(req.query.city)
        whereStatement.city = {[Op.like]: `%${req.query.city}%`};

    if(req.query.startingServiceDate)
        whereStatement.startingServiceDate = {[Op.gte]: req.query.startingServiceDate};

    let condition = Object.keys(whereStatement).length > 0 ? {[Op.and]: [whereStatement]} : {};

    Customer.findAndCountAll({
        where: condition, 
        attributes: ['id', 'name', 'surname', 'email'],
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']]
    }).then(result => {

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

exports.findOne = (req, res) => {

    const id = req.params.id;

    Customer.findByPk(id).then(data => {

        if (data) {
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

    Customer.update(req.body, {
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

    Customer.destroy({
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

exports.openAIResource = async (req, res) => {

    let migrationPrompt = `
    {
        sequelizeGenerator: true,
        migrationSkeleton: true,
        create: prompt,
        timeStamps: true,
        paranoidMode: true
    }`;

    migrationPrompt = migrationPrompt.replace(/\s+/g, '');
    migrationPrompt = migrationPrompt.replace("prompt", `${req.body.prompt}`);

    const openAI = new OpenAI;

    try{
        let data = {};
        openAI.setCompletion('resourceGenerator', migrationPrompt)
        data.migration = await openAI.getAnswer();

        const migration = await fs.createWriteStream(path.join(__dirname,"../../migrations/openai.js"));
        await migration.write(data.migration);
        migration.end();

        modelPrompt = `${data.migration.replace(/\s+/g, '')} Crea el modelo relacionado con validaciones y mensajes de error en castellano.`
        openAI.setCompletion('resourceGenerator', modelPrompt)
        data.model = await openAI.getAnswer();

        const model = await fs.createWriteStream(path.join(__dirname,"../../models/openai.js"));
        await model.write(data.model);
        model.end();

        const controllerExample = await fs.readFile(path.join(__dirname,"./email-controller.js"), (error, content) => {
            if (error) {
              console.error(error);
              return;
            }
          
            return content.toString().replace(/\s+/g, '');
        });

        controllerPrompt = `${controllerExample} Partiendo de este ejemplo 
        crea el controlador con las operaciones CRUD. Para ello utiliza el siguiente modelo: ${data.model.replace(/\s+/g, '')}`;
        openAI.setCompletion('resourceGenerator', controllerPrompt);
        data.controller = await openAI.getAnswer();

        const controller = await fs.createWriteStream(path.join(__dirname,"./open-ai.js"));
        await controller.write(data.controller);
        controller.end();

    }catch(error){

        console.log(error);

        res.status(500).send({
            message: "No ha sido posible generar el recurso."
        });
    }


};