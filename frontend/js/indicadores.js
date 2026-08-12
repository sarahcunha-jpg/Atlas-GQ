let graficos = {};


/*
|--------------------------------------------------------------------------
| CARREGAR INDICADORES
|--------------------------------------------------------------------------
*/

async function carregarIndicadores() {

    try {

        const dados =
            await api(
                "/indicadores"
            );


        document.getElementById(
            "totalInspecoes"
        ).textContent =
            dados.inspecoes.total;


        document.getElementById(
            "taxaConformidade"
        ).textContent =
            dados.inspecoes
                .taxaConformidade +
            "%";


        document.getElementById(
            "ncAbertas"
        ).textContent =
            dados.naoConformidades
                .abertas;


        document.getElementById(
            "acoesAbertas"
        ).textContent =
            dados.acoesCorretivas
                .abertas;


        document.getElementById(
            "eficienciaAcoes"
        ).textContent =
            dados.acoesCorretivas
                .eficiencia +
            "%";


        document.getElementById(
            "totalAuditorias"
        ).textContent =
            dados.auditorias.total;


        document.getElementById(
            "totalDocumentos"
        ).textContent =
            dados.documentos.total;


        carregarGraficos();


    } catch (erro) {

        console.error(
            erro
        );

    }

}


/*
|--------------------------------------------------------------------------
| GRÁFICOS
|--------------------------------------------------------------------------
*/

async function carregarGraficos() {

    try {

        const [

            inspecoes,

            nc,

            acoes,

            auditorias

        ] = await Promise.all([

            api(
                "/indicadores/inspecoes"
            ),

            api(
                "/indicadores/nao-conformidades"
            ),

            api(
                "/indicadores/acoes-corretivas"
            ),

            api(
                "/indicadores/auditorias"
            )

        ]);


        criarGrafico(
            "graficoInspecoes",
            "Inspeções",
            inspecoes
        );


        criarGrafico(
            "graficoNC",
            "Não Conformidades",
            nc
        );


        criarGrafico(
            "graficoAcoes",
            "Ações Corretivas",
            acoes
        );


        criarGrafico(
            "graficoAuditorias",
            "Auditorias",
            auditorias
        );


    } catch (erro) {

        console.error(
            erro
        );

    }

}


/*
|--------------------------------------------------------------------------
| CRIAR GRÁFICO
|--------------------------------------------------------------------------
*/

function criarGrafico(
    elemento,
    titulo,
    dados
) {

    const canvas =
        document.getElementById(
            elemento
        );


    if (
        graficos[elemento]
    ) {

        graficos[elemento].destroy();

    }


    const labels =
        dados.map(
            item =>
                item.resultado ||
                item.status ||
                "Sem informação"
        );


    const valores =
        dados.map(
            item =>
                item.total
        );


    graficos[elemento] =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",

                data: {

                    labels:
                        labels,

                    datasets: [

                        {

                            label:
                                titulo,

                            data:
                                valores

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        }

                    }

                }

            }
        );

}


/*
|--------------------------------------------------------------------------
| ATUALIZAÇÃO AUTOMÁTICA
|--------------------------------------------------------------------------
*/

carregarIndicadores();


setInterval(
    carregarIndicadores,
    30000
);
