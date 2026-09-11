const canvas = document.getElementById('kinetix-canvas');
const ctx = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let mouse = {
    x: null,
    y: null,
    radius: 150 
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});


window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});


window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});


class Particle {
    constructor(x, y, dx, dy, size) {
        this.x = x;
        this.y = y;
        this.dx = dx; 
        this.dy = dy; 
        this.size = size;
    }

    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#00ffff'; 
        ctx.fill();
    }

    
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


function init() {
    particlesArray = [];
    
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


function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        
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


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}


function renderCalendar() {
    const date = new Date();
    const currYear = date.getFullYear();
    const currMonth = date.getMonth();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('month-year').textContent = `${months[currMonth]} ${currYear}`;

    const daysTag = document.getElementById("calendar-days");
    
    
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
    let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
    let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
    let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    
    let liTag = "";

    
    
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    daysTag.innerHTML = liTag;
}


renderCalendar();


init();
animate();

