// Função para abrir o painel de vendas da mesa
function verDetalhes(id) {
    mesaSelecionada = id;
    const mesa = mesas.find(m => m.id === id);
    
    document.getElementById('titulo-mesa-ativa').innerText = `Lançar para: ${mesa.cliente}`;
    document.getElementById('modal-lancamento').style.display = 'flex';
    
    exibirProdutosParaVenda();
    atualizarListaConsumo(mesa);
}

// Exibe os produtos como cards pequenos para agilizar
function exibirProdutosParaVenda() {
    const container = document.getElementById('lista-produtos-lancamento');
    // Usando a lista de 'produtos' que definimos anteriormente
    container.innerHTML = produtos.map(p => `
        <div class="card-mini" onclick="adicionarItemAMesa(${p.id})">
            <span>${p.nome}</span>
            <strong>R$ ${(p.custo * (1 + p.markup/100)).toFixed(2)}</strong>
        </div>
    `).join('');
}

function adicionarItemAMesa(produtoId) {
    const mesa = mesas.find(m => m.id === mesaSelecionada);
    const produto = produtos.find(p => p.id === produtoId);
    const precoVenda = produto.custo * (1 + produto.markup/100);

    mesa.total += precoVenda;
    mesa.pedidos.push(produto.nome); // Registra o que foi consumido

    // Atualiza a visualização
    atualizarListaConsumo(mesa);
    renderizarMesas(); // Atualiza o valor no painel principal
}

function atualizarListaConsumo(mesa) {
    const lista = document.getElementById('itens-consumidos');
    lista.innerHTML = mesa.pedidos.map(item => `<li>${item}</li>`).join('');
}

function fecharModalLancamento() {
    document.getElementById('modal-lancamento').style.display = 'none';
}
