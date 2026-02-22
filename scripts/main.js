/* Custom Cursor */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my -ry) *0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('button, a, input').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '16px';
        cursor.style.height = '16px';
        ring.style.width = '50px';
        ring.style.height = '50px';
        ring.style.borderColor = 'rgba(200, 245, 98, 0.7)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = 'rgba(200, 245, 98, 0.4)';
    });
});

/* Cursor styles */
const cursorStyles = document.createElement('style');
cursorStyles.textContent = `
    .cursor {
        position: fixed;
        width: 10px;
        height: 10px;
        background: #c8f562;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: width 0.2s ease, height 0.2s ease;
        mix-blend-mode: difference;
    }
    .cursor-ring {
        position: fixed;
        width: 36px;
        height: 36px;
        border: 1px solid rgba(200, 245, 98, 0.4);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease, border-color 0.3s;
    }
`;
document.head.appendChild(cursorStyles);

/* Scroll Reveal */
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));

/* Reveal styles (injected via JS) */
const revealStyles = document.createElement('style');
revealStyles.textContent = `
    .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .reveal.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(revealStyles);

/* Waitlist Form */
async function handleSignup(inputId, successId) {
    const input = document.getElementById(inputId);
    const success = document.getElementById(successId);
    const email = input.value.trim();
    const sport = document.getElementById('hero-sport')?.value || 'not provided';
    const frequency = document.getElementById('hero-frequency')?.value || 'not provided';
    const utm = getUTMParams();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
        input.style.borderColor = 'rgba(255,80,80,0.5)';
        input.placeholder = 'Please enter a valid email';
        setTimeout(() => {
            input.style.borderColor = '';
            input.placeholder= 'Your email address';
        }, 2000);
        return;
    }

    const gdprCheckbox = document.getElementById(
        inputId === 'hero-email' ? 'hero-gdpr' : 'bottom-gdpr'
    );

    if (!gdprCheckbox?.checked) {
        gdprCheckbox.parentElement.style.color = 'rgba(255,80,80,0.7)';
        setTimeout(() => {
            gdprCheckbox.parentElement.style.color = '';
        }, 2000);
        return;
    }

    try {
        await fetch('https://submit.formspark.io/f/Pc2ZiyvaI', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                sport,
                frequency,
                utm_source: utm.source,
                utm_medium: utm.medium,
                utm_campaign: utm.campaign,
                timestamp: new Date().toISOString(),
            }),
        });

        input.parentElement.style.display = 'none';
        success.style.display = 'block';

    } catch (err) {
        console.error('Signup error:', err);
        input.style.borderColor = 'rgba(255,80,80,0.5)';
        input.placeholder = 'Something went wrong, try again';
        setTimeout(() => {
            input.style.borderColor = '';
            input.placeholder = 'Your email address';
        }, 2000);
    }
}

/* UTM Tracking */
function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        source: params.get('utm_source') || 'direct',
        medium: params.get('utm_medium') || 'none',
        campaign: params.get('utm_campaign') || 'none',
    };
}