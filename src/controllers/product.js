const { product, user } = require("../../models");

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
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                image: process.env.FILE_PATH + item.image
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

        // code here
        let newProduct = await product.create({
            ...data,
            image: req.file.filename,
            idUser: req.user.id
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

        let data = await product.findAll({
            where: {
                id
            },
            attributes: {
                exclude: ["password", "idUser", "createdAt", "updatedAt"],
            },
        });

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                image: process.env.FILE_PATH + item.image
            }
        })
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

        // editProduct = JSON.parse(JSON.stringify(editProduct))

        // editProduct = {
        //     ...editProduct,
        //     image: process.env.FILE_PATH + editProduct.image
        // }

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