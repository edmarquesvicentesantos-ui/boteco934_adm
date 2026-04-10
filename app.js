// ... Mantenha sua firebaseConfig aqui ...

const produtosLocal = [
    { id: "7891991000858", cat: "Cervejas", nome: "SKOL LATA", preco: 6.00, foto: "" }, // Exemplo de código real
    { id: "1", cat: "Doses", nome: "PITU", preco: 3.50, foto: "" }
];

let carrinho = [];

// ESCUTA O INPUT (BIP OU DIGITAÇÃO)
document.getElementById('input-busca').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        buscarProduto(this.value);
        this.value = ''; // Limpa após buscar
    }
});

async function buscarProduto(termo) {
    // 1. Tenta buscar no seu estoque local primeiro
    let p = produtosLocal.find(item => item.id === termo || item.nome.toLowerCase().includes(termo.toLowerCase()));

    if (p) {
        adicionarItem(p);
    } else {
        // 2. Se não achou no estoque, tenta buscar na Internet (API)
        try {
            const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${termo}.json`);
            const data = await res.json();

            if (data.status === 1) {
                const novoProd = {
                    id: termo,
                    nome: data.product.product_name.toUpperCase(),
                    preco: 0.00, // Você define o preço na hora ou depois
                    foto: data.product.image_front_url || ""
                };
                adicionarItem(novoProd);
            } else {
                alert("Produto não encontrado na internet. Tente cadastrar manualmente.");
            }
        } catch (error) {
            console.error("Erro na busca remota", error);
        }
    }
}

function adicionarItem(prod) {
    const index = carrinho.findIndex(item => item.id === prod.id);
    if (index >= 0) {
        carrinho[index].qtd += 1;
    } else {
        // Se o preço for 0 (busca na internet), pede para o usuário digitar
        if (prod.preco === 0) {
            const valorPrompt = prompt(`Qual o preço de ${prod.nome}?`, "0.00");
            prod.preco = parseFloat(valorPrompt) || 0;
        }
        carrinho.push({ ...prod, qtd: 1 });
    }
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('itens-venda');
    const totalTxt = document.getElementById('valor-total');
    
    lista.innerHTML = carrinho.map((item) => `
        <div class="flex items-center gap-2 border-b border-gray-100 py-1">
            ${item.foto ? `<img src="${item.foto}" class="w-8 h-8 object-contain rounded">` : `<div class="w-8 h-8 bg-gray-200 rounded"></div>`}
            <div class="flex-1 flex justify-between">
                <span class="w-1/2 uppercase text-[10px] leading-tight">${item.nome}</span>
                <span class="w-1/4 text-right">${item.qtd}x${item.preco.toFixed(2)}</span>
                <span class="w-1/4 text-right font-bold">${(item.qtd * item.preco).toFixed(2)}</span>
            </div>
        </div>
    `).join('');

    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.qtd), 0);
    totalTxt.innerText = total.toFixed(2);
}

// ... Restante da função finalizarVenda e filtrar ...
filtrar('Tudo');
