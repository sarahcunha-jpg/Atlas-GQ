/* ==================================================
   ATLAS GESTÃO
   APP.JS
   LOGIN LOCAL PARA GITHUB PAGES
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loginForm =
            document.getElementById("loginForm");


        if (!loginForm) {

            return;

        }


        const mensagem =
            document.getElementById("mensagem");


        const emailInput =
            document.getElementById("email");


        const senhaInput =
            document.getElementById("senha");


        const lembrarInput =
            document.getElementById("lembrar");


        const esqueciSenha =
            document.getElementById("esqueciSenha");


        /* ==================================================
           MOSTRAR MENSAGEM
        ================================================== */

        function mostrarMensagem(
            texto,
            tipo = "error"
        ) {

            mensagem.textContent = texto;

            mensagem.className =
                "message show " + tipo;

        }


        /* ==================================================
           RECUPERAR E-MAIL SALVO
        ================================================== */

        const lembrar =
            localStorage.getItem(
                "atlas_lembrar"
            );


        const usuarioSalvo =
            localStorage.getItem(
                "atlas_usuario"
            );


        if (
            lembrar === "true" &&
            usuarioSalvo
        ) {

            try {

                const usuario =
                    JSON.parse(usuarioSalvo);


                if (usuario.email) {

                    emailInput.value =
                        usuario.email;

                }


                lembrarInput.checked =
                    true;

            } catch (erro) {

                console.log(
                    "Não foi possível recuperar o usuário."
                );

            }

        }


        /* ==================================================
           LOGIN
        ================================================== */

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const email =
                    emailInput.value.trim();


                const senha =
                    senhaInput.value;


                /* ==============================
                   VALIDAÇÕES
                ============================== */

                if (!email || !senha) {

                    mostrarMensagem(
                        "Preencha e-mail e senha."
                    );

                    return;

                }


                if (
                    !email.includes("@")
                ) {

                    mostrarMensagem(
                        "Digite um e-mail válido."
                    );

                    return;

                }


                if (
                    senha.length < 4
                ) {

                    mostrarMensagem(
                        "A senha deve ter pelo menos 4 caracteres."
                    );

                    return;

                }


                /* ==============================
                   USUÁRIO
                ============================== */

                const nome =
                    email
                        .split("@")[0]
                        .trim();


                const usuario = {

                    nome:
                        nome || "Usuário",

                    email:
                        email,

                    perfil:
                        "Administrador"

                };


                /* ==============================
                   SALVAR ACESSO
                ============================== */

                localStorage.setItem(
                    "atlas_token",
                    "atlas-local-token"
                );


                localStorage.setItem(
                    "atlas_usuario",
                    JSON.stringify(usuario)
                );


                if (
                    lembrarInput.checked
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


                /* ==============================
                   SUCESSO
                ============================== */

                mostrarMensagem(
                    "Login realizado com sucesso.",
                    "success"
                );


                /* ==============================
                   IR PARA DASHBOARD
                ============================== */

                setTimeout(
                    function () {

                        window.location.href =
                            "dashboard.html";

                    },
                    400
                );

            }
        );


        /* ==================================================
           ESQUECI A SENHA
        ================================================== */

        if (esqueciSenha) {

            esqueciSenha.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    mostrarMensagem(
                        "A recuperação de senha será disponibilizada em uma próxima etapa.",
                        "info"
                    );

                }
            );

        }

    }
);
