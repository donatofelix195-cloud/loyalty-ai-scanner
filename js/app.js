console.log("Loyalty AI App Initializing...");

const state = {
    isScanning: false,
    stream: null,
    audio: {
        fiel: [
            new Audio('assets/let-her-go.mp3'),
            new Audio('assets/angel-choir.mp3'),
            new Audio('assets/siuuu.mp3'),
            new Audio('assets/viva-venezuela.mp3')
        ],
        infiel: [
            new Audio('assets/no-no-wait-wait.mp3'),
            new Audio('assets/infiel.mp3'),
            new Audio('assets/infiel-drama.mp3'),
            new Audio('assets/emotional-damage.mp3'),
            new Audio('assets/expropiese.mp3'),
            new Audio('assets/gta-wasted.mp3'),
            new Audio('assets/maduro-rolo.mp3'),
            new Audio('assets/mamaguevo.mp3'),
            new Audio('assets/oh-no-tiktok-v2.mp3')
        ]
    }
};

// Diagnostic: Check if audio files are valid
Object.entries(state.audio).forEach(([type, list]) => {
    list.forEach((audio, i) => {
        audio.addEventListener('error', (e) => {
            console.warn(`Audio ${type}[${i}] failed to load: ${audio.src}`);
        });
        // Pre-load
        audio.load();
    });
});

const reasons = {
    fiel: [
        "Rostro: Simetría pupilar fina, este pana no anda en vainas raras.",
        "Ropa: Anda vestido sencillo, no anda buscando que lo miren en el C.C.T.",
        "Figura: Postura derechita, tiene la conciencia más limpia que el Ávila un lunes.",
        "Rostro: Micro-expresiones de lealtad, se nota que no tiene chats con 'Juan Mecánico'.",
        "Ropa: Colores serios, transmite una confianza nivel 'pana de toda la vida'.",
        "Figura: Lenguaje corporal abierto, no anda escondiendo el perol (celular) de nadie.",
        "Rostro: Mirada de cristal, ese no sabe lo que es archivar un chat de WhatsApp.",
        "Rostro: Parpadeo legal, no anda inventando cuentos de camino.",
        "Ropa: Anda así como que para estar en casa, cero intención de 'buhonear' miradas.",
        "Figura: Ángulo de honestidad activado, este es un 'beta' serio.",
        "Rostro: Las pupilas solo se le dilatan cuando ve una empanada o a su pareja.",
        "Ropa: Esa franela no tiene rastros de labial ni olores a perfume 'ajeno'.",
        "Figura: Las manos afuera, nada de andar puyando el teclado a escondidas.",
        "Rostro: Mirada fija, no le baja la vista ni al Sebin.",
        "Ropa: Anda bien planchadito, señal de que tiene su vida en orden.",
        "Figura: Caminado firme, ese no tiene miedo que le tumben el patrón de desbloqueo."
    ],
    infiel: [
        "Rostro: Tiene un tic en el ojo cada vez que escucha la palabra 'mensaje'. ¡Qué raya!",
        "Ropa: Anda demasiado 'picao' a galán con ese outfit un martes, eso es sospechoso.",
        "Figura: Anda todo encorvado tapando el celular, ¡tremendo bicho!",
        "Rostro: Se le ven los 500 'likes' que le dio a la chama de ayer en su historial mental.",
        "Ropa: Huele a perfume importado y dijo que venía de jugar caimanera. ¡Muerde el peine!",
        "Figura: Tensión en los hombros, ese borra los mensajes más rápido que un motorizado en cola.",
        "Figura: Parpadeo de 'Mentira Fresca', ese cuento de que 'es solo una amiga' no se lo cree nadie.",
        "Rostro: Se le mueve la ceja cuando le preguntan: ¿Y quién es ese/a?",
        "Ropa: Anda con medias diferentes, salió corriendo de algún lado por el balcón.",
        "Figura: Postura defensiva nivel 'estoy cuidando el tesoro', o sea, el WhatsApp.",
        "Rostro: Parpadea más que un arbolito de Navidad cuando le pides la clave.",
        "Ropa: ¿Ropa interior de estreno un miércoles? ¡Ese huevo quiere sal!",
        "Figura: Reflejos de gato para voltear el celular cuando llega un DM.",
        "Rostro: Tiene una sonrisa de 'yo no fui' que ni él mismo se la cree.",
        "Ropa: Usa hoodie gigante para que no se vea el brillo del celular de noche.",
        "Figura: Mano rápida para cambiar de app en la calle, ¡más rápido que un carterista!",
        "Rostro: Sudando frío porque reconoció el perfume de la ex en el ambiente."
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
    console.log("Attempting to access camera...");
    try {
        state.stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false
        });
        elements.video.srcObject = state.stream;
        console.log("Camera access granted.");
    } catch (err) {
        console.error("Error accessing camera:", err);
        // Fallback or alert
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            alert("La cámara requiere HTTPS para funcionar en la web.");
        } else {
            alert("No se pudo acceder a la cámara. Prueba subiendo una foto.");
        }
    }
}

