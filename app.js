// ... (mantenha sua FirebaseConfig e lista de produtos aqui)

let saldoRestante = 0;
let totalVendaOriginal = 0;

function atualizarCarrinho() {
    const lista = document.getElementById('itens-venda');
    lista.innerHTML = carrinho.map(i => `
        <div class="flex justify-between border-b border-gray-100 py-1 uppercase">
            <span class="w-1/2">${i.nome}</span>
            <span class="w-1/4 text-right">${i.qtd}x${i.preco.toFixed(2)}</span>
            <span class="w-1/4 text-right font-bold">${(i.qtd*i.preco).toFixed(2)}</span>
        </div>
    `).join('');
    
    totalVendaOriginal = carrinho.reduce((s, i) => s + (i.preco * i.qtd), 0);
    
    // Se for um novo começo de venda, o saldo restante é o total
    if (saldoRestante <= 0) saldoRestante = totalVendaOriginal;

    document.getElementById('valor-total').innerText = saldoRestante.toFixed(2);
    
    // Mostra um aviso se a conta estiver sendo dividida
    if (saldoRestante < totalVendaOriginal && saldoRestante > 0) {
        document.getElementById('itens-venda').innerHTML += `
            <div class="mt-2 p-1 bg-yellow-100 text-center font-bold text-red-600">
                FALTA RECEBER: R$ ${saldoRestante.toFixed(2)}
            </div>
        `;
    }
}

async function finalizarVenda() {
    if (carrinho.length === 0) return;
    
    const pagto = document.getElementById('forma-pagamento').value;
    const valorPago = parseFloat(prompt(`Quanto o cliente está pagando no ${pagto}?`, saldoRestante.toFixed(2)));
    
    if (isNaN(valorPago) || valorPago <= 0) return;

    let cliente = "";
    if (pagto === "PENDURA") {
        cliente = prompt("Nome para o Pendura:");
        if (!cliente) return;
    }

    try {
        // Registra o pagamento parcial no Firebase
        await db.collection("vendas").add({
            data: new Date().toLocaleString(),
            valor_pago: valorPago,
            metodo: pagto,
            cliente: cliente,
            status: valorPago >= saldoRestante ? "FECHADO" : "PARCIAL",
            local: "Boteco 934"
        });

        saldoRestante -= valorPago;

        if (saldoRestante <= 0.01) {
            alert("CONTA TOTALMENTE PAGA! MESA LIBERADA.");
            carrinho = [];
            saldoRestante = 0;
            totalVendaOriginal = 0;
            atualizarCarrinho();
        } else {
            alert(`Pagamento registrado! Ainda faltam R$ ${saldoRestante.toFixed(2)}`);
            atualizarCarrinho();
        }
    } catch(e) { 
        alert("Erro ao salvar: " + e); 
    }
}
