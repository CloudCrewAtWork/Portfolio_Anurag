// Three.js Scene Setup
let scene, camera, renderer;
let computer, screen;
let initialCameraZ = 5;
let targetCameraZ = 25;
let scrollProgress = 0;

// Terminal Typing Animation
const typingText = [
    "Welcome to the retro terminal...",
    "Initializing system...",
    "Loading vintage computing experience...",
    "System ready."
];

// Initialize Three.js
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, initialCameraZ);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00ff00, 0.5, 100);
    pointLight1.position.set(10, 10, 10);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffff, 0.3, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Create Retro Computer
    createRetroComputer();

    // Handle Window Resize
    window.addEventListener('resize', onWindowResize);

    // Handle Scroll
    window.addEventListener('scroll', onScroll);

    // Start Typing Animation
    startTypingAnimation();
}

// Create Retro Computer Model
function createRetroComputer() {
    const computerGroup = new THREE.Group();

    // Monitor Case
    const monitorGeometry = new THREE.BoxGeometry(12, 10, 8);
    const monitorMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2a2a2a,
        specular: 0x111111,
        shininess: 10
    });
    const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
    monitor.position.y = 0;
    monitor.castShadow = true;
    monitor.receiveShadow = true;
    computerGroup.add(monitor);

    // Screen
    const screenGeometry = new THREE.BoxGeometry(10, 7.5, 0.1);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x001100,
        emissive: 0x00ff00,
        emissiveIntensity: 0.1,
        specular: 0x00ff00,
        shininess: 100
    });
    screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 4;
    computerGroup.add(screen);

    // Screen Glass Effect
    const glassGeometry = new THREE.BoxGeometry(10.1, 7.6, 0.2);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        envMapIntensity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.1
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.z = 4.1;
    computerGroup.add(glass);

    // Monitor Stand
    const standGeometry = new THREE.CylinderGeometry(2, 3, 2, 8);
    const standMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2a2a2a,
        specular: 0x111111,
        shininess: 10
    });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = -6;
    stand.castShadow = true;
    computerGroup.add(stand);

    // Monitor Base
    const baseGeometry = new THREE.CylinderGeometry(5, 5, 0.5, 16);
    const base = new THREE.Mesh(baseGeometry, standMaterial);
    base.position.y = -7;
    base.castShadow = true;
    computerGroup.add(base);

    // Keyboard
    const keyboardGeometry = new THREE.BoxGeometry(12, 0.5, 4);
    const keyboardMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1a1a1a,
        specular: 0x111111,
        shininess: 5
    });
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
    keyboard.position.set(0, -8, 8);
    keyboard.rotation.x = -0.1;
    keyboard.castShadow = true;
    computerGroup.add(keyboard);

    // Add scan lines effect
    const scanLinesGeometry = new THREE.PlaneGeometry(10, 7.5);
    const scanLinesMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec2 vUv;
            void main() {
                float scanLine = sin(vUv.y * 300.0 + time * 5.0) * 0.04;
                vec3 color = vec3(0.0, 1.0, 0.0) * (0.5 + scanLine);
                float alpha = 0.1 + scanLine * 0.5;
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
    const scanLines = new THREE.Mesh(scanLinesGeometry, scanLinesMaterial);
    scanLines.position.z = 4.2;
    computerGroup.add(scanLines);

    computer = computerGroup;
    scene.add(computer);

    // Create animated shader for scan lines
    function animateScanLines() {
        scanLinesMaterial.uniforms.time.value += 0.01;
        requestAnimationFrame(animateScanLines);
    }
    animateScanLines();
}

// Window Resize Handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Scroll Handler
function onScroll() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = window.pageYOffset / scrollHeight;
    
    // Update camera position (zoom out)
    camera.position.z = initialCameraZ + (targetCameraZ - initialCameraZ) * scrollProgress;
    
    // Rotate computer slightly
    if (computer) {
        computer.rotation.y = scrollProgress * Math.PI * 0.3;
        computer.rotation.x = scrollProgress * 0.1;
    }

    // Fade terminal overlay
    const terminalOverlay = document.querySelector('.terminal-overlay');
    if (scrollProgress > 0.3) {
        terminalOverlay.style.opacity = Math.max(0, 1 - (scrollProgress - 0.3) * 2);
    } else {
        terminalOverlay.style.opacity = 1;
    }
}

// Typing Animation
function startTypingAnimation() {
    const typedElement = document.querySelector('.typed-text');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentText = typingText[textIndex];
        
        if (!isDeleting) {
            typedElement.textContent = currentText.substring(0, charIndex++);
            
            if (charIndex > currentText.length) {
                // Wait before deleting
                setTimeout(() => {
                    isDeleting = true;
                    type();
                }, 2000);
                return;
            }
        } else {
            typedElement.textContent = currentText.substring(0, charIndex--);
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % typingText.length;
            }
        }
        
        // Random typing speed for more natural effect
        typeSpeed = isDeleting ? 50 : 100 + Math.random() * 50;
        setTimeout(type, typeSpeed);
    }

    // Start typing
    setTimeout(type, 1000);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Add subtle floating animation to computer
    if (computer) {
        computer.position.y = Math.sin(Date.now() * 0.001) * 0.2;
    }
    
    // Pulse screen glow
    if (screen) {
        const pulse = Math.sin(Date.now() * 0.002) * 0.1 + 0.1;
        screen.material.emissiveIntensity = pulse;
    }
    
    renderer.render(scene, camera);
}

// Initialize everything
init();
animate();