const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const databasePath = path.join(__dirname, "atlas.db");

const db = new sqlite3.Database(databasePath);

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            perfil TEXT NOT NULL DEFAULT 'Visualizador',
            status TEXT NOT NULL DEFAULT 'Ativo',
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS inspecoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT NOT NULL,
            produto TEXT NOT NULL,
            lote TEXT,
            responsavel TEXT NOT NULL,
            data TEXT NOT NULL,
            local TEXT,
            tipo TEXT,
            resultado TEXT NOT NULL,
            observacoes TEXT,
            descricao TEXT,
            gravidade TEXT,
            prazo TEXT,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS nao_conformidades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT NOT NULL,
            inspecao_id INTEGER,
            produto TEXT,
            processo TEXT,
            descricao TEXT NOT NULL,
            categoria TEXT,
            gravidade TEXT,
            responsavel TEXT,
            status TEXT DEFAULT 'Aberta',
            data TEXT,
            evidencias TEXT,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (inspecao_id)
            REFERENCES inspecoes(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS acoes_corretivas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL,
            nao_conformidade_id INTEGER,
            responsavel TEXT NOT NULL,
            data_abertura TEXT,
            prazo TEXT,
            plano_acao TEXT,
            status TEXT DEFAULT 'Aberta',
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (nao_conformidade_id)
            REFERENCES nao_conformidades(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS auditorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT NOT NULL,
            auditor TEXT NOT NULL,
            setor TEXT,
            data TEXT NOT NULL,
            tipo TEXT,
            checklist TEXT,
            resultado TEXT,
            observacoes TEXT,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS documentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT NOT NULL,
            nome TEXT NOT NULL,
            tipo TEXT,
            revisao TEXT,
            data TEXT,
            responsavel TEXT,
            arquivo TEXT,
            status TEXT DEFAULT 'Ativo',
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS empresa (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            cnpj TEXT,
            telefone TEXT,
            email TEXT,
            endereco TEXT,
            atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

});

module.exports = db;
