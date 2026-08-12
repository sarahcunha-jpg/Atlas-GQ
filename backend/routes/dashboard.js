const express = require("express");

const db = require("../database");

const autenticar =
    require("../middleware/auth");

const router = express.Router();


router.get(
    "/",
    autenticar,
    (req, res) => {

        const consultas = {};

        db.get(
            `
            SELECT COUNT(*) AS total
            FROM inspecoes
            `,
            [],
            (erro, resultado) => {

                consultas.inspecoes =
                    resultado?.total || 0;

                continuar();

            }
        );


        function continuar() {

            db.get(
                `
                SELECT COUNT(*) AS total
                FROM inspecoes
                WHERE resultado = 'Não Conforme'
                `,
                [],
                (erro, resultado) => {

                    consultas.naoConformidades =
                        resultado?.total || 0;


                    db.get(
                        `
                        SELECT COUNT(*) AS total
                        FROM acoes_corretivas
                        WHERE status != 'Concluída'
                        `,
                        [],
                        (erro, resultado) => {

                            consultas.acoesAbertas =
                                resultado?.total || 0;


                            db.get(
                                `
                                SELECT COUNT(*) AS total
                                FROM acoes_corretivas
                                WHERE status = 'Concluída'
                                `,
                                [],
                                (erro, resultado) => {

                                    consultas.acoesConcluidas =
                                        resultado?.total || 0;


                                    db.get(
                                        `
                                        SELECT COUNT(*) AS total
                                        FROM auditorias
                                        `,
                                        [],
                                        (erro, resultado) => {

                                            consultas.auditorias =
                                                resultado?.total || 0;


                                            db.get(
                                                `
                                                SELECT COUNT(*) AS total
                                                FROM documentos
                                                WHERE status = 'Ativo'
                                                `,
                                                [],
                                                (erro, resultado) => {

                                                    consultas.documentos =
                                                        resultado?.total || 0;


                                                    db.get(
                                                        `
                                                        SELECT COUNT(*) AS total
                                                        FROM inspecoes
                                                        WHERE resultado = 'Conforme'
                                                        `,
                                                        [],
                                                        (erro, resultado) => {

                                                            const conformes =
                                                                resultado?.total || 0;


                                                            const total =
                                                                consultas.inspecoes;


                                                            const taxa =
                                                                total > 0
                                                                    ? (
                                                                        conformes /
                                                                        total
                                                                    ) * 100
                                                                    : 0;


                                                            res.json({

                                                                inspecoes:
                                                                    consultas.inspecoes,

                                                                naoConformidades:
                                                                    consultas.naoConformidades,

                                                                acoesAbertas:
                                                                    consultas.acoesAbertas,

                                                                acoesConcluidas:
                                                                    consultas.acoesConcluidas,

                                                                auditorias:
                                                                    consultas.auditorias,

                                                                documentos:
                                                                    consultas.documentos,

                                                                taxaConformidade:
                                                                    Number(
                                                                        taxa.toFixed(2)
                                                                    )

                                                            });

                                                        }
                                                    );

                                                }
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }

    }
);


module.exports = router;
