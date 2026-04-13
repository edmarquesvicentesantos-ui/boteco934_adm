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
