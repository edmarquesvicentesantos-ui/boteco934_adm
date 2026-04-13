// BANCO DE DADOS ATUALIZADO
let db_estoque = JSON.parse(localStorage.getItem('934_est')) || [];
let db_mesas = JSON.parse(localStorage.getItem('934_mes')) || Array(12).fill().map((_, i) => ({ id: i+1, ocupada: false, pedidos: [], total: 0 }));
let db_clientes = JSON.parse(localStorage.getItem('934_cli')) || []; // Lista de Fiado
let mesaAberta = null;

// FUNÇÃO PARA FECHAR CONTA COM DIVISÃO (CAIXA OU PENDURA)
function fecharContaFinal(tipoPagamento) {
    if (!mesaAberta || mesaAberta.total <= 0) return;

    if (tipoPagamento === 'pendura') {
        let nomeCli = prompt("Para qual cliente vamos pendurar?");
        if (!nomeCli) return;

        let cliente = db_clientes.find(c => c.nome.toLowerCase() === nomeCli.toLowerCase());
        if (cliente) {
            cliente.debito += mesaAberta.total;
            cliente.historico.push({ data: new Date().toLocaleDateString(), valor: mesaAberta.total });
        } else {
            db_clientes.push({
                nome: nomeCli,
                debito: mesaAberta.total,
                historico: [{ data: new Date().toLocaleDateString(), valor: mesaAberta.total }]
            });
        }
        alert(`Valor de R$ ${mesaAberta.total.toFixed(2)} lançado no Fiado de ${nomeCli}`);
    } else {
        alert("Venda finalizada no CAIXA!");
    }

    // Gerar Recibo WhatsApp antes de limpar
    enviarZap();

    // Limpa a mesa
    mesaAberta.ocupada = false;
    mesaAberta.pedidos = [];
    mesaAberta.total = 0;
    save();
    location.reload();
}

// RENDERIZAR LISTA DE CLIENTES (FIADO)
function renderClientes() {
    const corpo = document.getElementById('corpoClientes');
    if(!corpo) return;
    
    corpo.innerHTML = db_clientes.map((c, index) => `
        <tr style="border-bottom: 1px solid #222;">
            <td style="padding:10px;"><b>${c.nome.toUpperCase()}</b></td>
            <td style="padding:10px; color:#ff4444;">R$ ${c.debito.toFixed(2)}</td>
            <td style="padding:10px;">
                <button onclick="receberDivida(${index})" style="background:#25d366; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; font-weight:bold;">RECEBER</button>
            </td>
        </tr>
    `).join('');
}

function receberDivida(index) {
    let valor = parseFloat(prompt(`Quanto o(a) ${db_clientes[index].nome} está pagando?`, db_clientes[index].debito));
    if (isNaN(valor) || valor <= 0) return;

    db_clientes[index].debito -= valor;
    if (db_clientes[index].debito <= 0) {
        alert("Dívida quitada!");
    }
    save();
    renderClientes();
}

function save() {
    localStorage.setItem('934_est', JSON.stringify(db_estoque));
    localStorage.setItem('934_mes', JSON.stringify(db_mesas));
    localStorage.setItem('934_cli', JSON.stringify(db_clientes));
}

// Função para ler o XML e converter fardos em unidades
function lerXML(arquivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(e.target.result, "text/xml");
        const produtos = xml.getElementsByTagName("det");
        
        for (let p of produtos) {
            let nomeNF = p.getElementsByTagName("xProd")[0].textContent;
            let qtdFardos = parseFloat(p.getElementsByTagName("qCom")[0].textContent); // Ex: 10
            let valorFardo = parseFloat(p.getElementsByTagName("vUnCom")[0].textContent); // Ex: 120.00
            
            // 1. PERGUNTA A FRAÇÃO (O segredo está aqui)
            let unidadesPorFardo = prompt(`PRODUTO: ${nomeNF}\n\nQuantas UNIDADES (ou doses) vêm dentro de cada pacote/garrafa?`, "12");
            
            if (unidadesPorFardo !== null) {
                let fator = parseInt(unidadesPorFardo);
                let estoqueReal = qtdFardos * fator; // 10 fardos x 12 = 120 latas
                let custoUnidade = valorFardo / fator; // 120.00 / 12 = 10.00 por lata

                // 2. CHAMA A CALCULADORA (Sugestão de 30% ou o que você definir)
                let margem = 1.30; 
                let precoVendaSugerido = custoUnidade * margem;

                // 3. SALVA NO ESTOQUE JÁ FRACIONADO
                let itemEstoque = {
                    nome: nomeNF,
                    qtd: estoqueReal, // Aqui entra os 120, não os 10
                    custo: custoUnidade,
                    preco: precoVendaSugerido
                };

                // Lógica para adicionar ou atualizar no seu banco (localStorage)
                atualizarOuAdicionarEstoque(itemEstoque);
            }
        }
        alert("Estoque atualizado com sucesso via XML!");
        renderizarTudo(); // Atualiza a tela
    };
    reader.readAsText(arquivo);
}
// --- BANCO DE DADOS ---
let db_estoque = JSON.parse(localStorage.getItem('934_est')) || [];
let db_clientes = JSON.parse(localStorage.getItem('934_cli')) || [];

