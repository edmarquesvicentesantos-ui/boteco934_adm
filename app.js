// CONFIGURAÇÃO FIREBASE
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

// ESTADO DO SISTEMA
let produtos = [
    { id: 101, cat: "Cervejas", nome: "SKOL LATA", preco: 6.00, custo_ant: 4.50 },
    { id: 102, cat: "Cervejas", nome: "HEINEKEN LN", preco: 11.00, custo_ant: 8.00 }
];
let carrinho = [];
let saldoRestante = 0;

// RELÓGIO
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);

// NAVEGAÇÃO E FILTROS
function filtrar(cat) {
    const lista = document.getElementById('lista-produtos');
    const filtrados = cat === "Tudo" ? produtos : produtos.filter(p => p.cat === cat);
    lista.innerHTML = filtrados.map(p => `
        <button onclick="adicionarItem(${p.id})" class="w-full bg-slate-700 rounded-xl overflow-hidden active:bg-slate-600 border border-slate-600 shadow-sm">
            <div class="p-3 text-left">
                <div class="text-white font-bold text-[11px] uppercase truncate">${p.nome}</div>
                <div class="text-yellow-500 font-black">R$ ${p.preco.toFixed(2)}</div>
            </div>
        </button>
    `).join('');
}

// CARRINHO E SOMA IGUAL SUPERMERCADO
function adicionarItem(id) {
    const p = produtos.find(i => i.id === id);
    const index = carrinho.findIndex(i => i.id === id);
    if (index >= 0) { carrinho[index].qtd += 1; } 
    else { carrinho.push({ ...p, qtd: 1 }); }
    
    // Reset do saldo para novo item
    const total = carrinho.reduce((s, i) => s + (i.preco * i.qtd), 0);
    saldoRestante = total;
    
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('itens-venda');
    lista.innerHTML = carrinho.map(i => `
        <div class="flex justify-between border-b border-gray-100 py-1 uppercase">
            <span class="w-1/2">${i.nome}</span>
            <span class="w-1/4 text-right">${i.qtd}x${i.preco.toFixed(2)}</span>
            <span class="w-1/4 text-right font-bold">${(i.qtd*i.preco).toFixed(2)}</span>
        </div>
    `).join('');
    
    document.getElementById('valor-total').innerText = saldoRestante.toFixed(2);
}

// PAGAMENTO PARCIAL, PENDURA E DIVISÃO DE CONTA
async function finalizarVenda() {
    if (carrinho.length === 0) return;
    const pagto = document.getElementById('forma-pagamento').value;
    const valorPago = parseFloat(prompt(`Valor pago no ${pagto}:`, saldoRestante.toFixed(2)));
    
    if (isNaN(valorPago) || valorPago <= 0) return;

    let cliente = "";
    if (pagto === "PENDURA") {
        cliente = prompt("Nome do Cliente (PENDURA):");
        if (!cliente) return alert("Erro: Nome obrigatório!");
    }

    try {
        await db.collection("vendas").add({
            data: new Date().toLocaleString(),
            valor: valorPago,
            metodo: pagto,
            cliente: cliente,
            local: "Boteco 934"
        });

        saldoRestante -= valorPago;

        if (saldoRestante <= 0.05) {
            alert("CONTA ZERADA! MESA LIBERADA.");
            carrinho = [];
            saldoRestante = 0;
            atualizarCarrinho();
        } else {
            alert(`FALTAM R$ ${saldoRestante.toFixed(2)}`);
            atualizarCarrinho();
        }
    } catch(e) { alert("Erro: " + e); }
}

// WHATSAPP
function enviarWhatsApp() {
    if (carrinho.length === 0) return;
    let msg = `*BOTECO 934 - RECIBO*%0A`;
    carrinho.forEach(i => msg += `${i.qtd}x ${i.nome} - R$${(i.qtd*i.preco).toFixed(2)}%0A`);
    msg += `*TOTAL: R$ ${saldoRestante.toFixed(2)}*`;
    const fone = prompt("WhatsApp do cliente:", "55879");
    if (fone) window.open(`https://api.whatsapp.org/send?phone=${fone}&text=${msg}`);
}

