const firebaseConfig = {
    apiKey: "AIzaSyAxjhzLPeqBqJ18S8m7lagxuvF9LX7OJks",
    authDomain: "boteco934-afc3f.firebaseapp.com",
    projectId: "boteco934-afc3f",
    storageBucket: "boteco934-afc3f.firebasestorage.app",
    messagingSenderId: "182023728304",
    appId: "1:182023728304:web:040a13bb6f61c9fff35f75"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// LISTA DE PRODUTOS (Você pode adicionar mais aqui)
const produtos = [
    { id: 1, nome: "Cerveja Lata", preco: 6.00, foto: "https://cdn-icons-png.flaticon.com/512/931/931949.png" },
    { id: 2, nome: "Cerveja 600ml", preco: 12.00, foto: "https://cdn-icons-png.flaticon.com/512/931/931949.png" },
    { id: 3, nome: "Espetinho", preco: 8.00, foto: "https://cdn-icons-png.flaticon.com/512/1046/1046769.png" },
    { id: 4, nome: "Dose Caninha", preco: 3.50, foto: "https://cdn-icons-png.flaticon.com/512/920/920610.png" },
    { id: 5, nome: "Refrigerante", preco: 5.00, foto: "https://cdn-icons-png.flaticon.com/512/2722/2722527.png" }
];

let carrinho = [];

// FUNÇÃO PARA GERAR OS BOTÕES COM TARJA E FONTE 13
function carregarProdutos() {
    const grid = document.getElementById('lista-produtos');
    grid.innerHTML = produtos.map(p => `
        <button onclick="adicionarItem(${p.id})" class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 active:scale-95 transition-all">
            <div class="h-14 flex items-center justify-center p-2 bg-gray-50">
                <img src="${p.foto}" class="h-full object-contain opacity-50">
            </div>
            <div class="tarja-botao p-2 text-left">
                <div class="text-white font-bold leading-tight truncate fonte-13">${p.nome}</div>
                <div class="text-blue-200 font-medium fonte-13">R$ ${p.preco.toFixed(2)}</div>
            </div>
        </button>
    `).join('');
}

function adicionarItem(id) {
    const prod = produtos.find(p => p.id === id);
    carrinho.push(prod);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('itens-venda');
    const totalTxt = document.getElementById('valor-total');
    
    if (carrinho.length === 0) {
        lista.innerHTML = '<p class="text-gray-400 text-sm italic text-center">Nenhum item selecionado</p>';
        totalTxt.innerText = 'R$ 0,00';
        return;
    }

    lista.innerHTML = carrinho.map((item, index) => `
        <div class="flex justify-between items-center bg-gray-50 p-2 rounded-lg border-l-4 border-blue-900">
            <span class="text-xs font-bold">${item.nome}</span>
            <span class="text-xs font-black text-blue-900">R$ ${item.preco.toFixed(2)}</span>
        </div>
    `).join('');

    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    totalTxt.innerText = `R$ ${total.toFixed(2)}`;
}

async function finalizarVenda() {
    if (carrinho.length === 0) return alert("Adicione itens primeiro!");
    
    const totalVenda = carrinho.reduce((sum, item) => sum + item.preco, 0);

    try {
        await db.collection("vendas").add({
            data: new Date().toLocaleString("pt-BR"),
            valor: totalVenda,
            itens: carrinho.length,
            metodo: "PIX",
            local: "Boteco 934"
        });
        
        alert("Venda enviada ao Monitor!");
        carrinho = [];
        atualizarCarrinho();
    } catch (e) {
        alert("Erro ao salvar: " + e);
    }
}

carregarProdutos();
