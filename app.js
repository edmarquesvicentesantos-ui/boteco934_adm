// Funções para abrir/fechar o painel
function abrirPainelGerente() {
    document.getElementById('modal-gerente').classList.remove('hidden');
}

function fecharPainelGerente() {
    document.getElementById('modal-gerente').classList.add('hidden');
}

// OUVINTE PARA CALCULAR ENQUANTO VOCÊ DIGITA
document.getElementById('calc-custo').addEventListener('input', function() {
    const custo = parseFloat(this.value) || 0;
    if (custo > 0) {
        // MATEMÁTICA DO BOTECO 934
        const doseCustoBase = custo / 18;
        const doseComGelo = doseCustoBase + 0.70; // Custo operacional
        
        const precoDose = doseComGelo * 2.8; // Margem de 180% na dose
        const precoLitro = custo * 1.5;      // Margem de 50% na garrafa

        document.getElementById('sugestao-dose').innerText = `R$ ${precoDose.toFixed(2)}`;
        document.getElementById('sugestao-litro').innerText = `R$ ${precoLitro.toFixed(2)}`;
    }
});

// FUNÇÃO PARA SALVAR E JÁ CRIAR OS BOTÕES NO PDV
function salvarPrecos() {
    const nome = document.getElementById('calc-nome').value.toUpperCase();
    const precoDose = parseFloat(document.getElementById('sugestao-dose').innerText.replace('R$ ', ''));
    const precoLitro = parseFloat(document.getElementById('sugestao-litro').innerText.replace('R$ ', ''));

    if (!nome || precoDose <= 0) return alert("Preencha os dados!");

    // Adiciona a Dose
    produtos.push({
        id: Date.now(), // gera um id unico
        cat: "Doses",
        nome: `${nome} (DOSE)`,
        preco: precoDose
    });

    // Adiciona a Garrafa
    produtos.push({
        id: Date.now() + 1,
        cat: "Doses",
        nome: `${nome} (GARRAF)`,
        preco: precoLitro
    });

    alert("Produtos precificados e adicionados!");
    fecharPainelGerente();
    filtrar('Doses'); // Já mostra os novos botões
}
