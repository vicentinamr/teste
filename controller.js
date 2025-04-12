// Referenciando a API
const API_URL = 'http://localhost:3000/usuarios';

// Carregar usuários ao iniciar a página
function carregarUsuarios() {
   fetch(API_URL)
         // Utiliza o promise para recuperar os dados do JSON
         .then(response => response.json())
         // pega a lista do JSON e insere no elemento HTML
         .then(usuarios => {
            const lista = document.getElementById('listaUsuarios');
            lista.innerHTML = ''; // Limpa a lista
            // Para cada registro encontrado, sera criado um elemento 'li'
            // serão criados os botoes para editar e exclir cada registro
            usuarios.forEach(user => {
               const li = document.createElement('li');
               li.innerHTML = `
                     <span id="user-${user.id}">${user.nome}</span>
                     <input type="text" id="edit-${user.id}" value="${user.nome}" style="display:none;">
                     <div>
                        <button class="btn-editar" onclick="editarUsuario(${user.id})">Editar</button>
                        <button class="btn-excluir" onclick="excluirUsuario(${user.id})">Excluir</button>
                        <button class="btn-salvar" id="salvar-${user.id}" style="display:none;" onclick="salvarEdicao(${user.id})">Salvar</button>
                        <button class="btn-cancelar" id="cancelar-${user.id}" style="display:none;" onclick="cancelarEdicao(${user.id})">Cancelar</button>
                     </div>
               `;
               // adiciona o elemento ao HTML
               lista.appendChild(li);
            });
         })
         .catch(error => console.error('Erro ao carregar usuários:', error));
}

// Adicionar usuário
function adicionarUsuario() {
   const nome = document.getElementById('nome').value;
   if (!nome) {
         alert('Digite um nome!');
         return;
   }

   // Recebe o conteudo da API para ser inserido e envia para o SERVIDOR 
   fetch(API_URL, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ nome })
   })
   .then(() => {
         document.getElementById('nome').value = '';
         carregarUsuarios(); // Atualiza a lista
   })
   .catch(error => console.error('Erro ao adicionar usuário:', error));
}

// Editar usuário, cada elemento foi criado com o ID do usuario
function editarUsuario(id) {
   document.getElementById(`user-${id}`).style.display = "none";
   document.getElementById(`edit-${id}`).style.display = "inline";
   document.getElementById(`salvar-${id}`).style.display = "inline";
   document.getElementById(`cancelar-${id}`).style.display = "inline";
}

// Cancelar edição, cada elemento foi criado com o ID do usuario
function cancelarEdicao(id) {
   document.getElementById(`user-${id}`).style.display = "inline";
   document.getElementById(`edit-${id}`).style.display = "none";
   document.getElementById(`salvar-${id}`).style.display = "none";
   document.getElementById(`cancelar-${id}`).style.display = "none";
}

// Salvar edição do usuário
function salvarEdicao(id) {
   console.log("EDITAR")
   const novoNome = document.getElementById(`edit-${id}`).value;
   if (!novoNome) return;

   // Recebe o conteudo da API para ser inserido e envia para o SERVIDOR 
   fetch(`${API_URL}/${id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ nome: novoNome })
   })
   .then(() => carregarUsuarios() )
   .catch(error => console.error('Erro ao editar usuário:', error));
}

// Excluir usuário
function excluirUsuario(id) {
   console.log("EXCLUIR")
   if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
// Recebe o conteudo da API para ser inserido e envia para o SERVIDOR 
   fetch(`${API_URL}/${id}`, {
         method: 'DELETE'
   })
   .then(() => carregarUsuarios())
   .catch(error => console.error('Erro ao excluir usuário:', error));
}

// Carrega os usuários quando a página abre
carregarUsuarios();