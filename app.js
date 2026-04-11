const firebaseConfig = {
    apiKey: "AIzaSyAxjhzLPeqBqJ18S8m7lagxuvF9LX70Jks", // Sua chave real do print
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

// Escutar Produtos
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

// Gestão de Mesas
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
    let nome = prompt("Nome do Cliente:");
    if(!nome) return;
    clienteAtual = nome;
    document.getElementById('cliente-nome').value = nome;
    db.ref('mesas/' + mesaAtual + '/cliente').set(nome);
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

// Fechamento e Pagamento
function abrirModalPagamento() {
    if(carrinho.length === 0) return alert("Nada para cobrar!");
    document.getElementById('info-recibo').innerHTML = `Cliente: ${clienteAtual}<br>Mesa: ${mesaAtual}<br><b>Total: ${document.getElementById('total-valor').innerText}</b>`;
    document.getElementById('modal-pagamento').style.display = 'flex';
    calcularDivisao();
}

function calcularDivisao() {
    let totalStr = document.getElementById('total-valor').innerText.replace('R$ ', '');
    let total = parseFloat(totalStr);
    let pessoas = parseInt(document.getElementById('dividir-pessoas').value) || 1;
    document.getElementById('valor-dividido').innerText = `Fica R$ ${(total/pessoas).toFixed(2)} por pessoa`;
}

function finalizarVenda() {
    const metodo = document.getElementById('metodo-pagamento').value;
    const total = document.getElementById('total-valor').innerText;

    // Registrar Venda
    db.ref('vendas_gerais').push({ cliente: clienteAtual, mesa: mesaAtual, total, metodo, data: new Date().toLocaleString() });

    // Se for Pendura, vai para pasta Fiado
    if(metodo === "Pendura") {
        db.ref('fiado').push({ cliente: clienteAtual, valor: total, data: new Date().toLocaleDateString() });
    }

    // Baixar Estoque
    carrinho.forEach(item => {
        db.ref('produtos/' + item.id + '/estoque').transaction(atual => (atual || 0) - 1);
    });

    // Limpar Mesa
    db.ref('mesas/' + mesaAtual).remove();
    alert("Recibo Finalizado!");
    location.reload();
}

function fecharModalPagamento() { document.getElementById('modal-pagamento').style.display = 'none'; }
function abrirModalProd() { document.getElementById('modal-produto').style.display = 'flex'; }
function fecharModalProd() { document.getElementById('modal-produto').style.display = 'none'; }

function salvarProduto() {
    const nome = document.getElementById('p-nome').value;
    const estoque = parseInt(document.getElementById('p-estoque').value);
    const preco = parseFloat(document.getElementById('p-preco').value);
    const categoria = document.getElementById('p-cat').value;
    if(nome && estoque && preco) {
        db.ref('produtos').push({ nome, estoque, preco_venda: preco, categoria });
        fecharModalProd();
    }
}
