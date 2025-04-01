
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Enregistrement des plugins GSAP
gsap.registerPlugin(ScrollTrigger);

// Animation d'entrée pour éléments
export const animateSectionEntry = (target: string, delay = 0) => {
  gsap.from(target, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: delay
  });
};

// Animation des éléments au défilement
export const animateOnScroll = (trigger: string, target: string) => {
  ScrollTrigger.create({
    trigger: trigger,
    start: 'top 80%',
    end: 'bottom 20%',
    onEnter: () => {
      gsap.to(target, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }
  });
};

// Animation de stagger pour liste d'éléments
export const animateStaggerItems = (target: string, staggerTime = 0.1, delay = 0) => {
  gsap.from(target, {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: staggerTime,
    ease: 'power3.out',
    delay: delay
  });
};

// Animation du curseur personnalisé
export const initCustomCursor = () => {
  // Vérifier si on est sur un appareil tactile
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;

  // Créer l'élément curseur s'il n'existe pas déjà
  let cursor = document.querySelector('.custom-cursor') as HTMLElement;
  
  if (!cursor) {
    cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    // Appliquer les styles de base
    cursor.style.position = 'fixed';
    cursor.style.width = '48px';
    cursor.style.height = '48px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = 'rgba(204, 153, 204, 0.4)';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'width 0.3s, height 0.3s, background-color 0.3s';
  }

  // Variables pour le suivi du curseur
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  // Mise à jour de la position de la souris
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animer le curseur
  const animateCursor = () => {
    // Animation fluide de suivi
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    if (cursor) {
      gsap.set(cursor, { x: cursorX, y: cursorY });
    }
    
    requestAnimationFrame(animateCursor);
  };
  
  // Démarrer l'animation
  animateCursor();

  // Gestion des survols d'éléments interactifs
  const handleInteractiveElements = () => {
    // Sélectionner tous les éléments interactifs
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
    
    interactiveElements.forEach(element => {
      // Au survol, agrandir le curseur
      element.addEventListener('mouseenter', () => {
        if (cursor) {
          cursor.style.width = '80px';
          cursor.style.height = '80px';
          cursor.style.backgroundColor = 'rgba(150, 0, 93, 0.3)'; // igc-magenta avec opacité
          
          // Ajouter un texte contextuel selon le type d'élément
          const isButton = element.tagName === 'BUTTON' || element.getAttribute('role') === 'button';
          const cursorText = document.createElement('span');
          cursorText.textContent = isButton ? 'Click' : 'View';
          cursorText.style.position = 'absolute';
          cursorText.style.top = '50%';
          cursorText.style.left = '50%';
          cursorText.style.transform = 'translate(-50%, -50%)';
          cursorText.style.color = '#1b1464';
          cursorText.style.fontSize = '12px';
          cursorText.style.fontWeight = 'bold';
          cursorText.classList.add('cursor-text');
          
          // Supprimer tout texte existant avant d'ajouter le nouveau
          const existingText = cursor.querySelector('.cursor-text');
          if (existingText) {
            cursor.removeChild(existingText);
          }
          
          cursor.appendChild(cursorText);
        }
      });
      
      // Au survol terminé, rétablir le curseur
      element.addEventListener('mouseleave', () => {
        if (cursor) {
          cursor.style.width = '48px';
          cursor.style.height = '48px';
          cursor.style.backgroundColor = 'rgba(204, 153, 204, 0.4)'; // igc-purple avec opacité
          
          // Supprimer le texte contextuel
          const cursorText = cursor.querySelector('.cursor-text');
          if (cursorText) {
            cursor.removeChild(cursorText);
          }
        }
      });
    });
  };
  
  // Mettre à jour les éléments interactifs quand le DOM change
  const observer = new MutationObserver(handleInteractiveElements);
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Initialisation
  handleInteractiveElements();
};

// Animation d'onde pour les boutons (ripple effect)
export const addRippleEffect = () => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('btn-ripple') || target.closest('.btn-ripple')) {
      const button = target.classList.contains('btn-ripple') ? target : target.closest('.btn-ripple') as HTMLElement;
      
      // Créer l'élément d'onde
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      button.appendChild(ripple);
      
      // Positionner l'onde au point de clic
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      
      // Animer l'onde
      ripple.style.animation = 'ripple 0.6s linear';
      
      // Supprimer l'élément après l'animation
      setTimeout(() => {
        ripple.remove();
      }, 700);
    }
  });
};

// Animation de transition de page
export const pageTransition = () => {
  // Créer l'élément de transition s'il n'existe pas déjà
  let overlay = document.querySelector('.page-transition-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.classList.add('page-transition-overlay');
    document.body.appendChild(overlay);
    
    // SVG pour l'effet de rectangle qui s'étend
    overlay.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path class="overlay-path" d="M0,0 L0,100 L100,100 L100,0 Z" fill="#1b1464" transform="scale(0, 1)" transform-origin="left"></path>
      </svg>
    `;
    
    // Styles
    const overlayStyles = document.createElement('style');
    overlayStyles.textContent = `
      .page-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
      }
    `;
    document.head.appendChild(overlayStyles);
  }
  
  // Animation de la transition
  const tl = gsap.timeline();
  tl.to('.overlay-path', {
    scaleX: 1,
    duration: 0.6,
    ease: 'power3.inOut'
  })
  .to('.overlay-path', {
    scaleX: 0,
    transformOrigin: 'right',
    duration: 0.6,
    delay: 0.2
  });
  
  return tl;
};

// Initialisation de toutes les animations
export const initAnimations = () => {
  // Initialiser le curseur personnalisé
  initCustomCursor();
  
  // Ajouter l'effet d'onde aux boutons
  addRippleEffect();
  
  // Animer les éléments principaux
  animateSectionEntry('h1', 0.3);
  animateSectionEntry('.hero-content', 0.5);
  
  // Animer les sections au défilement
  document.querySelectorAll('.section').forEach((section, index) => {
    animateOnScroll(`.section:nth-child(${index + 1})`, `.section:nth-child(${index + 1}) .section-content`);
  });
  
  // Animer les listes avec stagger
  document.querySelectorAll('.stagger-list').forEach((list) => {
    animateStaggerItems(`${list.className} > *`, 0.1, 0.2);
  });
  
  // Ajouter des classes pour les animations CSS
  document.querySelectorAll('.btn-more').forEach((btn) => {
    btn.classList.add('btn-ripple');
  });
};
