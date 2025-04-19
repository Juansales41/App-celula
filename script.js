// ✅ Configuração real do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAOsIlXR-XmdYoSvz0aHPGyRGOwB2_aVtg",
    authDomain: "yahweh-conect.firebaseapp.com",
    databaseURL: "https://yahweh-conect-default-rtdb.firebaseio.com/",
    projectId: "yahweh-conect",
    storageBucket: "yahweh-conect.appspot.com",
    messagingSenderId: "623530684157",
    appId: "1:623530684157:web:01c7a3ecd8cf0c04fc5894"
};

// ✅ Inicialização do Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ✅ Salvar relatório
document.getElementById("relatorioForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(this).entries());

    const relatoriosRef = database.ref('relatorios');
    const newRelatorioRef = relatoriosRef.push();
    newRelatorioRef.set(dados)
        .then(() => {
            alert("Relatório salvo com sucesso!");
            mostrarRelatorios();
            this.reset(); // Limpa o formulário
        })
        .catch((error) => {
            console.error("Erro ao salvar no Firebase: ", error);
        });
});

// ✅ Mostrar relatórios
function mostrarRelatorios() {
    const lista = document.getElementById("listaRelatorios");
    lista.innerHTML = "";

    const relatoriosRef = database.ref('relatorios');
    relatoriosRef.once('value', snapshot => {
        if (snapshot.exists()) {
            const relatorios = snapshot.val();
            for (let id in relatorios) {
                const r = relatorios[id];
                const item = document.createElement("li");
                item.innerHTML = `
                    <strong>${r.data}</strong> - por <em>${r.preenchidoPor}</em>
                    <button onclick="verDetalhes('${id}')">Ver Detalhes</button>
                `;
                lista.appendChild(item);
            }
        } else {
            lista.innerHTML = "Nenhum relatório encontrado.";
        }
    });
}

// ✅ Ver detalhes
function verDetalhes(id) {
    const relatorioRef = database.ref('relatorios/' + id);
    relatorioRef.once('value', snapshot => {
        const r = snapshot.val();
        const detalhes = `
            📅 Data do Encontro: ${r.data}<br/>
            📝 Preenchido por: ${r.preenchidoPor}<br/><br/>
            👥 Homens: ${r.homens}<br/>
            👩 Mulheres: ${r.mulheres}<br/>
            👶 Crianças: ${r.criancas}<br/>
            🙋‍♂️ Convidados: ${r.convidados}<br/><br/>
            👤 Líder: ${r.lider}<br/>
            👥 Vice-líder: ${r.vice}<br/>
            👨‍🎓 Timóteo: ${r.timoteo}<br/>
            🏡 Anfitrião: ${r.anfitriao}<br/><br/>
            🧾 Secretária 1: ${r.secretaria1}<br/>
            🧾 Secretária 2: ${r.secretaria2}<br/><br/>
            📖 Tema: ${r.temaPalavra}<br/>
            ✍️ Ministrante: ${r.ministrante}<br/>
            🧠 Pontos: ${r.pontosPalavra}
        `;
        document.getElementById("detalhesRelatorio").innerHTML = detalhes;
        document.getElementById("modal").style.display = "block";
    });
}

// ✅ Fechar modal
document.querySelector(".close-btn").addEventListener("click", function() {
    document.getElementById("modal").style.display = "none";
});

// ✅ Exportar CSV
document.getElementById("downloadCSVBtn").addEventListener("click", function() {
    const relatoriosRef = database.ref('relatorios');
    relatoriosRef.once('value', snapshot => {
        if (snapshot.exists()) {
            const relatorios = snapshot.val();
            const header = [
                "Data", "Preenchido por", "Homens", "Mulheres", "Crianças", "Convidados",
                "Líder", "Vice", "Timóteo", "Anfitrião", "Secretária 1", "Secretária 2",
                "Tema", "Ministrante", "Pontos"
            ];

            const linhas = [];
            for (let id in relatorios) {
                const r = relatorios[id];
                linhas.push([
                    r.data, r.preenchidoPor, r.homens, r.mulheres, r.criancas, r.convidados,
                    r.lider, r.vice, r.timoteo, r.anfitriao, r.secretaria1, r.secretaria2,
                    r.temaPalavra, r.ministrante, r.pontosPalavra
                ]);
            }

            const csv = [header.join(","), ...linhas.map(l => l.join(","))].join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "relatorios.csv";
            link.click();
        } else {
            alert("Nenhum relatório para exportar.");
        }
    });
});

// ✅ Compartilhar link
document.getElementById("shareLinkBtn").addEventListener("click", function() {
    const url = window.location.href;
    const input = document.getElementById("shareLinkInput");
    input.value = url;
    input.select();
    document.execCommand("copy");
    alert("Link copiado para compartilhar!");
});

// ✅ Mostrar ao carregar
mostrarRelatorios();
