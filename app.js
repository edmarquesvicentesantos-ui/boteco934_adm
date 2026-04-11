const firebaseConfig = {
    apiKey: "AIzaSyAxjhzLPeqBqJ18S8m7lagxuvF9LX70Jks", // Sua chave
    authDomain: "boteco934-afc3f.firebaseapp.com",
    databaseURL: "https://boteco934-afc3f-default-rtdb.firebaseio.com",
    projectId: "boteco934-afc3f",
    storageBucket: "boteco934-afc3f.firebasestorage.app",
    messagingSenderId: "182023728304",
    appId: "1:182023728304:web:040a13bb6f61c9fff35f75"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let carrinho = []; let clienteAtual = "";

// Sistema de Janelas
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }

// Cadastro e Carregamento
function salvarProduto() {
    const nome = document.getElementById('p-nome').value;
    const preco = parseFloat(document.getElementById('p-preco').value);
    if(nome && preco) {
        db.ref('produtos').push({ nome, preco_venda: preco });
        alert("Produto Salvo!");
        fecharModal('modal-produto');
    }
}

db.ref('produtos').on('value', snap => {
    const grid = document.getElementById('grade-produtos');
    grid.innerHTML = '';
    snap.forEach(item => {
        let p = item.val();
        grid.innerHTML += `<div class="card" onclick="add('${p.nome}', ${p.preco_venda})">
            <strong>${p.nome}</strong><br>R$ ${p.preco_venda.toFixed(2)}</div>`;
    });
});

// Vendas
function add(nome, preco) {
    clienteAtual = document.getElementById('cliente-nome').value;
    if(!clienteAtual) return alert("Digite o nome do cliente antes!");
    carrinho.push({ nome, preco });
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('carrinho-itens');
    lista.innerHTML = ''; let t = 0;
    carrinho.forEach(i => { t += i.preco; lista.innerHTML += `<div>${i.nome} - R$ ${i.preco.toFixed(2)}</div>`; });
    document.getElementById('total-valor').innerText = t.toFixed(2);
}

function finalizarVenda() {
    const met = document.getElementById('metodo').value;
    const total = parseFloat(document.getElementById('total-valor').innerText);
    db.ref('vendas_gerais').push({ cliente: clienteAtual, total, metodo: met, data: new Date().toLocaleString() });
    alert("Venda encerrada com sucesso!");
    location.reload(); // Limpa tudo para a próxima venda
}

function abrirModalFinanceiro() {
    abrirModal('modal-financeiro');
    let t = { Dinheiro: 0, PIX: 0, Pendura: 0 };
    db.ref('vendas_gerais').once('value', snap => {
        snap.forEach(v => { const d = v.val(); if(t[d.metodo] !== undefined) t[d.metodo] += d.total; });
        document.getElementById('f-dinheiro').innerText = t.Dinheiro.toFixed(2);
        document.getElementById('f-pix').innerText = t.PIX.toFixed(2);
        document.getElementById('f-pendura').innerText = t.Pendura.toFixed(2);
    });
}
