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
let mesaAtual = "1";
let clienteAtual = "";

// Carregar Produtos
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
                <small>Estoque: ${p.estoque}</small>
            </div>`;
    }
});

// Funções de Mesa e Cliente
function trocarMesa() {
    mesaAtual = document.getElementById('select-mesa').value;
    db.ref('mesas/' + mesaAtual).once('value', snap => {
        const dados = snap.val();
        clienteAtual = dados ? dados.cliente : "";
        carrinho = dados ? (dados.itens || []) : [];
        document.getElementById('cliente-nome').value = clienteAtual;
        atualizarCarrinho();
    });
}

function abrirMesa() {
    let nome = prompt("Digite o nome do cliente:");
    if(!nome) return;
    clienteAtual = nome;
    document.getElementById('cliente-nome').value = nome;
    db.ref('mesas/' + mesaAtual + '/cliente').set(nome);
}

function salvarCliente() {
    const nome = document.getElementById('c-nome').value;
    const fone = document.getElementById('c-fone').value;
    if(nome && fone) {
        db.ref('clientes_cadastrados/' + nome).set({ nome, telefone: fone });
        alert("Cliente Salvo!");
        fecharModalCliente();
    }
}

function add(id, nome, preco) {
    if(!clienteAtual) return alert("Abra a mesa com o nome do cliente primeiro!");
    carrinho.push({ id, nome, preco });
    db.ref('mesas/' + mesaAtual + '/itens').set(carrinho);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('carrinho-itens');
    lista.innerHTML = '';
    let total = 0;
    carrinho.forEach(i => {
        total += i.preco;
        lista.innerHTML += `<div>${i.nome} - R$ ${i.preco.toFixed(2)}</div>`;
    });
    document.getElementById('total-valor').innerText = `R$ ${total.toFixed(2)}`;
}

// WhatsApp Recibo
function enviarWhatsApp() {
    if(!clienteAtual) return alert("Abra a mesa primeiro!");
    db.ref('clientes_cadastrados/' + clienteAtual).once('value', snap => {
        const dados = snap.val();
        if(dados && dados.telefone) {
            let msg = `*Boteco 934*\n\nOlá ${clienteAtual}!\nTotal do consumo: ${document.getElementById('total-valor').innerText}\n\nObrigado!🍻`;
            window.open(`https://wa.me/${dados.telefone}?text=${encodeURIComponent(msg)}`);
        } else {
            alert("Cliente não cadastrado ou sem telefone!");
        }
    });
}

// Fechamento de Venda
function finalizarVenda() {
    const metodo = document.getElementById('metodo-pagamento').value;
    const total = document.getElementById('total-valor').innerText;

    if(metodo === "Pendura") {
        db.ref('fiado').push({ cliente: clienteAtual, valor: total, data: new Date().toLocaleDateString() });
    }

    carrinho.forEach(item => {
        db.ref('produtos/' + item.id + '/estoque').transaction(a => (a || 0) - 1);
    });

    db.ref('mesas/' + mesaAtual).remove();
    alert("Venda Finalizada!");
    location.reload();
}

// Auxiliares (Modais)
function abrirModalPagamento() { document.getElementById('modal-pagamento').style.display = 'flex'; }
function fecharModalPagamento() { document.getElementById('modal-pagamento').style.display = 'none'; }
function abrirModalCliente() { document.getElementById('modal-cliente').style.display = 'flex'; }
function fecharModalCliente() { document.getElementById('modal-cliente').style.display = 'none'; }
function abrirModalProd() { document.getElementById('modal-produto').style.display = 'flex'; }
function fecharModalProd() { document.getElementById('modal-produto').style.display = 'none'; }
function salvarProduto() {
    const n = document.getElementById('p-nome').value;
    const e = parseInt(document.getElementById('p-estoque').value);
    const p = parseFloat(document.getElementById('p-preco').value);
    if(n && e && p) { db.ref('produtos').push({ nome: n, estoque: e, preco_venda: p }); fecharModalProd(); }
}
