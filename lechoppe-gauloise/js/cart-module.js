/**
 * CART MODULE - Gestion commune du panier
 * L'Échoppe Gauloise
 * 
 * Ce module DOIT être inclus sur TOUTES les pages
 */

const CartModule = (function() {
    'use strict';

    const CART_KEY = 'cart';
    const CART_BADGE_ID = 'cartBadge';
    let cart = [];

    /**
     * Initialiser le module panier
     */
    function init() {
        console.log('🛒 Initialisation du module panier');
        loadCart();
        updateAllBadges();
        
        // Écouter les changements de localStorage depuis d'autres onglets
        window.addEventListener('storage', handleStorageChange);
        
        return getCart();
    }

    /**
     * Charger le panier depuis localStorage
     */
    function loadCart() {
        try {
            const cartData = localStorage.getItem(CART_KEY);
            cart = cartData ? JSON.parse(cartData) : [];
            console.log('📦 Panier chargé:', cart.length + ' articles');
        } catch (error) {
            console.error('❌ Erreur lors du chargement du panier:', error);
            cart = [];
        }
    }

    /**
     * Sauvegarder le panier dans localStorage
     */
    function saveCart() {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            updateAllBadges();
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde du panier:', error);
            return false;
        }
    }

    /**
     * Obtenir le panier
     */
    function getCart() {
        return [...cart]; // Retourne une copie pour éviter la mutation directe
    }

/**
 * Ajouter un produit au panier
 */
function addToCart(product) {
    // Vérifier si le produit existe déjà
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
        // Mettre à jour la quantité
        cart[existingIndex].quantity += (product.quantity || 1);
        console.log('📈 Quantité augmentée pour:', product.name);
    } else {
        // Ajouter un nouveau produit
        const newProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category || product.type || 'produit',
            quantity: product.quantity || 1
        };
        cart.push(newProduct);
        console.log('🆕 Produit ajouté:', product.name);
    }
    
    const saved = saveCart();
    if (saved) {
        dispatchCartUpdated();
        return true;
    }
    return false;
}

/**
 * Nouvelle fonction pour ajouter avec vérification de duplication stricte
 */
function addItem(product) {
    return addToCart(product);
}

    /**
     * Mettre à jour la quantité d'un produit
     */
    function updateQuantity(productId, quantity) {
        const index = cart.findIndex(item => item.id === productId);
        
        if (index > -1) {
            if (quantity <= 0) {
                // Supprimer le produit si quantité = 0
                cart.splice(index, 1);
            } else {
                cart[index].quantity = quantity;
            }
            saveCart();
            dispatchCartUpdated();
            return true;
        }
        return false;
    }

    /**
     * Supprimer un produit du panier
     */
    function removeFromCart(productId) {
        const initialLength = cart.length;
        cart = cart.filter(item => item.id !== productId);
        
        if (cart.length !== initialLength) {
            saveCart();
            dispatchCartUpdated();
            return true;
        }
        return false;
    }

    /**
     * Vider complètement le panier
     */
    function clearCart() {
        cart = [];
        saveCart();
        dispatchCartUpdated();
        return true;
    }

    /**
     * Obtenir le nombre total d'articles
     */
    function getTotalItems() {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Obtenir le total du panier
     */
    function getTotalPrice() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    /**
     * Mettre à jour TOUS les badges sur la page
     */
    function updateAllBadges() {
        const totalItems = getTotalItems();
        
        // Mettre à jour tous les badges avec l'ID cartBadge
        const badges = document.querySelectorAll(`#${CART_BADGE_ID}`);
        
        if (badges.length > 0) {
            badges.forEach(badge => {
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? 'flex' : 'none';
            });
        } else {
            // Si pas de badge trouvé, essayer de le créer
            createBadgeIfMissing(totalItems);
        }
        
        // Dispatch l'événement pour les pages qui écoutent
        window.dispatchEvent(new CustomEvent('cart-updated', {
            detail: { totalItems, totalPrice: getTotalPrice() }
        }));
    }

    /**
     * Créer le badge s'il n'existe pas
     */
    function createBadgeIfMissing(totalItems) {
        const cartIcons = document.querySelectorAll('.icon-btn[aria-label*="Panier"], .cart-icon, [href*="panier"]');
        
        cartIcons.forEach(icon => {
            if (!icon.querySelector(`#${CART_BADGE_ID}`)) {
                const badge = document.createElement('span');
                badge.id = CART_BADGE_ID;
                badge.className = 'badge cart-badge';
                badge.textContent = totalItems;
                badge.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: var(--primary);
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: ${totalItems > 0 ? 'flex' : 'none'};
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    z-index: 10;
                `;
                icon.style.position = 'relative';
                icon.appendChild(badge);
            }
        });
    }

    /**
     * Gérer les changements de localStorage
     */
    function handleStorageChange(event) {
        if (event.key === CART_KEY) {
            console.log('🔄 Panier mis à jour depuis un autre onglet');
            loadCart();
            updateAllBadges();
        }
    }

    /**
     * Dispatcher l'événement cart-updated
     */
    function dispatchCartUpdated() {
        window.dispatchEvent(new CustomEvent('cart-updated', {
            detail: {
                cart: getCart(),
                totalItems: getTotalItems(),
                totalPrice: getTotalPrice()
            }
        }));
    }

    /**
     * Fonction de débogage
     */
    function debug() {
        console.log('🛒 DEBUG CART MODULE:');
        console.log('- Cart:', cart);
        console.log('- Total items:', getTotalItems());
        console.log('- Total price:', getTotalPrice());
        console.log('- Badges trouvés:', document.querySelectorAll(`#${CART_BADGE_ID}`).length);
        return getCart();
    }

    // Interface publique du module
    return {
        init,
        getCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
        updateAllBadges,
        debug
    };
})();

// Initialiser automatiquement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        CartModule.init();
        console.log('✅ Cart Module initialisé sur DOMContentLoaded');
    });
} else {
    CartModule.init();
    console.log('✅ Cart Module initialisé immédiatement');
}

// Exposer globalement
window.CartModule = CartModule;