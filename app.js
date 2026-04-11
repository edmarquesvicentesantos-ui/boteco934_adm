body { font-family: sans-serif; padding: 20px; background: #fff; }
.controles-topo { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.btn-azul { background: #007bff; color: white; border: none; padding: 10px; border-radius: 4px; }
.btn-ciano { background: #17a2b8; color: white; border: none; padding: 10px; border-radius: 4px; }
.btn-fechar { background: #28a745; color: white; border: none; padding: 12px; border-radius: 5px; font-weight: bold; width: 200px; cursor: pointer; }
.grade { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 15px; margin: 20px 0; }
.card-prod { border: 1px solid #ccc; padding: 15px; text-align: center; border-radius: 8px; cursor: pointer; }

/* MODAIS */
.modal { display: none; position: fixed; z-index: 999; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); align-items: center; justify-content: center; }
.modal-content { background: #fff; padding: 25px; border-radius: 12px; width: 320px; border: 1px solid #000; display: flex; flex-direction: column; gap: 10px; }
