/* =========================================================
   ATLAS GESTÃO
   LOGIN
========================================================= */


/* =========================================================
   ELEMENTOS
========================================================= */

const loginForm =
    document.getElementById("loginForm");

const mensagem =
    document.getElementById("mensagemLogin");

const campoEmail =
    document.getElementById("email");

const campoSenha =
    document.getElementById("senha");

const campoLembrar =
    document.getElementById("manterConectado");

const botaoLogin =
    document.getElementById("btnLogin");

const linkEsqueciSenha =
    document.getElementById("esqueciSenha");


/* =========================================================
   MENSAGEM
========================================================= */

function mostrarMensagem(
    texto,
    tipo = "erro"
) {

    if (!mensagem) {
        return;
    }

    mensagem.textContent =
        texto;

    mensagem.className =
        "mensagem " + tipo;

}


/* =========================================================
   FORMULÁRIO DE LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            /* =============================================
               DADOS
            ============================================= */

            const email =
                campoEmail
                    ? campoEmail.value.trim()
                    : "";

            const senha =
                campoSenha
                    ? campoSenha.value
                    : "";


            /* =============================================
               VALIDAÇÃO
            ============================================= */

            if (!email || !senha) {

                mostrarMensagem(
                    "Preencha e-mail e senha.",
                    "erro"
                );

                return;

            }


            /* =============================================
               BOTÃO
            ============================================= */

            if (botaoLogin) {

                botaoLogin.disabled =
                    true;

                botaoLogin.textContent =
                    "Entrando...";

            }


            try {

                /*
                 * LOGIN TEMPORÁRIO
                 *
                 * Nesta fase estamos construindo
                 * o sistema no GitHub Pages.
                 *
                 * O banco de dados será conectado
                 * posteriormente.
                 */


                await new Promise(
                    function(resolve) {

                        setTimeout(
                            resolve,
                            500
                        );

                    }
                );


                /* =========================================
                   USUÁRIO TEMPORÁRIO
                ========================================= */

                const usuario = {

                    id: 1,

                    nome:
                        "Administrador",

                    email:
                        email,

                    perfil:
                        "Administrador",

                    status:
                        "Ativo"

                };


                /* =========================================
                   TOKEN TEMPORÁRIO
                ========================================= */

                const token =
                    "atlas-demo-token";


                localStorage.setItem(
                    "atlas_token",
                    token
                );


                localStorage.setItem(
                    "atlas_usuario",
                    JSON.stringify(
                        usuario
                    )
                );


                /* =========================================
                   LEMBRAR LOGIN
                ========================================= */

                if (
                    campoLembrar &&
                    campoLembrar.checked
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


                /* =========================================
                   SUCESSO
                ========================================= */

                mostrarMensagem(
                    "Login realizado com sucesso.",
                    "sucesso"
                );


                /* =========================================
                   IR PARA DASHBOARD
                ========================================= */

                setTimeout(
                    function() {

                        window.location.href =
                            "./frontend/dashboard.html";

                    },
                    700
                );


            } catch (erro) {

                console.error(
                    "Erro no login:",
                    erro
                );


                mostrarMensagem(
                    "Não foi possível realizar o login.",
                    "erro"
                );


            } finally {

                if (botaoLogin) {

                    botaoLogin.disabled =
                        false;

                    botaoLogin.textContent =
                        "Entrar";

                }

            }

        }
    );

}


/* =========================================================
   ESQUECI A SENHA
========================================================= */

if (linkEsqueciSenha) {

    linkEsqueciSenha.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            alert(
                "A recuperação de senha será disponibilizada na próxima etapa."
            );

        }
    );

}
