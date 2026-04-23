const linksData = [
    { id: 'facebook', color: '#006eff', icon: 'assets/facebook.png', url: 'https://facebook.com' },
    { id: 'instagram', color: '#f50052', icon: 'assets/instagram.png', url: 'https://instagram.com' },
    { id: 'linkedin', color: '#0080ff', icon: 'assets/linkedin.png', url: 'https://linkedin.com' },
    { id: 'github', color: '#000000', icon: 'assets/github.png', url: 'https://github.com' },
    { id: 'youtube', color: '#FF0000', icon: 'assets/youtube.png', url: 'https://youtube.com' },
    { id: 'x', color: '#000000', icon: 'assets/x.png', url: 'https://twitter.com' },
    { id: 'dribbble', color: '#00ff2a', icon: 'assets/whatsapp.png', url: 'https://dribbble.com' },
    { id: 'behance', color: '#ff00bf', icon: 'assets/tiktok.png', url: 'https://behance.net' }
];

const wheel = document.getElementById('wheel');
const radius = 160;
let iconElements = [];

// 1. Build Wheel
function buildWheel() {
    const total = linksData.length;
    linksData.forEach((item, index) => {
        const angle = (index / total) * (2 * Math.PI);
        const x = Math.sin(angle) * radius;
        const y = -Math.cos(angle) * radius;

        const el = document.createElement('div');
        el.className = 'icon-item';
        el.style.left = `calc(50% + ${x}px)`;
        el.style.top = `calc(50% + ${y}px)`;
        
        const img = document.createElement('img');
        img.src = item.icon;
        img.alt = item.id;
        el.appendChild(img);
        
        el.dataset.url = item.url;
        wheel.appendChild(el);
        iconElements.push({ el, angle, index });
    });
}
buildWheel();

// 2. Physics & Drag variables
let currentAngle = 0;
let targetAngle = 0;
const lerpFactor = 0.08; // Smoothness factor
let isDragging = false;
let startX = 0;
let dragDistance = 0;

// 3. Animation Loop (Smooth Lerp + Color Sync)
function animate() {
    currentAngle += (targetAngle - currentAngle) * lerpFactor;
    
    // Rotate Wheel
    wheel.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;
    
    // Counter-rotate Icons
    iconElements.forEach(item => {
        item.el.style.transform = `translate(-50%, -50%) rotate(${-currentAngle}deg)`;
    });

    // Color Calculation
    const anglePerIcon = 360 / linksData.length;
    let floatIndex = -currentAngle / anglePerIcon;
    let activeIndex = Math.round(floatIndex) % linksData.length;
    if (activeIndex < 0) activeIndex += linksData.length; 

    // Update CSS Variable for glow and active nav item
    const activeColor = linksData[activeIndex].color;
    document.documentElement.style.setProperty('--active-color', activeColor);

    requestAnimationFrame(animate);
}
animate();

// 4. Input Events
window.addEventListener('wheel', (e) => {
    targetAngle += e.deltaY * 0.15;
});

function handleStart(e) {
    isDragging = true;
    dragDistance = 0;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
}

function handleMove(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    targetAngle += deltaX * 0.5;
    dragDistance += Math.abs(deltaX);
    startX = clientX;
}

function handleEnd() {
    isDragging = false;
}

window.addEventListener('touchstart', handleStart, { passive: false });
window.addEventListener('touchmove', handleMove, { passive: false });
window.addEventListener('touchend', handleEnd);

window.addEventListener('mousedown', handleStart);
window.addEventListener('mousemove', handleMove);
window.addEventListener('mouseup', handleEnd);

// 5. Clicks
iconElements.forEach(item => {
    item.el.addEventListener('click', (e) => {
        if (dragDistance > 5) {
            e.preventDefault();
            return;
        }
        window.open(item.el.dataset.url, '_blank');
    });
});