// CONFIGURAÇÃO FIREBASE (Substitua pelos seus dados do console)
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "boteco934.firebaseapp.com",
    databaseURL: "https://boteco934-default-rtdb.firebaseio.com",
    projectId: "boteco934",
    storageBucket: "boteco934.appspot.com",
    messagingSenderId: "ID_AQUI",
    appId: "APP_ID_AQUI"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let carrinho = [];

// Escutar Produtos do Firebase em Tempo Real
db.ref('produtos').on('value', (snapshot) => <script type="module">
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
    const produtos = snapshot.val();
    renderizarProdutos(produtos);
    verificarEstoqueCritico(produtos);
});

function renderizarProdutos(produtos) {
    const grid = document.getElementById('grade-produtos');
    grid.innerHTML = '';
    
    for (let id in produtos) {
        let p = produtos[id];
        let alertaClass = p.estoque <= 5 ? 'alerta' : '';
        
        grid.innerHTML += `
            <div class="card ${alertaClass}" onclick="adicionarAoCarrinho('${id}', '${p.nome}', ${p.preco_venda})">
                <strong>${p.nome}</strong>
                <p>R$ ${p.preco_venda.toFixed(2)}</p>
                <small>Estoque: ${p.estoque}</small>
            </div>
        `;
    }
}

function verificarEstoqueCritico(produtos) {
    let criticos = 0;
    for (let id in produtos) {
        if (produtos[id].estoque <= 5) criticos++;
    }
    const statusBox = document.getElementById('status-estoque');
    statusBox.innerHTML = criticos > 0 ? `⚠️ ${criticos} itens acabando!` : '✅ Estoque OK';
    statusBox.style.color = criticos > 0 ? '#ff4444' : '#28a745';
}

function adicionarAoCarrinho(id, nome, preco) {
    carrinho.push({ id, nome, preco });
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('carrinho-itens');
    const totalDisplay = document.getElementById('total-valor');
    lista.innerHTML = '';
    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;
        lista.innerHTML += `<div class="item-carrinho">${item.nome} - R$ ${item.preco.toFixed(2)}</div>`;
    });

    totalDisplay.innerText = `R$ ${total.toFixed(2)}`;
}

function enviarExtratoWhatsApp() {
    let nomeCliente = prompt("Nome do Cliente:");
    if (!nomeCliente) return;

    let total = document.getElementById('total-valor').innerText;
    let mensagem = `Olá ${nomeCliente}, aqui está seu extrato do Boteco 934:\n`;
    carrinho.forEach(i => mensagem += `- ${i.nome}: R$ ${i.preco.toFixed(2)}\n`);
    mensagem += `*Total: ${total}*`;

    let encoded = encodeURIComponent(mensagem);
    window.open(`https://wa.me/?text=${encoded}`);
}
