const { user } = require("../../models");

const Joi = require("joi");

const bcrypt = require("bcrypt");

const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {

    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
    });


    const { error } = schema.validate(req.body);

    if (error)
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            },
        });

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = await user.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        // code here
        const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY)

        res.status(200).send({
            status: "success...",
            data: {
                name: newUser.name,
                email: newUser.email,
                // code here
                token
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

exports.login = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            },
        });

    try {
        const userExist = await user.findOne({
            where: {
                email: req.body.email,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        if (!userExist) {
            return res.status(400).send({
                status: 'failed',
                message: 'Email or password incorrect'
            })
        }
        const isValid = await bcrypt.compare(req.body.password, userExist.password);

        if (!isValid) {
            return res.status(400).send({
                status: "failed",
                message: "Email and Password incorrect",
            });
        }

        const token = jwt.sign({ id: userExist.id }, process.env.SECRET_KEY)

        res.status(200).send({
            status: "success...",
            data: {
                name: userExist.name,
                email: userExist.email,
                // code here
                token
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