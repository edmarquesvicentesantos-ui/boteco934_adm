async function finalizarVenda() {
    if (carrinho.length === 0) return;
    
    const pagto = document.getElementById('forma-pagamento').value;
    const valorParaCobrar = parseFloat(prompt(`Quanto será registrado no ${pagto}?`, saldoRestante.toFixed(2)));
    
    if (isNaN(valorParaCobrar) || valorParaCobrar <= 0) return;

    let clientePendura = "";
    // REGRA DO JOGO: Se for Pendura, o nome é obrigatório para salvar no Firebase
    if (pagto === "PENDURA") {
        clientePendura = prompt("Para quem vamos pendurar esta conta?");
        if (!clientePendura) {
            alert("ERRO: Não é possível pendurar sem identificar o cliente!");
            return;
        }
    }

    try {
        await db.collection("vendas").add({
            data: new Date().toLocaleString("pt-BR"),
            valor_pago: valorParaCobrar,
            metodo: pagto,
            cliente: clientePendura, // Salva o nome do devedor
            status: valorParaCobrar >= saldoRestante ? "FECHADO" : "PARCIAL",
            local: "Boteco 934"
        });

        saldoRestante -= valorParaCobrar;

        if (saldoRestante <= 0.01) {
            alert("CONTA ZERADA! Mesa liberada.");
            carrinho = [];
            saldoRestante = 0;
            atualizarCarrinho();
        } else {
            alert(`Registrado R$ ${valorParaCobrar.toFixed(2)} no ${pagto}. Ainda faltam R$ ${saldoRestante.toFixed(2)}`);
            atualizarCarrinho();
        }
    } catch(e) { 
        alert("Erro ao registrar pendura: " + e); 
    }
}
// Função para calcular o resumo financeiro do dia
function gerarResumoFinanceiro(vendasDoDia) {
    let financeiro = {
        dinheiro: 0,
        pix: 0,
        cartao: 0,
        pendura: 0
    };

    vendasDoDia.forEach(venda => {
        if (venda.metodo === "DINHEIRO") financeiro.dinheiro += venda.valor_pago;
        else if (venda.metodo === "PIX") financeiro.pix += venda.valor_pago;
        else if (venda.metodo === "CREDITO" || venda.metodo === "DEBITO") financeiro.cartao += venda.valor_pago;
        else if (venda.metodo === "PENDURA") financeiro.pendura += venda.valor_pago;
    });

    console.log("--- RESUMO DO DIA BOTECO 934 ---");
    console.log(`💵 Dinheiro em Caixa: R$ ${financeiro.dinheiro.toFixed(2)}`);
    console.log(`💎 Total em PIX: R$ ${financeiro.pix.toFixed(2)}`);
    console.log(`💳 Total em Cartão: R$ ${financeiro.cartao.toFixed(2)}`);
    console.log(`📝 Total em Pendura: R$ ${financeiro.pendura.toFixed(2)}`);
}

function verificarSubidaPreco(custoNovo, custoAntigo) {
    if (custoNovo > custoAntigo) {
        let aumento = ((custoNovo - custoAntigo) / custoAntigo) * 100;
        alert(`🚨 ALERTA DE SUBIDA: Este produto está ${aumento.toFixed(1)}% mais caro que na última compra!`);
        // Aqui o sistema sugere o novo preço mantendo a margem
    }
}
