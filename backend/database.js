const sqlite3 = require("sqlite3").verbose();

const path = require("path");

const banco =
    path.join(
        __dirname,
        "atlas.db"
    );


const db =
    new sqlite3.Database(
        banco,
        erro => {

            if (erro) {

                console.error(
                    "Erro ao conectar ao banco:",
                    erro.message
                );

            } else {

                console.log(
                    "Banco SQLite conectado."
                );

            }

        }
    );


/*
|--------------------------------------------------------------------------
| TABELAS
|--------------------------------------------------------------------------
*/

db.serialize(() => {


    /*
    |--------------------------------------------------------------------------
    | USUÁRIOS
    |--------------------------------------------------------------------------
    */

    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nome TEXT NOT NULL,

            email TEXT UNIQUE NOT NULL,

            senha TEXT NOT NULL,

            perfil TEXT DEFAULT 'Visualizador',

            status TEXT DEFAULT 'Ativo'

        )
    `);


    /*
    |--------------------------------------------------------------------------
    | INSPEÇÕES
    |--------------------------------------------------------------------------
    */

    db.run(`
        CREATE TABLE IF NOT EXISTS inspecoes (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            codigo TEXT NOT NULL,

            produto TEXT,

            lote TEXT,

            responsavel TEXT,

            data TEXT,

            local TEXT,

            tipo TEXT,

            resultado TEXT,

            observacoes TEXT,

            evidencias TEXT,

            gravidade TEXT,

            prazo TEXT

        )
    `);


    /*
    |--------------------------------------------------------------------------
    | NÃO CONFORMIDADES
    |--------------------------------------------------------------------------
    */

    db.run(`
        CREATE TABLE IF NOT EXISTS nao_conformidades (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            codigo TEXT NOT NULL,

            inspecao_id INTEGER,

            produto TEXT,

            processo TEXT,

            descricao TEXT,

            categoria TEXT,

            gravidade TEXT,

            responsavel TEXT,

            status TEXT DEFAULT 'Aberta',

            data TEXT,

            evidencias TEXT,

            FOREIGN KEY (
                inspecao_id
            )
            REFERENCES inspecoes(id)

        )
    `);


    /*
    |--------------------------------------------------------------------------
    | AÇÕES CORRETIVAS
    |--------------------------------------------------------------------------
    */

    db.run(`
        CREATE TABLE IF NOT EXISTS acoes_corretivas (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            numero TEXT NOT NULL,

            nao_conformidade_id INTEGER,

            responsavel TEXT,

            data_abertura TEXT,

            prazo TEXT,

            plano_acao TEXT,

            status TEXT DEFAULT 'Aberta',

            FOREIGN KEY (
                nao_conformidade_id
            )
            REFERENCES nao_conformidades(id)

        )
    `);


    /*
    |--------------------------------------------------------------------------
    | AUDITORIAS
    |--------------------------------------------------------------------------
    */

    db.run(`
        CREATE TABLE IF NOT EXISTS auditorias (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            codigo TEXT NOT NULL,

            auditor TEXT,

            setor TEXT,

            data TEXT,

            tipo TEXT,

            checklist TEXT,

            resultado TEXT,

            observacoes TEXT

        )
    `);


    /*
    |--------------------------------------------------------------------------
    | DOCUMENTOS
    |--------------------------------------------------------------------------
    */

    db.run(`
        CREATE TABLE IF NOT EXISTS documentos (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            codigo TEXT NOT NULL,

            nome TEXT NOT NULL,

            tipo TEXT,

            revisao TEXT DEFAULT '00',

            data TEXT,

            responsavel TEXT,

            arquivo TEXT,

            descricao TEXT

        )
    `);

});


module.exports = db;
