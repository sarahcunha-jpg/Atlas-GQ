let listaAuditorias = [];


const formularioAuditoria =
    document.getElementById(
        "auditoriaForm"
    );


/*
|--------------------------------------------------------------------------
| CADASTRAR
|--------------------------------------------------------------------------
*/

formularioAuditoria.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const dados =
            Object.fromEntries(
                new FormData(
                    formularioAuditoria
                )
            );


        const mensagem =
            document.getElementById(
                "mensagemAuditoria"
            );


        try {

            const resposta =
                await api(
                    "/auditorias",
                    {
                        method: "POST",

                        body:
                            JSON.stringify(
                                dados
                            )
                    }
                );


            mensagem.textContent =
                resposta.mensagem;


            mensagem.className =
                "mensagem sucesso";


            formularioAuditoria.reset();


            definirDataAuditoria();


            carregarAuditorias();


        } catch (erro) {

            mensagem.textContent =
                erro.message;


            mensagem.className =
                "mensagem erro";

        }

    }
);


/*
|--------------------------------------------------------------------------
| CARREGAR
|--------------------------------------------------------------------------
*/

async function carregarAuditorias() {

    try {

        listaAuditorias =
            await api(
                "/auditorias"
            );


        filtrarAuditorias();


    } catch (erro) {

        console.error(
            erro
        );

    }

}


/*
|--------------------------------------------------------------------------
| FILTROS
|--------------------------------------------------------------------------
*/

function filtrarAuditorias() {

    const pesquisa =
        document
            .getElementById(
                "pesquisaAuditoria"
            )
            .value
            .toLowerCase();


    const resultado =
        document
            .getElementById(
                "filtroResultado"
            )
            .value;


    const filtradas =
        listaAuditorias.filter(
            item => {

                const texto = `

                    ${item.codigo}

                    ${item.auditor}

                    ${item.setor}

                    ${item.tipo}

                    ${item.resultado}

                `.toLowerCase();


                return (

                    texto.includes(
                        pesquisa
                    )

                    &&

                    (
                        !resultado ||
                        item.resultado === resultado
                    )

                );

            }
        );


    mostrarAuditorias(
        filtradas
    );

}


/*
|--------------------------------------------------------------------------
| MOSTRAR
|--------------------------------------------------------------------------
*/

function mostrarAuditorias(
    lista
) {

    const tabela =
        document.getElementById(
            "listaAuditorias"
        );


    tabela.innerHTML =
        "";


    if (
        lista.length === 0
    ) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="tabela-vazia"
                >
                    Nenhuma auditoria encontrada.
                </td>

            </tr>

        `;

        return;

    }


    lista.forEach(
        item => {

            const linha =
                document.createElement(
                    "tr"
                );


            let classe =
                "status-alerta";


            if (
                item.resultado ===
                "Conforme"
            ) {

                classe =
                    "status-conforme";

            }


            if (
                item.resultado ===
                "Não Conforme"
            ) {

                classe =
                    "status-nao-conforme";

            }


            linha.innerHTML = `

                <td>

                    <strong>
                        ${item.codigo}
                    </strong>

                </td>


                <td>
                    ${item.auditor || "-"}
                </td>


                <td>
                    ${item.setor || "-"}
                </td>


                <td>
                    ${item.data || "-"}
                </td>


                <td>
                    ${item.tipo || "-"}
                </td>


                <td>

                    <span
                        class="status ${classe}"
                    >
                        ${item.resultado || "-"}
                    </span>

                </td>


                <td>

                    <button
                        class="btn-tabela btn-excluir"
                        onclick="excluirAuditoria(${item.id})"
                    >
                        Excluir
                    </button>

                </td>

            `;


            tabela.appendChild(
                linha
            );

        }
    );

}


/*
|--------------------------------------------------------------------------
| EXCLUIR
|--------------------------------------------------------------------------
*/

async function excluirAuditoria(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir esta auditoria?"
        )
    ) {

        return;

    }


    try {

        await api(
            `/auditorias/${id}`,
            {
                method: "DELETE"
            }
        );


        carregarAuditorias();


    } catch (erro) {

        alert(
            erro.message
        );

    }

}


/*
|--------------------------------------------------------------------------
| DATA AUTOMÁTICA
|--------------------------------------------------------------------------
*/

function definirDataAuditoria() {

    const campo =
        document.getElementById(
            "dataAuditoria"
        );


    if (
        !campo.value
    ) {

        campo.value =
            new Date()
                .toISOString()
                .split("T")[0];

    }

}


/*
|--------------------------------------------------------------------------
| EVENTOS
|--------------------------------------------------------------------------
*/

document
    .getElementById(
        "pesquisaAuditoria"
    )
    .addEventListener(
        "input",
        filtrarAuditorias
    );


document
    .getElementById(
        "filtroResultado"
    )
    .addEventListener(
        "change",
        filtrarAuditorias
    );


/*
|--------------------------------------------------------------------------
| INICIALIZAÇÃO
|--------------------------------------------------------------------------
*/

definirDataAuditoria();

carregarAuditorias();