// GERENTE E ALERTA DE INFLAÇÃO
function abrirPainelGerente() { document.getElementById('modal-gerente').classList.remove('hidden'); }
function fecharPainelGerente() { document.getElementById('modal-gerente').classList.add('hidden'); }

document.getElementById('calc-custo').addEventListener('input', function() {
    const custo = parseFloat(this.value) || 0;
    document.getElementById('sugestao-dose').innerText = "R$ " + (((custo/18)+0.7)*2.8).toFixed(2);
    document.getElementById('sugestao-litro').innerText = "R$ " + (custo*1.5).toFixed(2);
});

function salvarPrecos() {
    const nome = document.getElementById('calc-nome').value.toUpperCase();
    const pDose = parseFloat(document.getElementById('sugestao-dose').innerText.replace('R$ ', ''));
    const pLitro = parseFloat(document.getElementById('sugestao-litro').innerText.replace('R$ ', ''));
    if (!nome || pDose <= 0) return;

    produtos.push({ id: Date.now(), cat: "Doses", nome: nome + " (DOSE)", preco: pDose });
    produtos.push({ id: Date.now()+1, cat: "Doses", nome: nome + " (GARRAF)", preco: pLitro });
    fecharPainelGerente();
    filtrar('Doses');
}

// AGENDA DE CONTATOS
function abrirContatos() { document.getElementById('modal-contatos').classList.remove('hidden'); carregarContatos(); }
function fecharContatos() { document.getElementById('modal-contatos').classList.add('hidden'); }

async function salvarContato() {
    const nome = document.getElementById('cont-nome').value.toUpperCase();
    const fone = document.getElementById('cont-fone').value;
    if (nome && fone) {
        await db.collection("contatos").add({ nome, fone });
        carregarContatos();
    }
}

async function carregarContatos() {
    const lista = document.getElementById('lista-contatos');
    const snap = await db.collection("contatos").get();
    lista.innerHTML = snap.docs.map(doc => `
        <div class="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-700">
            <span class="text-xs font-bold">${doc.data().nome}</span>
            <button onclick="window.open('https://wa.me/55${doc.data().fone}')" class="bg-green-600 p-1 rounded text-[10px]">ZAP</button>
        </div>
    `).join('');
}

filtrar('Tudo');
async function enviarFechamentoDia() {
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    try {
        // Busca as vendas de hoje no Firebase
        const snapshot = await db.collection("vendas")
            .where("data", ">=", hoje) 
            .get();

        let resumo = {
            dinheiro: 0,
            pix: 0,
            cartao: 0,
            pendura: 0,
            totalReal: 0
        };

        snapshot.forEach(doc => {
            const v = doc.data();
            const valor = parseFloat(v.valor) || 0;

            if (v.metodo === "DINHEIRO") resumo.dinheiro += valor;
            else if (v.metodo === "PIX") resumo.pix += valor;
            else if (v.metodo === "CREDITO" || v.metodo === "DEBITO") resumo.cartao += valor;
            else if (v.metodo === "PENDURA") resumo.pendura += valor;
        });

        resumo.totalReal = resumo.dinheiro + resumo.pix + resumo.cartao;

        // Montagem da Mensagem para o Edmarques
        let texto = `*📊 FECHAMENTO BOTECO 934 - ${hoje}*%0A`;
        texto += `------------------------------%0A`;
        texto += `💵 *DINHEIRO:* R$ ${resumo.dinheiro.toFixed(2)}%0A`;
        texto += `💎 *PIX:* R$ ${resumo.pix.toFixed(2)}%0A`;
        texto += `💳 *CARTÕES:* R$ ${resumo.cartao.toFixed(2)}%0A`;
        texto += `------------------------------%0A`;
        texto += `✅ *SALDO REAL EM CAIXA:* R$ ${resumo.totalReal.toFixed(2)}%0A`;
        texto += `------------------------------%0A`;
        texto += `📝 *PENDURAS DO DIA:* R$ ${resumo.pendura.toFixed(2)}%0A`;
        texto += `------------------------------%0A`;
        texto += `_Relatório gerado automaticamente._`;

        // Envia para o seu WhatsApp pessoal
        const meuFone = "5587996806181";
        window.open(`https://api.whatsapp.org/send?phone=${meuFone}&text=${texto}`);

    } catch (e) {
        alert("Erro ao gerar fechamento: " + e);
    }
}
