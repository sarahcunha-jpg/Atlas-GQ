const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes =
    require("./routes/auth");

const inspecoesRoutes =
    require("./routes/inspecoes");

const naoConformidadesRoutes =
    require("./routes/naoConformidades");

const acoesCorretivasRoutes =
    require("./routes/acoesCorretivas");

const auditoriasRoutes =
    require("./routes/auditorias");

const documentosRoutes =
    require("./routes/documentos");

const indicadoresRoutes =
    require("./routes/indicadores");


const app = express();

const PORT = 3000;


/*
|--------------------------------------------------------------------------
| MIDDLEWARES
|--------------------------------------------------------------------------
*/

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


/*
|--------------------------------------------------------------------------
| FRONTEND
|--------------------------------------------------------------------------
*/

app.use(
    express.static(
        path.join(
            __dirname,
            "../frontend"
        )
    )
);


/*
|--------------------------------------------------------------------------
| UPLOADS
|--------------------------------------------------------------------------
*/

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);


/*
|--------------------------------------------------------------------------
| ROTAS
|--------------------------------------------------------------------------
*/

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/inspecoes",
    inspecoesRoutes
);

app.use(
    "/api/nao-conformidades",
    naoConformidadesRoutes
);

app.use(
    "/api/acoes-corretivas",
    acoesCorretivasRoutes
);

app.use(
    "/api/auditorias",
    auditoriasRoutes
);

app.use(
    "/api/documentos",
    documentosRoutes
);

app.use(
    "/api/indicadores",
    indicadoresRoutes
);


/*
|--------------------------------------------------------------------------
| INÍCIO
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/login.html"
        )
    );

});


/*
|--------------------------------------------------------------------------
| TESTE DA API
|--------------------------------------------------------------------------
*/

app.get("/api", (req, res) => {

    res.json({

        sistema:
            "Atlas Gestão",

        descricao:
            "Sistema de Gestão da Qualidade",

        status:
            "online"

    });

});


/*
|--------------------------------------------------------------------------
| ERROS
|--------------------------------------------------------------------------
*/

app.use(
    (erro, req, res, next) => {

        console.error(erro);

        res.status(500).json({

            erro:
                "Erro interno do servidor."

        });

    }
);


/*
|--------------------------------------------------------------------------
| SERVIDOR
|--------------------------------------------------------------------------
*/

app.listen(
    PORT,
    () => {

        console.log("");
        console.log(
            "========================================"
        );

        console.log(
            "             ATLAS GESTÃO"
        );

        console.log(
            "   Sistema de Gestão da Qualidade"
        );

        console.log(
            "========================================"
        );

        console.log("");

        console.log(
            `Servidor: http://localhost:${PORT}`
        );

        console.log("");

    }
);
