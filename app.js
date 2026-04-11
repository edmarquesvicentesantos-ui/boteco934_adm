// Configuração do seu Firebase
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

// --- FUNÇÕES DE ABRIR E FECHAR (Destrava a tela) ---
function abrirModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function fecharModal(id) {
    document.getElementById(id).style.display = 'none';
}

// --- LANÇAR NOTA (Conferência de Distribuidor) ---
function confirmarNota() {
    const prod = document.getElementById('nota-prod').value;
    const qtd = parseFloat(document.getElementById('nota-qtd').value);
    const custo = parseFloat(document.getElementById('nota-custo').value);

    if(prod && qtd && custo) {
        db.ref('historico_notas').push({
            produto: prod,
            quantidade: qtd,
            custo_unitario: custo,
            data: new Date().toLocaleString()
        });
        alert("Nota lançada! Estoque atualizado.");
        fecharModal('modal-nota');
    }
}

// --- FINANÇAS (Dinheiro, PIX, Cartão e Pendura) ---
function abrirModalFinanceiro() {
    abrirModal('modal-financeiro');
    let totais = { Dinheiro: 0, PIX: 0, Pendura: 0 };

    db.ref('vendas_gerais').once('value', snap => {
        snap.forEach(venda => {
            const v = venda.val();
            if(totais[v.metodo] !== undefined) totais[v.metodo] += v.total;
        });
        document.getElementById('f-dinheiro').innerText = `R$ ${totais.Dinheiro.toFixed(2)}`;
        document.getElementById('f-pix').innerText = `R$ ${totais.PIX.toFixed(2)}`;
        document.getElementById('f-pendura').innerText = `R$ ${totais.Pendura.toFixed(2)}`;
    });
}
