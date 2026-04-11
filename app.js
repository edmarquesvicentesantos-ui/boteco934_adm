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

// --- SISTEMA DE JANELAS (DESTRAVA TUDO) ---
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }

// --- CADASTRO DE PRODUTO ---
function salvarProduto() {
    const nome = document.getElementById('p-nome').value;
    const preco = parseFloat(document.getElementById('p-preco').value);
    const estoque = parseInt(document.getElementById('p-estoque').value);
    const tipo = document.getElementById('p-tipo').value;
    if(nome && preco) {
        db.ref('produtos').push({ nome, preco_venda: preco, estoque, tipo });
        alert("Produto Salvo!");
        fecharModal('modal-produto');
    }
}

// --- CADASTRO DE CLIENTE ---
function salvarCliente() {
    const nome = document.getElementById('c-nome').value;
    const fone = document.getElementById('c-fone').value;
    if(nome && fone) {
        db.ref('clientes_cadastrados/' + nome).set({ nome, telefone: fone });
        alert("Cliente Salvo!");
        fecharModal('modal-cliente');
    }
}

// --- CARREGAR PRODUTOS ---
db.ref('produtos').on('value', snap => {
    const prods = snap.val();
    const grid = document.getElementById('grade-produtos');
    grid.innerHTML = '';
    for(let id in prods) {
        let p = prods[id];
        grid.innerHTML += `<div class="card" onclick="add('${id}', '${p.nome}', ${p.preco_venda})">
            <strong>${p.nome}</strong><br>R$ ${p.preco_venda.toFixed(2)}</div>`;
    }
});

// --- FUNÇÕES DE VENDA ---
function abrirMesa() {
    let n = prompt("Nome do Cliente:");
    if(n) { clienteAtual = n; document.getElementById('cliente-nome').value = n; db.ref('mesas/'+mesaAtual+'/cliente').set(n); }
}

function add(id, nome, preco) {
    if(!clienteAtual) return alert("Abra a mesa!");
    carrinho.push({ id, nome, preco });
    db.ref('mesas/'+mesaAtual+'/itens').set(carrinho);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('carrinho-itens');
    lista.innerHTML = ''; let t = 0;
    carrinho.forEach(i => { t += i.preco; lista.innerHTML += `<div>${i.nome}</div>`; });
    document.getElementById('total-valor').innerText = `R$ ${t.toFixed(2)}`;
}

function finalizarVenda() {
    const m = document.getElementById('metodo-pagamento').value;
    const t = parseFloat(document.getElementById('total-valor').innerText.replace('R$ ',''));
    db.ref('vendas_gerais').push({ cliente: clienteAtual, total: t, metodo: m, data: new Date().toLocaleString() });
    db.ref('mesas/'+mesaAtual).remove();
    alert("Venda Finalizada!");
    location.reload();
}

function abrirModalFinanceiro() {
    abrirModal('modal-financeiro');
    let totais = { Dinheiro: 0, PIX: 0, Pendura: 0 };
    db.ref('vendas_gerais').once('value', snap => {
        snap.forEach(v => {
            const dados = v.val();
            if(totais[dados.metodo] !== undefined) totais[dados.metodo] += dados.total;
        });
        document.getElementById('f-dinheiro').innerText = `R$ ${totais.Dinheiro.toFixed(2)}`;
        document.getElementById('f-pix').innerText = `R$ ${totais.PIX.toFixed(2)}`;
        document.getElementById('f-pendura').innerText = `R$ ${totais.Pendura.toFixed(2)}`;
    });
}
