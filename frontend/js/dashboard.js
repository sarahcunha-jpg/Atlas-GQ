async function carregarDashboard() {

    try {

        const dados =
            await api(
                "/dashboard"
            );


        document.getElementById(
            "inspecoes"
        ).textContent =
            dados.inspecoes;


        document.getElementById(
            "naoConformidades"
        ).textContent =
            dados.naoConformidades;


        document.getElementById(
            "acoesAbertas"
        ).textContent =
            dados.acoesAbertas;


        document.getElementById(
            "acoesConcluidas"
        ).textContent =
            dados.acoesConcluidas;


        document.getElementById(
            "taxaConformidade"
        ).textContent =
            dados.taxaConformidade + "%";


        document.getElementById(
            "auditorias"
        ).textContent =
            dados.auditorias;


        document.getElementById(
            "documentos"
        ).textContent =
            dados.documentos;


        document.getElementById(
            "taxaTexto"
        ).textContent =
            dados.taxaConformidade + "%";


        document.getElementById(
            "statusInspecoes"
        ).textContent =
            dados.inspecoes;


        document.getElementById(
            "statusNC"
        ).textContent =
            dados.naoConformidades;


        document.getElementById(
            "statusAcoes"
        ).textContent =
            dados.acoesAbertas;


        const barra =
            document.getElementById(
                "barraConformidade"
            );


        barra.style.width =
            Math.min(
                100,
                Math.max(
                    0,
                    dados.taxaConformidade
                )
            ) + "%";


        carregarAtividades();


    } catch (erro) {

        console.error(
            "Erro no dashboard:",
            erro
        );

    }

}



async function carregarAtividades() {

    const area =
        document.getElementById(
            "atividadeRecente"
        );


    try {

        const inspecoes =
            await api(
                "/inspecoes"
            );


        if (
            !inspecoes ||
            inspecoes.length === 0
        ) {

            area.innerHTML = `
                <div class="atividade-vazia">
                    Nenhuma inspeção registrada.
                </div>
            `;

            return;

        }


        const recentes =
            inspecoes.slice(
                0,
                5
            );


        area.innerHTML = "";


        recentes.forEach(
            item => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "atividade-item";


                const classe =
                    item.resultado ===
                    "Conforme"
                        ? "atividade-ok"
                        : "atividade-alerta";


                div.innerHTML = `

                    <div
                        class="atividade-indicador ${classe}"
                    >
                        ${item.resultado === "Conforme" ? "✓" : "!"}
                    </div>

                    <div>

                        <strong>
                            ${item.codigo}
                        </strong>

                        <span>
                            ${item.produto}
                        </span>

                    </div>

                `;


                area.appendChild(
                    div
                );

            }
        );


    } catch (erro) {

        area.innerHTML = `
            <div class="atividade-vazia">
                Não foi possível carregar as atividades.
            </div>
        `;

    }

}



carregarDashboard();
