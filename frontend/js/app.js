const API_BASE = "/Atlas-GQ/api";


/*
|--------------------------------------------------------------------------
| CAMINHO BASE DO SISTEMA
|--------------------------------------------------------------------------
*/

const ATLAS_BASE =
    "/Atlas-GQ";


/*
|--------------------------------------------------------------------------
| TOKEN
|--------------------------------------------------------------------------
*/

function obterToken() {

    return localStorage.getItem(
        "atlas_token"
    );

}


/*
|--------------------------------------------------------------------------
| USUÁRIO
|--------------------------------------------------------------------------
*/

function obterUsuario() {

    const usuario =
        localStorage.getItem(
            "atlas_usuario"
        );


    if (!usuario) {

        return null;

    }


    try {

        return JSON.parse(
            usuario
        );

    } catch {

        return null;

    }

}


/*
|--------------------------------------------------------------------------
| VERIFICAR LOGIN
|--------------------------------------------------------------------------
*/

function verificarLogin() {

    const token =
        obterToken();


    const pagina =
        window.location.pathname;


    const paginaLogin =
        pagina === ATLAS_BASE + "/" ||
        pagina === ATLAS_BASE ||
        pagina.endsWith(
            "/index.html"
        );


    if (
        !token &&
        !paginaLogin
    ) {

        window.location.href =
            ATLAS_BASE + "/index.html";

        return false;

    }


    return true;

}


/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

async function api(
    rota,
    opcoes = {}
) {

    const token =
        obterToken();


    const configuracao = {

        ...opcoes,

        headers: {

            ...(opcoes.headers || {})

        }

    };


    /*
    ----------------------------------------------------------
    FORM DATA
    ----------------------------------------------------------
    */

    if (
        !(opcoes.body instanceof FormData)
    ) {

        configuracao.headers[
            "Content-Type"
        ] =
            "application/json";

    }


    /*
    ----------------------------------------------------------
    TOKEN
    ----------------------------------------------------------
    */

    if (token) {

        configuracao.headers.Authorization =
            `Bearer ${token}`;

    }


    const resposta =
        await fetch(
            API_BASE + rota,
            configuracao
        );


    /*
    ----------------------------------------------------------
    SESSÃO EXPIRADA
    ----------------------------------------------------------
    */

    if (
        resposta.status === 401
    ) {

        localStorage.removeItem(
            "atlas_token"
        );

        localStorage.removeItem(
            "atlas_usuario"
        );


        window.location.href =
            ATLAS_BASE + "/index.html";


        throw new Error(
            "Sua sessão expirou."
        );

    }


    /*
    ----------------------------------------------------------
    RESPOSTA
    ----------------------------------------------------------
    */

    let dados = null;


    try {

        dados =
            await resposta.json();

    } catch {

        dados = {};

    }


    /*
    ----------------------------------------------------------
    ERRO
    ----------------------------------------------------------
    */

    if (!resposta.ok) {

        throw new Error(
            dados.erro ||
            dados.mensagem ||
            "Erro na comunicação com o servidor."
        );

    }


    return dados;

}


/*
|--------------------------------------------------------------------------
| PREENCHER USUÁRIO
|--------------------------------------------------------------------------
*/

function preencherUsuario() {

    const usuario =
        obterUsuario();


    if (!usuario) {

        return;

    }


    const nome =
        document.getElementById(
            "usuarioNome"
        );


    const perfil =
        document.getElementById(
            "usuarioPerfil"
        );


    if (nome) {

        nome.textContent =
            usuario.nome ||
            "Usuário";

    }


    if (perfil) {

        perfil.textContent =
            usuario.perfil ||
            "Usuário";

    }


    const usuarioLogado =
        document.getElementById(
            "usuarioLogado"
        );


    if (usuarioLogado) {

        usuarioLogado.textContent =
            usuario.nome ||
            "Usuário";

    }

}


/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

function configurarLogout() {

    const botao =
        document.getElementById(
            "logout"
        );


    if (!botao) {

        return;

    }


    if (
        botao.dataset.logoutConfigurado
    ) {

        return;

    }


    botao.dataset.logoutConfigurado =
        "true";


    botao.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "atlas_token"
            );

            localStorage.removeItem(
                "atlas_usuario"
            );


            window.location.href =
                ATLAS_BASE + "/index.html";

        }
    );

}


