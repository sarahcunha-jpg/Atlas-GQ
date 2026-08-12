const express = require("express");
const db = require("../database");
const autenticar = require("../middleware/auth");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| LISTAR AUDITORIAS
|--------------------------------------------------------------------------
*/

router.get("/", autenticar, (req, res) => {

    db.all(
        `
        SELECT *
        FROM auditorias
        ORDER BY id DESC
        `,
        [],
        (erro, resultados) => {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao buscar auditorias."
                });
            }

            res.json(resultados);
        }
    );
});


/*
|--------------------------------------------------------------------------
| BUSCAR AUDITORIA
|--------------------------------------------------------------------------
*/

router.get("/:id", autenticar, (req, res) => {

    db.get(
        `
        SELECT *
        FROM auditorias
        WHERE id = ?
        `,
        [req.params.id],
        (erro, resultado) => {

            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao buscar auditoria."
                });
            }

            if (!resultado) {
                return res.status(404).json({
                    erro: "Auditoria não encontrada."
                });
            }

            res.json(resultado);
        }
    );
});


/*
|--------------------------------------------------------------------------
| CADASTRAR AUDITORIA
|--------------------------------------------------------------------------
*/

router.post("/", autenticar, (req, res) => {

    const {
        codigo,
        auditor,
        setor,
        data,
        tipo,
        checklist,
        resultado,
        observacoes
    } = req.body;

    if (!codigo) {
        return res.status(400).json({
            erro: "O código da auditoria é obrigatório."
        });
    }

    if (!auditor) {
        return res.status(400).json({
            erro: "O auditor é obrigatório."
        });
    }

    db.get(
        `
        SELECT id
        FROM auditorias
        WHERE codigo = ?
        `,
        [codigo],
        (erro, existente) => {

            if (erro) {
                return res.status(500).json({
                    erro: erro.message
                });
            }

            if (existente) {
                return res.status(400).json({
                    erro:
                        "Já existe uma auditoria com este código."
                });
            }

            db.run(
                `
                INSERT INTO auditorias
                (
                    codigo,
                    auditor,
                    setor,
                    data,
                    tipo,
                    checklist,
                    resultado,
                    observacoes
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    codigo,
                    auditor,
                    setor || "",
                    data || "",
                    tipo || "Interna",
                    checklist || "",
                    resultado || "Conforme",
                    observacoes || ""
                ],
                function (erro) {

                    if (erro) {
                        return res.status(500).json({
                            erro:
                                "Erro ao cadastrar auditoria."
                        });
                    }

                    res.status(201).json({
                        mensagem:
                            "Auditoria cadastrada com sucesso.",
                        id: this.lastID
                    });
                }
            );
        }
    );
});


/*
|--------------------------------------------------------------------------
| ATUALIZAR AUDITORIA
|--------------------------------------------------------------------------
*/

router.put("/:id", autenticar, (req, res) => {

    const {
        codigo,
        auditor,
        setor,
        data,
        tipo,
        checklist,
        resultado,
        observacoes
    } = req.body;

    if (!codigo || !auditor) {
        return res.status(400).json({
            erro:
                "Código e auditor são obrigatórios."
        });
    }

    db.run(
        `
        UPDATE auditorias
        SET
            codigo = ?,
            auditor = ?,
            setor = ?,
            data = ?,
            tipo = ?,
            checklist = ?,
            resultado = ?,
            observacoes = ?
        WHERE id = ?
        `,
        [
            codigo,
            auditor,
            setor || "",
            data || "",
            tipo || "Interna",
            checklist || "",
            resultado || "Conforme",
            observacoes || "",
            req.params.id
        ],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro:
                        "Erro ao atualizar auditoria."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    erro:
                        "Auditoria não encontrada."
                });
            }

            res.json({
                mensagem:
                    "Auditoria atualizada com sucesso."
            });
        }
    );
});


/*
|--------------------------------------------------------------------------
| EXCLUIR AUDITORIA
|--------------------------------------------------------------------------
*/

router.delete("/:id", autenticar, (req, res) => {

    db.run(
        `
        DELETE FROM auditorias
        WHERE id = ?
        `,
        [req.params.id],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro:
                        "Erro ao excluir auditoria."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    erro:
                        "Auditoria não encontrada."
                });
            }

            res.json({
                mensagem:
                    "Auditoria excluída com sucesso."
            });
        }
    );
});


module.exports = router;
