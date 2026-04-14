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
let financeiro = JSON.parse(localStorage.getItem('boteco_fin')) || { DINHEIRO: 0, PIX: 0, CARTAO: 0 };
let historico = JSON.parse(localStorage.getItem('boteco_his')) || [];

function ver(id, btn) {
    document.querySelectorAll('.tela').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).style.display = 'flex';
    btn.classList.add('active');
    if(id === 'financas') renderCaixa();
}

// ATUALIZE sua função fecharConta para perguntar o método:
function fecharConta() {
    const m = mesas.find(x => x.id === mesaAtiva);
    if(!m || m.total === 0) return alert("Mesa vazia!");

    const opcao = prompt("FORMA DE PAGAMENTO:\n1 - Dinheiro\n2 - PIX\n3 - Cartão");
    let metodo = "";
    if(opcao === "1") metodo = "DINHEIRO";
    else if(opcao === "2") metodo = "PIX";
    else if(opcao === "3") metodo = "CARTAO";
    else return alert("Venda cancelada!");

    // Soma no caixa e guarda histórico
    financeiro[metodo] += m.total;
    historico.push({ h: new Date().toLocaleTimeString(), info: `Mesa ${m.id}`, v: m.total, m: metodo });
    
    localStorage.setItem('boteco_fin', JSON.stringify(financeiro));
    localStorage.setItem('boteco_his', JSON.stringify(historico));

    m.total = 0; m.consumo = {}; m.status = 'livre'; mesaAtiva = null;
    alert("Venda enviada ao caixa!");
    render(); attCar();
}

function renderCaixa() {
    const resumo = document.getElementById('caixa-resumo');
    resumo.innerHTML = `
        <div style="flex:1; background:white; padding:15px; border-bottom:5px solid #27ae60; border-radius:10px; text-align:center;">
            <h4>DINHEIRO</h4><h2 style="color:#27ae60">R$ ${financeiro.DINHEIRO.toFixed(2)}</h2>
        </div>
        <div style="flex:1; background:white; padding:15px; border-bottom:5px solid #3498db; border-radius:10px; text-align:center;">
            <h4>PIX</h4><h2 style="color:#3498db">R$ ${financeiro.PIX.toFixed(2)}</h2>
        </div>
        <div style="flex:1; background:white; padding:15px; border-bottom:5px solid #f1c40f; border-radius:10px; text-align:center;">
            <h4>CARTÃO</h4><h2 style="color:#f1c40f">R$ ${financeiro.CARTAO.toFixed(2)}</h2>
        </div>
    `;
    document.getElementById('historico-corpo').innerHTML = historico.map(v => `
        <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px;">${v.h}</td>
            <td style="padding:10px;">${v.info}</td>
            <td style="padding:10px;">R$ ${v.v.toFixed(2)}</td>
            <td style="padding:10px;"><b>${v.m}</b></td>
        </tr>`).reverse().join('');
}

function limparTudo() {
    if(confirm("Zerar o financeiro?")) {
        localStorage.removeItem('boteco_fin'); localStorage.removeItem('boteco_his');
        location.reload();
    }
}
