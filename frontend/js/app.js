document.addEventListener("DOMContentLoaded", function () {

    const menu =
        document.getElementById("menu");

    const menuMobile =
        document.getElementById("menuMobile");

    const fecharMenu =
        document.getElementById("fecharMenu");

    const overlay =
        document.getElementById("overlay");


    /*
    =================================
    ABRIR MENU
    =================================
    */

    function abrirMenu() {

        if (!menu) return;

        menu.classList.add("aberto");

        if (overlay) {
            overlay.classList.add("aberto");
        }

    }


    /*
    =================================
    FECHAR MENU
    =================================
    */

    function fecharMenuLateral() {

        if (!menu) return;

        menu.classList.remove("aberto");

        if (overlay) {
            overlay.classList.remove("aberto");
        }

    }


    /*
    =================================
    BOTÃO ☰
    =================================
    */

    if (menuMobile) {

        menuMobile.addEventListener(
            "click",
            function () {

                abrirMenu();

            }
        );

    }


    /*
    =================================
    BOTÃO X
    =================================
    */

    if (fecharMenu) {

        fecharMenu.addEventListener(
            "click",
            function () {

                fecharMenuLateral();

            }
        );

    }


    /*
    =================================
    CLICAR FORA
    =================================
    */

    if (overlay) {

        overlay.addEventListener(
            "click",
            function () {

                fecharMenuLateral();

            }
        );

    }


    /*
    =================================
    CLICAR EM UM LINK
    FECHA MENU NO CELULAR
    =================================
    */

    const links =
        document.querySelectorAll(
            ".menu nav a"
        );


    links.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                if (
                    window.innerWidth <= 768
                ) {

                    fecharMenuLateral();

                }

            }
        );

    });


    /*
    =================================
    ESC FECHA O MENU
    =================================
    */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                fecharMenuLateral();

            }

        }
    );


    /*
    =================================
    BOTÃO SAIR
    =================================
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

});
