const API_BASE = "/api";


/* ==========================================================
   TOKEN
========================================================== */

function obterToken() {

    return localStorage.getItem("atlas_token");

}


/* ==========================================================
   USUÁRIO
========================================================== */

function obterUsuario() {

    const usuario =
        localStorage.getItem("atlas_usuario");

    if (!usuario) {
        return null;
    }

    try {

        return JSON.parse(usuario);

    } catch {

        return null;

    }

}


/* ==========================================================
   VERIFICAR LOGIN
========================================================== */

function verificarLogin() {

    const token =
        obterToken();

    const pagina =
        window.location.pathname;

    const paginaLogin =
        pagina === "/" ||
        pagina.endsWith("/index.html");

    if (!token && !paginaLogin) {

        window.location.href =
            "/index.html";

        return false;

    }

    return true;

}


/* ==========================================================
   API
========================================================== */

async function api(
    rota,
    opcoes = {}
) {

    const token =
        obterToken();

    const configuracao = {

        ...opcoes,

        headers: {

            "Content-Type":
                "application/json",

            ...(opcoes.headers || {})

        }

    };

    if (token) {

        configuracao.headers.Authorization =
            `Bearer ${token}`;

    }

    const resposta =
        await fetch(
            API_BASE + rota,
            configuracao
        );

    if (resposta.status === 401) {

        localStorage.removeItem(
            "atlas_token"
        );

        localStorage.removeItem(
            "atlas_usuario"
        );

        window.location.href =
            "/index.html";

        throw new Error(
            "Sua sessão expirou."
        );

    }

    let dados = {};

    try {

        dados =
            await resposta.json();

    } catch {

        dados = {};

    }

    if (!resposta.ok) {

        throw new Error(
            dados.erro ||
            "Erro na comunicação com o servidor."
        );

    }

    return dados;

}


/* ==========================================================
   PREENCHER USUÁRIO
========================================================== */

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
            usuario.nome || "Usuário";

    }

    if (perfil) {

        perfil.textContent =
            usuario.perfil || "Usuário";

    }

}


/* ==========================================================
   LOGOUT
========================================================== */

function configurarLogout() {

    const botao =
        document.getElementById("logout");

    if (!botao) {
        return;
    }

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
                "/index.html";

        }
    );

}


/* ==========================================================
   MENU MOBILE
========================================================== */

function configurarMenuMobile() {

    const menu =
        document.getElementById("menu");

    const botaoAbrir =
        document.getElementById("menuMobile");

    const botaoFechar =
        document.getElementById("fecharMenu");


    if (!menu) {
        return;
    }


    /* ======================================================
       ABRIR MENU
    ====================================================== */

    if (botaoAbrir) {

        botaoAbrir.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();

                menu.classList.add(
                    "aberto"
                );

            }
        );

    }


    /* ======================================================
       FECHAR MENU
    ====================================================== */

    if (botaoFechar) {

        botaoFechar.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();

                menu.classList.remove(
                    "aberto"
                );

            }
        );

    }


    /* ======================================================
       CLICAR FORA
    ====================================================== */

    document.addEventListener(
        "click",
        function(event) {

            if (
                menu.classList.contains("aberto") &&
                !menu.contains(event.target) &&
                !(
                    botaoAbrir &&
                    botaoAbrir.contains(event.target)
                )
            ) {

                menu.classList.remove(
                    "aberto"
                );

            }

        }
    );


    /* ======================================================
       CLICAR EM LINK DO MENU
    ====================================================== */

    const links =
        menu.querySelectorAll("nav a");

    links.forEach(
        function(link) {

            link.addEventListener(
                "click",
                function() {

                    menu.classList.remove(
                        "aberto"
                    );

                }
            );

        }
    );

}


/* ==========================================================
   DESTACAR MENU
========================================================== */

function destacarMenu() {

    const pagina =
        window.location.pathname;

    const links =
        document.querySelectorAll(
            "#menu nav a"
        );

    links.forEach(
        function(link) {

            const href =
                link.getAttribute("href");

            if (!href) {
                return;
            }

            const caminho =
                href.split("/").pop();

            if (
                pagina.endsWith(caminho)
            ) {

                link.classList.add(
                    "ativo"
                );

            }

        }
    );

}


/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

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
