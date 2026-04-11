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

// Finalizar Venda Separando por Tipo de Pagamento
function finalizarVenda() {
    const metodo = document.getElementById('metodo-pagamento').value;
    const totalStr = document.getElementById('total-valor').innerText.replace('R$ ', '');
    const total = parseFloat(totalStr);

    const vendaData = {
        cliente: clienteAtual,
        total: total,
        metodo: metodo,
        data: new Date().toLocaleString(),
        timestamp: Date.now()
    };

    // Salva no financeiro
    db.ref('vendas_gerais').push(vendaData);

    // Se for pendura, entra na lista de cobrança
    if(metodo === "Pendura") {
        db.ref('fiado').push({ cliente: clienteAtual, valor: total, data: vendaData.data });
    }

    // Baixa de Estoque e Doses
    carrinho.forEach(item => {
        db.ref('produtos/' + item.id).once('value', snap => {
            const p = snap.val();
            if(p.tipo === 'dose') {
                // Baixa 50ml da garrafa principal vinculada
                db.ref('produtos/' + p.garrafa_id + '/estoque_ml').transaction(atual => (atual || 1000) - 50);
            } else {
                db.ref('produtos/' + item.id + '/estoque').transaction(a => (a || 0) - 1);
            }
        });
    });

    db.ref('mesas/' + mesaAtual).remove();
    alert("Venda Finalizada!");
    location.reload();
}

// Abrir Finanças e Calcular Totais
function abrirModalFinanceiro() {
    document.getElementById('modal-financeiro').style.display = 'flex';
    let totais = { Dinheiro: 0, PIX: 0, "Cartão Débito": 0, "Cartão Crédito": 0, Pendura: 0 };

    db.ref('vendas_gerais').once('value', snap => {
        snap.forEach(venda => {
            const v = venda.val();
            if(totais[v.metodo] !== undefined) {
                totais[v.metodo] += v.total;
            }
        });
        document.getElementById('f-dinheiro').innerText = `R$ ${totais.Dinheiro.toFixed(2)}`;
        document.getElementById('f-pix').innerText = `R$ ${totais.PIX.toFixed(2)}`;
        document.getElementById('f-debito').innerText = `R$ ${totais["Cartão Débito"].toFixed(2)}`;
        document.getElementById('f-credito').innerText = `R$ ${totais["Cartão Crédito"].toFixed(2)}`;
        document.getElementById('f-pendura').innerText = `R$ ${totais.Pendura.toFixed(2)}`;
    });
}
