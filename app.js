const firebaseConfig = {
   <script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAxjhzLPeqBqJ18S8m7lagxuvF9LX7OJks",
    authDomain: "boteco934-afc3f.firebaseapp.com",
    databaseURL: "https://boteco934-afc3f-default-rtdb.firebaseio.com",
    projectId: "boteco934-afc3f",
    storageBucket: "boteco934-afc3f.firebasestorage.app",
    messagingSenderId: "182023728304",
    appId: "1:182023728304:web:040a13bb6f61c9fff35f75",
    measurementId: "G-HWT2RYRMRQ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let carrinho = [];

// Monitorar Banco de Dados
db.ref('produtos').on('value', snapshot => {
    const produtos = snapshot.val();
    renderizar(produtos);
    atualizarAlertas(produtos);
});

function renderizar(produtos) {
    const grid = document.getElementById('grade-produtos');
    grid.innerHTML = '';
    for (let id in produtos) {
        let p = produtos[id];
        let isCritico = p.estoque <= 5;
        grid.innerHTML += `
            <div class="card ${isCritico ? 'alerta' : ''}" onclick="add('${id}', '${p.nome}', ${p.preco_venda})">
                <strong>${p.nome}</strong>
                <p>R$ ${p.preco_venda.toFixed(2)}</p>
                <small>Estoque: ${p.estoque}</small>
            </div>
        `;
    }
}

function add(id, nome, preco) {
    carrinho.push({ id, nome, preco });
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('carrinho-itens');
    const totalDisp = document.getElementById('total-valor');
    lista.innerHTML = '';
    let total = 0;
    carrinho.forEach(i => {
        total += i.preco;
        lista.innerHTML += `<div>${i.nome} - R$ ${i.preco.toFixed(2)}</div>`;
    });
    totalDisp.innerText = `R$ ${total.toFixed(2)}`;
}

function finalizarVenda() {
    if (carrinho.length === 0) return alert("Carrinho vazio!");
    carrinho.forEach(item => {
        const ref = db.ref('produtos/' + item.id + '/estoque');
        ref.transaction(atual => (atual || 0) - 1);
    });
    alert("Venda realizada!");
    carrinho = [];
    atualizarCarrinho();
}

function enviarWhatsApp() {
    let nome = prompt("Nome do Cliente:");
    if(!nome) return;
    let total = document.getElementById('total-valor').innerText;
    let msg = `Boteco 934 - Olá ${nome}!\nTotal: ${total}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
}

// Modal Funções
function abrirModal() { document.getElementById('modal-produto').style.display = 'flex'; }
function fecharModal() { document.getElementById('modal-produto').style.display = 'none'; }

function salvarProduto() {
    const nome = document.getElementById('nome-prod').value;
    const estoque = parseInt(document.getElementById('estoque-prod').value);
    const preco = parseFloat(document.getElementById('preco-prod').value);
    const categoria = document.getElementById('cat-prod').value;

    if (nome && estoque && preco) {
        db.ref('produtos').push({ nome, estoque, preco_venda: preco, categoria });
        fecharModal();
    }
}

function atualizarAlertas(produtos) {
    let criticos = 0;
    for (let id in produtos) if(produtos[id].estoque <= 5) criticos++;
    document.getElementById('status-estoque').innerText = criticos > 0 ? `⚠️ ${criticos} itens acabando` : '✅ Estoque OK';
}
