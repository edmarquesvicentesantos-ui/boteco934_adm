// --- LER CLIENTES SEM O ERRO 'UNDEFINED' ---
onValue(ref(db, 'clientes'), (snapshot) => {
    const div = document.getElementById('listaClientes');
    div.innerHTML = "";
    const dados = snapshot.val();
    
    if(dados) {
        Object.values(dados).forEach((c) => {
            // Verifica se o contato existe, senão coloca um aviso
            const telefone = c.contato ? c.contato : "Sem contato";
            
            div.innerHTML += `
            <div class="cliente-item" style="background: #fff; color: #000; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
                <span style="font-size: 18px;">👤 ${c.nome.toUpperCase()}</span>
                <span style="background: #eee; padding: 5px 10px; border-radius: 4px; color: #333; font-size: 14px;">
                    📞 ${telefone}
                </span>
            </div>`;
        });
    } else {
        div.innerHTML = "<div style='color: #888; text-align: center;'>Nenhum cliente cadastrado.</div>";
    }
});
