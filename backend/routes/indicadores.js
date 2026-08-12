const express = require("express");
const db = require("../database");
const autenticar = require("../middleware/auth");

const router = express.Router();

router.get("/", autenticar, async (req, res) => {

    try {

        const consultas = {

            inspecoes: `
                SELECT COUNT(*) AS total
                FROM inspecoes
            `,

            conformes: `
                SELECT COUNT(*) AS total
                FROM inspecoes
                WHERE resultado = 'Conforme'
            `,

            naoConformes: `
                SELECT COUNT(*) AS total
                FROM inspecoes
                WHERE resultado = 'Não Conforme'
            `,

            ncAbertas: `
                SELECT COUNT(*) AS total
                FROM nao_conformidades
                WHERE status IN ('Aberta', 'Em análise', 'Em andamento')
            `,

            ncTotal: `
                SELECT COUNT(*) AS total
                FROM nao_conformidades
            `,

            acoesAbertas: `
                SELECT COUNT(*) AS total
                FROM acoes_corretivas
                WHERE status IN ('Aberta', 'Em andamento')
            `,

            acoesConcluidas: `
                SELECT COUNT(*) AS total
                FROM acoes_corretivas
                WHERE status = 'Concluída'
            `,

            auditorias: `
                SELECT COUNT(*) AS total
                FROM auditorias
            `,

            auditoriasNaoConformes: `
                SELECT COUNT(*) AS total
                FROM auditorias
                WHERE resultado = 'Não Conforme'
            `,

            documentos: `
                SELECT COUNT(*) AS total
                FROM documentos
            `

        };


        const executar = sql => {

            return new Promise(
                (resolve, reject) => {

                    db.get(
                        sql,
                        [],
                        (erro, resultado) => {

                            if (erro) {
                                reject(erro);
                            } else {
                                resolve(
                                    resultado.total || 0
                                );
                            }

                        }
                    );

                }
            );

        };


        const [

            totalInspecoes,

            conformes,

            naoConformes,

            ncAbertas,

            ncTotal,

            acoesAbertas,

            acoesConcluidas,

            totalAuditorias,

            auditoriasNaoConformes,

            totalDocumentos

        ] = await Promise.all([

            executar(consultas.inspecoes),

            executar(consultas.conformes),

            executar(consultas.naoConformes),

            executar(consultas.ncAbertas),

            executar(consultas.ncTotal),

            executar(consultas.acoesAbertas),

            executar(consultas.acoesConcluidas),

            executar(consultas.auditorias),

            executar(consultas.auditoriasNaoConformes),

            executar(consultas.documentos)

        ]);


        const taxaConformidade =
            totalInspecoes > 0
                ? (
                    conformes /
                    totalInspecoes
                ) * 100
                : 0;


        const eficienciaAcoes =
            (
                acoesConcluidas +
                acoesAbertas
            ) > 0
                ? (
                    acoesConcluidas /
                    (
                        acoesConcluidas +
                        acoesAbertas
                    )
                ) * 100
                : 0;


        res.json({

            inspecoes: {

                total:
                    totalInspecoes,

                conformes:
                    conformes,

                naoConformes:
                    naoConformes,

                taxaConformidade:
                    Number(
                        taxaConformidade.toFixed(2)
                    )

            },

            naoConformidades: {

                total:
                    ncTotal,

                abertas:
                    ncAbertas

            },

            acoesCorretivas: {

                abertas:
                    acoesAbertas,

                concluidas:
                    acoesConcluidas,

                eficiencia:
                    Number(
                        eficienciaAcoes.toFixed(2)
                    )

            },

            auditorias: {

                total:
                    totalAuditorias,

                naoConformes:
                    auditoriasNaoConformes

            },

            documentos: {

                total:
                    totalDocumentos

            }

        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({

            erro:
                "Erro ao calcular indicadores."

        });

    }

});


/*
|--------------------------------------------------------------------------
| INSPEÇÕES POR RESULTADO
|--------------------------------------------------------------------------
*/

router.get(
    "/inspecoes",
    autenticar,
    (req, res) => {

        db.all(
            `
            SELECT
                resultado,
                COUNT(*) AS total
            FROM inspecoes
            GROUP BY resultado
            ORDER BY total DESC
            `,
            [],
            (erro, resultados) => {

                if (erro) {

                    return res.status(500).json({
                        erro:
                            "Erro ao buscar dados das inspeções."
                    });

                }

                res.json(resultados);

            }
        );

    }
);


/*
|--------------------------------------------------------------------------
| NÃO CONFORMIDADES POR STATUS
|--------------------------------------------------------------------------
*/

router.get(
    "/nao-conformidades",
    autenticar,
    (req, res) => {

        db.all(
            `
            SELECT
                status,
                COUNT(*) AS total
            FROM nao_conformidades
            GROUP BY status
            ORDER BY total DESC
            `,
            [],
            (erro, resultados) => {

                if (erro) {

                    return res.status(500).json({
                        erro:
                            "Erro ao buscar não conformidades."
                    });

                }

                res.json(resultados);

            }
        );

    }
);


/*
|--------------------------------------------------------------------------
| AÇÕES CORRETIVAS POR STATUS
|--------------------------------------------------------------------------
*/

router.get(
    "/acoes-corretivas",
    autenticar,
    (req, res) => {

        db.all(
            `
            SELECT
                status,
                COUNT(*) AS total
            FROM acoes_corretivas
            GROUP BY status
            ORDER BY total DESC
            `,
            [],
            (erro, resultados) => {

                if (erro) {

                    return res.status(500).json({
                        erro:
                            "Erro ao buscar ações corretivas."
                    });

                }

                res.json(resultados);

            }
        );

    }
);


/*
|--------------------------------------------------------------------------
| AUDITORIAS POR RESULTADO
|--------------------------------------------------------------------------
*/

router.get(
    "/auditorias",
    autenticar,
    (req, res) => {

        db.all(
            `
            SELECT
                resultado,
                COUNT(*) AS total
            FROM auditorias
            GROUP BY resultado
            ORDER BY total DESC
            `,
            [],
            (erro, resultados) => {

                if (erro) {

                    return res.status(500).json({
                        erro:
                            "Erro ao buscar auditorias."
                    });

                }

                res.json(resultados);

            }
        );

    }
);


module.exports = router;
