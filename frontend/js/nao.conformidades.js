let listaNC = [];

const formularioNC =
    document.getElementById("ncForm");


async function carregarInspecoesNC() {

    try {

        const inspecoes =
            await api("/inspecoes");

        const select =
            document.getElementById("inspecao");

        select.innerHTML = `
            <option value="">
                Selecione uma inspeção
            </option>
        `;

        inspecoes.forEach(item => {

            const option =
                document.createElement("option");

            option.value =
                item.id;

            option.textContent =
                `${item.codigo} - ${item.produto}`;

            select.appendChild(option);

        });

    } catch (erro) {

        console.error(erro);

    }
}


formularioNC.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const dados =
            Object.fromEntries(
                new FormData(formularioNC)
            );

        const mensagem =
            document.getElementById(
                "mensagemNC"
            );

        try {

            const resposta =
                await api(
                    "/nao-conformidades",
                    {
                        method: "POST",

                        body:
                            JSON.stringify(dados)
                    }
                );

            mensagem.textContent =
                resposta.mensagem;

            mensagem.className =
                "mensagem sucesso";

            formularioNC.reset();

            definirDataNC();

            carregarNC();

        } catch (erro) {

            mensagem.textContent =
                erro.message;

            mensagem.className =
                "mensagem erro";
        }
    }
);


async function carregarNC() {

    try {

        listaNC =
            await api(
                "/nao-conformidades"
            );

        filtrarNC();

    } catch (erro) {

        console.error(erro);

    }
}


function filtrarNC() {

    const pesquisa =
        document
            .getElementById("pesquisaNC")
            .value
            .toLowerCase();

    const filtro =
        document
            .getElementById("filtroNC")
            .value;

    const filtradas =
        listaNC.filter(item => {

            const texto = `
                ${item.codigo}
                ${item.produto}
                ${item.processo}
                ${item.responsavel}
            `.toLowerCase();

            return (
                texto.includes(pesquisa) &&
                (!filtro ||
                    item.status === filtro)
            );
        });

    mostrarNC(filtradas);
}


function mostrarNC(lista) {

    const tabela =
        document.getElementById(
            "listaNC"
        );

    tabela.innerHTML = "";

    if (lista.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="tabela-vazia"
                >
                    Nenhuma não conformidade encontrada.
                </td>
            </tr>
        `;

        return;
    }

    lista.forEach(item => {

        const linha =
            document.createElement("tr");

        let classeStatus =
            "status-alerta";

        if (
            item.status === "Fechada" ||
            item.status === "Resolvida"
        ) {
            classeStatus =
                "status-conforme";
        }

        linha.innerHTML = `

            <td>
                <strong>
                    ${item.codigo}
                </strong>
            </td>

            <td>
                ${item.produto || "-"}
            </td>

            <td>
                ${item.processo || "-"}
            </td>

            <td>
                ${item.gravidade || "-"}
            </td>

            <td>
                ${item.responsavel || "-"}
            </td>

            <td>
                ${item.data || "-"}
            </td>

            <td>

                <span
                    class="status ${classeStatus}"
                >
                    ${item.status}
                </span>

            </td>

            <td>

                <button
                    class="btn-tabela btn-excluir"
                    onclick="excluirNC(${item.id})"
                >
                    Excluir
                </button>

            </td>
        `;

        tabela.appendChild(linha);

    });
}


async function excluirNC(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta não conformidade?"
        )
    ) {
        return;
    }

    try {

        await api(
            `/nao-conformidades/${id}`,
            {
                method: "DELETE"
            }
        );

        carregarNC();

    } catch (erro) {

        alert(erro.message);

    }
}


function definirDataNC() {

    const campo =
        document.getElementById(
            "dataNC"
        );

    if (!campo.value) {

        campo.value =
            new Date()
                .toISOString()
                .split("T")[0];
    }
}


document
    .getElementById("pesquisaNC")
    .addEventListener(
        "input",
        filtrarNC
    );


document
    .getElementById("filtroNC")
    .addEventListener(
        "change",
        filtrarNC
    );


definirDataNC();

carregarInspecoesNC();

carregarNC();
