const state = {
    isScanning: false,
    stream: null,
    audio: {
        fiel: new Audio('assets/let-her-go.mp3'),
        infielWait: new Audio('assets/no-no-wait-wait.mp3'),
        infielVerdict: new Audio('assets/infiel.mp3')
    }
};

const reasons = {
    fiel: [
        "Rostro: Simetría pupilar consistente con la honestidad absoluta.",
        "Ropa: El estilo 'modesto' sugiere que no tiene nada que ocultar.",
        "Figura: Postura erguida que demuestra una conciencia tranquila.",
        "Rostro: Micro-expresiones de lealtad detectadas en los músculos orbiculares.",
        "Ropa: Combinación de colores que transmite confianza y estabilidad.",
        "Figura: Lenguaje corporal abierto, sin signos de ocultar el celular.",
        "Rostro: Reflejos oculares que demuestran cero chats archivados."
    ],
    infiel: [
        "Rostro: Leves espasmos en el iris al detectar la palabra 'WhatsApp'.",
        "Ropa: Outfit demasiado 'producido' para la ocasión, detectado intento de impresionar a terceros.",
        "Figura: Inclinación pélvica sospechosa hacia el lado del celular.",
        "Rostro: Detección de 456 'likes' sospechosos en su historial mental.",
        "Ropa: Perfume detectado digitalmente con notas de 'lo siento, me quedé dormido'.",
        "Figura: Tensión en los hombros típica de quien borra mensajes rápido.",
        "Figura: Patrón de parpadeo compatible con: 'Es solo un/a amigo/a'."
    ]
};

const elements = {
    video: document.getElementById('video-preview'),
    startBtn: document.getElementById('start-scan-btn'),
    uploadBtn: document.getElementById('upload-btn'),
    fileInput: document.getElementById('file-upload'),
    setupScreen: document.getElementById('setup-screen'),
    processingScreen: document.getElementById('processing-screen'),
    resultScreen: document.getElementById('result-screen'),
    verdictTitle: document.getElementById('result-verdict'),
    reasonText: document.getElementById('result-reason'),
    reasonContainer: document.getElementById('reason-container'),
    emoji: document.getElementById('result-emoji'),
    resetBtn: document.getElementById('reset-btn'),
    statusLog: document.getElementById('status-log')
};

// Initialize Camera
async function initCamera() {
    try {
        state.stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false
        });
        elements.video.srcObject = state.stream;
    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Por favor, permite el acceso a la cámara para usar el escáner.");
    }
}

// State Management
function showScreen(screen) {
    [elements.setupScreen, elements.processingScreen, elements.resultScreen].forEach(s => s.style.display = 'none');
    elements[screen].style.display = 'block';
}

function updateLog(messages) {
    elements.statusLog.innerHTML = '';
    messages.forEach((msg, i) => {
        setTimeout(() => {
            elements.statusLog.innerHTML += `> ${msg}<br>`;
        }, i * 1000);
    });
}

// Main Flow
function startScanning() {
    showScreen('processingScreen');

    updateLog([
        "Iniciando escaneo biométrico facial...",
        "Analizando fibras de la vestimenta...",
        "Calculando volumen y postura corporal...",
        "Analizando densidad de mentiras...",
        "Extrayendo historial de notificaciones...",
        "Calculando índice de arrepentimiento..."
    ]);

    setTimeout(finishScanning, 7500);
}

function finishScanning() {
    const isLoyal = Math.random() > 0.5;
    const verdict = isLoyal ? 'fiel' : 'infiel';
    const reasonList = reasons[verdict];
    const reason = reasonList[Math.floor(Math.random() * reasonList.length)];

    // Update UI
    elements.verdictTitle.textContent = verdict.toUpperCase();
    elements.verdictTitle.className = `verdict ${verdict}`;
    elements.reasonText.textContent = reason;
    elements.reasonContainer.className = `reason-box ${verdict}`;
    elements.emoji.textContent = isLoyal ? '😇' : '🤡';

    showScreen('resultScreen');

    // Play Audio
    if (isLoyal) {
        state.audio.fiel.play();
    } else {
        state.audio.infielWait.play();
        state.audio.infielWait.onended = () => {
            state.audio.infielVerdict.play();
        };
    }
}

// Event Listeners
elements.startBtn.addEventListener('click', startScanning);

elements.uploadBtn.addEventListener('click', () => {
    elements.fileInput.click();
});

elements.fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        startScanning();
    }
});

elements.resetBtn.addEventListener('click', () => {
    // Stop all audio
    Object.values(state.audio).forEach(a => {
        a.pause();
        a.currentTime = 0;
    });
    showScreen('setupScreen');
});

// Auto-start camera
initCamera();
