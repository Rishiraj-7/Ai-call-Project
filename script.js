// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const startCallBtn = document.getElementById('startCallBtn');
const demoBtn = document.getElementById('demoBtn');
const simulateCallBtn = document.getElementById('simulateCall');
const endCallBtn = document.getElementById('endCall');
const callStatus = document.getElementById('callStatus');
const callDuration = document.getElementById('callDuration');
const transcript = document.getElementById('transcript');

// Navigation functionality
hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar transparency on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.9)';
    }
});

// Call simulation variables
let callTimer = null;
let callStartTime = null;
let isCallActive = false;

// Demo responses for AI simulation
const demoResponses = [
    "AI: Hello! I'm your AI assistant. How can I help you today?",
    "User: I'd like to schedule an appointment.",
    "AI: I'd be happy to help you schedule an appointment. What type of service are you looking for?",
    "User: I need a consultation for next week.",
    "AI: Perfect! Let me check available slots for next week. I have openings on Tuesday at 2 PM, Wednesday at 10 AM, or Friday at 3 PM. Which works best for you?",
    "User: Tuesday at 2 PM sounds good.",
    "AI: Excellent! I've scheduled your consultation for Tuesday at 2 PM. You'll receive a confirmation email shortly. Is there anything else I can help you with?",
    "User: No, that's all. Thank you!",
    "AI: You're welcome! Have a great day and we'll see you on Tuesday!"
];

let currentResponseIndex = 0;

// Format time function
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update call duration
function updateCallDuration() {
    if (callStartTime) {
        const elapsed = Math.floor((Date.now() - callStartTime) / 1000);
        callDuration.textContent = formatTime(elapsed);
    }
}

// Add transcript line with typing effect
function addTranscriptLine(text, delay = 0) {
    setTimeout(() => {
        const line = document.createElement('p');
        line.className = 'transcript-line';
        line.style.opacity = '0';
        line.style.transform = 'translateY(10px)';
        transcript.appendChild(line);
        
        // Typing effect
        let charIndex = 0;
        const typeWriter = () => {
            if (charIndex < text.length) {
                line.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Animate in
        setTimeout(() => {
            line.style.transition = 'all 0.3s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
            typeWriter();
        }, 100);
        
        // Scroll to bottom
        transcript.scrollTop = transcript.scrollHeight;
    }, delay);
}

// Start call simulation
function startCall() {
    if (isCallActive) return;
    
    isCallActive = true;
    callStartTime = Date.now();
    currentResponseIndex = 0;
    
    // Update UI
    callStatus.textContent = 'Call Active - AI Assistant';
    simulateCallBtn.disabled = true;
    endCallBtn.disabled = false;
    
    // Clear previous transcript
    transcript.innerHTML = '';
    
    // Start timer
    callTimer = setInterval(updateCallDuration, 1000);
    
    // Add visual effects
    const callAvatar = document.querySelector('.call-avatar');
    callAvatar.style.animation = 'pulse 1s infinite';
    
    // Simulate conversation
    simulateConversation();
}

// End call simulation
function endCall() {
    if (!isCallActive) return;
    
    isCallActive = false;
    
    // Clear timer
    if (callTimer) {
        clearInterval(callTimer);
        callTimer = null;
    }
    
    // Update UI
    callStatus.textContent = 'Call Ended';
    simulateCallBtn.disabled = false;
    endCallBtn.disabled = true;
    
    // Remove visual effects
    const callAvatar = document.querySelector('.call-avatar');
    callAvatar.style.animation = '';
    
    // Reset after 3 seconds
    setTimeout(() => {
        callStatus.textContent = 'Click to start AI call';
        callDuration.textContent = '00:00';
        callStartTime = null;
    }, 3000);
}

// Simulate conversation
function simulateConversation() {
    if (!isCallActive || currentResponseIndex >= demoResponses.length) {
        return;
    }
    
    const response = demoResponses[currentResponseIndex];
    const delay = currentResponseIndex * 3000; // 3 seconds between responses
    
    addTranscriptLine(response, delay);
    currentResponseIndex++;
    
    // Schedule next response
    setTimeout(() => {
        simulateConversation();
    }, delay + 2000);
}

// Event listeners for demo
simulateCallBtn?.addEventListener('click', startCall);
endCallBtn?.addEventListener('click', endCall);

// Main call button functionality
startCallBtn?.addEventListener('click', () => {
    // Scroll to demo section
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
        
        // Start call after scroll
        setTimeout(() => {
            startCall();
        }, 1000);
    }
});

// Demo button functionality
demoBtn?.addEventListener('click', () => {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .use-case, .tech-category');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Particle effect for hero section
function createParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(99, 102, 241, 0.5);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
        `;
        heroSection.appendChild(particle);
    }
}

// Initialize particles
createParticles();

// Phone mockup interaction
const phoneMockup = document.querySelector('.phone-mockup');
const acceptBtn = document.querySelector('.call-btn.accept');
const declineBtn = document.querySelector('.call-btn.decline');

acceptBtn?.addEventListener('click', () => {
    // Add ripple effect
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: 20px;
        height: 20px;
        left: 50%;
        top: 50%;
        margin-left: -10px;
        margin-top: -10px;
    `;
    
    acceptBtn.style.position = 'relative';
    acceptBtn.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // Simulate call acceptance
    const callerInfo = document.querySelector('.caller-info p');
    if (callerInfo) {
        callerInfo.textContent = 'Connected...';
        callerInfo.style.color = '#10b981';
    }
});

declineBtn?.addEventListener('click', () => {
    // Add ripple effect
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: 20px;
        height: 20px;
        left: 50%;
        top: 50%;
        margin-left: -10px;
        margin-top: -10px;
    `;
    
    declineBtn.style.position = 'relative';
    declineBtn.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // Simulate call decline
    const callerInfo = document.querySelector('.caller-info p');
    if (callerInfo) {
        callerInfo.textContent = 'Call Declined';
        callerInfo.style.color = '#ef4444';
        
        setTimeout(() => {
            callerInfo.textContent = 'Incoming Call...';
            callerInfo.style.color = '';
        }, 2000);
    }
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .particle {
        z-index: -1;
    }
`;
document.head.appendChild(style);

// Stats counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        const suffix = stat.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (suffix.includes('K')) {
                stat.textContent = Math.floor(current / 1000) + 'K+';
            } else if (suffix.includes('%')) {
                stat.textContent = current.toFixed(1) + '%';
            } else {
                stat.textContent = Math.floor(current) + '+';
            }
        }, 20);
    });
}

// Trigger stats animation when in view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
});

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Error handling for API calls (placeholder)
function handleApiError(error) {
    console.error('API Error:', error);
    // Show user-friendly error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    errorMsg.textContent = 'Service temporarily unavailable. Please try again later.';
    document.body.appendChild(errorMsg);
    
    setTimeout(() => {
        errorMsg.remove();
    }, 5000);
}

// Console message for developers
console.log(`
🔊🤖 AI-Call Frontend Loaded Successfully!

Features:
- Interactive call simulation
- Smooth animations
- Responsive design
- Modern UI/UX

Built with ❤️ for the AI Call project
`);

// Performance monitoring
window.addEventListener('load', () => {
    console.log('🚀 Page loaded in:', performance.now().toFixed(2), 'ms');
});

// Service Worker registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered successfully');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed');
            });
    });
}
