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

function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }

function salvarProduto() {
    const nome = document.getElementById('p-nome').value;
    const preco = parseFloat(document.getElementById('p-preco').value);
    if(nome && preco) {
        db.ref('produtos').push({ nome, preco });
        alert("Salvo!"); fecharModal('modal-produto');
    }
}

// Carrega os produtos na grade
db.ref('produtos').on('value', snap => {
    const grid = document.getElementById('grade-produtos');
    grid.innerHTML = '';
    snap.forEach(item => {
        let p = item.val();
        grid.innerHTML += `<div class="card-prod" onclick="addCarrinho('${p.nome}', ${p.preco})">
            <strong>${p.nome}</strong><br>R$ ${p.preco.toFixed(2)}</div>`;
    });
});

function addCarrinho(nome, preco) {
    if(!document.getElementById('cliente-nome').value) return alert("Digite o nome do cliente!");
    carrinho.push({ nome, preco });
    atualizarConsumo();
}

function atualizarConsumo() {
    let t = 0; document.getElementById('lista-carrinho').innerHTML = '';
    carrinho.forEach(i => { t += i.preco; document.getElementById('lista-carrinho').innerHTML += `<div>${i.nome}</div>`; });
    document.getElementById('total-venda').innerText = t.toFixed(2);
}

function finalizarVenda() {
    const met = document.getElementById('metodo-final').value;
    const total = parseFloat(document.getElementById('total-venda').innerText);
    db.ref('vendas_realizadas').push({ total, metodo: met, data: new Date().toLocaleString() });
    alert("Venda encerrada!"); location.reload();
}
