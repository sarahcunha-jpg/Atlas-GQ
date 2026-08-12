/* =========================================================
   ATLAS GESTÃO
   LOGIN
========================================================= */


/* =========================================================
   ELEMENTOS DA PÁGINA
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
   LOGIN
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


            /* =============================================
               LOGIN LOCAL TEMPORÁRIO
               
               Nesta primeira etapa o sistema funciona
               sem backend para conseguirmos construir
               todas as páginas.
            ============================================= */

            try {

                await new Promise(
                    function(resolve) {

                        setTimeout(
                            resolve,
                            500
                        );

                    }
                );


                /*
                 * Usuário de demonstração.
                 *
                 * Depois vamos substituir esta parte
                 * pela API + banco de dados.
                 */

                const usuarioDemo = {

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

                const tokenDemo =
                    "atlas-demo-token";


                localStorage.setItem(
                    "atlas_token",
                    tokenDemo
                );


                localStorage.setItem(
                    "atlas_usuario",
                    JSON.stringify(
                        usuarioDemo
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
                   MENSAGEM DE SUCESSO
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
                            "./dashboard.html";

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


/* =========================================================
   VERIFICAR LOGIN EXISTENTE
========================================================= */

function verificarLoginExistente() {

    const token =
        localStorage.getItem(
            "atlas_token"
        );


    const paginaAtual =
        window.location.pathname;


    const estaNoLogin =
        paginaAtual.endsWith(
            "/index.html"
        ) ||
        paginaAtual.endsWith(
            "/Atlas-GQ/"
        ) ||
        paginaAtual === "/";


    if (
        token &&
        !estaNoLogin
    ) {

        return;

    }

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        verificarLoginExistente();

    }
);
