// 1. Memória do Sistema (Gerencia as 8 mesas + balcão)
let bancoMesas = {};
const listaMesas = ["Balcão", "Mesa 01", "Mesa 02", "Mesa 03", "Mesa 04", "Mesa 05", "Mesa 06", "Mesa 07", "Mesa 08"];

listaMesas.forEach(m => {
    bancoMesas[m] = { itens: [], pagos: 0, cliente: "" };
});

// 2. Função para registrar pagamentos (PIX, Crédito, etc.)
function registrarPagamento(metodo) {
    const mesaAtual = document.getElementById('select-mesa').value;
    const dados = bancoMesas[mesaAtual];
    
    const total = dados.itens.reduce((acc, i) => acc + i.preco, 0);
    const falta = total - dados.pagos;

    if (falta <= 0) {
        alert("Esta conta já foi totalmente paga!");
        return;
    }

    // Pergunta quanto o cliente está pagando agora
    let valorSugerido = falta.toFixed(2).replace('.', ',');
    let entrada = prompt(`Pagamento em ${metodo}\nFaltando: R$ ${valorSugerido}\nDigite o valor pago:`, valorSugerido);

    if (entrada) {
        let valorNum = parseFloat(entrada.replace(',', '.'));
        if (!isNaN(valorNum)) {
            dados.pagos += valorNum;
            atualizarInterface();
        }
    }
}

// 3. Trava de Segurança e Finalização
function fecharEImprimir() {
    const mesaAtual = document.getElementById('select-mesa').value;
    const dados = bancoMesas[mesaAtual];
    const total = dados.itens.reduce((acc, i) => acc + i.preco, 0);
    const falta = total - dados.pagos;

    // Validação de Nome e Pagamento
    if (!dados.cliente || dados.cliente.trim() === "") {
        alert("Erro: Identifique o cliente antes de fechar a conta!");
        return;
    }

    if (falta > 0.01) { // Tolera pequena diferença de centavos
        alert(`Não é possível fechar!\nAinda falta receber R$ ${falta.toFixed(2).replace('.', ',')}`);
        return;
    }

    // Fluxo de Saída (WhatsApp + Impressão)
    gerarRecibo(dados);
    
    // Limpa a mesa para o próximo cliente
    bancoMesas[mesaAtual] = { itens: [], pagos: 0, cliente: "" };
    document.getElementById('input-nome-cliente').value = "";
    atualizarInterface();
}

// 4. Formatação do Recibo
function gerarRecibo(dados) {
    let textoZap = `*BOTECO 934 - RECIBO*\n`;
    textoZap += `Cliente: ${dados.cliente}\n`;
    textoZap += `--------------------------\n`;
    
    dados.itens.forEach(item => {
        textoZap += `${item.nome}: R$ ${item.preco.toFixed(2)}\n`;
    });

    textoZap += `--------------------------\n`;
    textoZap += `*TOTAL PAGO: R$ ${dados.pagos.toFixed(2)}*`;

    // Abre WhatsApp e aciona impressora térmica
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textoZap)}`, '_blank');
    window.print();
}
