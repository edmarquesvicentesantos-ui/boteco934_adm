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

// LISTA DE PRODUTOS COM CATEGORIAS
const produtos = [
    { id: 1, cat: "Cervejas", nome: "Skol Lata", preco: 6.00 },
    { id: 2, cat: "Cervejas", nome: "Heineken LN", preco: 10.00 },
    { id: 3, cat: "Refrigerantes", nome: "Coca-Cola", preco: 5.00 },
    { id: 4, cat: "Petiscos", nome: "Calabresa", preco: 15.00 },
    { id: 5, cat: "Petiscos", nome: "Batata Frita", preco: 12.00 },
    { id: 6, cat: "Doses", nome: "Pitu", preco: 3.00 },
    { id: 7, cat: "Doses", nome: "Old Eight", preco: 8.00 }
];

let carrinho = [];

// FUNÇÃO PARA FILTRAR
function filtrar(categoria) {
    // Atualiza visual das abas
    document.querySelectorAll('#menu-categorias button').forEach(btn => {
        btn.classList.remove('aba-ativa');
        if(btn.innerText.toLowerCase() === categoria.toLowerCase() || (categoria === 'Tudo' && btn.innerText === 'TUDO')) {
            btn.classList.add('aba-ativa');
        }
    });

    const lista = document.getElementById('lista-produtos');
    const produtosFiltrados = categoria === "Tudo" ? produtos : produtos.filter(p => p.cat === categoria);

    lista.innerHTML = produtosFiltrados.map(p => `
        <button onclick="adicionarItem(${p.id})" class="flex items-stretch bg-white rounded-xl shadow-sm overflow-hidden border border-gray-300 active:scale-95 transition-all w-full text-left">
            <div class="tarja-botao flex-1 p-2 flex flex-col justify-center">
                <div class="text-white font-bold leading-tight fonte-13">${p.nome}</div>
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
    lista.innerHTML = carrinho.map((item, index) => `
        <div class="flex justify-between items-center bg-gray-50 p-2 rounded-lg border-l-4 border-blue-900 mb-1">
            <span class="text-[11px] font-bold">${item.nome}</span>
            <span class="text-[11px] font-black">R$ ${item.preco.toFixed(2)}</span>
        </div>
    `).join('');
    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    totalTxt.innerText = `R$ ${total.toFixed(2)}`;
}

async function finalizarVenda() {
    if (carrinho.length === 0) return;
    const totalVenda = carrinho.reduce((sum, item) => sum + item.preco, 0);
    try {
        await db.collection("vendas").add({
            data: new Date().toLocaleString("pt-BR"),
            valor: totalVenda,
            metodo: "PIX",
            local: "Boteco 934"
        });
        alert("Venda enviada!");
        carrinho = [];
        atualizarCarrinho();
    } catch (e) { alert("Erro: " + e); }
}

// Inicializa
filtrar('Tudo');
