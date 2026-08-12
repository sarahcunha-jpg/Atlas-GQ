const express = require("express");

const db = require("../database");

const autenticar =
    require("../middleware/auth");

const router = express.Router();



router.get(
    "/",
    autenticar,
    (req, res) => {

        db.all(
            `
            SELECT *
            FROM inspecoes
            ORDER BY id DESC
            `,
            [],
            (erro, resultados) => {

                if (erro) {

                    return res.status(500).json({
                        erro: erro.message
                    });

                }

                res.json(resultados);

            }
        );

    }
);



router.get(
    "/:id",
    autenticar,
    (req, res) => {

        db.get(
            `
            SELECT *
            FROM inspecoes
            WHERE id = ?
            `,
            [req.params.id],
            (erro, resultado) => {

                if (erro) {

                    return res.status(500).json({
                        erro: erro.message
                    });

                }

                if (!resultado) {

                    return res.status(404).json({
                        erro: "Inspeção não encontrada."
                    });

                }

                res.json(resultado);

            }
        );

    }
);



router.post(
    "/",
    autenticar,
    (req, res) => {

        const {
            codigo,
            produto,
            lote,
            responsavel,
            data,
            local,
            tipo,
            resultado,
            observacoes,
            descricao,
            gravidade,
            prazo
        } = req.body;


        if (
            !codigo ||
            !produto ||
            !responsavel ||
            !data ||
            !resultado
        ) {

            return res.status(400).json({
                erro:
                    "Código, produto, responsável, data e resultado são obrigatórios."
            });

        }


        db.run(
            `
            INSERT INTO inspecoes
            (
                codigo,
                produto,
                lote,
                responsavel,
                data,
                local,
                tipo,
                resultado,
                observacoes,
                descricao,
                gravidade,
                prazo
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                codigo,
                produto,
                lote,
                responsavel,
                data,
                local,
                tipo,
                resultado,
                observacoes,
                descricao,
                gravidade,
                prazo
            ],
            function (erro) {

                if (erro) {

                    return res.status(500).json({
                        erro: erro.message
                    });

                }


                res.status(201).json({

                    mensagem:
                        "Inspeção cadastrada com sucesso.",

                    id:
                        this.lastID

                });

            }
        );

    }
);



router.put(
    "/:id",
    autenticar,
    (req, res) => {

        const {
            codigo,
            produto,
            lote,
            responsavel,
            data,
            local,
            tipo,
            resultado,
            observacoes,
            descricao,
            gravidade,
            prazo
        } = req.body;


        db.run(
            `
            UPDATE inspecoes

            SET
                codigo = ?,
                produto = ?,
                lote = ?,
                responsavel = ?,
                data = ?,
                local = ?,
                tipo = ?,
                resultado = ?,
                observacoes = ?,
                descricao = ?,
                gravidade = ?,
                prazo = ?

            WHERE id = ?
            `,
            [
                codigo,
                produto,
                lote,
                responsavel,
                data,
                local,
                tipo,
                resultado,
                observacoes,
                descricao,
                gravidade,
                prazo,
                req.params.id
            ],
            function (erro) {

                if (erro) {

                    return res.status(500).json({
                        erro: erro.message
                    });

                }


                if (this.changes === 0) {

                    return res.status(404).json({
                        erro: "Inspeção não encontrada."
                    });

                }


                res.json({
                    mensagem:
                        "Inspeção atualizada com sucesso."
                });

            }
        );

    }
);



router.delete(
    "/:id",
    autenticar,
    (req, res) => {

        db.run(
            `
            DELETE FROM inspecoes
            WHERE id = ?
            `,
            [req.params.id],
            function (erro) {

                if (erro) {

                    return res.status(500).json({
                        erro: erro.message
                    });

                }


                if (this.changes === 0) {

                    return res.status(404).json({
                        erro: "Inspeção não encontrada."
                    });

                }


                res.json({
                    mensagem:
                        "Inspeção excluída com sucesso."
                });

            }
        );

    }
);


module.exports = router;