// State Management
function showScreen(screen) {
    console.log("Switching to screen:", screen);
    [elements.setupScreen, elements.processingScreen, elements.resultScreen].forEach(s => s.style.display = 'none');
    elements[screen].style.display = 'block';
}

function updateLog(messages) {
    elements.statusLog.innerHTML = '';
    messages.forEach((msg, i) => {
        setTimeout(() => {
            elements.statusLog.innerHTML += `> ${msg}<br>`;
        }, i * 1200);
    });
}

// Main Flow
function startScanning() {
    console.log("Scan started.");
    showScreen('processingScreen');

    updateLog([
        "Pillando facciones con el satélite...",
        "Analizando si esa pinta es de marca o de los guajiros...",
        "Viendo si anda más tenso que el dólar paralelo...",
        "Calculando el índice de 'Mentira Fresca'...",
        "Hackeando el historial de notificaciones del perol...",
        "Viendo si hay arrepentimiento o puro cuento..."
    ]);

    setTimeout(finishScanning, 7500);
}

function finishScanning() {
    console.log("Scan finished. Calculating result...");
    const isLoyal = Math.random() > 0.5;
    const verdict = isLoyal ? 'fiel' : 'infiel';
    const reasonList = reasons[verdict];
    const reason = reasonList[Math.floor(Math.random() * reasonList.length)];

    // Update UI (but don't show the screen yet to sync with audio reveal)
    elements.verdictTitle.textContent = verdict.toUpperCase();
    elements.verdictTitle.className = `verdict ${verdict}`;
    elements.reasonText.textContent = reason;
    elements.reasonContainer.className = `reason-box ${verdict}`;
    elements.emoji.textContent = isLoyal ? '😇' : '🤡';

    const handleAudioError = (e, sound) => {
        console.warn("Autoplay blocked. Press or click to hear sound.", e);
        document.body.addEventListener('click', () => {
            sound.play();
            showScreen('resultScreen');
        }, { once: true });
    };

    const playResult = () => {
        const list = state.audio[verdict];

        // Reset all sounds first
        Object.values(state.audio).flat().forEach(a => {
            a.pause();
            a.currentTime = 0;
        });

        if (isLoyal) {
            // Pick random between all available faithful sounds
            const sound = list[Math.floor(Math.random() * list.length)];
            console.log(`Playing faithful sound: ${sound.src}`);
            showScreen('resultScreen');
            sound.play().catch(e => handleAudioError(e, sound));
        } else {
            // INFIDEL: Higher drama
            const wait = state.audio.infiel[0]; // no-no-wait-wait
            const dramaSounds = state.audio.infiel.slice(1);
            const drama = dramaSounds[Math.floor(Math.random() * dramaSounds.length)];

            const randomType = Math.random();
            if (randomType > 0.4) {
                // Combo: Wait + Drama reveal
                console.log("Playing infidelity combo (Wait + Randomized Drama)");
                wait.play().then(() => {
                    setTimeout(() => {
                        showScreen('resultScreen');
                        drama.play().catch(err => console.error(err));
                    }, 1500);
                }).catch(e => {
                    showScreen('resultScreen');
                    drama.play().catch(err => handleAudioError(err, drama));
                });
            } else {
                // Direct reveal with a random drama sound
                console.log("Playing immediate infidelity drama");
                showScreen('resultScreen');
                drama.play().catch(e => handleAudioError(e, drama));
            }
        }
    };

    playResult();
}

// Event Listeners
if (elements.startBtn) {
    elements.startBtn.addEventListener('click', startScanning);
}

if (elements.uploadBtn) {
    elements.uploadBtn.addEventListener('click', () => {
        elements.fileInput.click();
    });
}

if (elements.fileInput) {
    elements.fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            startScanning();
        }
    });
}

if (elements.resetBtn) {
    elements.resetBtn.addEventListener('click', () => {
        // Stop all audio
        Object.values(state.audio).flat().forEach(a => {
            a.pause();
            a.currentTime = 0;
        });
        showScreen('setupScreen');
    });
}

// Auto-start camera
initCamera();
