// ... (mantenha sua FirebaseConfig aqui no topo igual ao anterior)

// FUNÇÃO ATUALIZADA PARA BOTÕES LATERAIS COM TARJA
function carregarProdutos() {
    const grid = document.getElementById('lista-produtos');
    grid.innerHTML = produtos.map(p => `
        <button onclick="adicionarItem(${p.id})" class="flex items-stretch bg-white rounded-xl shadow-sm overflow-hidden border border-gray-300 active:scale-95 transition-all w-full text-left">
            <div class="w-16 h-16 bg-gray-50 flex items-center justify-center p-2">
                <img src="${p.foto}" class="w-full object-contain">
            </div>
            <div class="tarja-botao flex-1 p-2 flex flex-col justify-center">
                <div class="text-white font-bold leading-tight fonte-13">${p.nome}</div>
                <div class="text-blue-200 font-medium fonte-13">R$ ${p.preco.toFixed(2)}</div>
            </div>
        </button>
    `).join('');
}

// ... (mantenha o restante das funções adicionarItem, atualizarCarrinho e finalizarVenda do código anterior)
