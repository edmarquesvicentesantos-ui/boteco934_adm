// ... (mantenha sua FirebaseConfig aqui)

const produtos = [
    { id: 1, cat: "Cervejas", nome: "CERVEJA LATA", preco: 6.00 },
    { id: 2, cat: "Cervejas", nome: "HEINEKEN LN", preco: 10.00 },
    { id: 3, cat: "Petiscos", nome: "ESPETINHO", preco: 8.00 },
    { id: 4, cat: "Petiscos", nome: "CALABRESA", preco: 15.00 }
];

let carrinho = [];

function filtrar(categoria) {
    const lista = document.getElementById('lista-produtos');
    const filtrados = categoria === "Tudo" ? produtos : produtos.filter(p => p.cat === categoria);
    lista.innerHTML = filtrados.map(p => `
        <button onclick="adicionarItem(${p.id})" class="bg-white border rounded-lg overflow-hidden flex active:scale-95">
            <div class="tarja-botao w-full p-2 text-left">
                <div class="text-white font-bold fonte-13">${p.nome}</div>
                <div class="text-blue-200 fonte-13">R$ ${p.preco.toFixed(2)}</div>
            </div>
        </button>
    `).join('');
}

function adicionarItem(id) {
    const prod = produtos.find(p => p.id === id);
    // Verifica se já tem o item no carrinho para somar quantidade
    const existente = carrinho.find(item => item.id === id);
    if (existente) {
        existente.qtd += 1;
    } else {
        carrinho.push({ ...prod, qtd: 1 });
    }
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('itens-venda');
    const totalTxt = document.getElementById('valor-total');
    const dataTxt = document.getElementById('data-recibo');
    
    dataTxt.innerText = new Date().toLocaleString("pt-BR");

    lista.innerHTML = carrinho.map((item, index) => `
        <div class="flex justify-between border-b border-gray-100 pb-1">
            <span class="w-1/2 uppercase">${index + 1}. ${item.nome}</span>
            <span class="w-1/4 text-right">${item.qtd}x${item.preco.toFixed(2)}</span>
            <span class="w-1/4 text-right font-bold">${(item.qtd * item.preco).toFixed(2)}</span>
        </div>
    `).join('');

    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.qtd), 0);
    totalTxt.innerText = total.toFixed(2);
}

// ... (mantenha a função finalizarVenda anterior)

filtrar('Tudo');
