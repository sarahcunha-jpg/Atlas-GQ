const API_BASE = "/api";



function obterToken() {

    return localStorage.getItem(
        "atlas_token"
    );

}



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


    botao.addEventListener(
        "click",
        function() {

            menu.classList.toggle(
                "menu-aberto"
            );

        }
    );

}



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
                pagina.endsWith(href)
            ) {

                link.classList.add(
                    "ativo"
                );

            }

        }
    );

}



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
