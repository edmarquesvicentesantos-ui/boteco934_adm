function renderizar() {
    const m = document.getElementById('select-mesa').value;
    const mesa = bancoMesas[m];
    const lista = document.getElementById('itens-lista');
    const total = mesa.itens.reduce((acc, i) => acc + i.preco, 0);
    const falta = total - mesa.pagos;

    // Lógica para somar itens iguais e economizar papel
    const itensAgrupados = {};
    mesa.itens.forEach(item => {
        if (itensAgrupados[item.nome]) {
            itensAgrupados[item.nome].qtd++;
            itensAgrupados[item.nome].total += item.preco;
        } else {
            itensAgrupados[item.nome] = { qtd: 1, preco: item.preco, total: item.preco };
        }
    });

    // Gera o HTML do recibo compacto
    lista.innerHTML = Object.keys(itensAgrupados).map(nome => {
        const item = itensAgrupados[nome];
        return `
            <div class="item-linha">
                <span>${item.qtd}x ${nome}</span>
                <span>${item.total.toFixed(2).replace('.', ',')}</span>
            </div>`;
    }).join('');

    document.getElementById('txt-total').innerText = total.toFixed(2).replace('.', ',');
    document.getElementById('txt-falta').innerText = (falta < 0 ? 0 : falta).toFixed(2).replace('.', ',');
    document.getElementById('print-total').innerText = `TOTAL: R$ ${total.toFixed(2).replace('.', ',')}`;
    
    document.getElementById('btn-fechar').disabled = (falta > 0.01 || total === 0);
}

function fecharVenda() {
    const m = document.getElementById('select-mesa').value;
    const mesa = bancoMesas[m];
    
    // Agrupa para o WhatsApp também
    const agrupados = {};
    mesa.itens.forEach(i => {
        agrupados[i.nome] = (agrupados[i.nome] || 0) + 1;
    });

    let zap = `*BOTECO 934 - COMPROVANTE*\n`;
    zap += `Cliente: ${mesa.cliente}\n`;
    zap += `Mesa: ${m}\n---\n`;
    
    for (let nome in agrupados) {
        zap += `${agrupados[nome]}x ${nome}\n`;
    }
    
    const totalGeral = mesa.itens.reduce((acc, i) => acc + i.preco, 0);
    zap += `---\n*TOTAL: R$ ${totalGeral.toFixed(2)}*`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(zap)}`, '_blank');
    window.print();

    bancoMesas[m] = { itens: [], pagos: 0, cliente: "" };
    document.getElementById('nome-cliente').value = "";
    renderizar();
}
