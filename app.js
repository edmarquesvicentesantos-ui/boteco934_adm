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
        alert("Salvo!");
        fecharModal('modal-produto');
    }
}

db.ref('produtos').on('value', snap => {
    const grid = document.getElementById('grade-produtos');
    grid.innerHTML = '';
    snap.forEach(item => {
        let p = item.val();
        grid.innerHTML += `<div class="item-card" onclick="add('${p.nome}', ${p.preco})"><b>${p.nome}</b><br>R$ ${p.preco.toFixed(2)}</div>`;
    });
});

function add(nome, preco) {
    if(!document.getElementById('cliente-nome').value) return alert("Dê nome ao cliente!");
    carrinho.push({ nome, preco });
    renderCarrinho();
}

function renderCarrinho() {
    let t = 0; document.getElementById('lista-carrinho').innerHTML = '';
    carrinho.forEach(i => { t += i.preco; document.getElementById('lista-carrinho').innerHTML += `<div>${i.nome}</div>`; });
    document.getElementById('valor-total').innerText = t.toFixed(2);
}

function fecharVenda() {
    const total = parseFloat(document.getElementById('valor-total').innerText);
    db.ref('vendas').push({ total, data: new Date().toLocaleString() });
    alert("Venda Fechada!");
    location.reload();
}
