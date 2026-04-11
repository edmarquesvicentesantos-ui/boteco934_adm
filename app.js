.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
    padding: 10px;
}

.card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px;
    text-align: center;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
}

.info {
    display: flex;
    flex-direction: column;
    margin: 5px 0;
    font-size: 0.9em;
}

.nome { font-weight: bold; }
.preco { color: #2ecc71; }

.btn-add {
    display: block;
    background: #3498db;
    color: white;
    text-decoration: none;
    padding: 5px;
    border-radius: 4px;
    font-size: 0.8em;
    transition: 0.3s;
}

.btn-add:hover { background: #2980b9; }
