// CONFIGURAÇÃO DO FIREBASE (Mantenha a sua aqui em cima)
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

let produtos = [
    { id: 101, cat: "Cervejas", nome: "SKOL LATA", preco: 6.00 },
    { id: 102, cat: "Cervejas", nome: "HEINEKEN LN", preco: 11.00 }
];
let carrinho = [];

// FUNÇÕES BÁSICAS
function filtrar(cat) {
    const lista = document.getElementById('lista-produtos');
    const filtrados = cat === "Tudo" ? produtos : produtos.filter(p => p.cat === cat);
    lista.innerHTML = filtrados.map(p => `
        <button onclick="adicionarItem(${p.id})" class="w-full bg-white rounded-lg border border-gray-400 overflow-hidden active:bg-blue-100">
            <div class="tarja-botao p-2 text-left text-white">
                <div class="font-bold text-[11px] uppercase truncate">${p.nome}</div>
                <div class="font-black">R$ ${p.preco.toFixed(2)}</div>
            </div>
        </button>
    `).join('');
}

function adicionarItem(id) {
    const p = produtos.find(i => i.id === id);
    const index = carrinho.findIndex(i => i.id === id);
    if (index >= 0) { carrinho[index].qtd += 1; } 
    else { carrinho.push({ ...p, qtd: 1 }); }
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
    const total = carrinho.reduce((s, i) => s + (i.preco * i.qtd), 0);
    document.getElementById('valor-total').innerText = total.toFixed(2);
}

// FINALIZAR E WHATSAPP
async function finalizarVenda() {
    if (carrinho.length === 0) return;
    const pagto = document.getElementById('forma-pagamento').value;
    const total = carrinho.reduce((s, i) => s + (i.preco * i.qtd), 0);
    let cliente = "";

    if (pagto === "PENDURA") {
        cliente = prompt("Nome do cliente que está pendurando:");
        if (!cliente) return;
    }

    try {
        const dados = { data: new Date().toLocaleString(), valor: total, metodo: pagto, cliente: cliente, local: "Boteco 934" };
        await db.collection("vendas").add(dados);
        
        if (confirm("Venda salva! Imprimir cupom?")) { window.print(); }
        
        carrinho = [];
        atualizarCarrinho();
        alert("CONCLUÍDO!");
    } catch(e) { alert("Erro: " + e); }
}

function enviarWhatsApp() {
    if (carrinho.length === 0) return;
    const total = document.getElementById('valor-total').innerText;
    let msg = `*BOTECO 934 - RECIBO*%0A`;
    carrinho.forEach(i => msg += `${i.qtd}x ${i.nome} - R$${(i.qtd*i.preco).toFixed(2)}%0A`);
    msg += `*TOTAL: R$ ${total}*`;
    const fone = prompt("WhatsApp (DDD+Número):", "55879");
    if (fone) window.open(`https://api.whatsapp.org/send?phone=${fone}&text=${msg}`);
}

// LÓGICA DO GERENTE
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

filtrar('Tudo');
