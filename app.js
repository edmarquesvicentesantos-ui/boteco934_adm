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
let carrinho = [];
let mesaAtual = "1";
let clienteAtual = "";

// Função para abrir qualquer modal
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }

// Função para fechar qualquer modal e DESTRAVAR a tela
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }

// Carregar Produtos na Tela
db.ref('produtos').on('value', snap => {
    const prods = snap.val();
    const grid = document.getElementById('grade-produtos');
    grid.innerHTML = '';
    for(let id in prods) {
        let p = prods[id];
        grid.innerHTML += `
            <div class="card" onclick="add('${id}', '${p.nome}', ${p.preco_venda})">
                <strong>${p.nome}</strong><br>
                <span>R$ ${p.preco_venda.toFixed(2)}</span><br>
                <small>Estoque: ${p.estoque || 0}</small>
            </div>`;
    }
});

// Funções de Mesa
function trocarMesa() {
    mesaAtual = document.getElementById('select-mesa').value;
    db.ref('mesas/' + mesaAtual).once('value', snap => {
        const dados = snap.val();
        clienteAtual = dados ? dados.cliente : "";
        carrinho = dados ? (dados.itens || []) : [];
        document.getElementById('cliente-nome').value = clienteAtual || "Mesa Vazia";
        atualizarCarrinho();
    });
}

function abrirMesa() {
    let nome = prompt("Nome do Cliente para esta mesa:");
    if(!nome) return;
    clienteAtual = nome;
    document.getElementById('cliente-nome').value = nome;
    db.ref('mesas/' + mesaAtual + '/cliente').set(nome);
}

function add(id, nome, preco) {
    if(!clienteAtual) return alert("Abra a mesa primeiro!");
    carrinho.push({ id, nome, preco });
    db.ref('mesas/' + mesaAtual + '/itens').set(carrinho);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('carrinho-itens');
    lista.innerHTML = '';
    let total = 0;
    carrinho.forEach(i => { total += i.preco; lista.innerHTML += `<div>${i.nome} - R$ ${i.preco.toFixed(2)}</div>`; });
    document.getElementById('total-valor').innerText = `R$ ${total.toFixed(2)}`;
}

// Financeiro e Fechamento
function abrirModalFinanceiro() {
    abrirModal('modal-financeiro');
    let totais = { Dinheiro: 0, PIX: 0, "Cartão Débito": 0, "Cartão Crédito": 0, Pendura: 0 };
    db.ref('vendas_gerais').once('value', snap => {
        snap.forEach(venda => {
            const v = venda.val();
            if(totais[v.metodo] !== undefined) totais[v.metodo] += v.total;
        });
        document.getElementById('f-dinheiro').innerText = `R$ ${totais.Dinheiro.toFixed(2)}`;
        document.getElementById('f-pix').innerText = `R$ ${totais.PIX.toFixed(2)}`;
        document.getElementById('f-debito').innerText = `R$ ${totais["Cartão Débito"].toFixed(2)}`;
        document.getElementById('f-credito').innerText = `R$ ${totais["Cartão Crédito"].toFixed(2)}`;
        document.getElementById('f-pendura').innerText = `R$ ${totais.Pendura.toFixed(2)}`;
    });
}

function finalizarVenda() {
    const metodo = document.getElementById('metodo-pagamento').value;
    const total = parseFloat(document.getElementById('total-valor').innerText.replace('R$ ', ''));

    db.ref('vendas_gerais').push({ cliente: clienteAtual, total, metodo, data: new Date().toLocaleString() });

    if(metodo === "Pendura") {
        db.ref('fiado').push({ cliente: clienteAtual, valor: total, data: new Date().toLocaleDateString() });
    }

    // Baixa de estoque simplificada
    carrinho.forEach(item => {
        db.ref('produtos/' + item.id + '/estoque').transaction(a => (a || 0) - 1);
    });

    db.ref('mesas/' + mesaAtual).remove();
    alert("Venda encerrada!");
    location.reload();
}

// Cadastro de Cliente
function salvarCliente() {
    const nome = document.getElementById('c-nome').value;
    const fone = document.getElementById('c-fone').value;
    if(nome && fone) {
        db.ref('clientes_cadastrados/' + nome).set({ nome, telefone: fone });
        alert("Cliente Salvo!");
        fecharModal('modal-cliente');
    }
}
