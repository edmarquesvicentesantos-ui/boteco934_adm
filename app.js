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
