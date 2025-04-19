document.getElementById("relatorioForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const dados = Object.fromEntries(new FormData(this).entries());

    const relatorios = JSON.parse(localStorage.getItem("relatorios")) || [];

    relatorios.push(dados);

    localStorage.setItem("relatorios", JSON.stringify(relatorios));

    alert("Relatório salvo com sucesso!");

    this.reset();
    mostrarRelatorios();
});

function mostrarRelatorios() {
    const lista = document.getElementById("listaRelatorios");
    lista.innerHTML = "";

    const relatorios = JSON.parse(localStorage.getItem("relatorios")) || [];

    relatorios.forEach((r, index) => {
        const item = document.createElement("li");
        item.innerHTML = `
            <strong>${r.data}</strong> - por <em>${r.preenchidoPor}</em>
            <button onclick="verDetalhes(${index})">Ver Detalhes</button>
        `;
        lista.appendChild(item);
    });
}

function verDetalhes(index) {
    const relatorios = JSON.parse(localStorage.getItem("relatorios")) || [];
    const r = relatorios[index];

    const detalhes = `
        📅 Data do Encontro: ${r.data}<br/>
        📝 Preenchido por: ${r.preenchidoPor}<br/><br/>
        👥 Quantos homens? ${r.homens}<br/>
        👩 Quantas mulheres? ${r.mulheres}<br/>
        👶 Quantas crianças? ${r.criancas}<br/>
        🙋‍♂️ Quantos convidados? ${r.convidados}<br/><br/>
        👤 Quem é o líder? ${r.lider}<br/>
        👥 Quem é o vice-líder? ${r.vice}<br/>
        👨‍🎓 Quem é o Timóteo? ${r.timoteo}<br/>
        🏡 Quem é o anfitrião? ${r.anfitriao}<br/><br/>
        🧾 Secretária 1: ${r.secretaria1}<br/>
        🧾 Secretária 2: ${r.secretaria2}<br/><br/>
        📖 Tema da Palavra: ${r.temaPalavra}<br/>
        ✍️ Quem ministrou a Palavra? ${r.ministrante}<br/>
        🧠 Pontos principais: ${r.pontosPalavra}
    `;

    document.getElementById("detalhesRelatorio").innerHTML = detalhes;

    // Mostrar modal
    document.getElementById("modal").style.display = "block";
}

document.querySelector(".close-btn").addEventListener("click", function() {
    document.getElementById("modal").style.display = "none";
});

function baixarCSV() {
    const relatorios = JSON.parse(localStorage.getItem("relatorios")) || [];

    if (relatorios.length === 0) {
        alert("Nenhum relatório salvo.");
        return;
    }

    const header = [
        "Data do Encontro", "Preenchido por", "Quantos homens?", "Quantas mulheres?", "Quantas crianças?", "Quantos convidados?",
        "Quem é o líder?", "Quem é o vice-líder?", "Quem é o Timóteo?", "Quem é o anfitrião?", "Secretária 1", "Secretária 2",
        "Tema da Palavra", "Quem ministrou a Palavra?", "Pontos principais da Palavra"
    ];

    const linhas = relatorios.map(r => [
        r.data, r.preenchidoPor, r.homens, r.mulheres, r.criancas, r.convidados,
        r.lider, r.vice, r.timoteo, r.anfitriao, r.secretaria1, r.secretaria2,
        r.temaPalavra, r.ministrante, r.pontosPalavra
    ]);

    const csv = [header.join(","), ...linhas.map(l => l.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relatorios.csv";
    link.click();
}

// Compartilhar link
document.getElementById("shareLinkBtn").addEventListener("click", function() {
    const url = window.location.href;
    const input = document.getElementById("shareLinkInput");
    input.value = url;
    input.select();
    document.execCommand("copy");
    alert("Link copiado para compartilhar!");
});
  
// Carregar relatórios ao iniciar
mostrarRelatorios();
