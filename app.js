// Configuração do Firebase corrigida conforme sua imagem
const firebaseConfig = {
    apiKey: "AIzaSyAxjhzLPeqBqJ18S8m7lagxuvF9LX70Jks", // Sua chave
    databaseURL: "https://boteco934-afc3f-default-rtdb.firebaseio.com",
    projectId: "boteco934-afc3f",
    // ... complete com os outros dados do seu projeto
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- FUNÇÃO QUE ABRE AS JANELAS ---
function abrirModal(id) {
    document.getElementById(id).style.display = 'flex';
}

// --- FUNÇÃO QUE FECHA AS JANELAS ---
function fecharModal(id) {
    document.getElementById(id).style.display = 'none';
}

// --- SALVAR PRODUTO ---
function salvarProduto() {
    const nome = document.getElementById('p-nome').value;
    const preco = parseFloat(document.getElementById('p-preco').value);
    if(nome && preco) {
        db.ref('produtos').push({ nome, preco_venda: preco });
        alert("Produto salvo!");
        fecharModal('modal-produto');
    }
}