// --- 1. LEITOR DE XML COM CALCULADORA DE FRACIONAMENTO ---
function importarXML(arquivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(e.target.result, "text/xml");
        const produtos = xml.getElementsByTagName("det");
        
        for (let p of produtos) {
            let nomeNF = p.getElementsByTagName("xProd")[0].textContent;
            let qtdPacotes = parseFloat(p.getElementsByTagName("qCom")[0].textContent); 
            let valorFardo = parseFloat(p.getElementsByTagName("vUnCom")[0].textContent);
            
            // Pergunta o fracionamento (Ex: 12 unidades por fardo)
            let unidadesPorPacote = prompt(`PRODUTO: ${nomeNF}\nQtd na Nota: ${qtdPacotes} pacotes\n\nQuantas UNIDADES vêm em cada pacote?`, "12");
            
            if (unidadesPorPacote) {
                let fator = parseInt(unidadesPorPacote);
                let totalUnidades = qtdPacotes * fator; // Ex: 10 fardos x 12 = 120 latas
                let custoUnidade = valorFardo / fator;

                // Sugestão de venda automática (pode ajustar a margem aqui)
                let precoVenda = custoUnidade * 1.50; 

                let existe = db_estoque.find(i => i.nome === nomeNF);
                if (existe) {
                    existe.qtd += totalUnidades;
                    existe.custo = custoUnidade;
                } else {
                    db_estoque.push({ 
                        nome: nomeNF, 
                        qtd: totalUnidades, 
                        preco: precoVenda, 
                        custo: custoUnidade 
                    });
                }
            }
        }
        salvarEShow();
        alert("XML Processado! O estoque agora reflete as UNIDADES.");
    };
    reader.readAsText(arquivo);
}

// --- 2. GESTÃO DE FIADO (PENDURA) ---
function pendurarConta(nomeCliente, valorTotal, resumoItens) {
    if (!nomeCliente) return;

    let cliente = db_clientes.find(c => c.nome.toLowerCase() === nomeCliente.toLowerCase());

    if (cliente) {
        cliente.debito += valorTotal;
        cliente.historico.push({ data: new Date().toLocaleDateString(), valor: valorTotal, itens: resumoItens });
    } else {
        db_clientes.push({
            nome: nomeCliente,
            debito: valorTotal,
            historico: [{ data: new Date().toLocaleDateString(), valor: valorTotal, itens: resumoItens }]
        });
    }
    salvarEShow();
    alert(`R$ ${valorTotal.toFixed(2)} pendurado para ${nomeCliente}`);
}

// --- 3. TABELA DE CLIENTES (RECEBIMENTO) ---
function renderizarClientes() {
    const lista = document.getElementById('listaClientes');
    if(!lista) return;

    lista.innerHTML = db_clientes.map((c, index) => `
        <div style="display:flex; justify-content:space-between; background:#1a1a1a; padding:15px; margin-bottom:5px; border-radius:5px;">
            <div>
                <b style="color:#ffcc00">${c.nome.toUpperCase()}</b><br>
                <small style="color:#ff4444">Dívida: R$ ${c.debito.toFixed(2)}</small>
            </div>
            <button onclick="receberPagamento(${index})" style="background:#25d366; border:none; color:#fff; padding:10px; border-radius:5px; cursor:pointer;">PAGAR</button>
        </div>
    `).join('');
}

function receberPagamento(index) {
    let valorPagar = parseFloat(prompt(`Quanto ${db_clientes[index].nome} está pagando?`, db_clientes[index].debito));
    if (valorPagar > 0) {
        db_clientes[index].debito -= valorPagar;
        if(db_clientes[index].debito <= 0) db_clientes.splice(index, 1); // Remove se quitou tudo
        salvarEShow();
    }
}

function salvarEShow() {
    localStorage.setItem('934_est', JSON.stringify(db_estoque));
    localStorage.setItem('934_cli', JSON.stringify(db_clientes));
    if (typeof render === "function") render(); // Atualiza sua tela principal
    renderizarClientes();
}
