const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./database");

const authRoutes = require("./routes/auth");
const inspecoesRoutes = require("./routes/inspecoes");
const naoConformidadesRoutes = require("./routes/naoConformidades");
const acoesCorretivasRoutes = require("./routes/acoesCorretivas");
const auditoriasRoutes = require("./routes/auditorias");

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
| API
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


/*
|--------------------------------------------------------------------------
| PÁGINA INICIAL
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
    (err, req, res, next) => {

        console.error(err);

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
