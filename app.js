/* ==========================================================================
   Durga Pujo 2026 Countdown Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. CONFIGURATIONS & STATE
    // ----------------------------------------------------------------------
    const TARGETS = {
        shasthi: {
            name: "Maha Shasthi",
            date: new Date(2026, 9, 17, 0, 0, 0) // Oct 17, 2026 local time
        },
        mahalaya: {
            name: "Mahalaya",
            date: new Date(2026, 9, 10, 0, 0, 0) // Oct 10, 2026 local time
        }
    };

    let activeTargetKey = 'shasthi';
    let countdownInterval = null;

    // DOM References
    const btnShasthi = document.getElementById('btn-shasthi');
    const btnMahalaya = document.getElementById('btn-mahalaya');
    const toggleContainer = document.querySelector('.toggle-container');
    const labelTargetName = document.getElementById('current-target-name');
    
    const cardDays = document.querySelector('#card-days .number');
    const cardHours = document.querySelector('#card-hours .number');
    const cardMinutes = document.querySelector('#card-minutes .number');
    const cardSeconds = document.querySelector('#card-seconds .number');

    // ----------------------------------------------------------------------
    // 2. COUNTDOWN TIMER LOGIC
    // ----------------------------------------------------------------------
    function updateCountdown() {
        const now = new Date().getTime();
        const targetDate = TARGETS[activeTargetKey].date.getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            // Target date reached!
            cardDays.textContent = "00";
            cardHours.textContent = "00";
            cardMinutes.textContent = "00";
            cardSeconds.textContent = "00";
            labelTargetName.textContent = `${TARGETS[activeTargetKey].name} is Here!`;
            return;
        }

        // Time calculations
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Update elements with visual transitions if values change
        updateValueWithPulse(cardDays, days.toString().padStart(2, '0'));
        updateValueWithPulse(cardHours, hours.toString().padStart(2, '0'));
        updateValueWithPulse(cardMinutes, minutes.toString().padStart(2, '0'));
        updateValueWithPulse(cardSeconds, seconds.toString().padStart(2, '0'));
    }

    function updateValueWithPulse(element, newValue) {
        if (element.textContent !== newValue) {
            element.textContent = newValue;
            const card = element.parentElement;
            card.classList.add('pulse-glow');
            setTimeout(() => {
                card.classList.remove('pulse-glow');
            }, 300);
        }
    }

    function switchTarget(targetKey) {
        if (activeTargetKey === targetKey) return;
        activeTargetKey = targetKey;

        // Visual toggle adjustments
        toggleContainer.setAttribute('data-active', targetKey);
        
        if (targetKey === 'shasthi') {
            btnShasthi.classList.add('active');
            btnMahalaya.classList.remove('active');
            labelTargetName.textContent = "Maha Shasthi";
        } else {
            btnMahalaya.classList.add('active');
            btnShasthi.classList.remove('active');
            labelTargetName.textContent = "Mahalaya";
        }

        // Trigger immediate tick & recalculation
        updateCountdown();
    }

    // Bind Toggle Button events
    btnShasthi.addEventListener('click', () => switchTarget('shasthi'));
    btnMahalaya.addEventListener('click', () => switchTarget('mahalaya'));

    // Start ticker
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // ----------------------------------------------------------------------
    // 3. PUJO CALENDAR LOGIC (NIRGHONTO)
    // ----------------------------------------------------------------------
    function setupCalendarHighlights() {
        const currentDate = new Date();
        const items = document.querySelectorAll('.calendar-item');
        
        items.forEach(item => {
            const dateStr = item.getAttribute('data-date');
            const dateParts = dateStr.split('-');
            const targetDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]), 0, 0, 0);
            
            // Set end of day for comparison
            const endOfDay = new Date(targetDate);
            endOfDay.setHours(23, 59, 59, 999);

            if (currentDate > endOfDay) {
                // Day has already passed
                item.classList.add('passed');
                item.classList.remove('active');
            } else if (currentDate.toDateString() === targetDate.toDateString()) {
                // Active today
                item.classList.add('active');
                item.classList.remove('passed');
            } else {
                // Future day
                item.classList.remove('passed', 'active');
            }
        });
    }
    setupCalendarHighlights();

    // ----------------------------------------------------------------------
    // 4. SHIULI FLOWER PARTICLES SYSTEM (CANVAS RENDERER)
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('shiuli-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const maxParticles = 25; // Balanced performance for mobile

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class ShiuliFlower {
        constructor(x = null, y = null, isUserSpawned = false) {
            this.x = x !== null ? x : Math.random() * canvas.width;
            this.y = y !== null ? y : (isUserSpawned ? y : Math.random() * -100 - 20);
            this.size = Math.random() * 12 + 10; // Flower size: 10px to 22px
            this.speedY = Math.random() * 1.2 + 0.6; // Downward drift speed
            this.speedX = Math.random() * 0.8 - 0.4; // Gentle sway
            this.angle = Math.random() * Math.PI * 2; // Initial rotation angle
            this.spinSpeed = (Math.random() * 0.02 - 0.01) * 1.5; // Spin speed
            this.swayFreq = Math.random() * 0.02 + 0.01; // Horizontal sway frequency
            this.swayAmp = Math.random() * 15 + 10; // Horizontal sway amplitude
            this.startY = this.y;
        }

        update() {
            this.y += this.speedY;
            this.angle += this.spinSpeed;
            
            // Sway horizontally using sine wave
            this.x += Math.sin(this.y * this.swayFreq) * 0.15 + this.speedX;
            
            // Reset if out of bounds
            if (this.y - this.size > canvas.height) {
                this.y = Math.random() * -50 - 20;
                this.x = Math.random() * canvas.width;
                this.speedY = Math.random() * 1.2 + 0.6;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            // Draw 6 white petals arranged circularly
            ctx.fillStyle = '#ffffff';
            const petals = 6;
            for (let i = 0; i < petals; i++) {
                ctx.beginPath();
                ctx.rotate((Math.PI * 2) / petals);
                // Draw oval shape representing a petal
                ctx.ellipse(0, -this.size * 0.55, this.size * 0.35, this.size * 0.55, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw deep orange hollow/ring center (typical of Shiuli)
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.22, 0, Math.PI * 2);
            ctx.fillStyle = '#e64a19'; // Rich orange center
            ctx.fill();

            // Tiny yellow dot in the very middle
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.09, 0, Math.PI * 2);
            ctx.fillStyle = '#ffb300';
            ctx.fill();

            ctx.restore();
        }
    }

    // Populate initial flowers
    for (let i = 0; i < maxParticles; i++) {
        // Distribute initial vertical positions so they don't all fall in a bundle
        const initialFlower = new ShiuliFlower();
        initialFlower.y = Math.random() * canvas.height;
        particles.push(initialFlower);
    }

    // Spawn flowers on user clicks/touches
    window.addEventListener('pointerdown', (e) => {
        // Spawn 3 flowers at touch location
        for (let i = 0; i < 3; i++) {
            if (particles.length < 50) { // Limit max spawns for memory safety
                particles.push(new ShiuliFlower(e.clientX + (Math.random() * 30 - 15), e.clientY + (Math.random() * 30 - 15), true));
            }
        }
    });

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    animate();

    // ----------------------------------------------------------------------
    // 5. AMBIENT DHAK AUDIO SYNTHESIZER (WEB AUDIO API)
    // ----------------------------------------------------------------------
    let audioCtx = null;
    let schedulerTimer = null;
    let nextNoteTime = 0.0;
    let currentNote = 0; // 0 to 7 (8-step loop)
    let isPlaying = false;
    
    // Configurable state via sliders
    let tempo = 105.0; // BPM
    let volume = 0.7;  // 0.0 to 1.0
    let masterGainNode = null;

    // DOM Audio Controls
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    const floatingAudioBtn = document.getElementById('floating-audio-trigger');
    const tempoSlider = document.getElementById('tempo-slider');
    const volumeSlider = document.getElementById('volume-slider');
    
    const tempoValText = document.getElementById('tempo-val');
    const volumeValText = document.getElementById('volume-val');
    const soundStatusText = document.getElementById('sound-status-text');

    const playIcons = document.querySelectorAll('.play-icon');
    const pauseIcons = document.querySelectorAll('.pause-icon');

    function initAudio() {
        if (audioCtx) return;
        
        // Create context
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
        
        // Set master gain for volume control
        masterGainNode = audioCtx.createGain();
        masterGainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        masterGainNode.connect(audioCtx.destination);
    }

    // --- Web Audio Drum Synthesis Helpers ---
    
    // 1. Deep Bass Drum (Dhak)
    function playBassDrum(time) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(masterGainNode);
        
        osc.type = 'sine';
        
        // Ensure scheduling time is not in the past to avoid browser glitches
        const playTime = Math.max(time, audioCtx.currentTime);
        
        // Quick pitch drop representing the drum strike skin bounce
        osc.frequency.setValueAtTime(140, playTime);
        osc.frequency.linearRampToValueAtTime(45, playTime + 0.12);
        
        // Volume decay (linear ramp avoids Safari exponential range errors)
        gain.gain.setValueAtTime(1.0, playTime);
        gain.gain.linearRampToValueAtTime(0.01, playTime + 0.15);
        gain.gain.setValueAtTime(0.0, playTime + 0.16);
        
        osc.start(playTime);
        osc.stop(playTime + 0.18);
    }

    // 2. High Stick Rimshot (Stick)
    function playStickHit(time, strength = 0.3) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(masterGainNode);
        
        osc.type = 'triangle';
        
        const playTime = Math.max(time, audioCtx.currentTime);
        
        // Very fast high frequency decay representing wood strike
        osc.frequency.setValueAtTime(1200, playTime);
        osc.frequency.linearRampToValueAtTime(700, playTime + 0.03);
        
        gain.gain.setValueAtTime(strength, playTime);
        gain.gain.linearRampToValueAtTime(0.01, playTime + 0.04);
        gain.gain.setValueAtTime(0.0, playTime + 0.05);
        
        osc.start(playTime);
        osc.stop(playTime + 0.06);
    }

    // 3. Kansar (Metallic Bell Chime)
    function playKansar(time) {
        // Combine 3 clean high frequencies to form a resonant bronze dish strike sound
        const frequencies = [1180, 1540, 2150];
        const playTime = Math.max(time, audioCtx.currentTime);
        
        frequencies.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(masterGainNode);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, playTime);
            
            // Subtly different decay to sound organic
            const volumeCoeff = idx === 0 ? 0.09 : (idx === 1 ? 0.06 : 0.04);
            gain.gain.setValueAtTime(volumeCoeff, playTime);
            gain.gain.linearRampToValueAtTime(0.0, playTime + 0.38);
            
            osc.start(playTime);
            osc.stop(playTime + 0.4);
        });
    }

    // --- Rhythm Scheduler ---
    
    // Simple 8-step looping traditional rhythm
    function scheduleNote(noteNumber, time) {
        // Dhak pattern loop (8 steps)
        switch (noteNumber) {
            case 0:
                playBassDrum(time);
                playKansar(time);
                break;
            case 1:
                playStickHit(time, 0.15);
                break;
            case 2:
                playBassDrum(time);
                playKansar(time);
                break;
            case 3:
                // Double hit scheduler (Kiririri)
                playStickHit(time, 0.15);
                playStickHit(time + 0.08, 0.25);
                break;
            case 4:
                playBassDrum(time);
                playKansar(time);
                break;
            case 5:
                playStickHit(time, 0.15);
                break;
            case 6:
                playBassDrum(time);
                playStickHit(time, 0.2);
                playKansar(time);
                break;
            case 7:
                playStickHit(time, 0.35);
                // Extra bounce
                playStickHit(time + 0.06, 0.15);
                break;
        }
    }

    // Scheduler ticking loop
    function scheduler() {
        // Reset nextNoteTime if it falls behind due to tab suspend / backgrounding
        if (nextNoteTime < audioCtx.currentTime) {
            nextNoteTime = audioCtx.currentTime + 0.02;
        }

        // While there are notes to play before next interval, schedule them
        while (nextNoteTime < audioCtx.currentTime + 0.1) {
            scheduleNote(currentNote, nextNoteTime);
            
            // Advance time based on step (tempo)
            const secondsPerBeat = 60.0 / tempo;
            // 8-step cycle, each step is an eighth note (half beat)
            nextNoteTime += 0.25 * secondsPerBeat;
            
            currentNote = (currentNote + 1) % 8;
        }
        
        schedulerTimer = setTimeout(scheduler, 25);
    }

    // --- Controls and Interaction ---

    function startAudioEngine() {
        initAudio();
        
        // Resume context if suspended (browser security autoplay policy)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        isPlaying = true;
        currentNote = 0;
        nextNoteTime = audioCtx.currentTime + 0.05;
        
        // Start scheduler
        scheduler();

        // Enable sliders UI
        tempoSlider.removeAttribute('disabled');
        volumeSlider.removeAttribute('disabled');

        // Update UI States
        soundToggleBtn.classList.add('playing');
        floatingAudioBtn.classList.add('playing');
        floatingAudioBtn.classList.remove('muted');
        soundStatusText.textContent = "Stop Dhak Sound";

        playIcons.forEach(icon => icon.classList.add('hidden'));
        pauseIcons.forEach(icon => icon.classList.remove('hidden'));
    }

    function stopAudioEngine() {
        isPlaying = false;
        clearTimeout(schedulerTimer);

        // Disable sliders UI
        tempoSlider.setAttribute('disabled', 'true');
        volumeSlider.setAttribute('disabled', 'true');

        // Update UI States
        soundToggleBtn.classList.remove('playing');
        floatingAudioBtn.classList.remove('playing');
        floatingAudioBtn.classList.add('muted');
        soundStatusText.textContent = "Enable Dhak Sound";

        playIcons.forEach(icon => icon.classList.remove('hidden'));
        pauseIcons.forEach(icon => icon.classList.add('hidden'));
    }

    function toggleAudio() {
        if (isPlaying) {
            stopAudioEngine();
        } else {
            startAudioEngine();
        }
    }

    // Event Bindings
    soundToggleBtn.addEventListener('click', toggleAudio);
    floatingAudioBtn.addEventListener('click', toggleAudio);

    // Dynamic Controls
    tempoSlider.addEventListener('input', (e) => {
        tempo = parseInt(e.target.value);
        tempoValText.textContent = `${tempo} bpm`;
    });

    volumeSlider.addEventListener('input', (e) => {
        volume = parseInt(e.target.value) / 100;
        volumeValText.textContent = `${Math.round(volume * 100)}%`;
        if (masterGainNode) {
            masterGainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        }
    });

    // Handle spacebar / enter on floating widget for accessibility
    floatingAudioBtn.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggleAudio();
        }
    });

    // ----------------------------------------------------------------------
    // 6. PWA / MOBILE HOME INSTALLED PROMPT (Optional but elegant helper)
    // ----------------------------------------------------------------------
    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        installBtn.classList.remove('hidden');
    });

    installBtn.addEventListener('click', () => {
        if (!deferredPrompt) return;
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
            installBtn.classList.add('hidden');
        });
    });
});
