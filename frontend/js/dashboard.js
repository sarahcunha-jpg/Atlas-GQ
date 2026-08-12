document.addEventListener("DOMContentLoaded", function () {


    /*
     * DADOS INICIAIS
     *
     * Nesta primeira versão os dados ficam
     * armazenados no navegador.
     */


    const dados = {

        inspecoes: 12,

        naoConformidades: 3,

        acoesAbertas: 4,

        acoesConcluidas: 8,

        auditorias: 5,

        documentos: 17

    };


    /*
     * PREENCHER INDICADORES
     */

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
        "auditorias"
    ).textContent =
        dados.auditorias;


    document.getElementById(
        "documentos"
    ).textContent =
        dados.documentos;


    /*
     * TAXA DE CONFORMIDADE
     */

    const total =
        dados.inspecoes;


    let taxa = 0;


    if (total > 0) {

        taxa =
            Math.round(
                (
                    (total - dados.naoConformidades)
                    / total
                ) * 100
            );

    }


    document.getElementById(
        "taxaConformidade"
    ).textContent =
        taxa + "%";


    document.getElementById(
        "taxaTexto"
    ).textContent =
        taxa + "%";


    /*
     * BARRA
     */

    const barra =
        document.getElementById(
            "barraConformidade"
        );


    if (barra) {

        barra.style.width =
            taxa + "%";

    }


    /*
     * STATUS
     */

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


});
