import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './cart.js';

gsap.registerPlugin(ScrollTrigger);

// Initialize Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  smoothTouch: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Enable ScrollTrigger to sync with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);


// --- Mobile Navigation Logic ---
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const body = document.body;

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Toggle hamburger icon animation
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
      gsap.to(spans[0], { y: 8, rotation: 45, duration: 0.3 });
      gsap.to(spans[1], { opacity: 0, duration: 0.3 });
      gsap.to(spans[2], { y: -8, rotation: -45, duration: 0.3 });
      body.style.overflow = 'hidden'; // Prevent scroll when menu is open
    } else {
      gsap.to(spans[0], { y: 0, rotation: 0, duration: 0.3 });
      gsap.to(spans[1], { opacity: 1, duration: 0.3 });
      gsap.to(spans[2], { y: 0, rotation: 0, duration: 0.3 });
      body.style.overflow = '';
    }
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.style.overflow = '';
      
      const spans = hamburger.querySelectorAll('span');
      gsap.to(spans[0], { y: 0, rotation: 0, duration: 0.3 });
      gsap.to(spans[1], { opacity: 1, duration: 0.3 });
      gsap.to(spans[2], { y: 0, rotation: 0, duration: 0.3 });
    });
  });
}


// --- Cinematic Preloader & Transitions ---
const preloader = document.querySelector('.preloader');
const preloaderContent = document.querySelector('.preloader-content');
const preloaderLogo = document.querySelector('.preloader-logo');
const preloaderLine = document.querySelector('.preloader-line');
const bgTop = document.querySelector('.preloader-bg-top');
const bgBottom = document.querySelector('.preloader-bg-bottom');

window.addEventListener('load', () => {
  if (preloader) {
    const tl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = 'none';
        initPageAnimations();
      }
    });

    // EMERGENCY KILL-SWITCH: Force preloader to disappear immediately
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
        initPageAnimations();
    }, 100);

    tl.to(preloaderLine, { width: 100, duration: 0.5, ease: "power2.inOut" })
      .to(preloaderContent, { opacity: 0, duration: 0.5 })
      .to(bgTop, { yPercent: -100, duration: 0.8 }, "-=0.1")
      .to(bgBottom, { yPercent: 100, duration: 0.8 }, "<");
  } else {
    initPageAnimations();
  }
});

// Intercept Links for smooth exit transition
document.querySelectorAll('a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (this.hostname === window.location.hostname && !this.hash && this.getAttribute('target') !== '_blank') {
      const targetUrl = this.href;
      
      if(preloader) {
         e.preventDefault();
         preloader.style.display = 'flex';
         gsap.set(bgTop, { yPercent: -100 });
         gsap.set(bgBottom, { yPercent: 100 });
         gsap.set(preloaderContent, { opacity: 0 });

         const tl = gsap.timeline({
            onComplete: () => { window.location.href = targetUrl; }
         });

         tl.to([bgTop, bgBottom], { yPercent: 0, duration: 0.8, ease: "power3.inOut" });
      }
    }
  });
});


// --- Sophisticated Animations ---
function initPageAnimations() {
  
  // 1. Hero Text Reveal (Cinematic 'mask' stagger)
  const heroTitleLines = document.querySelectorAll('.hero-title > div');
  if (heroTitleLines.length > 0) {
    gsap.fromTo(heroTitleLines, 
      { y: 50, opacity: 0, rotationX: -20 },
      { y: 0, opacity: 1, rotationX: 0, duration: 1.2, stagger: 0.15, ease: "power3.out" }
    );
  }

  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroBtn = document.querySelector('.hero-btn');
  if (heroSubtitle) {
    gsap.fromTo([heroSubtitle, heroBtn], 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power2.out", delay: 0.5 }
    );
  }

  // Hero Image scale up
  const heroMainImg = document.querySelector('.hero-main-img');
  if (heroMainImg) {
    gsap.fromTo(heroMainImg,
       { scale: 1.1, opacity: 0 },
       { scale: 1, opacity: 1, duration: 1.5, ease: "power3.inOut" }
    );
  }

  // 2. Parallax Effects
  const heroSection = document.querySelector('.hero-section');
  if (heroSection && heroMainImg) {
     window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gsap.to(heroMainImg, {
           x: x, y: y, duration: 2, ease: "power2.out"
        });
     });
  }

  // 3. Scroll Reveals (.reveal-up)
  const revealElements = document.querySelectorAll('.reveal-up');
  revealElements.forEach(el => {
    gsap.fromTo(el, 
       { y: 40, opacity: 0, scale: 0.98 }, // Reduced y for subtler mobile reveal
       { 
         y: 0, opacity: 1, scale: 1, 
         duration: 1, 
         ease: "power3.out",
         scrollTrigger: {
           trigger: el,
           start: "top 90%", // Trigger slightly later for mobile
           toggleActions: "play none none reverse"
         }
       }
    );
  });

  // Features Pill Parallax & Float
  const featPill = document.querySelector('.features-pill');
  if (featPill) {
     gsap.fromTo(featPill, 
       { y: 40, opacity: 0 },
       { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1 }
     );
     // Parallax on scroll
     gsap.to(featPill, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
           trigger: '.hero-section',
           start: "top top",
           end: "bottom top",
           scrub: true
        }
     });
  }
}
