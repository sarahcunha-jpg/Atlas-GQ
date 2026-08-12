const API_BASE = "/api";


/* ==========================================================
   TOKEN
========================================================== */

function obterToken() {

    return localStorage.getItem(
        "atlas_token"
    );

}


/* ==========================================================
   USUÁRIO
========================================================== */

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
        pagina.endsWith(
            "/index.html"
        );

    if (
        !token &&
        !paginaLogin
    ) {

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
            "/index.html";

        throw new Error(
            "Sua sessão expirou."
        );

    }

    let dados = null;

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
            usuario.nome;

    }

    if (perfil) {

        perfil.textContent =
            usuario.perfil;

    }

    const usuarioLogado =
        document.getElementById(
            "usuarioLogado"
        );

    if (usuarioLogado) {

        usuarioLogado.textContent =
            usuario.nome;

    }

}


/* ==========================================================
   LOGOUT
========================================================== */

function configurarLogout() {

    const botao =
        document.getElementById(
            "logout"
        );

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


    /* ======================================================
       CRIA BOTÃO FECHAR
    ====================================================== */

    let botaoFechar =
        document.getElementById(
            "fecharMenu"
        );


    if (!botaoFechar) {

        botaoFechar =
            document.createElement(
                "button"
            );

        botaoFechar.id =
            "fecharMenu";

        botaoFechar.type =
            "button";

        botaoFechar.innerHTML =
            "✕";

        botaoFechar.setAttribute(
            "aria-label",
            "Fechar menu"
        );

        botaoFechar.style.position =
            "absolute";

        botaoFechar.style.top =
            "18px";

        botaoFechar.style.right =
            "15px";

        botaoFechar.style.width =
            "36px";

        botaoFechar.style.height =
            "36px";

        botaoFechar.style.border =
            "none";

        botaoFechar.style.borderRadius =
            "8px";

        botaoFechar.style.background =
            "#EFF6FF";

        botaoFechar.style.color =
            "#2563EB";

        botaoFechar.style.fontSize =
            "18px";

        botaoFechar.style.cursor =
            "pointer";

        menu.appendChild(
            botaoFechar
        );

    }


    /* ======================================================
       FUNÇÃO ABRIR
    ====================================================== */

    function abrirMenu() {

        menu.classList.add(
            "aberto"
        );

        botao.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    /* ======================================================
       FUNÇÃO FECHAR
    ====================================================== */

    function fecharMenu() {

        menu.classList.remove(
            "aberto"
        );

        botao.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    /* ======================================================
       BOTÃO ☰
    ====================================================== */

    botao.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            if (
                menu.classList.contains(
                    "aberto"
                )
            ) {

                fecharMenu();

            } else {

                abrirMenu();

            }

        }
    );


    /* ======================================================
       BOTÃO ✕
    ====================================================== */

    botaoFechar.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            fecharMenu();

        }
    );


    /* ======================================================
       CLICAR FORA DO MENU
    ====================================================== */

    document.addEventListener(
        "click",
        function(event) {

            if (
                menu.classList.contains(
                    "aberto"
                ) &&
                !menu.contains(
                    event.target
                ) &&
                !botao.contains(
                    event.target
                )
            ) {

                fecharMenu();

            }

        }
    );


    /* ======================================================
       CLICAR EM ITEM DO MENU
    ====================================================== */

    const links =
        menu.querySelectorAll(
            "nav a"
        );

    links.forEach(
        function(link) {

            link.addEventListener(
                "click",
                function() {

                    fecharMenu();

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
        link => {

            const href =
                link.getAttribute(
                    "href"
                );

            if (
                href &&
                pagina.endsWith(
                    href
                )
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
