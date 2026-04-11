<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boteco 934 - PDV 58mm</title>
    <style>
        * { box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        body { margin: 0; display: flex; flex-direction: column; height: 100vh; background: #f0f2f5; }
        
        /* Layout Principal */
        header { background: #1c1e21; color: white; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; }
        .search-bar { flex: 0 1 400px; }
        #busca-produto { width: 100%; padding: 8px; border-radius: 20px; border: none; outline: none; }

        main { display: flex; flex: 1; overflow: hidden; }
        .categorias { width: 120px; background: #2c3e50; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
        .btn-cat { padding: 12px; background: #34495e; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold; }

        /* Vitrine com 5 itens por linha */
        .vitrine { flex: 1; padding: 15px; overflow-y: auto; background: white; }
        .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .card { border: 1px solid #eee; padding: 10px; text-align: center; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .card img { height: 45px; object-fit: contain; margin-bottom: 5px; }
        .nome-prod { display: block; font-size: 10px; font-weight: bold; min-height: 24px; color: #333; }
        .preco-prod { display: block; color: #27ae60; font-weight: bold; margin: 4px 0; font-size: 12px; }
        .btn-add { width: 100%; padding: 6px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold; }

        /* Painel Lateral */
        .painel-venda { width: 340px; background: #f8f9fa; border-left: 1px solid #ddd; padding: 15px; display: flex; flex-direction: column; }
        .input-cli { width: 100%; padding: 10px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 4px; font-weight: bold; }
        
        /* Estilo do Recibo na Tela */
        .cupom-tela { background: white; border: 1px solid #bbb; flex: 1; padding: 10px; font-family: monospace; overflow-y: auto; }
        .item-linha { display: flex; justify-content: space-between; font-size: 11px; border-bottom: 1px dotted #ccc; padding: 4px 0; }
        
        .financeiro { margin-top: 10px; padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 4px; }
        .total-info { font-size: 18px; font-weight: bold; text-align: right; color: #333; }
        .falta-info { font-size: 15px; font-weight: bold; text-align: right; color: #e67e22; }

        .pagamentos { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 10px; }
        .btn-pg { padding: 10px; font-size: 10px; font-weight: bold; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: #fff; }
        .btn-pendura { grid-column: span 2; background: #e67e22; color: white; border: none; }

        .btn-finalizar { width: 100%; padding: 15px; background: #27ae60; color: white; border: none; margin-top: 10px; font-weight: bold; border-radius: 4px; cursor: pointer; }
        .btn-finalizar:disabled { background: #ccc; cursor: not-allowed; }

        /* --- CONFIGURAÇÃO PARA IMPRESSORA 58mm --- */
        @media print {
            body * { visibility: hidden; }
            #corpo-impressao, #corpo-impressao * { visibility: visible; }
            #corpo-impressao {
                position: absolute; left: 0; top: 0;
                width: 58mm; /* Ajustado para sua impressora */
                font-size: 12px; line-height: 1.2;
                padding: 0; margin: 0;
            }
            .no-print { display: none !important; }
        }
    </style>
</head>
<body>

    <header class="no-print">
        <div style="display:flex; align-items:center; gap:10px;">
            <div style="background:#f1c40f; color:black; padding:5px 12px; border-radius:50%; font-weight:bold;">934</div>
            <h2 style="margin:0; font-size: 18px;">Boteco 934</h2>
        </div>
        <div class="search-bar"><input type="text" id="busca-produto" placeholder="Bipar código..." oninput="buscar()"></div>
        <div id="data-hora"></div>
    </header>

    <main class="no-print">
        <nav class="categorias">
            <button class="btn-cat" onclick="filtrar('Todos')">TUDO</button>
            <button class="btn-cat" onclick="filtrar('Bebidas')">BEBIDAS</button>
            <button class="btn-cat" onclick="filtrar('Doses')">DOSES</button>
            <button class="btn-cat" onclick="filtrar('Boticário')">BOTICÁRIO</button>
        </nav>

        <section class="vitrine">
            <div id="grid-produtos" class="grid"></div>
        </section>

        <aside class="painel-venda">
            <select id="select-mesa" class="input-cli" onchange="mudarMesa()">
                <option value="Balcão">Balcão</option>
                <option value="Mesa 1">Mesa 01</option><option value="Mesa 2">Mesa 02</option>
                <option value="Mesa 3">Mesa 03</option><option value="Mesa 4">Mesa 04</option>
                <option value="Mesa 5">Mesa 05</option><option value="Mesa 6">Mesa 06</option>
                <option value="Mesa 7">Mesa 07</option><option value="Mesa 8">Mesa 08</option>
            </select>
            
            <input type="text" id="nome-cliente" class="input-cli" placeholder="Nome do Cliente" oninput="salvarNome()">

            <div class="cupom-tela" id="corpo-impressao">
                <div style="text-align:center; font-weight:bold; border-bottom:1px dashed #000; margin-bottom:8px;">
                    BOTECO 934<br>Petrolina - PE
                </div>
                <div id="itens-lista"></div>
                <div style="border-top:1px solid #000; margin-top:10px; padding-top:5px; text-align:right;">
                    <strong id="print-total">TOTAL: R$ 0,00</strong>
                </div>
            </div>

            <div class="financeiro">
                <div class="total-info">Total: R$ <span id="txt-total">0,00</span></div>
                <div class="falta-info">Faltando: R$ <span id="txt-falta">0,00</span></div>
            </div>

            <div class="pagamentos">
                <button class="btn-pg" onclick="receber('Dinheiro')">DINHEIRO</button>
                <button class="btn-pg" onclick="receber('Pix')">PIX</button>
                <button class="btn-pg" onclick="receber('Débito')">DÉBITO</button>
                <button class="btn-pg" onclick="receber('Crédito')">CRÉDITO</button>
                <button class="btn-pg btn-pendura" onclick="receber('Pendura')">LANÇAR NO PENDURA (CONTA)</button>
            </div>

            <button class="btn-finalizar" id="btn-fechar" onclick="fecharVenda()" disabled>FECHAR E IMPRIMIR</button>
        </aside>
    </main>

    <script>
        let bancoMesas = { "Balcão": { itens: [], pagos: 0, cliente: "" } };
        for(let i=1; i<=8; i++) bancoMesas[`Mesa ${i}`] = { itens: [], pagos: 0, cliente: "" };

        const produtos = [
            { nome: "Cerveja Latão", preco: 7.50, cat: "Bebidas", img: "https://img.icons8.com/color/96/beer.png" },
            { nome: "Cerveja Heineken", preco: 12.00, cat: "Bebidas", img: "https://img.icons8.com/color/96/beer-bottle.png" },
            { nome: "Água s/ Gás", preco: 3.00, cat: "Bebidas", img: "https://img.icons8.com/color/48/water-glass.png" },
            { nome: "Dose de Pitu", preco: 4.00, cat: "Doses", img: "https://img.icons8.com/color/48/tequila-shot.png" },
            { nome: "Perfume Malbec", preco: 180.00, cat: "Boticário", img: "https://img.icons8.com/color/48/perfume-bottle.png" }
        ].sort((a,b) => a.nome.localeCompare(b.nome));

        function mudarMesa() {
            const m = document.getElementById('select-mesa').value;
            document.getElementById('nome-cliente').value = bancoMesas[m].cliente;
            renderizar();
        }

        function salvarNome() {
            const m = document.getElementById('select-mesa').value;
            bancoMesas[m].cliente = document.getElementById('nome-cliente').value;
        }

        function adicionar(n, p) {
            const m = document.getElementById('select-mesa').value;
            if(!bancoMesas[m].cliente) return alert("Digite o nome do cliente!");
            bancoMesas[m].itens.push({nome: n, preco: p});
            renderizar();
        }

        function receber(tipo) {
            const m = document.getElementById('select-mesa').value;
            const total = bancoMesas[m].itens.reduce((acc, i) => acc + i.preco, 0);
            const falta = total - bancoMesas[m].pagos;
            if(falta <= 0) return;

            let v = prompt(`Valor em ${tipo} (Falta R$ ${falta.toFixed(2)}):`, falta.toFixed(2));
            if(v) {
                bancoMesas[m].pagos += parseFloat(v.replace(',', '.'));
                renderizar();
            }
        }

        function renderizar() {
            const m = document.getElementById('select-mesa').value;
            const mesa = bancoMesas[m];
            const lista = document.getElementById('itens-lista');
            const total = mesa.itens.reduce((acc, i) => acc + i.preco, 0);
            const falta = total - mesa.pagos;

            lista.innerHTML = mesa.itens.map(i => `<div class="item-linha"><span>${i.nome}</span> <span>${i.preco.toFixed(2)}</span></div>`).join('');
            document.getElementById('txt-total').innerText = total.toFixed(2).replace('.', ',');
            document.getElementById('txt-falta').innerText = (falta < 0 ? 0 : falta).toFixed(2).replace('.', ',');
            document.getElementById('print-total').innerText = `TOTAL: R$ ${total.toFixed(2)}`;
            
            document.getElementById('btn-fechar').disabled = (falta > 0.01 || total === 0);
        }

        function fecharVenda() {
            const m = document.getElementById('select-mesa').value;
            const mesa = bancoMesas[m];
            
            let zap = `*BOTECO 934*\nCliente: ${mesa.cliente}\n---\n`;
            mesa.itens.forEach(i => zap += `${i.nome}: R$ ${i.preco.toFixed(2)}\n`);
            zap += `*TOTAL: R$ ${mesa.itens.reduce((acc, i)=>acc+i.preco, 0).toFixed(2)}*`;
            
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(zap)}`, '_blank');
            window.print();

            bancoMesas[m] = { itens: [], pagos: 0, cliente: "" };
            document.getElementById('nome-cliente').value = "";
            renderizar();
        }

        function carregar(l) {
            document.getElementById('grid-produtos').innerHTML = l.map(p => `
                <div class="card">
                    <img src="${p.img}">
                    <span class="nome-prod">${p.nome}</span>
                    <span class="preco-prod">R$ ${p.preco.toFixed(2).replace('.',',')}</span>
                    <button class="btn-add" onclick="adicionar('${p.nome}', ${p.preco})">ADD</button>
                </div>
            `).join('');
        }
        function filtrar(c) { carregar(c === 'Todos' ? produtos : produtos.filter(p => p.cat === c)); }
        function buscar() { const t = document.getElementById('busca-produto').value.toLowerCase(); carregar(produtos.filter(p => p.nome.toLowerCase().includes(t))); }
        setInterval(() => { document.getElementById('data-hora').innerText = new Date().toLocaleString('pt-br'); }, 1000);
        carregar(produtos);
/* Botões de pagamento menores */
.btn-pg { 
    padding: 6px !important; 
    font-size: 9px !important; 
}

/* Área financeira mais compacta */
.financeiro { 
    margin-top: 5px; 
    padding: 5px; 
}

.total-info { font-size: 16px; }
.falta-info { font-size: 13px; }

/* Botão final mais estreito */
.btn-finalizar { 
    padding: 10px; 
    margin-top: 5px; 
    font-size: 14px; 
}

/* Garante que o input e o select fiquem alinhados */
.input-cli {
    margin-bottom: 0 !important;
    padding: 8px !important;
    font-size: 12px;
}
    </script>
</body>
</html>
