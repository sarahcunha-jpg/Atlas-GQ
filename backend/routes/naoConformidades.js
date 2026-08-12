const express = require("express");
const db = require("../database");
const autenticar = require("../middleware/auth");

const router = express.Router();

router.get("/", autenticar, (req, res) => {
    db.all(
        `
        SELECT 
            nc.*,
            i.codigo AS inspeção_codigo
        FROM nao_conformidades nc
        LEFT JOIN inspecoes i
            ON nc.inspecao_id = i.id
        ORDER BY nc.id DESC
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
        FROM nao_conformidades
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
                    erro: "Não conformidade não encontrada."
                });
            }

            res.json(resultado);
        }
    );
});


router.post("/", autenticar, (req, res) => {

    const {
        codigo,
        inspecao_id,
        produto,
        processo,
        descricao,
        categoria,
        gravidade,
        responsavel,
        status,
        data,
        evidencias
    } = req.body;

    if (!codigo || !descricao) {
        return res.status(400).json({
            erro: "Código e descrição são obrigatórios."
        });
    }

    db.run(
        `
        INSERT INTO nao_conformidades
        (
            codigo,
            inspecao_id,
            produto,
            processo,
            descricao,
            categoria,
            gravidade,
            responsavel,
            status,
            data,
            evidencias
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            codigo,
            inspecao_id || null,
            produto || "",
            processo || "",
            descricao,
            categoria || "",
            gravidade || "Média",
            responsavel || "",
            status || "Aberta",
            data || "",
            evidencias || ""
        ],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro: erro.message
                });
            }

            res.status(201).json({
                mensagem:
                    "Não conformidade cadastrada com sucesso.",
                id: this.lastID
            });
        }
    );
});


router.put("/:id", autenticar, (req, res) => {

    const {
        codigo,
        inspecao_id,
        produto,
        processo,
        descricao,
        categoria,
        gravidade,
        responsavel,
        status,
        data,
        evidencias
    } = req.body;

    db.run(
        `
        UPDATE nao_conformidades
        SET
            codigo = ?,
            inspecao_id = ?,
            produto = ?,
            processo = ?,
            descricao = ?,
            categoria = ?,
            gravidade = ?,
            responsavel = ?,
            status = ?,
            data = ?,
            evidencias = ?
        WHERE id = ?
        `,
        [
            codigo,
            inspecao_id || null,
            produto,
            processo,
            descricao,
            categoria,
            gravidade,
            responsavel,
            status,
            data,
            evidencias,
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
                    erro: "Não conformidade não encontrada."
                });
            }

            res.json({
                mensagem:
                    "Não conformidade atualizada com sucesso."
            });
        }
    );
});


router.delete("/:id", autenticar, (req, res) => {

    db.run(
        `
        DELETE FROM nao_conformidades
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
                    erro: "Não conformidade não encontrada."
                });
            }

            res.json({
                mensagem:
                    "Não conformidade excluída com sucesso."
            });
        }
    );
});


module.exports = router;
