# 🕹️ Catálogo de Jogos - Interface Web (React + TypeScript)

Avaliação A2-2 - Desenvolvimento Web Avançado  
**Professor:** Marlon  
**Data de Entrega:** 01/06/2026  

## 👥 Integrantes da Equipe
* Nycolas Polatoro
* Gustavo Cáceres
* Lucas Perusselli
* Arthur Pessoa

## 📝 Descrição do Sistema
Esta é a interface de usuário (Single Page Application) desenvolvida em **React** com **TypeScript** utilizando o **Vite** como ferramenta de build. O sistema estende o projeto anterior (A2-1) e funciona como o cliente oficial da **CatalogoJogosAPI**. 

A aplicação permite o gerenciamento completo (CRUD) de jogos e categorias de forma dinâmica, realizando requisições HTTP assíncronas para o back-end em C#. Além disso, conta com um ecossistema de rotas protegidas por autenticação via **JWT (JSON Web Token)**.

## 🛠️ Tecnologias Utilizadas
* **React 18** (Componentes Funcionais, Hooks)
* **TypeScript** (Tipagem estática e segurança de código)
* **Vite** (Ambiente de desenvolvimento rápido)
* **CSS Nativo** (Estilização da interface)

## 🔑 Funcionamento da Autenticação JWT
A segurança da aplicação é baseada em tokens de portador (Bearer Token):
1. O usuário submete suas credenciais na tela de Login.
2. O front-end envia uma requisição `POST` para o endpoint de autenticação do back-end.
3. A API valida as credenciais, gera um token JWT assinado e o retorna na resposta.
4. O front-end armazena esse token com segurança no `localStorage`.
5. Para todas as requisições subsequentes a endpoints protegidos, o front-end intercepta a chamada e insere o token no cabeçalho HTTP: `Authorization: Bearer <seu_token>`.

## 🔌 Endpoints Principais Consumidos
* `POST /api/auth/login` - Autenticação do usuário e obtenção do JWT.
* `GET /api/categorias` - Listagem de todas as categorias.
* `POST /api/categorias` - Cadastro de nova categoria (Protegido).
* `DELETE /api/categorias/{id}` - Remoção de categoria (Protegido).
* `GET /api/jogos` - Listagem de jogos mapeados com preço com desconto.
* `POST /api/jogos` - Cadastro de novos jogos (Protegido).
* `PUT /api/jogos/{id}` - Atualização de dados dos jogos (Protegido).
* `DELETE /api/jogos/{id}` - Remoção de jogos do catálogo (Protegido).

## 🚀 Instruções de Execução

1. Certifique-se de que a **CatalogoJogosAPI** (Back-end) esteja rodando localmente na porta configurada.
2. Clone este repositório do front-end.
3. Navegue até a pasta do projeto e instale as dependências com o comando:
   `npm install`
4. Inicie o servidor de desenvolvimento local rodando:
   `npm run dev`
5. Abra o navegador no endereço indicado pelo terminal (geralmente `http://localhost:5173`).

