<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Boteco 934 - Sistema Completo</title>
    <style>
        :root { --amarelo: #ffcc00; --azul: #2b579a; --preto: #0b0b0b; }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        body { background: var(--preto); color: #fff; }
        
        header { background: var(--amarelo); padding: 15px 30px; color: #000; display: flex; justify-content: space-between; align-items: center; }
        header h1 { font-size: 24px; font-weight: 900; }

        nav { background: #1a1a1a; display: flex; border-bottom: 1px solid #333; }
        .nav-item { padding: 15px 25px; cursor: pointer; color: #888; font-weight: bold; text-transform: uppercase; font-size: 12px; }
        .active { color: var(--amarelo); border-bottom: 3px solid var(--amarelo); background: rgba(255,204,0,0.05); }

        .container { padding: 20px; }
        .secao { display: none; }
        .ativa { display: block; }

        /* Estilo dos Inputs */
        .card-form { background: #161616; padding: 20px; border-radius: 10px; margin-bottom: 20px; display: flex; gap: 10px; align-items: center; border: 1px solid #333; }
        input { background: #222; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 6px; flex: 1; }
        button { background: var(--amarelo); color: #000; border: none; padding: 12px 25px; font-weight: bold; border-radius: 6px; cursor: pointer; text-transform: uppercase; }

        /* Tabela de Estoque */
        .tabela-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; background: var(--azul); padding: 12px; border-radius: 8px 8px 0 0; font-size: 12px; font-weight: bold; text-align: center; }
        .produto-linha { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; background: #fff; color: #000; border-bottom: 1px solid #eee; text-align: center; font-weight: bold; }
        .produto-linha div { padding: 12px; }

        /* Cards de Cliente */
        .cliente-card { background: #fff; color: #000; padding: 15px; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
        .badge-fone { background: #f0f0f0; padding: 5px 10px; border-radius: 5px; font-size: 13px; color: #333; display: flex; align-items: center; gap: 5px; }
    </style>
</head>
<body>

<header>
    <h1>934 BOTECO</h1>
    <span>SISTEMA COMPLETO</span>
</header>

<nav>
    <div class="nav-item active" onclick="mudar('estoque', this)">Estoque XML</div>
    <div class="nav-item" onclick="mudar('clientes', this)">Clientes / Contatos</div>
</nav>

<div class="container">
    <div id="estoque" class="secao ativa">
        <div class="card-form">
            <input type="file" id="xmlInput" accept=".xml">
            <button onclick="lancarXML()">Lançar no Firebase</button>
        </div>
        <div class="tabela-header">
            <div>PRODUTO</div><div>QTD</div><div>CUSTO</div><div>VENDA</div><div>LUCRO</div><div>%</div>
        </div>
        <div id="listaProdutos"></div>
    </div>

    <div id="clientes" class="secao">
        <div class="card-form">
            <input type="text" id="nomeCli" placeholder="Nome do Cliente">
            <input type="text" id="foneCli" placeholder="WhatsApp / Telefone">
            <button onclick="salvarCliente()">Cadastrar</button>
        </div>
        <h3 style="color: var(--amarelo); margin-bottom: 15px; font-size: 14px;">CLIENTES CADASTRADOS</h3>
        <div id="listaClientes"></div>
    </div>
</div>

<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

    const firebaseConfig = {
        apiKey: "AIzaSy...", 
        authDomain: "boteco934-afc3f.firebaseapp.com",
        databaseURL: "https://boteco934-afc3f-default-rtdb.firebaseio.com",
        projectId: "boteco934-afc3f",
        appId: "1:182023728304:web:040a13bb6f61c9fff35f75"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // --- ESTOQUE COM PROTEÇÃO CONTRA ERRO 'toFixed' ---
    onValue(ref(db, 'produtos'), (snapshot) => {
        const div = document.getElementById('listaProdutos');
        div.innerHTML = "";
        const dados = snapshot.val();
        if(dados) {
            Object.values(dados).forEach(p => {
                // Proteção: se o valor não existir, vira 0
                const custo = p.custo || 0;
                const venda = p.venda || 0;
                const lucro = p.lucro || 0;

                div.innerHTML += `
                <div class="produto-linha">
                    <div style="text-align:left">${p.nome || '---'}</div>
                    <div>${p.qtd || 0}</div>
                    <div style="background:#fff2cc">R$ ${custo.toFixed(2)}</div>
                    <div style="background:#d9e1f2">R$ ${venda.toFixed(2)}</div>
                    <div style="background:#fce4ec">R$ ${lucro.toFixed(2)}</div>
                    <div style="background:#e2efda">${p.margem || 0}%</div>
                </div>`;
            });
        }
    });

    // --- CLIENTES SEM O ERRO 'UNDEFINED' ---
    window.salvarCliente = function() {
        const nome = document.getElementById('nomeCli').value;
        const contato = document.getElementById('foneCli').value;
        if(!nome) return alert("Digite o nome!");
        
        push(ref(db, 'clientes'), { nome, contato: contato || "" }).then(() => {
            document.getElementById('nomeCli').value = "";
            document.getElementById('foneCli').value = "";
        });
    };

    onValue(ref(db, 'clientes'), (snapshot) => {
        const div = document.getElementById('listaClientes');
        div.innerHTML = "";
        const dados = snapshot.val();
        if(dados) {
            Object.values(dados).forEach(c => {
                // Se o contato for vazio ou undefined, mostra ícone cinza
                const foneDisplay = c.contato ? `📞 ${c.contato}` : "🚫 Sem fone";
                div.innerHTML += `
                <div class="cliente-card">
                    <span>👤 ${c.nome.toUpperCase()}</span>
                    <div class="badge-fone">${foneDisplay}</div>
                </div>`;
            });
        }
    });

    window.mudar = (id, el) => {
        document.querySelectorAll('.secao').forEach(s => s.classList.remove('ativa'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.getElementById(id).classList.add('ativa');
        el.classList.add('active');
    };
</script>
</body>
</html>
