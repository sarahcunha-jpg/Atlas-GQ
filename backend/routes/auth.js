const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../database");

const router = express.Router();


router.post("/login", (req, res) => {

    const {
        email,
        senha
    } = req.body;


    if (!email || !senha) {

        return res.status(400).json({
            erro: "Informe e-mail e senha."
        });

    }


    db.get(
        `
        SELECT *
        FROM usuarios
        WHERE email = ?
        `,
        [email],
        async (erro, usuario) => {

            if (erro) {

                return res.status(500).json({
                    erro: "Erro no banco de dados."
                });

            }


            if (!usuario) {

                return res.status(401).json({
                    erro: "E-mail ou senha incorretos."
                });

            }


            if (usuario.status !== "Ativo") {

                return res.status(403).json({
                    erro: "Usuário inativo."
                });

            }


            const senhaValida =
                await bcrypt.compare(
                    senha,
                    usuario.senha
                );


            if (!senhaValida) {

                return res.status(401).json({
                    erro: "E-mail ou senha incorretos."
                });

            }


            const token =
                jwt.sign(
                    {
                        id: usuario.id,
                        nome: usuario.nome,
                        email: usuario.email,
                        perfil: usuario.perfil
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "8h"
                    }
                );


            res.json({

                mensagem:
                    "Login realizado com sucesso.",

                token,

                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    perfil: usuario.perfil
                }

            });

        }
    );

});



router.post("/criar-admin", async (req, res) => {

    const {
        nome,
        email,
        senha
    } = req.body;


    if (!nome || !email || !senha) {

        return res.status(400).json({
            erro: "Nome, e-mail e senha são obrigatórios."
        });

    }


    try {

        const senhaHash =
            await bcrypt.hash(
                senha,
                10
            );


        db.run(
            `
            INSERT INTO usuarios
            (
                nome,
                email,
                senha,
                perfil,
                status
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                nome,
                email,
                senhaHash,
                "Administrador",
                "Ativo"
            ],
            function (erro) {

                if (erro) {

                    if (
                        erro.message.includes(
                            "UNIQUE"
                        )
                    ) {

                        return res.status(400).json({
                            erro: "Este e-mail já está cadastrado."
                        });

                    }

                    return res.status(500).json({
                        erro: erro.message
                    });

                }


                res.status(201).json({

                    mensagem:
                        "Administrador criado com sucesso.",

                    id: this.lastID

                });

            }
        );

    } catch (erro) {

        res.status(500).json({
            erro: "Erro ao criar usuário."
        });

    }

});


module.exports = router;
