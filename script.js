// --- SCENE SETUP ---

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('bg-canvas'),
    alpha: true // Make canvas transparent
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(40);

// --- SKILL DATA ---
const skills = [
    { name: 'JavaScript', type: 'swe' }, { name: 'Node.js', type: 'swe' }, { name: 'Express.js', type: 'swe' },
    { name: 'HTML5', type: 'swe' }, { name: 'CSS3', type: 'swe' }, { name: 'MongoDB', type: 'swe' },
    { name: 'REST APIs', type: 'swe' }, { name: 'React', type: 'swe' },
    { name: 'Python', type: 'ds' }, { name: 'scikit-learn', type: 'ds' }, { name: 'pandas', type: 'ds' },
    { name: 'NumPy', type: 'ds' }, { name: 'Power BI', type: 'ds' }, { name: 'NLP', type: 'ds' },
    { name: 'Generative AI', type: 'ds' }, { name: 'PyTorch', type: 'ds' },
    { name: 'SQL', type: 'core' }, { name: 'Java', type: 'core' }, { name: 'Git', type: 'core' },
    { name: 'OOP', type: 'core' }, { name: 'DBMS', type: 'core' }, { name: 'OS', type: 'core' },
    { name: 'Data Structures', type: 'core' }, { name: 'Algorithms', type: 'core' }
];

const skillColors = {
    swe: new THREE.Color(0x3b82f6),   // Blue
    ds: new THREE.Color(0xec4899),   // Magenta
    core: new THREE.Color(0xffffff)  // White
};

// --- PARTICLE SYSTEM CREATION ---
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = skills.length * 20;
const posArray = new Float32Array(particleCount * 3);
const colorArray = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    const skill = skills[i % skills.length];
    const color = skillColors[skill.type];
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 20 + Math.random() * 20;
    posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    posArray[i * 3 + 2] = radius * Math.cos(phi);
    colorArray[i * 3] = color.r;
    colorArray[i * 3 + 1] = color.g;
    colorArray[i * 3 + 2] = color.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
});

const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleMesh);

// --- INTERACTIVITY ---
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

let scrollY = window.scrollY;
document.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();
const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    // Smoother, constant rotation
    particleMesh.rotation.y = elapsedTime * 0.04;
    particleMesh.rotation.x = elapsedTime * 0.02;
    particleMesh.rotation.z = elapsedTime * 0.01; // Added gentle z-axis rotation

    // Smoothed camera movement (eased interpolation)
    const easingFactor = 0.03;
    camera.position.x += (mouseX * 5 - camera.position.x) * easingFactor;
    camera.position.y += (mouseY * 5 - camera.position.y) * easingFactor;
    camera.lookAt(scene.position);

    // Smoothed scroll effect
    camera.position.z += (40 - scrollY * 0.05 - camera.position.z) * easingFactor;
    
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
};

// --- RESIZE HANDLER ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();