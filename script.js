// Roda ao carregar a página
document.addEventListener("DOMContentLoaded", checkCookies);

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function checkCookies() {
    const consent = getCookie("cookiesAccepted");
    if (consent !== "true") {
        document.getElementById("cookiePopup").classList.add("active");
    }
}

function acceptCookies() {
    document.cookie = "cookiesAccepted=true; path=/; max-age=" + 60 * 60 * 24 * 365;
    document.getElementById("cookiePopup").classList.remove("active");
}

function closeCookiePopup() {
    document.getElementById("cookiePopup").classList.remove("active");
}

const steps = [
    {
        title: "Objetivo de Comunicação",
        paragraph: "Defina uma intenção onde você compartilha algum conhecimento ou informação que educa o espectador.",
        placeholder: "Ex.: Mostrar que a criação de conteúdo pode ser mais natural e autêntica ao editar antes de gravar.",

    },
    {
        title: "Objetivo de Marketing",
        paragraph: "Defina a ação que você quer influenciar que pode, ou não, envolver dinheiro.",
        placeholder: "Ex.: Pedir para a pessoa clicar no link da bio para editar antes de gravar."
    },
    {
        title: "Temperatura do Público",
        paragraph: "Defina se sua audiência é homem ou mulher, a idade dela e o grau do que essa pessoa sabe até então.",
        placeholder: "Ex.: Homem, 30 anos, Frio, pois não sabe editar nenhum vídeo antes de gravar."
    },
    {
        title: "Big Idea",
        paragraph: "Defina a raiz que vai sustentar pedacinho do seu conteúdo. Imagine a Big Idea como a sua mãe. Cada coisa que você faz ou fala tem que obedecê-la. — 'E AI DE VOCÊ, SE NÃO OBEDECER!' — É melhor obedecer pras visualizações não ajudarem a sua mãe... 😅",
        placeholder: "Ex.: A partir de hoje você vai editar seus vídeos antes de gravar."
    },
    {
        title: "Final",
        paragraph: "Saber o final protege sua intenção por trás de tudo. Abrindo caminho para soltar pequenas pistas nas demais etapas do conteúdo. Ps.: Você pode alterar para encaixar no roteiro finalizado.",
        placeholder: "Final iniciando o roteiro: 'A Fiona casou com um ogro.' | Final do roteiro finalizado: 'Ali eu vi que a Fiona também não era humana.'"
    },
    {
        title: "Título",
        paragraph: "Além de ser a primeira pista, sem dar spoilers, o título identifica quem é o seu espectador.",
        placeholder: "Ex.: Com o que ou quem essa princesa se casou?"
    },
    {
        title: "Introdução",
        paragraph: "Agora que pessoa entrou na casa do seu conteúdo, você oferece açúcar pra dar mais sabor ao título.",
        placeholder: "Ex.: Será que ela tava enfeitiçada?"
    },
    {
        title: "Desenvolvimento",
        paragraph: "Comece a ligar cada pegada do título com o final ainda não revelado.",
        placeholder: "Ex.: Havia um colete marrom na mesa. Uma colônia verde ao meu redor. E pegadas enormes na entrada."
    },
    {
        title: "Clímax",
        paragraph: "Conduza a curiosidade do espectador numa escada, onde cada frase sobe na outra, elevando cada vez mais a expectativa do que virá.",
        placeholder: "Ex.: Ao sair, ouvi um urro tão alto, que o fundo das minhas calças foi pro chão. E conforme ele se aproximava, eu permanecia imóvel. E quando ele estava prestes a me atacar, ouviu-se uma voz feminina: 'Shrek, eu queria te dizer uma coisa.'"
    },
    {
        title: "CTA",
        paragraph: "Complemente o final com uma chamada para ação provocante.",
        placeholder: "Ex.: Se você é feio de trincar o espelho, mas ainda sim quer casar com uma princesa, entra no link da bio."
    }
];

