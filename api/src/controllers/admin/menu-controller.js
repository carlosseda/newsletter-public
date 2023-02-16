const db = require("../../models");
const Menu = db.Menu;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {

    try{
        let data = await Menu.create(req.body);
        res.status(200).send(data);
    }catch(error){
        res.status(500).send({
            message: error.message || "Algún error ha surgido al insertar el dato.",
            errors: error.errors
        });
    }
};

exports.findAll = async (req, res) => {

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

    Menu.findAndCountAll({
        where: condition, 
        attributes: ['id', 'name'],
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
            message: err.message || "Algún error ha surgido al recuperar los datos."
        });
    });
};

exports.findOne = (req, res) => {

    const id = req.params.id;

    Menu.findByPk(id).then(data => {

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

    Menu.update(req.body, {
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

    Menu.destroy({
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

exports.getMenuItems = (req, res) => {

    const menuName = req.params.name;

    Menu.findAll({
        order: [
            ['parentId', 'ASC'],
            ['order', 'ASC']
        ]
    }).then(data => {
            
        if (data) {

            let nestedData = this.nestMenuItems(data, null, menuName);

            res.status(200).send(Object.values(nestedData)[0].dataValues.children);

        } else {
            res.status(404).send({
                message: `No se puede encontrar el elemento con el nombre=${menuName}.`
            });
        }

    }).catch(err => {
        console.log(err);
        res.status(500).send({
            message: "Algún error ha surgido al recuperar el nombre=" + menuName
        });
    });
}

exports.nestMenuItems = (data, parentId, menuName) => {

    let nestedObject = {};

    data.forEach(function (item) {

        if(item.parentId === null && menuName !== item.name) return;

        if(item.parentId === parentId) {

            let children = module.exports.nestMenuItems(data, item.id);

            if (Object.keys(children).length) {
                item.dataValues.children = children;
            }

            nestedObject[item.id] = item;
        }
    });

    return nestedObject;
}
