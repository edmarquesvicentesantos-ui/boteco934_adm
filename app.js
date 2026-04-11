// Configuração Oficial do seu Boteco 934
const firebaseConfig = {
    apiKey: "AIzaSyAxjhzLPeqBqJ18S8m7lagxuvF9LX70Jks",
    authDomain: "boteco934-afc3f.firebaseapp.com",
    databaseURL: "https://boteco934-afc3f-default-rtdb.firebaseio.com",
    projectId: "boteco934-afc3f",
    storageBucket: "boteco934-afc3f.firebasestorage.app",
    messagingSenderId: "182023728304",
    appId: "1:182023728304:web:040a13bb6f61c9fff35f75"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let carrinho = [];

// Funções de Interface (Abre e Fecha Janelas)
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }

// Cadastro de Produtos
function salvarProduto() {
    const nome = document.getElementById('p-nome').value;
    const preco = parseFloat(document.getElementById('p-preco').value);
    if(nome && preco) {
        db.ref('produtos').push({ nome, preco_venda: preco });
        alert("Produto Salvo!");
        fecharModal('modal-produto');
    }
}

// Carrega os produtos na tela automaticamente
db.ref('produtos').on('value', snap => {
    const grid = document.getElementById('grade-produtos');
    grid.innerHTML = '';
    snap.forEach(item => {
        let p = item.val();
        grid.innerHTML += `<div class="card-produto" onclick="addCarrinho('${p.nome}', ${p.preco_venda})">
            <strong>${p.nome}</strong><br>R$ ${p.preco_venda.toFixed(2)}</div>`;
    });
});

// Lógica de Venda
function addCarrinho(nome, preco) {
    const cliente = document.getElementById('cliente-nome').value;
    if(!cliente) return alert("Por favor, digite o nome do cliente primeiro!");
    carrinho.push({ nome, preco });
    atualizarTela();
}

function atualizarTela() {
    const lista = document.getElementById('carrinho-itens');
    lista.innerHTML = ''; let total = 0;
    carrinho.forEach(i => { total += i.preco; lista.innerHTML += `<div>${i.nome} - R$ ${i.preco.toFixed(2)}</div>`; });
    document.getElementById('total-valor').innerText = total.toFixed(2);
}

function finalizarVenda() {
    const met = document.getElementById('metodo').value;
    const total = parseFloat(document.getElementById('total-valor').innerText);
    db.ref('vendas_gerais').push({ total, metodo: met, data: new Date().toLocaleString() });
    alert("Venda encerrada!");
    location.reload();
}
