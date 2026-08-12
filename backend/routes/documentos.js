const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("../database");
const autenticar = require("../middleware/auth");

const router = express.Router();

const pastaUploads = path.join(
    __dirname,
    "../uploads/documentos"
);

if (!fs.existsSync(pastaUploads)) {
    fs.mkdirSync(pastaUploads, {
        recursive: true
    });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, pastaUploads);
    },

    filename: (req, file, cb) => {

        const extensao =
            path.extname(file.originalname);

        const nome =
            Date.now() +
            "-" +
            Math.round(Math.random() * 100000) +
            extensao;

        cb(null, nome);
    }

});

const upload = multer({
    storage: storage
});


/*
|--------------------------------------------------------------------------
| LISTAR DOCUMENTOS
|--------------------------------------------------------------------------
*/

router.get("/", autenticar, (req, res) => {

    db.all(
        `
        SELECT *
        FROM documentos
        ORDER BY id DESC
        `,
        [],
        (erro, resultados) => {

            if (erro) {

                return res.status(500).json({
                    erro:
                        "Erro ao buscar documentos."
                });

            }

            res.json(resultados);
        }
    );

});


/*
|--------------------------------------------------------------------------
| BUSCAR DOCUMENTO
|--------------------------------------------------------------------------
*/

router.get("/:id", autenticar, (req, res) => {

    db.get(
        `
        SELECT *
        FROM documentos
        WHERE id = ?
        `,
        [req.params.id],
        (erro, documento) => {

            if (erro) {

                return res.status(500).json({
                    erro:
                        "Erro ao buscar documento."
                });

            }

            if (!documento) {

                return res.status(404).json({
                    erro:
                        "Documento não encontrado."
                });

            }

            res.json(documento);
        }
    );

});


/*
|--------------------------------------------------------------------------
| CADASTRAR DOCUMENTO
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    autenticar,
    upload.single("arquivo"),
    (req, res) => {

        const {
            codigo,
            nome,
            tipo,
            revisao,
            data,
            responsavel,
            descricao
        } = req.body;

        if (!codigo) {

            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(400).json({
                erro:
                    "O código do documento é obrigatório."
            });

        }

        if (!nome) {

            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(400).json({
                erro:
                    "O nome do documento é obrigatório."
            });

        }

        db.get(
            `
            SELECT id
            FROM documentos
            WHERE codigo = ?
            `,
            [codigo],
            (erro, existente) => {

                if (erro) {

                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }

                    return res.status(500).json({
                        erro:
                            "Erro ao verificar documento."
                    });

                }

                if (existente) {

                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }

                    return res.status(400).json({
                        erro:
                            "Já existe um documento com este código."
                    });

                }

                const arquivo =
                    req.file
                        ? "/uploads/documentos/" +
                          req.file.filename
                        : null;

                db.run(
                    `
                    INSERT INTO documentos
                    (
                        codigo,
                        nome,
                        tipo,
                        revisao,
                        data,
                        responsavel,
                        arquivo,
                        descricao
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        codigo,
                        nome,
                        tipo || "Procedimento",
                        revisao || "00",
                        data || "",
                        responsavel || "",
                        arquivo,
                        descricao || ""
                    ],
                    function (erro) {

                        if (erro) {

                            if (req.file) {
                                fs.unlinkSync(
                                    req.file.path
                                );
                            }

                            return res.status(500).json({
                                erro:
                                    "Erro ao cadastrar documento."
                            });

                        }

                        res.status(201).json({

                            mensagem:
                                "Documento cadastrado com sucesso.",

                            id:
                                this.lastID

                        });

                    }
                );

            }
        );

    }
);


/*
|--------------------------------------------------------------------------
| ATUALIZAR DOCUMENTO
|--------------------------------------------------------------------------
*/

router.put(
    "/:id",
    autenticar,
    upload.single("arquivo"),
    (req, res) => {

        const {
            codigo,
            nome,
            tipo,
            revisao,
            data,
            responsavel,
            descricao
        } = req.body;

        if (!codigo || !nome) {

            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(400).json({
                erro:
                    "Código e nome são obrigatórios."
            });

        }

        db.get(
            `
            SELECT *
            FROM documentos
            WHERE id = ?
            `,
            [req.params.id],
            (erro, documento) => {

                if (erro) {

                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }

                    return res.status(500).json({
                        erro:
                            "Erro ao buscar documento."
                    });

                }

                if (!documento) {

                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }

                    return res.status(404).json({
                        erro:
                            "Documento não encontrado."
                    });

                }

                let arquivo =
                    documento.arquivo;

                if (req.file) {

                    if (documento.arquivo) {

                        const antigo =
                            path.join(
                                __dirname,
                                "..",
                                documento.arquivo
                            );

                        if (fs.existsSync(antigo)) {
                            fs.unlinkSync(antigo);
                        }

                    }

                    arquivo =
                        "/uploads/documentos/" +
                        req.file.filename;
                }

                db.run(
                    `
                    UPDATE documentos
                    SET
                        codigo = ?,
                        nome = ?,
                        tipo = ?,
                        revisao = ?,
                        data = ?,
                        responsavel = ?,
                        arquivo = ?,
                        descricao = ?
                    WHERE id = ?
                    `,
                    [
                        codigo,
                        nome,
                        tipo || "Procedimento",
                        revisao || "00",
                        data || "",
                        responsavel || "",
                        arquivo,
                        descricao || "",
                        req.params.id
                    ],
                    function (erro) {

                        if (erro) {

                            if (req.file) {
                                fs.unlinkSync(
                                    req.file.path
                                );
                            }

                            return res.status(500).json({
                                erro:
                                    "Erro ao atualizar documento."
                            });

                        }

                        res.json({
                            mensagem:
                                "Documento atualizado com sucesso."
                        });

                    }
                );

            }
        );

    }
);


/*
|--------------------------------------------------------------------------
| EXCLUIR DOCUMENTO
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",
    autenticar,
    (req, res) => {

        db.get(
            `
            SELECT arquivo
            FROM documentos
            WHERE id = ?
            `,
            [req.params.id],
            (erro, documento) => {

                if (erro) {

                    return res.status(500).json({
                        erro:
                            "Erro ao buscar documento."
                    });

                }

                if (!documento) {

                    return res.status(404).json({
                        erro:
                            "Documento não encontrado."
                    });

                }

                db.run(
                    `
                    DELETE FROM documentos
                    WHERE id = ?
                    `,
                    [req.params.id],
                    function (erro) {

                        if (erro) {

                            return res.status(500).json({
                                erro:
                                    "Erro ao excluir documento."
                            });

                        }

                        if (
                            documento.arquivo
                        ) {

                            const arquivo =
                                path.join(
                                    __dirname,
                                    "..",
                                    documento.arquivo
                                );

                            if (
                                fs.existsSync(
                                    arquivo
                                )
                            ) {

                                fs.unlinkSync(
                                    arquivo
                                );

                            }

                        }

                        res.json({
                            mensagem:
                                "Documento excluído com sucesso."
                        });

                    }
                );

            }
        );

    }
);


module.exports = router;
