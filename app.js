// 1. SEU ESTOQUE (Você pode mudar os preços aqui)
let produtos = [
    { id: 101, nome: "Cerveja 600ml", preco: 10.00 },
    { id: 102, nome: "Dose Whisky", preco: 15.00 },
    { id: 103, nome: "Refrigerante", preco: 6.00 },
    { id: 201, nome: "Perfume Boticário", preco: 120.00 }
];

// 2. ESTADO DAS MESAS
let mesaSelecionada = null;
let mesas = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    ocupada: false,
    cliente: "",
    total: 0,
    pedidos: []
}));

// 3. FUNÇÃO PARA SALVAR (Para não perder os dados)
function salvarNoNavegador() {
    localStorage.setItem('boteco934_dados', JSON.stringify(mesas));
}

// 4. FUNÇÃO PARA CARREGAR O QUE FOI SALVO
function carregarDados() {
    const salvo = localStorage.getItem('boteco934_dados');
    if (salvo) {
        mesas = JSON.parse(salvo);
        renderizarMesas();
    }
}

// 5. MOSTRAR AS MESAS NA TELA
function renderizarMesas() {
    const grid = document.getElementById('grid-mesas');
    if(!grid) return; 

    grid.innerHTML = mesas.map(m => `
        <div class="card-mesa ${m.ocupada ? 'status-ocupada' : 'status-livre'}" 
             onclick="${m.ocupada ? `abrirPainelVenda(${m.id})` : `prepararAbertura(${m.id})`}">
            <div class="mesa-header">Mesa ${m.id}</div>
            <div class="mesa-body">
                <strong>${m.ocupada ? m.cliente : 'LIVRE'}</strong>
                <p>${m.ocupada ? 'R$ ' + m.total.toFixed(2) : '---'}</p>
            </div>
        </div>
    `).join('');
}

// 6. ABRIR MESA (PEDIR NOME)
function prepararAbertura(id) {
    mesaSelecionada = id;
    const nome = prompt("Nome do Cliente:");
    if (nome) {
        const mesa = mesas.find(m => m.id === id);
        mesa.ocupada = true;
        mesa.cliente = nome;
        salvarNoNavegador();
        renderizarMesas();
    }
}

// 7. LANÇAR PRODUTO NA MESA
function abrirPainelVenda(id) {
    mesaSelecionada = id;
    const mesa = mesas.find(m => m.id === id);
    
    // Aqui você pode usar um prompt simples para testar agora
    const listaProdutos = produtos.map(p => `${p.id}: ${p.nome} (R$ ${p.preco})`).join('\n');
    const escolha = prompt(`Mesa de ${mesa.cliente}\nDigite o código do produto:\n${listaProdutos}`);
    
    const produtoEncontrado = produtos.find(p => p.id == escolha);
    
    if (produtoEncontrado) {
        mesa.total += produtoEncontrado.preco;
        mesa.pedidos.push(produtoEncontrado.nome);
        alert(`${produtoEncontrado.nome} adicionado!`);
        salvarNoNavegador();
        renderizarMesas();
    }
}

// Iniciar o sistema
carregarDados();
renderizarMesas();
