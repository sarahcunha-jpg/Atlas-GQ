let listaAcoes = [];

const formularioAcao =
    document.getElementById(
        "acaoForm"
    );


async function carregarNCs() {

    try {

        const lista =
            await api(
                "/nao-conformidades"
            );

        const select =
            document.getElementById(
                "selectNC"
            );

        select.innerHTML = `
            <option value="">
                Selecione uma não conformidade
            </option>
        `;

        lista.forEach(item => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                item.id;

            option.textContent =
                `${item.codigo} - ${item.descricao.substring(0, 60)}`;

            select.appendChild(
                option
            );

        });

    } catch (erro) {

        console.error(erro);

    }
}



formularioAcao.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const dados =
            Object.fromEntries(
                new FormData(
                    formularioAcao
                )
            );


        const mensagem =
            document.getElementById(
                "mensagemAcao"
            );


        try {

            const resposta =
                await api(
                    "/acoes-corretivas",
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


            formularioAcao.reset();


            definirDataAbertura();


            carregarAcoes();


        } catch (erro) {

            mensagem.textContent =
                erro.message;


            mensagem.className =
                "mensagem erro";

        }

    }
);



async function carregarAcoes() {

    try {

        listaAcoes =
            await api(
                "/acoes-corretivas"
            );


        filtrarAcoes();


    } catch (erro) {

        console.error(
            erro
        );

    }

}



function filtrarAcoes() {

    const pesquisa =
        document
            .getElementById(
                "pesquisaAcao"
            )
            .value
            .toLowerCase();


    const filtro =
        document
            .getElementById(
                "filtroAcao"
            )
            .value;


    const filtradas =
        listaAcoes.filter(
            item => {

                const texto = `

                    ${item.numero}

                    ${item.nc_codigo || ""}

                    ${item.responsavel}

                    ${item.plano_acao}

                `.toLowerCase();


                return (

                    texto.includes(
                        pesquisa
                    )

                    &&

                    (
                        !filtro ||
                        item.status === filtro
                    )

                );

            }
        );


    mostrarAcoes(
        filtradas
    );

}



function mostrarAcoes(
    lista
) {

    const tabela =
        document.getElementById(
            "listaAcoes"
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
                    Nenhuma ação corretiva encontrada.
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
                item.status ===
                "Concluída"
            ) {

                classe =
                    "status-conforme";

            }


            if (
                item.status ===
                "Atrasada"
            ) {

                classe =
                    "status-nao-conforme";

            }


            linha.innerHTML = `

                <td>

                    <strong>
                        ${item.numero}
                    </strong>

                </td>


                <td>

                    ${item.nc_codigo || "-"}

                </td>


                <td>

                    ${item.responsavel}

                </td>


                <td>

                    ${item.data_abertura || "-"}

                </td>


                <td>

                    ${item.prazo || "-"}

                </td>


                <td>

                    <span
                        class="status ${classe}"
                    >
                        ${item.status}
                    </span>

                </td>


                <td>

                    <button
                        class="btn-tabela btn-excluir"
                        onclick="excluirAcao(${item.id})"
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



async function excluirAcao(
    id
) {

    if (
        !confirm(
            "Deseja realmente excluir esta ação corretiva?"
        )
    ) {

        return;

    }


    try {

        await api(
            `/acoes-corretivas/${id}`,
            {
                method: "DELETE"
            }
        );


        carregarAcoes();


    } catch (erro) {

        alert(
            erro.message
        );

    }

}



function definirDataAbertura() {

    const campo =
        document.getElementById(
            "dataAbertura"
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



document
    .getElementById(
        "pesquisaAcao"
    )
    .addEventListener(
        "input",
        filtrarAcoes
    );


document
    .getElementById(
        "filtroAcao"
    )
    .addEventListener(
        "change",
        filtrarAcoes
    );


definirDataAbertura();

carregarNCs();

carregarAcoes();
