/* Para rodar a aplicação deve ser instalado no computador
NODE JS E O CLIENT DO MYSQL

no vscode deve ser instalado os módulos através do terminal:
npm init -y
npm install express mysql2 cors body-parser

para rodar o servidor execute o comando do TERMINAL:
node server.js
 */

// Importando módulos necessários
const express = require('express'); // Cria o servidor e gerencia rotas HTTP.
const mysql = require('mysql2'); // onecta o Node.js ao banco de dados MySQL e executa consultas.
const cors = require('cors'); // serve para permitir ou bloquear requisições entre diferentes origens.
const bodyParser = require('body-parser'); //Processa o corpo das requisições (JSON, formulários).

const app = express();
const PORT = 3000;

// Middleware para permitir requisições de outros domínios (CORS) e processar JSON
app.use(cors()); // Libera acesso para qualquer origem
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',   // Altere para seu usuário do MySQL
    password: 'sua_senha',   // Altere para sua senha do MySQL
    database: 'teste'
});
/*
--EXECUTE O COMANDO DO MYSQL
--criação do banco
CREATE DATABASE estudo;

--conectar ao banco de dados
USE estudo;

-- Criar a tabela de cadastro do usuário
CREATE TABLE usuarios(
    id int AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);
*/

// Conectar ao banco
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
    } else {
        console.log('Conectado ao MySQL');
    }
});

// Rota para obter todos os usuários
app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            res.status(500).json({ erro: 'Erro ao buscar usuários' });
        } else {
            res.json(results);
        }
    });
});

// Rota para adicionar um usuário
app.post('/usuarios', (req, res) => {
    const { nome } = req.body;
    if (!nome) {
        return res.status(400).json({ erro: 'Nome é obrigatório' });
    }

    db.query('INSERT INTO usuarios (nome) VALUES (?)', [nome], (err, result) => {
        if (err) {
            res.status(500).json({ erro: 'Erro ao adicionar usuário' });
        } else {
            res.json({ id: result.insertId, nome });
        }
    });
});

// Rota PUT - Atualizar um usuário por ID
app.put('/usuarios/:id', (req, res) => {
   const { id } = req.params;
   const { nome } = req.body;

   if (!nome) {
       return res.status(400).json({ error: 'O campo nome é obrigatório' });
   }

   db.query('UPDATE usuarios SET nome = ? WHERE id = ?', [nome, id], (err, result) => {
       if (err) {
           res.status(500).json({ error: 'Erro ao atualizar usuário' });
       } else if (result.affectedRows === 0) {
           res.status(404).json({ error: 'Usuário não encontrado' });
       } else {
           res.json({ message: 'Usuário atualizado com sucesso' });
       }
   });
});

// Rota DELETE - Excluir um usuário por ID
app.delete('/usuarios/:id', (req, res) => {
   const { id } = req.params;

   db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
       if (err) {
           res.status(500).json({ error: 'Erro ao excluir usuário' });
       } else if (result.affectedRows === 0) {
           res.status(404).json({ error: 'Usuário não encontrado' });
       } else {
           res.json({ message: 'Usuário excluído com sucesso' });
       }
   });
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
