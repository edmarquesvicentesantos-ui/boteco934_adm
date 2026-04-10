const firebaseConfig = {
    apiKey: "AIzaSyAxjhzLPeqBqJ18S8m7lagxuvF9LX7OJks",
    authDomain: "boteco934-afc3f.firebaseapp.com",
    projectId: "boteco934-afc3f",
    storageBucket: "boteco934-afc3f.firebasestorage.app",
    messagingSenderId: "182023728304",
    appId: "1:182023728304:web:040a13bb6f61c9fff35f75"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Desenha as mesas na tela
const container = document.getElementById('containerMesas');
if (container) {
    for (let i = 1; i <= 8; i++) {
        container.innerHTML += `
            <div class="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm text-center">
                <span class="block text-gray-400 text-xs font-bold uppercase">Mesa</span>
                <span class="text-3xl font-black text-gray-800">${i}</span>
                <div class="mt-2 text-green-500 text-[10px] font-bold uppercase italic">Livre</div>
            </div>`;
    }
}
