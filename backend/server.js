require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT =
    process.env.PORT || 3000;



/* =========================
   BANCO
========================= */

require("./database");



/* =========================
   MIDDLEWARE
========================= */

app.use(
    cors()
);

app.use(
    express.json({
        limit: "10mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb"
    })
);



/* =========================
   UPLOADS
========================= */

const pastaUploads =
    path.join(
        __dirname,
        "uploads"
    );


if (
    !fs.existsSync(
        pastaUploads
    )
) {

    fs.mkdirSync(
        pastaUploads,
        {
            recursive: true
        }
    );

}


app.use(
    "/uploads",
    express.static(
        pastaUploads
    )
);



/* =========================
   FRONTEND
========================= */

app.use(
    express.static(
        path.join(
            __dirname,
            "../frontend"
        )
    )
);



/* =========================
   ROTAS
========================= */

const authRoutes =
    require("./routes/auth");

const dashboardRoutes =
    require("./routes/dashboard");

const inspecoesRoutes =
    require("./routes/inspecoes");


app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/dashboard",
    dashboardRoutes
);


app.use(
    "/api/inspecoes",
    inspecoesRoutes
);



/* =========================
   ROTA PRINCIPAL
========================= */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "../frontend/index.html"
            )
        );

    }
);



/* =========================
   ERROS
========================= */

app.use(
    (erro, req, res, next) => {

        console.error(erro);

        res.status(500).json({
            erro:
                "Erro interno do servidor."
        });

    }
);



/* =========================
   SERVIDOR
========================= */

app.listen(
    PORT,
    () => {

        console.log(
            `Atlas Gestão rodando em http://localhost:${PORT}`
        );

    }
);
