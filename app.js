// --- CONFIGURAÇÕES E ESTADO ---
const firebaseConfig = { /* Sua configuração aqui */ };
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let mesas = Array.from({length: 10}, (_, i) => ({ numero: i + 1, status: 'livre', itens: [], total: 0 }));
let mesaAtiva = null;
let produtos = []; // Carregado do Firebase ou XML
let saldoRestante = 0;
let vendedorAtivo = "Edmarques"; // Poderia ser um prompt inicial

// --- GESTÃO DE MESAS ---
function renderizarMesas() {
    const painel = document.getElementById('painel-mesas');
    if(!painel) return;
    painel.innerHTML = mesas.map(m => {
        const cor = m.status === 'ocupada' ? 'bg-red-600' : 'bg-green-600';
        const destaque = mesaAtiva === m.numero ? 'ring-4 ring-yellow-400 scale-105' : '';
        return `
            <button onclick="selecionarMesa(${m.numero})" class="${cor} ${destaque} p-3 rounded-xl text-white font-black transition-all shadow-md">
                MESA ${m.numero}
                <div class="text-[9px] font-normal">${m.status === 'ocupada' ? 'R$ '+m.total.toFixed(2) : 'LIVRE'}</div>
            </button>
        `;
    }).join('');
}

function selecionarMesa(num) {
    mesaAtiva = num;
    const mesa = mesas.find(m => m.numero === num);
    carrinho = mesa.itens;
    saldoRestante = mesa.total;
    renderizarMesas();
    atualizarCarrinho();
}

// --- LANÇAMENTO DE ITENS ---
function adicionarItem(id) {
    if (mesaAtiva === null) return alert("❌ SELECIONE UMA MESA!");
    
    const p = produtos.find(item => item.id === id);
    const mesa = mesas.find(m => m.numero === mesaAtiva);
    
    const index = mesa.itens.findIndex(i => i.id === id);
    if (index >= 0) mesa.itens[index].qtd += 1;
    else mesa.itens.push({ ...p, qtd: 1 });

    mesa.status = 'ocupada';
    mesa.total = mesa.itens.reduce((s, i) => s + (i.preco * i.qtd), 0);
    saldoRestante = mesa.total;
    
    renderizarMesas();
    atualizarCarrinho();
}

// --- FECHAMENTO E DIVISÃO (GOLD) ---
async function finalizarVenda() {
    if (!mesaAtiva || saldoRestante <= 0) return;
    
    const pagto = document.getElementById('forma-pagamento').value;
    const valor = parseFloat(prompt(`Valor no ${pagto} (Falta R$ ${saldoRestante.toFixed(2)}):`, saldoRestante.toFixed(2)));
    
    if (!valor || valor <= 0) return;

    let cliente = (pagto === "PENDURA") ? prompt("Nome do Cliente:") : "";
    if (pagto === "PENDURA" && !cliente) return alert("Identificação obrigatória!");

    try {
        await db.collection("vendas").add({
            data: new Date().toLocaleString(),
            mesa: mesaAtiva,
            valor: valor,
            metodo: pagto,
            cliente: cliente,
            vendedor: vendedorAtivo
        });

        saldoRestante -= valor;
        const mesa = mesas.find(m => m.numero === mesaAtiva);
        mesa.total = saldoRestante;

        if (saldoRestante <= 0.05) {
            mesa.status = 'livre';
            mesa.itens = [];
            mesa.total = 0;
            mesaAtiva = null;
            alert("✅ CONTA FECHADA! MESA LIBERADA.");
        }
        
        renderizarMesas();
        atualizarCarrinho();
    } catch(e) { alert("Erro: " + e); }
}

// --- INICIALIZAÇÃO ---
renderizarMesas();
