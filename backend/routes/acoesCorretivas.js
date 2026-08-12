const express = require("express");
const db = require("../database");
const autenticar = require("../middleware/auth");

const router = express.Router();


router.get("/", autenticar, (req, res) => {

    db.all(
        `
        SELECT
            ac.*,
            nc.codigo AS nc_codigo,
            nc.descricao AS nc_descricao

        FROM acoes_corretivas ac

        LEFT JOIN nao_conformidades nc
            ON ac.nao_conformidade_id = nc.id

        ORDER BY ac.id DESC
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
});


router.get("/:id", autenticar, (req, res) => {

    db.get(
        `
        SELECT *
        FROM acoes_corretivas
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
                    erro: "Ação corretiva não encontrada."
                });

            }

            res.json(resultado);

        }
    );
});


router.post("/", autenticar, (req, res) => {

    const {
        numero,
        nao_conformidade_id,
        responsavel,
        data_abertura,
        prazo,
        plano_acao,
        status
    } = req.body;


    if (
        !numero ||
        !responsavel ||
        !plano_acao
    ) {

        return res.status(400).json({
            erro:
                "Número, responsável e plano de ação são obrigatórios."
        });

    }


    db.run(
        `
        INSERT INTO acoes_corretivas
        (
            numero,
            nao_conformidade_id,
            responsavel,
            data_abertura,
            prazo,
            plano_acao,
            status
        )

        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            numero,
            nao_conformidade_id || null,
            responsavel,
            data_abertura || "",
            prazo || "",
            plano_acao,
            status || "Aberta"
        ],
        function (erro) {

            if (erro) {

                return res.status(500).json({
                    erro: erro.message
                });

            }

            res.status(201).json({

                mensagem:
                    "Ação corretiva cadastrada com sucesso.",

                id:
                    this.lastID

            });

        }
    );
});


router.put("/:id", autenticar, (req, res) => {

    const {
        numero,
        nao_conformidade_id,
        responsavel,
        data_abertura,
        prazo,
        plano_acao,
        status
    } = req.body;


    db.run(
        `
        UPDATE acoes_corretivas

        SET
            numero = ?,
            nao_conformidade_id = ?,
            responsavel = ?,
            data_abertura = ?,
            prazo = ?,
            plano_acao = ?,
            status = ?

        WHERE id = ?
        `,
        [
            numero,
            nao_conformidade_id || null,
            responsavel,
            data_abertura,
            prazo,
            plano_acao,
            status,
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
                    erro:
                        "Ação corretiva não encontrada."
                });

            }

            res.json({
                mensagem:
                    "Ação corretiva atualizada com sucesso."
            });

        }
    );
});


router.delete("/:id", autenticar, (req, res) => {

    db.run(
        `
        DELETE FROM acoes_corretivas
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
                    erro:
                        "Ação corretiva não encontrada."
                });

            }

            res.json({
                mensagem:
                    "Ação corretiva excluída com sucesso."
            });

        }
    );
});


module.exports = router;
