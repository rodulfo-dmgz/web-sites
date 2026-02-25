/**
 * PAGE COOKIES - L'Échoppe Gauloise
 * Gestion des interactions et animations pour la Politique des Cookies
 */

(function() {
  'use strict';

  // ============================================
  // INITIALISATION
  // ============================================
  function initPage() {
    console.log('🍪 Initialisation de la page Politique des Cookies');
    
    try {
      // Initialiser Lucide icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      
      // Initialiser le scroll fluide pour les ancres
      initSmoothScroll();
      
      // Mettre en surbrillance le sommaire au scroll
      initTocHighlight();
      
      // Simulation du bandeau cookies
      initConsentBannerSimulation();
      
      // Gestionnaire des préférences cookies
      initCookiePreferences();
      
      // Initialiser Google Translate
      initGoogleTranslate();
      
      // Mettre à jour le badge panier
      updateCartBadge();
      
      console.log('✅ Page Cookies initialisée');
      
    } catch (error) {
      console.error('❌ Erreur d\'initialisation:', error);
    }
  }

  // ============================================
  // SCROLL FLUIDE
  // ============================================
  function initSmoothScroll() {
    const tocLinks = document.querySelectorAll('.toc-list a, .footer-legal a[href="#"]');
    
    tocLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href && href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            const headerHeight = document.getElementById('header')?.offsetHeight || 80;
            const tocHeight = document.querySelector('.cookies-toc')?.offsetHeight || 0;
            const offset = headerHeight + tocHeight + 20;
            
            window.scrollTo({
              top: targetElement.offsetTop - offset,
              behavior: 'smooth'
            });
            
            // Mettre à jour l'URL
            history.pushState(null, null, href);
          }
        }
      });
    });
  }

  // ============================================
  // SURBRILLANCE DU SOMMAIRE
  // ============================================
  function initTocHighlight() {
    const sections = document.querySelectorAll('.cookies-section');
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    if (sections.length === 0 || tocLinks.length === 0) return;
    
    window.addEventListener('scroll', throttle(function() {
      let current = '';
      const scrollPosition = window.scrollY + 150;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          current = section.getAttribute('id');
        }
      });
      
      tocLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.substring(1) === current) {
          link.classList.add('active');
        }
      });
    }, 100));
  }

  // ============================================
  // SIMULATION BANDEAU COOKIES
  // ============================================
  function initConsentBannerSimulation() {
    const simulateBtn = document.getElementById('simulateConsentBanner');
    
    if (simulateBtn) {
      simulateBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Créer un bandeau temporaire
        const banner = document.createElement('div');
        banner.className = 'cookie-banner-simulation';
        banner.innerHTML = `
          <div class="cookie-banner-content">
            <div class="cookie-banner-text">
              <i data-lucide="cookie" size="20"></i>
              <span>Nous utilisons des cookies pour améliorer votre expérience.</span>
            </div>
            <div class="cookie-banner-buttons">
              <button class="btn btn-outline btn-sm" id="simuRefuse">Refuser</button>
              <button class="btn btn-secondary btn-sm" id="simuAccept">Accepter</button>
              <button class="btn btn-link btn-sm" id="simuCustom">Personnaliser</button>
            </div>
          </div>
        `;
        
        // Style du bandeau
        banner.style.cssText = `
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          padding: var(--space-4);
          z-index: 9999;
          animation: slideUp 0.3s ease-out;
        `;
        
        document.body.appendChild(banner);
        
        // Recréer les icônes
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
        
        // Gestionnaires pour fermer
        const closeBanner = () => {
          banner.style.animation = 'slideOutRight 0.3s ease-out';
          setTimeout(() => banner.remove(), 300);
        };
        
        document.getElementById('simuAccept')?.addEventListener('click', function() {
          alert('✅ Cookies acceptés ');
          closeBanner();
        });
        
        document.getElementById('simuRefuse')?.addEventListener('click', function() {
          alert('❌ Cookies refusés');
          closeBanner();
        });
        
        document.getElementById('simuCustom')?.addEventListener('click', function() {
          alert('⚙️ Ouverture des préférences ');
          closeBanner();
        });
        
        // Auto-fermeture après 10 secondes
        setTimeout(closeBanner, 10000);
      });
    }
  }

  // ============================================
  // GESTION DES PRÉFÉRENCES COOKIES
  // ============================================
  function initCookiePreferences() {
    const prefBtn = document.getElementById('openCookiePreferences');
    
    if (prefBtn) {
      prefBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Simuler l'ouverture d'un panneau de préférences
        alert('🔧 Paramètres des cookies .\n\nDans un vrai site, vous pourriez activer/désactiver les cookies analytiques ici.');
      });
    }
  }

  // ============================================
  // BADGE PANIER
  // ============================================
  function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartBadge.textContent = itemCount;
        cartBadge.style.display = itemCount > 0 ? 'flex' : 'none';
      } catch (e) {
        console.warn('Erreur badge panier', e);
      }
    }
  }

  // ============================================
  // UTILITAIRES
  // ============================================
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  function initGoogleTranslate() {
    if (typeof google !== 'undefined' && google.translate) {
      const style = document.createElement('style');
      style.textContent = `
        .goog-te-banner-frame { display: none !important; }
        .goog-te-menu-value { color: var(--text-primary) !important; }
        .skiptranslate { display: none !important; }
      `;
      document.head.appendChild(style);
    }
  }

  // ============================================
  // DÉMARRAGE
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initPage();
    });
  } else {
    initPage();
  }

  // Écouter les mises à jour du panier
  window.addEventListener('cart-updated', updateCartBadge);

  // Exposer globalement
  window.CookiesPage = {
    init: initPage,
    updateCartBadge,
    simulateConsentBanner: initConsentBannerSimulation
  };

  console.log(`
    ╔════════════════════════════════════════════════════════════════════════════════════╗
    ║                                                                                    ║
    ║                    🍪 POLITIQUE DES COOKIES - L'Échoppe Gauloise 🍪               ║
    ║                                                                                    ║
    ║               Document pédagogique créé par Rodulfo DOMINGUEZ                      ║ 
    ║                                                                                    ║
    ╚════════════════════════════════════════════════════════════════════════════════════╝
  `);

})();