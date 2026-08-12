let listaInspecoes =
    [];



const formulario =
    document.getElementById(
        "inspecaoForm"
    );


const resultado =
    document.getElementById(
        "resultado"
    );


const gravidadeArea =
    document.getElementById(
        "gravidadeArea"
    );


const prazoArea =
    document.getElementById(
        "prazoArea"
    );



function controlarResultado() {

    if (
        resultado.value ===
        "Não Conforme"
    ) {

        gravidadeArea.style.display =
            "block";

        prazoArea.style.display =
            "block";

    } else {

        gravidadeArea.style.display =
            "none";

        prazoArea.style.display =
            "none";

    }

}



resultado.addEventListener(
    "change",
    controlarResultado
);



formulario.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const dados =
            Object.fromEntries(
                new FormData(
                    formulario
                )
            );


        const mensagem =
            document.getElementById(
                "mensagemInspecao"
            );


        try {

            const resposta =
                await api(
                    "/inspecoes",
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


            formulario.reset();


            controlarResultado();


            definirDataAtual();


            carregarInspecoes();


        } catch (erro) {

            mensagem.textContent =
                erro.message;


            mensagem.className =
                "mensagem erro";

        }

    }
);



async function carregarInspecoes() {

    try {

        listaInspecoes =
            await api(
                "/inspecoes"
            );


        aplicarFiltros();


    } catch (erro) {

        console.error(
            erro
        );

    }

}



function aplicarFiltros() {

    const pesquisa =
        document.getElementById(
            "pesquisa"
        )
        .value
        .toLowerCase();


    const filtro =
        document.getElementById(
            "filtroResultado"
        )
        .value;


    const resultadoFiltrado =
        listaInspecoes.filter(
            item => {

                const texto =
                    `

                    ${item.codigo}
                    ${item.produto}
                    ${item.responsavel}
                    ${item.lote}

                    `
                    .toLowerCase();


                const correspondePesquisa =
                    texto.includes(
                        pesquisa
                    );


                const correspondeResultado =
                    !filtro ||
                    item.resultado ===
                    filtro;


                return (
                    correspondePesquisa &&
                    correspondeResultado
                );

            }
        );


    mostrarInspecoes(
        resultadoFiltrado
    );

}



function mostrarInspecoes(
    lista
) {

    const tabela =
        document.getElementById(
            "listaInspecoes"
        );


    tabela.innerHTML =
        "";


    if (
        lista.length === 0
    ) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="tabela-vazia"
                >
                    Nenhuma inspeção encontrada.
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


            const classe =
                item.resultado ===
                "Conforme"
                    ? "status-conforme"
                    : "status-nao-conforme";


            linha.innerHTML = `

                <td>
                    <strong>
                        ${item.codigo}
                    </strong>
                </td>

                <td>
                    ${item.produto}
                </td>

                <td>
                    ${item.lote || "-"}
                </td>

                <td>
                    ${item.responsavel}
                </td>

                <td>
                    ${item.data}
                </td>

                <td>
                    ${item.tipo || "-"}
                </td>

                <td>

                    <span
                        class="status ${classe}"
                    >
                        ${item.resultado}
                    </span>

                </td>

                <td>

                    <button
                        class="btn-tabela btn-excluir"
                        onclick="excluirInspecao(${item.id})"
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



async function excluirInspecao(
    id
) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta inspeção?"
        );


    if (!confirmar) {
        return;
    }


    try {

        await api(
            `/inspecoes/${id}`,
            {
                method: "DELETE"
            }
        );


        carregarInspecoes();


    } catch (erro) {

        alert(
            erro.message
        );

    }

}



function definirDataAtual() {

    const campo =
        formulario.querySelector(
            'input[name="data"]'
        );


    if (!campo.value) {

        campo.value =
            new Date()
                .toISOString()
                .split("T")[0];

    }

}



document
    .getElementById("pesquisa")
    .addEventListener(
        "input",
        aplicarFiltros
    );


document
    .getElementById("filtroResultado")
    .addEventListener(
        "change",
        aplicarFiltros
    );



definirDataAtual();

controlarResultado();

carregarInspecoes();
