const loginForm =
    document.getElementById("loginForm");


const mensagem =
    document.getElementById("mensagem");



function mostrarMensagem(
    texto,
    tipo = "erro"
) {

    mensagem.textContent =
        texto;

    mensagem.className =
        "mensagem " + tipo;

}



loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const email =
            document.getElementById(
                "email"
            ).value.trim();


        const senha =
            document.getElementById(
                "senha"
            ).value;


        if (!email || !senha) {

            mostrarMensagem(
                "Preencha e-mail e senha."
            );

            return;

        }


        try {

            mostrarMensagem(
                "Entrando...",
                "info"
            );


            const resposta =
                await fetch(
                    "/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                email,
                                senha
                            })
                    }
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    dados.erro ||
                    "Não foi possível realizar o login."
                );

            }


            localStorage.setItem(
                "atlas_token",
                dados.token
            );


            localStorage.setItem(
                "atlas_usuario",
                JSON.stringify(
                    dados.usuario
                )
            );


            const lembrar =
                document.getElementById(
                    "lembrar"
                ).checked;


            if (lembrar) {

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


            setTimeout(
                () => {

                    window.location.href =
                        "/dashboard.html";

                },
                500
            );


        } catch (erro) {

            mostrarMensagem(
                erro.message
            );

        }

    }
);



document
    .getElementById("esqueciSenha")
    .addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            alert(
                "A recuperação de senha será disponibilizada na próxima etapa."
            );

        }
    );
