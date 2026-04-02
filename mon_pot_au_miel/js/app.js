/* ========================================
   APP.JS - Mon Pote au Miel
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Page loader
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 600);
  }

  // Header scroll
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Burger menu
  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Cart sidebar
  document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.addEventListener('click', () => Cart.toggleSidebar(true));
  });

  document.querySelectorAll('.cart-close-btn').forEach(btn => {
    btn.addEventListener('click', () => Cart.toggleSidebar(false));
  });

  const cartOverlay = document.querySelector('.cart-sidebar-overlay');
  if (cartOverlay) {
    cartOverlay.addEventListener('click', () => Cart.toggleSidebar(false));
  }

  // Init cart
  Cart.init();

  // Init currency selector
  if (typeof initCurrencySelector === 'function') {
    initCurrencySelector();
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // FAQ toggles
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Product modals
  document.querySelectorAll('[data-product-detail]').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.productDetail;
      openProductModal(productId);
    });
  });

  // Close modal
  document.querySelectorAll('.modal-close, .product-modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) {
        closeProductModal();
      }
    });
  });

  // ESC close modal/cart
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      Cart.toggleSidebar(false);
    }
  });

  // Shop filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      filterProducts(filter);
    });
  });

  // Contact form
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const toast = document.querySelector('.toast') || document.createElement('div');
      toast.className = 'toast show';
      toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
        Message envoyé avec succès !`;
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.remove('show'), 3000);
      contactForm.reset();
    });
  }
});

// Product data
const PRODUCTS = [
  {
    id: 'miel-lavande',
    name: 'Miel de Lavande',
    category: 'miel',
    price: 12.90,
    weight: '250g',
    badge: 'Populaire',
    description: 'Un miel délicat aux arômes floraux de lavande, récolté dans les champs de Provence. Sa texture onctueuse et son goût subtil en font un incontournable.',
    ingredients: 'Miel 100% pur de lavande. Origine : Provence, France.',
    benefits: 'Apaisant, idéal pour les tisanes et les desserts'
  },
  {
    id: 'miel-acacia',
    name: 'Miel d\'Acacia',
    category: 'miel',
    price: 14.50,
    weight: '250g',
    badge: '',
    description: 'Un miel clair et liquide, au goût fin et élégant. Le miel d\'acacia reste longtemps liquide grâce à sa haute teneur en fructose.',
    ingredients: 'Miel 100% pur d\'acacia. Origine : Sud de la France.',
    benefits: 'Doux, idéal pour sucrer naturellement'
  },
  {
    id: 'miel-foret',
    name: 'Miel de Forêt',
    category: 'miel',
    price: 15.90,
    weight: '250g',
    badge: 'Nouveau',
    description: 'Miel ambré aux saveurs boisées et corsées. Récolté à partir de miellat de chênes et de sapins, il possède un caractère unique et puissant.',
    ingredients: 'Miel 100% pur de miellat forestier. Origine : Massif Central, France.',
    benefits: 'Riche en minéraux, goût prononcé'
  },
  {
    id: 'miel-thym',
    name: 'Miel de Thym',
    category: 'miel',
    price: 16.90,
    weight: '250g',
    badge: '',
    description: 'Un miel puissant aux propriétés exceptionnelles. Le thym sauvage confère à ce miel un goût intense et des vertus reconnues depuis l\'Antiquité.',
    ingredients: 'Miel 100% pur de thym. Origine : Garrigue languedocienne.',
    benefits: 'Antiseptique naturel, parfait en période hivernale'
  },
  {
    id: 'savon-lavande',
    name: 'Savon Miel & Lavande',
    category: 'savon',
    price: 8.50,
    weight: '100g',
    badge: 'Best-seller',
    description: 'Savon artisanal surgras au miel de lavande. Saponifié à froid pour préserver toutes les propriétés nourrissantes du miel et de la lavande.',
    ingredients: 'Huile d\'olive, beurre de karité, miel de lavande, huile essentielle de lavande, glycérine naturelle.',
    benefits: 'Hydratant et apaisant pour peaux sensibles'
  },
  {
    id: 'savon-propolis',
    name: 'Savon Miel & Propolis',
    category: 'savon',
    price: 9.50,
    weight: '100g',
    badge: '',
    description: 'Savon purifiant enrichi en propolis et en miel. Idéal pour les peaux mixtes à grasses, il nettoie en douceur tout en régulant le sébum.',
    ingredients: 'Huile d\'olive, huile de coco, miel, propolis, cire d\'abeille, huile essentielle de tea tree.',
    benefits: 'Purifiant et antibactérien naturel'
  },
  {
    id: 'savon-miel-doux',
    name: 'Savon au Miel Pur',
    category: 'savon',
    price: 7.90,
    weight: '100g',
    badge: '',
    description: 'Le savon essentiel de notre gamme, formulé avec du miel pur pour une hydratation intense. Convient à toute la famille, des plus jeunes aux plus âgés.',
    ingredients: 'Huile d\'olive, beurre de karité, miel d\'acacia, glycérine naturelle.',
    benefits: 'Ultra-doux, convient à toute la famille'
  },
  {
    id: 'coffret-decouverte',
    name: 'Coffret Découverte',
    category: 'coffret',
    price: 39.90,
    weight: '',
    badge: 'Idée cadeau',
    description: 'Un coffret élégant contenant 2 miels (lavande et forêt) et 1 savon au miel. Le cadeau parfait pour faire découvrir nos produits artisanaux.',
    ingredients: '1 pot de miel de lavande (250g), 1 pot de miel de forêt (250g), 1 savon au miel pur (100g).',
    benefits: 'Coffret cadeau prêt à offrir'
  }
];

function filterProducts(category) {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const cat = card.dataset.category;
    if (category === 'all' || cat === category) {
      card.style.display = '';
      card.style.animation = 'fadeInUp 0.5s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const overlay = document.querySelector('.product-modal-overlay');
  if (!overlay) return;

  overlay.querySelector('.modal-body h3').textContent = product.name;
  overlay.querySelector('.modal-description').textContent = product.description;
  overlay.querySelector('.modal-ingredients p').textContent = product.ingredients;
  overlay.querySelector('.modal-price').textContent = CurrencyManager.format(product.price);
  overlay.querySelector('.modal-tag').textContent = product.category === 'miel' ? 'Miel' : product.category === 'savon' ? 'Savon' : 'Coffret';

  const addBtn = overlay.querySelector('.modal-add-btn');
  addBtn.onclick = () => {
    Cart.add({ id: product.id, name: product.name, price: product.price });
    closeProductModal();
  };

  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const overlay = document.querySelector('.product-modal-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Update prices on currency change
document.addEventListener('currencyChange', () => {
  document.querySelectorAll('[data-price-eur]').forEach(el => {
    const eur = parseFloat(el.dataset.priceEur);
    el.textContent = CurrencyManager.format(eur);
  });
});

// Fade in animation
const style = document.createElement('style');
style.textContent = `@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);