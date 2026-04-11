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
let clienteAtual = "";

function salvarCliente() {
    const nome = document.getElementById('c-nome').value;
    const fone = document.getElementById('c-fone').value;
    if(nome && fone) {
        db.ref('clientes_cadastrados/' + nome).set({ nome, telefone: fone });
        alert("Cliente Salvo!");
        fecharModalCliente();
    }
}

function enviarWhatsApp() {
    if(!clienteAtual) return alert("Selecione um cliente!");
    db.ref('clientes_cadastrados/' + clienteAtual).once('value', snap => {
        const dados = snap.val();
        if(dados && dados.telefone) {
            let msg = `*Boteco 934*\nOlá ${clienteAtual}!\nTotal: ${document.getElementById('total-valor').innerText}`;
            window.open(`https://wa.me/${dados.telefone}?text=${encodeURIComponent(msg)}`);
        } else {
            alert("Telefone não encontrado para este cliente!");
        }
    });
}

// Mantenha as outras funções (trocarMesa, abrirMesa, finalizarVenda) conforme passadas anteriormente.
