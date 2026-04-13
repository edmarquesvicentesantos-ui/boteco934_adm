// --- FUNÇÃO PARA ABRIR MESA COM NOME ---
function selecionarMesa(id) {
    mesaAtiva = db.mesas.find(m => m.id === id);
    
    // Se a mesa estiver vazia, pergunta o nome do cliente
    if (!mesaAtiva.ocupada) {
        let nomeCliente = prompt("Quem está ocupando a Mesa " + id + "?");
        if (!nomeCliente) return; // Cancela se não digitar nome
        mesaAtiva.cliente = nomeCliente.toUpperCase();
        mesaAtiva.ocupada = true;
    }
    
    render();
}

// --- RENDERIZAÇÃO ATUALIZADA (MOSTRA O NOME NA MESA) ---
function render() {
    // Render Mesas
    document.getElementById('containerMesas').innerHTML = db.mesas.map(m => `
        <div class="mesa-card ${m.ocupada ? 'ocupada' : ''}" onclick="selecionarMesa(${m.id})">
            <h3>MESA ${m.id}</h3>
            <p>${m.ocupada ? '👤 ' + m.cliente : 'Livre'}</p>
            <p><b>${m.ocupada ? 'R$ ' + m.total.toFixed(2) : ''}</b></p>
        </div>
    `).join('');

    // Atualiza o Título do Painel de Vendas
    if(mesaAtiva) {
        document.getElementById('txtMesa').innerHTML = `
            Mesa ${mesaAtiva.id} <br> 
            <small style="color:var(--gold)">Cliente: ${mesaAtiva.cliente}</small>
        `;
        
        // ... restante do código de renderização do carrinho (igual ao anterior)
        document.getElementById('cupomVirtual').innerHTML = `
            <select onchange="addNoPedido(this.value); this.value=''" style="width:100%; padding:10px; margin-bottom:15px; background:#000; color:#fff;">
                <option value="">+ ADICIONAR ITEM</option>
                ${db.estoque.map(p => `<option value="${p.nome}">${p.nome} (Sald: ${p.qtd})</option>`)}
            </select>
            ${mesaAtiva.itens.map(i => `<div class="item-linha"><span>${i.qtd}x ${i.nome}</span><b>R$ ${i.sub.toFixed(2)}</b></div>`).join('')}
        `;
        document.getElementById('valTotal').innerText = "R$ " + mesaAtiva.total.toFixed(2);
    }
    // ... restante da função render
}