function createHintForTextareas() {
    document.querySelectorAll('textarea.editable-area').forEach(area => {
        if (!area.nextElementSibling || !area.nextElementSibling.classList.contains('hint-drag')) {
            const hint = document.createElement('div');
            hint.className = 'hint-drag';
            hint.innerText = '↘️ você pode arrastar o canto inferior direito para aumentar ou diminuir o campo';
            area.insertAdjacentElement('afterend', hint);
        }
    });
}

// Executa após todos os elementos serem carregados dinamicamente
const observer = new MutationObserver(() => {
    createHintForTextareas();
});

observer.observe(document.getElementById('formSteps'), { childList: true, subtree: true });

let currentStep = 0;
let answers = JSON.parse(localStorage.getItem("answers") || "[]");

const formStepsDiv = document.getElementById("formSteps");
const formControls = document.getElementById("formControls");
const summaryDiv = document.getElementById("summary");

function saveToLocalStorage() {
    localStorage.setItem("answers", JSON.stringify(answers));
}

function renderStep() {
    const step = steps[currentStep];
    formStepsDiv.innerHTML = `
    <div class="step active">
      <label>${step.title}</label>
      ${step.paragraph ? `<p class="step-description">${step.paragraph}</p>` : ""}
      <textarea 
        placeholder="${step.placeholder}" 
        oninput="updateAnswer(event); autoResizeTextarea(this);" 
        id="stepInput"
        class="editable-area"
      >${answers[currentStep] || ""}</textarea>
    </div>
  `;
    renderControls();
    
    const textarea = document.getElementById("stepInput");

    // Corrige o bug: aguarda o textarea estar renderizado para calcular o scrollHeight corretamente
    setTimeout(() => {
        autoResizeTextarea(textarea);
    }, 0);
}

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}


function updateAnswer(e) {
    answers[currentStep] = e.target.value;
    saveToLocalStorage();
    renderSummary();
}

