:root {
    --bg-dark: #121212;
    --card-bg: #1e1e1e;
    --accent: #ffc107; /* Cor de cerveja/ouro */
    --text: #ffffff;
    --danger: #ff4444;
}

body { font-family: sans-serif; background: var(--bg-dark); color: var(--text); margin: 0; }
.container { display: flex; height: 100vh; }

.sidebar { width: 200px; background: #000; padding: 20px; border-right: 1px solid #333; }
.btn-categoria { background: #333; color: #fff; margin-top: 20px; width: 100%; border: none; padding: 10px; cursor: pointer; }

.grid-produtos { 
    display: grid; 
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
    gap: 15px; 
    padding: 20px; 
}

.card-produto {
    background: var(--card-bg);
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    border: 2px solid transparent;
}

.card-produto:hover { border-color: var(--accent); }
.critico { border-color: var(--danger) !important; background: #3d1a1a; }

.cupom-lateral { width: 350px; background: #f9f9f9; color: #333; padding: 20px; display: flex; flex-direction: column; }
.totalizador { margin-top: auto; border-top: 2px solid #ccc; padding-top: 10px; }
.btn-finalizar { width: 100%; padding: 20px; background: #28a745; color: white; border: none; font-size: 1.2rem; cursor: pointer; }
