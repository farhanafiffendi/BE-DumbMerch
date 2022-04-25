const { transaction, product, user } = require("../../models");

exports.addTransaction = async (req, res) => {
    try {
        let data = req.body

        // code here
        const newTransaction = await transaction.create({
            ...data,
            idBuyer: req.user.id, //dari token
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        })

        // code here
        res.send({
            status: 'success',
            newTransaction,
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getTransaction = async (req, res) => {
    try {

        const idBuyer = req.user.id
        let data = await transaction.findAll({
            where: {
                idBuyer,
            },
            include: [
                {
                    model: product,
                    as: "product",
                    attributes: {
                        exclude: ["createdAt", "updatedAt",],
                    },
                },
                {
                    model: user,
                    as: "buyer",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password", "status"],
                    },
                },
                {
                    model: user,
                    as: "seller",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password", "status"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        data = JSON.parse(JSON.stringify(data));

        data = data.map((item) => {
            return {
                ...item,
                product: {
                    ...item.product,
                    image: process.env.FILE_PATH + item.product.image,
                },
            };
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