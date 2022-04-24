const { product, user, product_category, category } = require("../../models");

exports.getProduct = async (req, res) => {
    try {
        let data = await product.findAll({
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"],
                    },
                },
                {
                    model: category,
                    as: "categories",
                    through: {
                        model: product_category,
                        as: "bridge",
                        attributes: [],
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                image: process.env.FILE_PATH + item.image,
            }
        })


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

exports.addProduct = async (req, res) => {
    try {
        const data = req.body;

        let newProduct = await product.create({
            ...data,
            image: req.file.filename,
            idUser: req.user.id,
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        })

        newProduct = JSON.parse(JSON.stringify(newProduct))

        newProduct = {
            ...newProduct,
            image: process.env.FILE_PATH + newProduct.image
        }

        // code here
        res.send({
            status: 'success',
            data: {
                newProduct
            }

        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getDetailProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await product.findOne({
            where: { id },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"],
                    },
                },
                {
                    model: category,
                    as: "categories",
                    through: {
                        model: product_category,
                        as: "bridge",
                        attributes: [],
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
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

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = {
            name: req.body.name,
            desc: req.body.desc,
            image: req.file.filename,
            price: req.body.price,
            qty: req.body.qty,
        };

        await product.update(data, {
            where: {
                id
            },
            attributes: {
                exclude: ["password", "idUser", "createdAt", "updatedAt"],
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

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await product.destroy({
            where: {
                id,
            },
        });

        res.send({
            status: "success",
            message: `Delete user id: ${id} finished`,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};