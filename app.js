function abrirModal(id) { document.getElementById(id).style.display = 'flex'; }
function fecharModal(id) { document.getElementById(id).style.display = 'none'; }

function salvarProduto() {
    const nome = document.getElementById('p-nome').value;
    const preco = document.getElementById('p-preco').value;
    if(nome && preco) {
        db.ref('produtos').push({ nome, preco_venda: parseFloat(preco) });
        alert("Salvo!");
        fecharModal('modal-produto');
    }
}