/*
|--------------------------------------------------------------------------
| MENU MOBILE
|--------------------------------------------------------------------------
*/

function configurarMenuMobile() {

    const botao =
        document.getElementById(
            "menuMobile"
        );


    const menu =
        document.getElementById(
            "menu"
        );


    if (!botao || !menu) {

        return;

    }


    if (
        botao.dataset.menuConfigurado
    ) {

        return;

    }


    botao.dataset.menuConfigurado =
        "true";


    botao.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            menu.classList.toggle(
                "menu-aberto"
            );

        }
    );


    /*
    ----------------------------------------------------------
    FECHAR AO CLICAR FORA
    ----------------------------------------------------------
    */

    document.addEventListener(
        "click",
        function(event) {

            if (
                window.innerWidth > 900
            ) {

                return;

            }


            if (
                !menu.contains(
                    event.target
                ) &&
                !botao.contains(
                    event.target
                )
            ) {

                menu.classList.remove(
                    "menu-aberto"
                );

            }

        }
    );


    /*
    ----------------------------------------------------------
    FECHAR AO CLICAR EM LINK
    ----------------------------------------------------------
    */

    const links =
        menu.querySelectorAll(
            "nav a"
        );


    links.forEach(
        link => {

            link.addEventListener(
                "click",
                function() {

                    if (
                        window.innerWidth <= 900
                    ) {

                        menu.classList.remove(
                            "menu-aberto"
                        );

                    }

                }
            );

        }
    );

}


/*
|--------------------------------------------------------------------------
| DESTACAR MENU
|--------------------------------------------------------------------------
*/

function destacarMenu() {

    const pagina =
        window.location.pathname;


    const links =
        document.querySelectorAll(
            "#menu nav a"
        );


    links.forEach(
        link => {

            const href =
                link.getAttribute(
                    "href"
                );


            if (!href) {

                return;

            }


            link.classList.remove(
                "ativo"
            );


            /*
            --------------------------------------------------
            COMPARA O ENDEREÇO
            --------------------------------------------------
            */

            const caminhoLink =
                href.startsWith("/")
                    ? href
                    : ATLAS_BASE + "/" + href;


            if (
                pagina.endsWith(
                    caminhoLink
                )
            ) {

                link.classList.add(
                    "ativo"
                );

            }

        }
    );

}


/*
|--------------------------------------------------------------------------
| MENSAGEM
|--------------------------------------------------------------------------
*/

function mostrarMensagem(
    elemento,
    mensagem,
    tipo = "sucesso"
) {

    if (
        typeof elemento === "string"
    ) {

        elemento =
            document.getElementById(
                elemento
            );

    }


    if (!elemento) {

        return;

    }


    elemento.textContent =
        mensagem;


    elemento.className =
        `mensagem ${tipo}`;


    setTimeout(
        function() {

            elemento.className =
                "mensagem";

        },
        5000
    );

}


/*
|--------------------------------------------------------------------------
| CONFIRMAÇÃO
|--------------------------------------------------------------------------
*/

function confirmarExclusao(
    mensagem =
        "Deseja realmente excluir este registro?"
) {

    return window.confirm(
        mensagem
    );

}


/*
|--------------------------------------------------------------------------
| FORMATAÇÃO DE DATA
|--------------------------------------------------------------------------
*/

function formatarData(
    data
) {

    if (!data) {

        return "-";

    }


    const dataObjeto =
        new Date(data);


    if (
        Number.isNaN(
            dataObjeto.getTime()
        )
    ) {

        return data;

    }


    return dataObjeto.toLocaleDateString(
        "pt-BR"
    );

}


/*
|--------------------------------------------------------------------------
| FORMATAÇÃO DE NÚMERO
|--------------------------------------------------------------------------
*/

function formatarNumero(
    valor
) {

    const numero =
        Number(valor);


    if (
        Number.isNaN(numero)
    ) {

        return "0";

    }


    return numero.toLocaleString(
        "pt-BR"
    );

}


/*
|--------------------------------------------------------------------------
| INICIALIZAÇÃO
|--------------------------------------------------------------------------
*/

document.addEventListener(
    "DOMContentLoaded",
    function() {

        verificarLogin();

        preencherUsuario();

        configurarLogout();

        configurarMenuMobile();

        destacarMenu();

    }
);
