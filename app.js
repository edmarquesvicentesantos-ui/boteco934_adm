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
// --- CONFIGURAÇÃO FIREBASE ---
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

// --- ESTADO DO SISTEMA ---
let mesas = Array.from({length: 10}, (_, i) => ({ numero: i + 1, status: 'livre', itens: [], total: 0 }));
let mesaAtiva = null;
let produtos = [
    { id: 101, cat: "Cervejas", nome: "SKOL LATA", preco: 6.00, codigo: "7891991000858" },
    { id: 102, cat: "Cervejas", nome: "HEINEKEN LN", preco: 11.00, codigo: "7896045505452" }
];
let carrinho = [];
let saldoRestante = 0;

// --- RELÓGIO ---
setInterval(() => { 
    document.getElementById('clock').innerText = new Date().toLocaleTimeString(); 
}, 1000);

// --- FUNÇÃO: PRECIFIKAR / GERENTE ---
function abrirPainelGerente() {
    document.getElementById('modal-gerente').classList.remove('hidden');
}

function fecharPainelGerente() {
    document.getElementById('modal-gerente').classList.add('hidden');
}

function salvarPrecos() {
    const nome = document.getElementById('calc-nome').value.toUpperCase();
    const preco = parseFloat(document.getElementById('calc-custo').value);

    if (!nome || isNaN(preco)) {
        alert("Preencha o nome e o preço corretamente!");
        return;
    }

    const novoProd = {
        id: Date.now(),
        cat: "Geral",
        nome: nome,
        preco: preco * 1.5, // Exemplo: Margem de 50% automática
        codigo: ""
    };

    produtos.push(novoProd);
    alert("Produto salvo com sucesso!");
    fecharPainelGerente();
    filtrar('Tudo');
}

// --- FUNÇÃO: CONTATOS ---
// Adicione este modal ao seu HTML se ele sumiu
function abrirContatos() {
    const fone = prompt("WhatsApp do Cliente ou Fornecedor (com DDD):", "879");
    if (fone) {
        window.open(`https://wa.me/55${fone}`);
    }
}

// --- GESTÃO DE MESAS ---
function renderizarMesas() {
    const painel = document.getElementById('painel-mesas');
    painel.innerHTML = mesas.map(m => {
        const cor = m.status === 'ocupada' ? 'bg-red-600' : 'bg-green-600';
        const borda = mesaAtiva === m.numero ? 'ring-4 ring-yellow-400 scale-105' : 'opacity-80';
        return `
            <button onclick="selecionarMesa(${m.numero})" class="${cor} ${borda} p-2 rounded-lg text-white font-bold text-[9px] transition-all shadow-md">
                MESA ${m.numero}<br>R$ ${m.total.toFixed(2)}
            </button>
        `;
    }).join('');
}

function selecionarMesa(num) {
    mesaAtiva = num;
    const mesa = mesas.find(m => m.numero === num);
    carrinho = mesa.itens;
    saldoRestante = mesa.total;
    document.getElementById('info-mesa-cupom').innerText = `CONTA ATUAL: MESA ${num}`;
    renderizarMesas();
    atualizarCarrinho();
}

// --- PRODUTOS E BUSCA ---
function filtrar(cat) {
    const lista = document.getElementById('lista-produtos');
    const filtrados = cat === "Tudo" ? produtos : produtos.filter(p => p.cat === cat);
    lista.innerHTML = filtrados.map(p => `
        <button onclick="adicionarItem(${p.id})" class="w-full bg-slate-700 p-3 rounded-xl border border-slate-600 text-left active:bg-slate-600">
            <p class="text-[10px] font-bold uppercase truncate text-white">${p.nome}</p>
            <p class="text-yellow-500 font-black">R$ ${p.preco.toFixed(2)}</p>
        </button>
    `).join('');
}

function adicionarItem(id) {
    if (!mesaAtiva) {
        alert("⚠️ Selecione uma MESA primeiro!");
        return;
    }
    const p = produtos.find(i => i.id === id);
    const mesa = mesas.find(m => m.numero === mesaAtiva);
    
    const idx = mesa.itens.findIndex(i => i.id === id);
    if (idx >= 0) {
        mesa.itens[idx].qtd += 1;
    } else {
        mesa.itens.push({ ...p, qtd: 1 });
    }
    
    mesa.status = 'ocupada';
    mesa.total = mesa.itens.reduce((s, i) => s + (i.preco * i.qtd), 0);
    saldoRestante = mesa.total;
    
    renderizarMesas();
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('itens-venda');
    lista.innerHTML = carrinho.map(i => `
        <div class="flex justify-between border-b border-gray-100 py-1 uppercase text-black font-bold">
            <span class="w-1/2">${i.nome}</span>
            <span class="w-1/4 text-right">${i.qtd}x</span>
            <span class="w-1/4 text-right font-bold">${(i.qtd*i.preco).toFixed(2)}</span>
        </div>
    `).join('');
    document.getElementById('valor-total').innerText = saldoRestante.toFixed(2);
}

// --- FECHAMENTO E WHATSAPP ---
async function finalizarVenda() {
    if (!mesaAtiva || saldoRestante <= 0) return;
    const pagto = document.getElementById('forma-pagamento').value;
    const valor = parseFloat(prompt(`Valor pago no ${pagto} (Faltam R$ ${saldoRestante.toFixed(2)}):`, saldoRestante.toFixed(2)));
    
    if (isNaN(valor) || valor <= 0) return;

    try {
        await db.collection("vendas").add({
            data: new Date().toLocaleString(),
            mesa: mesaAtiva,
            valor: valor,
            metodo: pagto
        });

        saldoRestante -= valor;
        const mesa = mesas.find(m => m.numero === mesaAtiva);
        mesa.total = saldoRestante;

        if (saldoRestante <= 0.05) {
            mesa.status = 'livre';
            mesa.itens = [];
            mesa.total = 0;
            mesaAtiva = null;
            document.getElementById('info-mesa-cupom').innerText = `SELECIONE UMA MESA`;
            alert("CONTA FECHADA! MESA LIBERADA.");
        }
        
        renderizarMesas();
        atualizarCarrinho();
    } catch (e) { alert("Erro ao salvar: " + e); }
}

async function enviarFechamentoDia() {
    const meuZap = "5587996806181";
    let texto = `*📊 FECHAMENTO BOTECO 934 - ${new Date().toLocaleDateString()}*%0A%0A*Venda Total:* R$ ${document.getElementById('valor-total').innerText}`;
    window.open(`https://api.whatsapp.org/send?phone=${meuZap}&text=${texto}`);
}

// --- INICIALIZAÇÃO ---
renderizarMesas();
filtrar('Tudo');

// --- INICIALIZAÇÃO ---
renderizarMesas();
