const loginForm = document.getElementById("loginForm");

const mensagem = document.getElementById("mensagemLogin");



function mostrarMensagem(texto, tipo = "erro") {

    if (!mensagem) {
        return;
    }

    mensagem.textContent = texto;

    mensagem.className = "mensagem " + tipo;

}



if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document.getElementById("email").value.trim();


            const senha =
                document.getElementById("senha").value;


            const manterConectado =
                document.getElementById("manterConectado");


            if (!email || !senha) {

                mostrarMensagem(
                    "Preencha e-mail e senha."
                );

                return;

            }


            /*
            =====================================================
            LOGIN TEMPORÁRIO PARA GITHUB PAGES
            =====================================================

            O GitHub Pages não executa o backend Node.js.
            Por isso, nesta etapa vamos apenas testar
            a navegação do sistema.
            */


            const usuario = {

                nome: email.split("@")[0],

                perfil: "Administrador"

            };


            localStorage.setItem(
                "atlas_token",
                "demo-token"
            );


            localStorage.setItem(
                "atlas_usuario",
                JSON.stringify(usuario)
            );


            if (
                manterConectado &&
                manterConectado.checked
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
                "Login realizado com sucesso.",
                "sucesso"
            );


            /*
            =====================================================
            REDIRECIONAMENTO
            =====================================================

            O dashboard está dentro de front-end.
            */


            setTimeout(
                function() {

                    window.location.href =
                        "./front-end/dashboard.html";

                },
                500
            );

        }
    );

}



const esqueciSenha =
    document.getElementById("esqueciSenha");


if (esqueciSenha) {

    esqueciSenha.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            alert(
                "A recuperação de senha será disponibilizada na próxima etapa."
            );

        }
    );

}
