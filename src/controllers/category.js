const { category, product_category } = require("../../models");

exports.getCategory = async (req, res) => {
    try {
        let data = await category.findAll({
        });

        res.send({
            status: "success...",
            data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const newCategory = await category.create(req.body)

        res.send({
            status: 'success',
            data: {
                id: newCategory.id,
                name: newCategory.name
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getDetailCategory = async (req, res) => {
    try {
        const { id } = req.params;

        let data = await category.findOne({
            where: {
                id
            },
        });

        res.send({
            status: "success",
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body

        await category.update(data, {
            where: {
                id,
            },
        });

        res.send({
            status: "success",
            data: {
                data
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        await category.destroy({
            where: {
                id,
            },
        });

        await product_category.destroy({
            where: {
                idCategory: id,
            },
        });

        res.send({
            status: "success",
            message: `Delete user id: ${id} finished`,
            data: {
                id,
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};