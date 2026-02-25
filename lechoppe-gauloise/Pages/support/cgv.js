/**
 * PAGE CONDITIONS GÉNÉRALES DE VENTE - L'Échoppe Gauloise
 * Gestion interactive de la page CGV
 */

(function() {
  'use strict';

  // Initialisation
  function initCgvPage() {
    console.log('⚖️ Initialisation de la page Conditions Générales de Vente');
    
    // Initialiser Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    // Initialiser la navigation
    initNavigation();
    
    // Initialiser le filtrage par type de client
    initClientFiltering();
    
    // Initialiser les boutons d'action
    initActionButtons();
    
    // Initialiser la sidebar
    initSidebar();
    
    // Initialiser le suivi de lecture
    initReadingProgress();
    
    console.log('✅ Page CGV initialisée');
  }

  // ============================================
  // NAVIGATION
  // ============================================
  function initNavigation() {
    // Navigation par ancres
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href.startsWith('#')) return;
        
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Calculer la position avec offset pour le header
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Mettre à jour l'URL sans recharger la page
          history.pushState(null, null, href);
          
          // Mettre en évidence l'élément actif dans la sidebar
          updateActiveNavItem(targetId);
        }
      });
    });
  }

  function updateActiveNavItem(targetId) {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      const itemHref = item.getAttribute('href');
      if (itemHref === `#${targetId}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // ============================================
  // FILTRAGE PAR TYPE DE CLIENT
  // ============================================
  function initClientFiltering() {
    const clientButtons = document.querySelectorAll('[data-client-type]');
    
    clientButtons.forEach(button => {
      button.addEventListener('click', function() {
        const clientType = this.dataset.clientType;
        
        // Mettre en évidence les sections concernées
        highlightClientSections(clientType);
        
        // Afficher une notification
        showClientNotification(clientType);
      });
    });
  }

  function highlightClientSections(clientType) {
    // Retirer les highlights précédents
    document.querySelectorAll('.highlight-consumer, .highlight-professional').forEach(el => {
      el.classList.remove('highlight-consumer', 'highlight-professional');
    });
    
    // Identifier les sections à highlight
    let sectionsToHighlight = [];
    
    if (clientType === 'particulier') {
      sectionsToHighlight = [
        '.cgv-section.consumer',  // Article 7 : Droit de rétractation
        '.cgv-section:not(.professional)'  // Toutes sauf professionnelles
      ];
    } else if (clientType === 'professionnel') {
      sectionsToHighlight = [
        '.cgv-section.professional',  // Articles professionnels
        '.cgv-section.important'      // Articles importants
      ];
    }
    
    // Appliquer le highlight
    sectionsToHighlight.forEach(selector => {
      document.querySelectorAll(selector).forEach(section => {
        section.classList.add(`highlight-${clientType}`);
        
        // Retirer le highlight après 2 secondes
        setTimeout(() => {
          section.classList.remove(`highlight-${clientType}`);
        }, 2000);
      });
    });
    
    // Faire défiler vers la première section pertinente
    const firstSection = document.querySelector(sectionsToHighlight[0]);
    if (firstSection) {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const targetPosition = firstSection.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  function showClientNotification(clientType) {
    const messages = {
      particulier: "Nous avons mis en évidence les articles qui vous concernent en tant que particulier. Les articles spécifiques aux professionnels sont signalés.",
      professionnel: "Nous avons mis en évidence les articles spécifiques aux professionnels. Attention aux pénalités de retard et clauses résolutoires."
    };
    
    showNotification(messages[clientType], 'info');
  }

  // ============================================
  // BOUTONS D'ACTION
  // ============================================
  function initActionButtons() {
    // Bouton d'impression
    const printButton = document.getElementById('printCgv');
    if (printButton) {
      printButton.addEventListener('click', function() {
        window.print();
      });
    }
    
    // Bouton de téléchargement du formulaire
    const downloadButton = document.getElementById('downloadForm');
    if (downloadButton) {
      downloadButton.addEventListener('click', function() {
        downloadWithdrawalForm();
      });
    }
    
    // Bouton de sauvegarde des CGV
    const saveButton = document.getElementById('saveCgv');
    if (saveButton) {
      saveButton.addEventListener('click', function(e) {
        e.preventDefault();
        saveCgvCopy();
      });
    }
  }

  function downloadWithdrawalForm() {
    // Créer un PDF du formulaire de rétractation
    const formContent = document.querySelector('.withdrawal-form').outerHTML;
    
    // Dans une vraie implémentation, on utiliserait une bibliothèque comme jsPDF
    // Pour cette démo, on simule le téléchargement
    const blob = new Blob([formContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formulaire-retractation-echoppe-gauloise.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    
    showNotification('Formulaire de rétractation téléchargé', 'success');
  }

  function saveCgvCopy() {
    // Sauvegarder une copie des CGV au format texte
    const cgvText = extractCgvText();
    
    const blob = new Blob([cgvText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cgv-echoppe-gauloise.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    
    showNotification('Copie des CGV sauvegardée', 'success');
  }

  function extractCgvText() {
    let text = 'CONDITIONS GÉNÉRALES DE VENTE - L\'ÉCHOPPE GAULOISE\n';
    text += '====================================================\n\n';
    
    // Extraire le contenu textuel des articles
    const articles = document.querySelectorAll('.cgv-section:not(.preamble):not(.annexe):not(.acceptance-section)');
    
    articles.forEach(article => {
      const articleNumber = article.querySelector('.article-number')?.textContent || '';
      const articleTitle = article.querySelector('.article-title')?.textContent || '';
      
      text += `${articleNumber} - ${articleTitle}\n`;
      text += '-'.repeat(50) + '\n\n';
      
      // Extraire le contenu textuel
      const paragraphs = article.querySelectorAll('.article-content p');
      paragraphs.forEach(p => {
        text += p.textContent + '\n\n';
      });
      
      text += '\n';
    });
    
    return text;
  }

  // ============================================
  // SIDEBAR
  // ============================================
  function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.cgv-sidebar');
    
    if (sidebarToggle && sidebar) {
      let sidebarVisible = true;
      
      sidebarToggle.addEventListener('click', function() {
        sidebarVisible = !sidebarVisible;
        
        if (sidebarVisible) {
          sidebar.style.display = 'block';
          sidebarToggle.innerHTML = '<i data-lucide="chevron-left" size="20"></i>';
          sidebarToggle.title = 'Masquer le sommaire';
        } else {
          sidebar.style.display = 'none';
          sidebarToggle.innerHTML = '<i data-lucide="chevron-right" size="20"></i>';
          sidebarToggle.title = 'Afficher le sommaire';
        }
        
        // Recréer les icônes Lucide
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
    }
    
    // Mettre à jour l'élément actif lors du défilement
    window.addEventListener('scroll', updateSidebarOnScroll);
  }

  function updateSidebarOnScroll() {
    const sections = document.querySelectorAll('.cgv-section');
    const navItems = document.querySelectorAll('.nav-item');
    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
    
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop - headerHeight - 100 && 
          window.scrollY < sectionTop + sectionHeight - headerHeight - 100) {
        currentSectionId = section.id;
      }
    });
    
    // Mettre à jour les éléments de navigation
    navItems.forEach(item => {
      const itemHref = item.getAttribute('href');
      if (itemHref === `#${currentSectionId}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // ============================================
  // SUIVI DE LECTURE
  // ============================================
  function initReadingProgress() {
    // Créer une barre de progression
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: var(--header-height);
      left: 0;
      height: 3px;
      background: var(--primary);
      z-index: 1000;
      width: 0%;
      transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    // Mettre à jour la barre lors du défilement
    window.addEventListener('scroll', updateReadingProgress);
    
    // Initialiser
    updateReadingProgress();
  }

  function updateReadingProgress() {
    const progressBar = document.querySelector('.reading-progress');
    if (!progressBar) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    
    const progress = (scrolled / documentHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // ============================================
  // UTILITAIRES
  // ============================================
  function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <i data-lucide="${getNotificationIcon(type)}" size="20"></i>
      <span>${message}</span>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${getNotificationColor(type)};
      color: white;
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: var(--space-3);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  function getNotificationIcon(type) {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'alert-triangle';
      default: return 'info';
    }
  }

  function getNotificationColor(type) {
    switch (type) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'warning': return '#F59E0B';
      default: return 'var(--primary)';
    }
  }

  // ============================================
  // EXPORT DES FONCTIONNALITÉS
  // ============================================
  function highlightArticle(articleNumber) {
    const article = document.querySelector(`[data-article="${articleNumber}"]`);
    if (article) {
      article.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Ajouter une animation de highlight
      article.style.animation = 'highlight 2s ease';
      setTimeout(() => {
        article.style.animation = '';
      }, 2000);
    }
  }

  function toggleClientView(clientType) {
    highlightClientSections(clientType);
    showClientNotification(clientType);
  }

  // ============================================
  // INITIALISATION
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCgvPage);
  } else {
    initCgvPage();
  }

  // Exposer les fonctions globalement
  window.CgvModule = {
    init: initCgvPage,
    highlightArticle: highlightArticle,
    toggleClientView: toggleClientView,
    downloadForm: downloadWithdrawalForm,
    saveCopy: saveCgvCopy
  };

  console.log(`

    ╔════════════════════════════════════════════════════════════════════════════════════╗
    ║                                                                                    ║
    ║                    ⚖️ CONDITIONS GÉNÉRALES DE VENTE - L'Échoppe Gauloise 🍷     ║
    ║                                                                                    ║
    ║          17 articles complets | Différenciation B2B/B2C | Navigation intelligente  ║ 
    ║               Développé par Rodulfo DOMINGUEZ                                      ║
    ║                                                                                    ║
    ╚════════════════════════════════════════════════════════════════════════════════════╝

  `);

})();