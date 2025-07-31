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

// Updated demo responses for customer service scenario - delayed package
const demoResponses = [
    {
        speaker: "User",
        text: "I've been waiting for my package for over a week now, and the tracking hasn't updated at all!",
        emotion: "Frustrated/Angry",
        tone: "Upset, demanding tone"
    },
    {
        speaker: "AI",
        text: "I'm really sorry to hear that. I understand how frustrating delays can be. Let me look into it for you right away.",
        emotion: "Empathetic",
        tone: "Calm, apologetic tone",
        voiceStyle: "Compassionate"
    },
    {
        speaker: "User",
        text: "Yeah… I just want to know when I'll get it. It was supposed to be a gift.",
        emotion: "Still Frustrated but softening",
        tone: "Slightly calmer, explaining situation"
    },
    {
        speaker: "AI",
        text: "That makes sense, and I appreciate you sharing that with me. I've just checked the tracking—it looks like there was a delay at the distribution center, but your package is now out for delivery and should arrive tomorrow.",
        emotion: "Understanding",
        tone: "Warm, reassuring tone",
        voiceStyle: "Helpful and informative"
    },
    {
        speaker: "User",
        text: "Oh okay, that's a relief. I just wish I had known sooner.",
        emotion: "Relief",
        tone: "Noticeably calmer, relieved"
    },
    {
        speaker: "AI",
        text: "Absolutely—and you're right. You deserve timely updates. I've gone ahead and enabled SMS alerts for any future changes so you'll be in the loop instantly.",
        emotion: "Proactive",
        tone: "Empathetic, slightly cheerful",
        voiceStyle: "Solution-oriented"
    },
    {
        speaker: "User",
        text: "Thanks. That really helps.",
        emotion: "Satisfied",
        tone: "Calm, appreciative"
    },
    {
        speaker: "AI",
        text: "You're very welcome! I'm glad I could assist. If you need anything else, I'm right here.",
        emotion: "Positive",
        tone: "Upbeat, friendly conclusion",
        voiceStyle: "Cheerful and supportive"
    }
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

// Add transcript line with typing effect and emotion indicators
function addTranscriptLine(responseObj, delay = 0) {
    setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'transcript-line';
        line.style.opacity = '0';
        line.style.transform = 'translateY(10px)';
        
        // Create the main text element
        const textElement = document.createElement('p');
        textElement.className = 'transcript-text';
        
        // Create emotion indicator
        const emotionElement = document.createElement('span');
        emotionElement.className = 'emotion-indicator';
        emotionElement.textContent = `[${responseObj.emotion} detected]`;
        
        // Create voice style indicator for AI responses
        let voiceStyleElement = null;
        if (responseObj.voiceStyle) {
            voiceStyleElement = document.createElement('span');
            voiceStyleElement.className = 'voice-style-indicator';
            voiceStyleElement.textContent = `[Voice: ${responseObj.voiceStyle}]`;
        }
        
        // Style based on speaker
        if (responseObj.speaker === 'AI') {
            line.classList.add('ai-response');
            textElement.style.color = '#06b6d4';
            emotionElement.style.color = '#10b981';
        } else {
            line.classList.add('user-response');
            textElement.style.color = '#f8fafc';
            emotionElement.style.color = '#f59e0b';
        }
        
        // Append elements
        line.appendChild(emotionElement);
        if (voiceStyleElement) {
            line.appendChild(voiceStyleElement);
        }
        line.appendChild(textElement);
        
        transcript.appendChild(line);
        
        // Typing effect for main text
        let charIndex = 0;
        const fullText = `${responseObj.speaker}: ${responseObj.text}`;
        const typeWriter = () => {
            if (charIndex < fullText.length) {
                textElement.textContent += fullText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 30);
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
    callStatus.textContent = 'Call Active - Customer Service';
    simulateCallBtn.disabled = true;
    endCallBtn.disabled = false;
    
    // Clear previous transcript
    transcript.innerHTML = '';
    
    // Add initial context
    const contextElement = document.createElement('div');
    contextElement.className = 'scenario-context';
    contextElement.innerHTML = `
        <h4>📋 Scenario: Customer calling about delayed package</h4>
        <p><strong>🧠 AI System:</strong> Real-time emotion detection & voice adaptation active</p>
    `;
    transcript.appendChild(contextElement);
    
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
    callStatus.textContent = 'Call Ended - Issue Resolved ✅';
    simulateCallBtn.disabled = false;
    endCallBtn.disabled = true;
    
    // Add call summary
    setTimeout(() => {
        const summaryElement = document.createElement('div');
        summaryElement.className = 'call-summary';
        summaryElement.innerHTML = `
            <h4>📊 Call Summary</h4>
            <p><strong>Outcome:</strong> Customer issue resolved successfully</p>
            <p><strong>Emotions Detected:</strong> Frustration → Relief → Satisfaction</p>
            <p><strong>AI Adaptations:</strong> Apologetic → Reassuring → Cheerful</p>
        `;
        transcript.appendChild(summaryElement);
        transcript.scrollTop = transcript.scrollHeight;
    }, 1000);
    
    // Remove visual effects
    const callAvatar = document.querySelector('.call-avatar');
    callAvatar.style.animation = '';
    
    // Reset after 5 seconds
    setTimeout(() => {
        callStatus.textContent = 'Click to start AI call';
        callDuration.textContent = '00:00';
        callStartTime = null;
    }, 5000);
}

// Simulate conversation
function simulateConversation() {
    if (!isCallActive || currentResponseIndex >= demoResponses.length) {
        return;
    }
    
    const response = demoResponses[currentResponseIndex];
    const delay = currentResponseIndex * 4000; // 4 seconds between responses for better readability
    
    addTranscriptLine(response, delay);
    currentResponseIndex++;
    
    // Schedule next response
    setTimeout(() => {
        simulateConversation();
    }, delay + 3000);
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
        callerInfo.textContent = 'Connected to Support...';
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

// Add CSS for new elements
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
    
    .scenario-context {
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
    }
    
    .scenario-context h4 {
        color: #6366f1;
        margin-bottom: 10px;
        font-size: 1.1rem;
    }
    
    .scenario-context p {
        color: #cbd5e1;
        font-size: 0.9rem;
        margin: 0;
    }
    
    .emotion-indicator {
        display: block;
        font-size: 0.8rem;
        font-style: italic;
        margin-bottom: 5px;
        opacity: 0.8;
    }
    
    .voice-style-indicator {
        display: block;
        font-size: 0.8rem;
        font-style: italic;
        margin-bottom: 5px;
        color: #8b5cf6 !important;
        opacity: 0.8;
    }
    
    .transcript-line {
        margin-bottom: 15px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border-left: 3px solid transparent;
    }
    
    .transcript-line.ai-response {
        border-left-color: #06b6d4;
        background: rgba(6, 182, 212, 0.1);
    }
    
    .transcript-line.user-response {
        border-left-color: #f59e0b;
        background: rgba(245, 158, 11, 0.1);
    }
    
    .transcript-text {
        font-size: 0.95rem;
        line-height: 1.5;
        margin: 0;
    }
    
    .call-summary {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 8px;
        padding: 15px;
        margin-top: 20px;
    }
    
    .call-summary h4 {
        color: #10b981;
        margin-bottom: 10px;
        font-size: 1.1rem;
    }
    
    .call-summary p {
        color: #cbd5e1;
        font-size: 0.9rem;
        margin: 5px 0;
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

Scenario: Customer Service - Delayed Package
Features:
- Real-time emotion detection simulation
- AI voice tone adaptation
- Interactive call simulation
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