function renderControls() {
    formControls.innerHTML = '';

    if (currentStep > 0) {
        const backBtn = document.createElement("button");
        backBtn.textContent = "Voltar";
        backBtn.onclick = () => {
            currentStep--;
            renderStep();
        };
        formControls.appendChild(backBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = currentStep === steps.length - 1 ? "Finalizar" : "Próximo";
    nextBtn.onclick = () => {
        const input = document.getElementById("stepInput");
        if (!input.value.trim()) return alert("Preencha o campo antes de continuar...");
        if (currentStep < steps.length - 1) {
            currentStep++;
            renderStep();
        } else {
            showFinalPopup();
        }
    };
    formControls.appendChild(nextBtn);
}

function renderSummary() {
    summaryDiv.innerHTML = steps.map((step, index) => {
        return `<p><strong>${step.title}:</strong> ${answers[index] || ""}</p>`;
    }).join("");
}

function showFinalPopup() {
    const popup = document.getElementById("finalPopup");
    popup.innerHTML = `
        <div class="popup-content">
          <h2>Roteiro Finalizado!</h2>
          <p>Escolha o que fazer com seu roteiro:</p>
          <button onclick="copyScript()">📋 Copiar Roteiro</button>
          <button onclick="downloadScript()">⬇️ Baixar .txt agora</button>
          <button onclick="closeFinalPopup()">✅ Ok</button>
        </div>
      `;
    popup.classList.add("active");
}

function getFullScript() {
    return steps.map((step, index) => {
        const answer = answers[index] || "";
        return `${step.title}:\n${answer}\n`;
    }).join("\n");
}

function copyScript() {
    const script = getFullScript();
    navigator.clipboard.writeText(script)
        .then(() => showMessage("Roteiro copiado com sucesso!"))
        .catch(() => showMessage("Erro ao copiar o roteiro", "error"));
}

function downloadScript() {
    const script = getFullScript();
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roteiro-edite-antes-de-gravar.txt";
    a.click();
    URL.revokeObjectURL(url);
}

function closeFinalPopup() {
    document.getElementById("finalPopup").classList.remove("active");
}

function showMessage(text, type = "success") {
    const message = document.createElement("div");
    message.className = `custom-message ${type}`;
    message.textContent = text;

    // Adiciona no topo do body
    document.body.appendChild(message);

    // Remove depois de 3 segundos
    setTimeout(() => {
        message.remove();
    }, 3000);
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// ----- COOKIES -----

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/";
}

function getCookie(name) {
    return document.cookie.split("; ").find(row => row.startsWith(name + "="));
}

function acceptCookies() {
    setCookie("cookieAccepted", "true", 365);
    closeCookiePopup();
}

function closeCookiePopup() {
    document.getElementById("cookiePopup").classList.remove("active");
}

// Verifica se o cookie já existe
window.onload = () => {
    if (getCookie("cookieAccepted")) {
        closeCookiePopup();
    }
    renderStep();
    renderSummary();
};

// Função para limpar e gerar nome válido para arquivo a partir do título
function sanitizeFileName(text) {
    if (!text) return "roteiro-edite-antes-de-gravar.txt";
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")  // remove caracteres especiais
        .replace(/\s+/g, "-")          // espaços viram hífen
        + ".txt";
}

function showFinalPopup() {
    const popup = document.getElementById("finalPopup");
    popup.innerHTML = `
        <div class="popup-content">
          <h2>Roteiro Finalizado!</h2>
          <p>Escolha o que fazer com seu roteiro:</p>
          <button onclick="copyScript()">📋 Copiar Roteiro</button>
          <button onclick="downloadScript()">⬇️ Baixar .txt agora</button>
          <button onclick="openSaveAsModal()">💾 Salvar Como</button>
          <button onclick="closeFinalPopup()">✅ Ok</button>
        </div>
      `;
    popup.classList.add("active");
}

// Botão “Salvar Como” abre modal customizado
function openSaveAsModal() {
    const title = answers[5] || "";
    const defaultFileName = sanitizeFileName(title);
    const modal = document.getElementById("saveAsModal");
    modal.querySelector("input").value = defaultFileName;
    modal.classList.add("active");
}

// Fecha modal “Salvar Como”
function closeSaveAsModal() {
    document.getElementById("saveAsModal").classList.remove("active");
}

// Salva arquivo com nome personalizado do input
function saveAsCustomFileName() {
    const modal = document.getElementById("saveAsModal");
    const input = modal.querySelector("input");
    let fileName = input.value.trim();
    if (!fileName) {
        alert("Por favor, insira um nome válido para o arquivo.");
        return;
    }
    // Garante extensão .txt
    if (!fileName.toLowerCase().endsWith(".txt")) {
        fileName += ".txt";
    }
    const script = getFullScript();
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    closeSaveAsModal();
    showMessage(`Arquivo salvo como "${fileName}"`);
}


// Função para mostrar mensagens temporárias na tela
function showMessage(msg, type = "success") {
  // Cria um elemento temporário
  let messageEl = document.createElement("div");
  messageEl.className = `toast-message ${type}`; // estilos podem ser definidos no CSS
  messageEl.textContent = msg;
  document.body.appendChild(messageEl);

  // Remove após 3 segundos
  setTimeout(() => {
    messageEl.classList.add("fade-out");
    setTimeout(() => document.body.removeChild(messageEl), 500);
  }, 3000);
}

// Funções para abrir e fechar o popup final
function showFinalPopup() {
  const popup = document.getElementById("finalPopup");
  popup.classList.remove("hidden");
  popup.classList.add("active");
  removeDarkOverlay(); // Remove escurecimento para garantir

  // Constrói conteúdo fixo para garantir listeners
  popup.innerHTML = `
    <div class="popup-content" tabindex="0">
      <h2>Roteiro finalizado! O que deseja fazer?</h2>
      <div id="popupAviso" class="popup-aviso hidden"></div>
      <div class="popup-buttons">
        <button id="btnCopy">Copiar Roteiro</button>
        <button id="btnDownload">Baixar .txt agora</button>
        <button id="btnSaveAs">Salvar como</button>
        <button id="btnNew">Criar Novo Roteiro</button>
        <button id="btnEdit">Editar Roteiro Atual</button>
      </div>
    </div>
  `;

  document.getElementById("btnCopy").addEventListener("click", copyScript);
  document.getElementById("btnDownload").addEventListener("click", downloadScript);
  document.getElementById("btnSaveAs").addEventListener("click", openSaveAsModal);
  document.getElementById("btnEdit").addEventListener("click", editCurrentScript);
  document.getElementById("btnNew").addEventListener("click", openConfirmNewModal);
}

function closeFinalPopup() {
  const popup = document.getElementById("finalPopup");
  popup.classList.add("hidden");
  popup.classList.remove("active");
  removeDarkOverlay();
}

// Função para adicionar/remover overlay escurecido
function addDarkOverlay() {
  document.body.classList.add("overlay-active");
}
function removeDarkOverlay() {
  document.body.classList.remove("overlay-active");
}

// Copiar roteiro com feedback
function copyScript() {
  const script = getFullScript();
  navigator.clipboard.writeText(script)
    .then(() => {
      showMessage("Roteiro copiado com sucesso!");
      closeFinalPopup();
    })
    .catch(() => showMessage("Erro ao copiar o roteiro", "error"));
}

// Download do roteiro
function downloadScript() {
  const script = getFullScript();
  const blob = new Blob([script], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = sanitizeFileName(answers[5]) || "roteiro.txt";
  a.click();
  URL.revokeObjectURL(url);
  closeFinalPopup();
}

// Abrir modal salvar como
function openSaveAsModal() {
  closeFinalPopup();
  const modal = document.getElementById("saveAsModal");
  modal.classList.remove("hidden");
  addDarkOverlay();

  // Foca no input para melhor UX
  document.getElementById("saveAsFilename").focus();
}

// Fechar modal salvar como
function closeSaveAsModal() {
  const modal = document.getElementById("saveAsModal");
  modal.classList.add("hidden");
  removeDarkOverlay();
}

// Confirmar salvar como
function confirmSaveAs() {
  const filenameInput = document.getElementById("saveAsFilename");
  let filename = filenameInput.value.trim();
  if (!filename) {
    alert("Por favor, informe um nome válido para o arquivo.");
    filenameInput.focus();
    return;
  }
  const script = getFullScript();
  const blob = new Blob([script], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = sanitizeFileName(filename) + ".txt";
  a.click();
  URL.revokeObjectURL(url);
  closeSaveAsModal();
  showMessage("Arquivo salvo com sucesso!");
}

// Editar roteiro atual
function editCurrentScript() {
  closeFinalPopup();
  removeDarkOverlay();
  // Voltar para o passo atual e renderizar para editar
  renderStep();
}

// Abrir modal confirmar novo roteiro
function openConfirmNewModal() {
  closeFinalPopup();
  const modal = document.getElementById("confirmNewModal");
  modal.classList.remove("hidden");
  addDarkOverlay();
}

// Fechar modal confirmar novo roteiro
function closeConfirmNewModal() {
  const modal = document.getElementById("confirmNewModal");
  modal.classList.add("hidden");
  removeDarkOverlay();
}

// Confirmar criar novo roteiro
function confirmNewScriptAction() {
  answers = [];
  saveToLocalStorage();
  currentStep = 0;
  renderStep();
  closeConfirmNewModal();
  showMessage("Novo roteiro iniciado!");
}

// Sanitizar nome do arquivo (remove caracteres inválidos)
function sanitizeFileName(name) {
  return name ? name.replace(/[^a-z0-9_\- ]/gi, '').trim() : "roteiro";
}

// --- Event listeners para modais ---

document.getElementById("saveAsConfirm").addEventListener("click", confirmSaveAs);
document.getElementById("saveAsCancel").addEventListener("click", closeSaveAsModal);

document.getElementById("confirmNewYes").addEventListener("click", confirmNewScriptAction);
document.getElementById("confirmNewNo").addEventListener("click", closeConfirmNewModal);

// Opcional: fechar modais clicando fora do conteúdo
document.querySelectorAll(".popup-overlay").forEach(overlay => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      if (!overlay.classList.contains("hidden")) {
        // Fecha modais específicos
        if (overlay.id === "saveAsModal") closeSaveAsModal();
        else if (overlay.id === "confirmNewModal") closeConfirmNewModal();
      }
    }
  });
});
