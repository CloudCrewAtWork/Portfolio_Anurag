// Three.js Scene Setup
let scene, camera, renderer;
let computer, screen;
let initialCameraZ = 8;
let targetCameraZ = 30;
let scrollProgress = 0;

// Terminal Typing Animation
const typingText = [
    "Welcome to Macintosh.",
    "System 7.5 starting up...",
    "The computer for the rest of us.",
    "Think different."
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

    // Classic Macintosh beige color
    const beigeColor = 0xd4c5b0;
    const darkBeigeColor = 0xb8a898;
    
    // Main Macintosh Body
    const bodyGeometry = new THREE.BoxGeometry(9, 11, 10);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: beigeColor,
        specular: 0x222222,
        shininess: 20
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0;
    body.castShadow = true;
    body.receiveShadow = true;
    computerGroup.add(body);

    // Front Face Indent (for screen area)
    const indentGeometry = new THREE.BoxGeometry(7.5, 9, 1);
    const indentMaterial = new THREE.MeshPhongMaterial({ 
        color: darkBeigeColor,
        specular: 0x111111,
        shininess: 10
    });
    const indent = new THREE.Mesh(indentGeometry, indentMaterial);
    indent.position.set(0, 0.5, 4.5);
    computerGroup.add(indent);

    // Screen
    const screenGeometry = new THREE.BoxGeometry(6, 6, 0.1);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x001100,
        emissive: 0x00ff00,
        emissiveIntensity: 0.1,
        specular: 0x00ff00,
        shininess: 100
    });
    screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1.5, 5);
    computerGroup.add(screen);

    // Screen Glass Effect
    const glassGeometry = new THREE.BoxGeometry(6.1, 6.1, 0.2);
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
    glass.position.set(0, 1.5, 5.1);
    computerGroup.add(glass);

    // Disk Drive Slot
    const driveSlotGeometry = new THREE.BoxGeometry(4, 0.2, 0.5);
    const driveSlotMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1a1a1a
    });
    const driveSlot = new THREE.Mesh(driveSlotGeometry, driveSlotMaterial);
    driveSlot.position.set(0, -3, 5);
    computerGroup.add(driveSlot);

    // Apple Logo (simplified)
    const logoGeometry = new THREE.CircleGeometry(0.3, 32);
    const logoMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x666666,
        specular: 0x999999,
        shininess: 50
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, -1.5, 5.01);
    computerGroup.add(logo);

    // Base/Foot
    const baseGeometry = new THREE.BoxGeometry(9.5, 0.5, 10.5);
    const base = new THREE.Mesh(baseGeometry, bodyMaterial);
    base.position.y = -5.75;
    base.castShadow = true;
    computerGroup.add(base);

    // Keyboard
    const keyboardGeometry = new THREE.BoxGeometry(11, 0.6, 4.5);
    const keyboardMaterial = new THREE.MeshPhongMaterial({ 
        color: beigeColor,
        specular: 0x222222,
        shininess: 15
    });
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
    keyboard.position.set(0, -7, 8);
    keyboard.rotation.x = -0.08;
    keyboard.castShadow = true;
    computerGroup.add(keyboard);

    // Keyboard Keys (simplified)
    const keyRowGeometry = new THREE.BoxGeometry(10, 0.1, 0.4);
    const keyMaterial = new THREE.MeshPhongMaterial({ 
        color: darkBeigeColor
    });
    
    for (let i = 0; i < 5; i++) {
        const keyRow = new THREE.Mesh(keyRowGeometry, keyMaterial);
        keyRow.position.set(0, -6.6, 6.5 + i * 0.7);
        keyRow.rotation.x = -0.08;
        computerGroup.add(keyRow);
    }

    // Mouse
    const mouseGroup = new THREE.Group();
    
    // Mouse body
    const mouseGeometry = new THREE.BoxGeometry(2, 0.8, 3);
    const mouseMaterial = new THREE.MeshPhongMaterial({ 
        color: beigeColor,
        specular: 0x222222,
        shininess: 15
    });
    const mouseBody = new THREE.Mesh(mouseGeometry, mouseMaterial);
    mouseBody.castShadow = true;
    mouseGroup.add(mouseBody);

    // Mouse button
    const buttonGeometry = new THREE.BoxGeometry(1.8, 0.1, 2);
    const buttonMaterial = new THREE.MeshPhongMaterial({ 
        color: darkBeigeColor
    });
    const mouseButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
    mouseButton.position.y = 0.45;
    mouseButton.position.z = -0.3;
    mouseGroup.add(mouseButton);

    // Mouse cable (simplified)
    const cableGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
    const cableMaterial = new THREE.MeshPhongMaterial({ 
        color: darkBeigeColor
    });
    const cable = new THREE.Mesh(cableGeometry, cableMaterial);
    cable.rotation.z = Math.PI / 2;
    cable.position.set(-1.5, 0, -1.5);
    mouseGroup.add(cable);

    mouseGroup.position.set(8, -7, 8);
    mouseGroup.rotation.y = -0.3;
    computerGroup.add(mouseGroup);

    // Add scan lines effect
    const scanLinesGeometry = new THREE.PlaneGeometry(6, 6);
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
                float scanLine = sin(vUv.y * 200.0 + time * 5.0) * 0.04;
                vec3 color = vec3(0.0, 1.0, 0.0) * (0.5 + scanLine);
                float alpha = 0.1 + scanLine * 0.5;
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
    const scanLines = new THREE.Mesh(scanLinesGeometry, scanLinesMaterial);
    scanLines.position.set(0, 1.5, 5.2);
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