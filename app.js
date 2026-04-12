import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const db = getDatabase();
const produtosRef = ref(db, 'produtos'); // Conecta na pasta 'produtos' da sua foto

// Esta função monitora o Firebase 24h por dia
onValue(produtosRef, (snapshot) => {
    const listaProdutos = document.getElementById('corpoEstoque'); // Onde os produtos aparecem
    listaProdutos.innerHTML = ""; // Limpa a tabela antes de carregar
    
    const dados = snapshot.val();
    
    if (dados) {
        // Transforma os dados do Firebase em linhas da sua tabela
        Object.keys(dados).forEach((id) => {
            const p = dados[id];
            listaProdutos.innerHTML += `
                <tr>
                    <td><img src="${p.foto || 'placeholder.png'}" width="50"></td>
                    <td>${p.nome}</td>
                    <td>${p.qtd_pacote || 0}</td>
                    <td>R$ ${p.venda_uni.toFixed(2)}</td>
                    <td class="c-custo">R$ ${p.custo.toFixed(2)}</td>
                    <td style="background:#fce4ec">R$ ${p.lucro.toFixed(2)}</td>
                    <td style="background:#e8f5e9; color:green">${p.margem}%</td>
                </tr>
            `;
        });
    } else {
        listaProdutos.innerHTML = "<tr><td colspan='7'>Nenhum produto no estoque online.</td></tr>";
    }
});
