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

// Controla o abre e fecha das janelas
function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }

function salvarProduto() {
    const nome = document.getElementById('p-nome').value;
    const preco = parseFloat(document.getElementById('p-preco').value);
    if(nome && preco) {
        db.ref('produtos').push({ nome, preco });
        alert("Produto Gravado!");
        fecharModal('modal-produto');
    }
}

// Carrega os produtos na tela
db.ref('produtos').on('value', snap => {
    const grid = document.getElementById('grade-produtos');
    grid.innerHTML = '';
    snap.forEach(item => {
        let p = item.val();
        grid.innerHTML += `<div class="card-p" style="background:white;padding:15px;border-radius:8px;text-align:center;cursor:pointer;border:1px solid #ccc">
            <b>${p.nome}</b><br>R$ ${p.preco.toFixed(2)}</div>`;
    });
});
