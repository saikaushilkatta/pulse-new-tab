// --- 1. Live Neon Clock ---
function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    clockElement.textContent = timeString;
}


updateClock();
setInterval(updateClock, 1000);


// --- 2. Interactive Particle Network ---
const canvas = document.getElementById('kinetix-canvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Track mouse position
let mouse = {
    x: null,
    y: null,
    radius: 150 
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Remove mouse coordinates when it leaves the screen
window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Update canvas size if the window is resized
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Create Particle object
class Particle {
    constructor(x, y, dx, dy, size) {
        this.x = x;
        this.y = y;
        this.dx = dx; // X velocity
        this.dy = dy; // Y velocity
        this.size = size;
    }

    // Draw the particle dot
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#00ffff'; // Neon cyan
        ctx.fill();
    }

    // Move the particle and bounce off edges
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.dx = -this.dx;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

let particlesArray = [];

// Fill the array with random particles
function init() {
    particlesArray = [];
    // Adjust the density based on screen size
    let numberOfParticles = (canvas.width * canvas.height) / 9000;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
        let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
        let dx = (Math.random() - 0.5) * 1.5; // Speed X
        let dy = (Math.random() - 0.5) * 1.5; // Speed Y
        particlesArray.push(new Particle(x, y, dx, dy, size));
    }
}

// Connect particles to each other and the mouse
function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        // Connect to mouse
        if (mouse.x != undefined && mouse.y != undefined) {
            let dx = mouse.x - particlesArray[a].x;
            let dy = mouse.y - particlesArray[a].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 255, 255, ${1 - (distance/mouse.radius)})`; // Fades out the further it is
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
        
        // Connect particles to other nearby particles
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 255, 255, ${1 - (distance/100)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Main animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the previous frame
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Start everything
init();
animate();