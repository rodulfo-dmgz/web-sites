// =============================================
// CONFIGURATION SUPABASE CENTRALISÉE
// =============================================

// ✅ Configuration unique pour toute l'application
const SUPABASE_CONFIG = {
  url: 'https://iomzcbmyzjwtswrkvxqk.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvbXpjYm15emp3dHN3cmt2eHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMjM4MTAsImV4cCI6MjA4NTc5OTgxMH0.ap4Fk6pxGZgVSAdb6krWbv8CM-Dzw0ZQRcsKPKScSVw'
};

// ✅ Vérifier que le SDK Supabase est chargé
if (typeof window.supabase === 'undefined') {
  console.error('❌ ERREUR CRITIQUE: SDK Supabase non chargé !');
  console.error('Vérifiez que vous avez bien inclus:');
  console.error('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
  alert('Erreur: SDK Supabase non chargé. Vérifiez votre connexion internet.');
} else {
  console.log('✅ SDK Supabase chargé avec succès');
}

// ✅ IMPORTANT: Sauvegarder la référence au SDK avant de l'écraser
const supabaseSDK = window.supabase;

// ✅ Initialiser le client Supabase
const supabaseClient = supabaseSDK.createClient(
  SUPABASE_CONFIG.url, 
  SUPABASE_CONFIG.anonKey
);

console.log('🔍 Client Supabase créé:', supabaseClient);
console.log('🔍 Méthode .from disponible:', typeof supabaseClient.from);

// ✅ Tester la connexion (optionnel en dev)
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabaseClient
      .from('entreprise')
      .select('count')
      .limit(1);
    
    if (error) {
      console.warn('⚠️ Erreur connexion Supabase:', error.message);
    } else {
      console.log('✅ Connexion Supabase opérationnelle');
    }
  } catch (err) {
    console.error('❌ Impossible de se connecter à Supabase:', err);
  }
}

// ✅ Lancer le test uniquement en développement
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  testSupabaseConnection();
}

// ✅ Helper pour gérer les erreurs Supabase
function handleSupabaseError(error, context) {
  console.error(`❌ Erreur Supabase (${context}):`, error);
  
  // Messages d'erreur plus clairs pour l'utilisateur
  const userFriendlyMessages = {
    'PGRST116': 'Aucune donnée trouvée',
    'PGRST301': 'Erreur de permission',
    '23505': 'Cette donnée existe déjà',
    '23503': 'Référence invalide',
    '42P01': 'Table non trouvée'
  };
  
  const friendlyMessage = userFriendlyMessages[error.code] || error.message;
  
  return {
    error: true,
    message: friendlyMessage,
    originalError: error
  };
}

// ✅ Export pour utilisation globale
// IMPORTANT: On exporte le CLIENT, pas le SDK
window.supabase = supabaseClient;  // Le client créé (avec .from, .insert, etc.)
window.supabaseClient = supabaseClient;  // Alias pour compatibilité
window.handleSupabaseError = handleSupabaseError;

console.log('📦 Configuration Supabase chargée');
console.log('✅ window.supabase = Client Supabase (avec méthodes .from, .insert, etc.)');
console.log('✅ window.supabaseClient = Même chose (alias)');

// À la fin de supabase-config.js
window.supabaseTest = async function() {
  try {
    console.log('Test de connexion Supabase...');
    
    // Tester une requête simple
    const { data, error, count } = await supabaseClient
      .from('vins')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return false;
    }
    
    console.log(`✅ Supabase connecté! ${count} vins disponibles`);
    return true;
    
  } catch (err) {
    console.error('❌ Exception Supabase:', err);
    return false;
  }
};

// Tester automatiquement en développement
if (window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1') {
  setTimeout(() => {
    window.supabaseTest();
  }, 1000);
}