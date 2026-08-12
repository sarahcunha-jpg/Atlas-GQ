document.addEventListener("DOMContentLoaded", function () {


    /*
     * VERIFICA LOGIN
     */

    const token =
        localStorage.getItem("atlas_token");


    const pagina =
        window.location.pathname;


    const estaNoLogin =
        pagina.endsWith("index.html") ||
        pagina.endsWith("/");


    if (!token && !estaNoLogin) {

        window.location.href = "index.html";

        return;

    }


    /*
     * USUÁRIO
     */

    const usuarioSalvo =
        localStorage.getItem("atlas_usuario");


    if (usuarioSalvo) {

        try {

            const usuario =
                JSON.parse(usuarioSalvo);


            const nome =
                document.getElementById("usuarioNome");


            const perfil =
                document.getElementById("usuarioPerfil");


            if (nome) {

                nome.textContent =
                    usuario.nome || "Usuário";

            }


            if (perfil) {

                perfil.textContent =
                    usuario.perfil || "Usuário";

            }


        } catch (erro) {

            console.log(
                "Erro ao carregar usuário:",
                erro
            );

        }

    }


    /*
     * LOGOUT
     */

    const logout =
        document.getElementById("logout");


    if (logout) {

        logout.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "atlas_token"
                );

                localStorage.removeItem(
                    "atlas_usuario"
                );


                window.location.href =
                    "index.html";

            }
        );

    }


    /*
     * MENU MOBILE
     */

    const menuMobile =
        document.getElementById("menuMobile");


    const menu =
        document.getElementById("menu");


    if (menuMobile && menu) {

        menuMobile.addEventListener(
            "click",
            function () {

                menu.classList.toggle(
                    "aberto"
                );

            }
        );

    }

});
