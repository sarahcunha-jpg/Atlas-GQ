const express = require("express");

const db = require("../database");

const autenticar =
    require("../middleware/auth");

const router =
    express.Router();


/*
|--------------------------------------------------------------------------
| LISTAR AÇÕES CORRETIVAS
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    autenticar,
    (req, res) => {

        db.all(
            `
            SELECT

                ac.id,
                ac.numero,
                ac.nao_conformidade_id,
                ac.responsavel,
                ac.data_abertura,
                ac.prazo,
                ac.plano_acao,
                ac.status,

                nc.codigo AS nc_codigo,
                nc.descricao AS nc_descricao

            FROM acoes_corretivas ac

            LEFT JOIN nao_conformidades nc

                ON ac.nao_conformidade_id =
                   nc.id

            ORDER BY
                ac.id DESC
            `,
            [],
            (erro, resultados) => {

                if (erro) {

                    console.error(
                        erro
                    );

                    return res
                        .status(500)
                        .json({
                            erro:
                                "Erro ao buscar ações corretivas."
                        });

                }

                res.json(
                    resultados
                );

            }
        );

    }
);


/*
|--------------------------------------------------------------------------
| BUSCAR UMA AÇÃO CORRETIVA
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    autenticar,
    (req, res) => {

        db.get(
            `
            SELECT

                ac.*,

                nc.codigo AS nc_codigo,
                nc.descricao AS nc_descricao

            FROM acoes_corretivas ac

            LEFT JOIN nao_conformidades nc

                ON ac.nao_conformidade_id =
                   nc.id

            WHERE ac.id = ?
            `,
            [
                req.params.id
            ],
            (erro, resultado) => {

                if (erro) {

                    return res
                        .status(500)
                        .json({
                            erro:
                                "Erro ao buscar ação corretiva."
                        });

                }

                if (!resultado) {

                    return res
                        .status(404)
                        .json({
                            erro:
                                "Ação corretiva não encontrada."
                        });

                }

                res.json(
                    resultado
                );

            }
        );

    }
);


/*
|--------------------------------------------------------------------------
| CADASTRAR AÇÃO CORRETIVA
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    autenticar,
    (req, res) => {

        const {

            numero,

            nao_conformidade_id,

            responsavel,

            data_abertura,

            prazo,

            plano_acao,

            status

        } = req.body;


        /*
        |--------------------------------------------------------------------------
        | VALIDAÇÃO
        |--------------------------------------------------------------------------
        */

        if (!numero) {

            return res
                .status(400)
                .json({
                    erro:
                        "O número da ação é obrigatório."
                });

        }


        if (!responsavel) {

            return res
                .status(400)
                .json({
                    erro:
                        "O responsável é obrigatório."
                });

        }


        if (!plano_acao) {

            return res
                .status(400)
                .json({
                    erro:
                        "O plano de ação é obrigatório."
                });

        }


        /*
        |--------------------------------------------------------------------------
        | VERIFICAR NÚMERO DUPLICADO
        |--------------------------------------------------------------------------
        */

        db.get(
            `
            SELECT id

            FROM acoes_corretivas

            WHERE numero = ?
            `,
            [
                numero
            ],
            (erro, existente) => {

                if (erro) {

                    return res
                        .status(500)
                        .json({
                            erro:
                                erro.message
                        });

                }


                if (existente) {

                    return res
                        .status(400)
                        .json({
                            erro:
                                "Já existe uma ação corretiva com este número."
                        });

                }


                /*
                |--------------------------------------------------------------------------
                | INSERIR
                |--------------------------------------------------------------------------
                */

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

                    VALUES
                    (?, ?, ?, ?, ?, ?, ?)
                    `,
                    [

                        numero,

                        nao_conformidade_id
                            || null,

                        responsavel,

                        data_abertura
                            || "",

                        prazo
                            || "",

                        plano_acao,

                        status
                            || "Aberta"

                    ],
                    function (erro) {

                        if (erro) {

                            console.error(
                                erro
                            );

                            return res
                                .status(500)
                                .json({
                                    erro:
                                        "Erro ao cadastrar ação corretiva."
                                });

                        }


                        res
                            .status(201)
                            .json({

                                mensagem:
                                    "Ação corretiva cadastrada com sucesso.",

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
| ATUALIZAR AÇÃO CORRETIVA
|--------------------------------------------------------------------------
*/

router.put(
    "/:id",
    autenticar,
    (req, res) => {

        const {

            numero,

            nao_conformidade_id,

            responsavel,

            data_abertura,

            prazo,

            plano_acao,

            status

        } = req.body;


        if (!numero) {

            return res
                .status(400)
                .json({
                    erro:
                        "O número da ação é obrigatório."
                });

        }


        if (!responsavel) {

            return res
                .status(400)
                .json({
                    erro:
                        "O responsável é obrigatório."
                });

        }


        if (!plano_acao) {

            return res
                .status(400)
                .json({
                    erro:
                        "O plano de ação é obrigatório."
                });

        }


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

                nao_conformidade_id
                    || null,

                responsavel,

                data_abertura
                    || "",

                prazo
                    || "",

                plano_acao,

                status
                    || "Aberta",

                req.params.id

            ],
            function (erro) {

                if (erro) {

                    return res
                        .status(500)
                        .json({
                            erro:
                                "Erro ao atualizar ação corretiva."
                        });

                }


                if (
                    this.changes === 0
                ) {

                    return res
                        .status(404)
                        .json({
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

    }
);


/*
|--------------------------------------------------------------------------
| EXCLUIR AÇÃO CORRETIVA
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",
    autenticar,
    (req, res) => {

        db.run(
            `
            DELETE FROM acoes_corretivas

            WHERE id = ?
            `,
            [
                req.params.id
            ],
            function (erro) {

                if (erro) {

                    return res
                        .status(500)
                        .json({
                            erro:
                                "Erro ao excluir ação corretiva."
                        });

                }


                if (
                    this.changes === 0
                ) {

                    return res
                        .status(404)
                        .json({
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

    }
);


module.exports =
    router;
