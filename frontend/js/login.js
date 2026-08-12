document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const mensagem = document.getElementById("mensagem");

    function mostrarMensagem(texto, tipo = "erro") {

        mensagem.textContent = texto;

        mensagem.className = "mensagem " + tipo;

    }


    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const senha =
            document.getElementById("senha").value;


        if (!email || !senha) {

            mostrarMensagem(
                "Preencha e-mail e senha.",
                "erro"
            );

            return;

        }


        /*
         * LOGIN LOCAL PARA GITHUB PAGES
         *
         * Nesta etapa não usamos o backend.
         * O objetivo é permitir testar o sistema
         * diretamente pelo GitHub Pages.
         */


        const usuario = {

            nome: email.split("@")[0],

            email: email,

            perfil: "Administrador"

        };


        localStorage.setItem(
            "atlas_token",
            "login-local"
        );


        localStorage.setItem(
            "atlas_usuario",
            JSON.stringify(usuario)
        );


        if (
            document.getElementById("lembrar").checked
        ) {

            localStorage.setItem(
                "atlas_lembrar",
                "true"
            );

        } else {

            localStorage.removeItem(
                "atlas_lembrar"
            );

        }


        mostrarMensagem(
            "Login realizado com sucesso!",
            "sucesso"
        );


        setTimeout(function () {

            window.location.href = "painel.html";

        }, 500);

    });


    const esqueciSenha =
        document.getElementById("esqueciSenha");


    if (esqueciSenha) {

        esqueciSenha.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                alert(
                    "A recuperação de senha será disponibilizada em uma próxima etapa."
                );

            }
        );

    }

});
