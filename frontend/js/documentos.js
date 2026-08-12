let listaDocumentos = [];


const formulario =
    document.getElementById(
        "documentoForm"
    );


/*
|--------------------------------------------------------------------------
| CADASTRAR DOCUMENTO
|--------------------------------------------------------------------------
*/

formulario.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const dados =
            new FormData(
                formulario
            );


        const mensagem =
            document.getElementById(
                "mensagemDocumento"
            );


        try {

            const resposta =
                await api(
                    "/documentos",
                    {
                        method: "POST",
                        body: dados
                    }
                );


            mensagem.textContent =
                resposta.mensagem;


            mensagem.className =
                "mensagem sucesso";


            formulario.reset();


            definirData();


            carregarDocumentos();


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
| CARREGAR DOCUMENTOS
|--------------------------------------------------------------------------
*/

async function carregarDocumentos() {

    try {

        listaDocumentos =
            await api(
                "/documentos"
            );


        filtrarDocumentos();

    } catch (erro) {

        console.error(
            erro
        );

    }

}


/*
|--------------------------------------------------------------------------
| FILTRAR
|--------------------------------------------------------------------------
*/

function filtrarDocumentos() {

    const pesquisa =
        document
            .getElementById(
                "pesquisaDocumento"
            )
            .value
            .toLowerCase();


    const tipo =
        document
            .getElementById(
                "filtroTipo"
            )
            .value;


    const filtrados =
        listaDocumentos.filter(
            documento => {

                const texto = `

                    ${documento.codigo}

                    ${documento.nome}

                    ${documento.tipo}

                    ${documento.revisao}

                    ${documento.responsavel}

                `.toLowerCase();


                return (

                    texto.includes(
                        pesquisa
                    )

                    &&

                    (
                        !tipo ||
                        documento.tipo === tipo
                    )

                );

            }
        );


    mostrarDocumentos(
        filtrados
    );

}


/*
|--------------------------------------------------------------------------
| MOSTRAR DOCUMENTOS
|--------------------------------------------------------------------------
*/

function mostrarDocumentos(
    documentos
) {

    const tabela =
        document.getElementById(
            "listaDocumentos"
        );


    tabela.innerHTML =
        "";


    if (
        documentos.length === 0
    ) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="tabela-vazia"
                >
                    Nenhum documento encontrado.
                </td>

            </tr>

        `;

        return;

    }


    documentos.forEach(
        documento => {

            const linha =
                document.createElement(
                    "tr"
                );


            let arquivo =
                "-";


            if (
                documento.arquivo
            ) {

                arquivo = `

                    <a
                        href="${documento.arquivo}"
                        target="_blank"
                        class="link-arquivo"
                    >
                        Abrir
                    </a>

                `;

            }


            linha.innerHTML = `

                <td>

                    <strong>
                        ${documento.codigo}
                    </strong>

                </td>


                <td>
                    ${documento.nome}
                </td>


                <td>
                    ${documento.tipo || "-"}
                </td>


                <td>

                    <span class="badge">

                        Rev.
                        ${documento.revisao || "00"}

                    </span>

                </td>


                <td>
                    ${documento.data || "-"}
                </td>


                <td>
                    ${documento.responsavel || "-"}
                </td>


                <td>
                    ${arquivo}
                </td>


                <td>

                    <button
                        class="btn-tabela btn-excluir"
                        onclick="excluirDocumento(${documento.id})"
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

async function excluirDocumento(
    id
) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este documento?"
        );


    if (!confirmar) {
        return;
    }


    try {

        await api(
            `/documentos/${id}`,
            {
                method: "DELETE"
            }
        );


        carregarDocumentos();


    } catch (erro) {

        alert(
            erro.message
        );

    }

}


/*
|--------------------------------------------------------------------------
| DATA
|--------------------------------------------------------------------------
*/

function definirData() {

    const campo =
        document.getElementById(
            "dataDocumento"
        );


    if (!campo.value) {

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
        "pesquisaDocumento"
    )
    .addEventListener(
        "input",
        filtrarDocumentos
    );


document
    .getElementById(
        "filtroTipo"
    )
    .addEventListener(
        "change",
        filtrarDocumentos
    );


/*
|--------------------------------------------------------------------------
| INICIALIZAÇÃO
|--------------------------------------------------------------------------
*/

definirData();

carregarDocumentos();
