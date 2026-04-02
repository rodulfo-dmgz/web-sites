/* ========================================
   CURRENCY UTILITY - Mon Pote au Miel
   ======================================== */

const CurrencyManager = {
  current: 'EUR',
  rates: {
    EUR: { symbol: '€', rate: 1, flag: '🇫🇷', name: 'Euro', code: 'EUR' },
    USD: { symbol: '$', rate: 1.08, flag: '🇺🇸', name: 'Dollar US', code: 'USD' },
    JPY: { symbol: '¥', rate: 162.5, flag: '🇯🇵', name: 'Yen', code: 'JPY' },
    MAD: { symbol: 'MAD', rate: 10.8, flag: '🇲🇦', name: 'Dirham', code: 'MAD' },
    ARS: { symbol: 'ARS', rate: 950, flag: '🇦🇷', name: 'Peso', code: 'ARS' },
    MXN: { symbol: 'MXN', rate: 18.5, flag: '🇲🇽', name: 'Peso MX', code: 'MXN' }
  },

  convert(eurPrice) {
    const { rate } = this.rates[this.current];
    const converted = eurPrice * rate;
    if (this.current === 'JPY') return Math.round(converted);
    if (this.current === 'ARS') return Math.round(converted);
    return Math.round(converted * 100) / 100;
  },

  format(eurPrice) {
    const converted = this.convert(eurPrice);
    const { symbol } = this.rates[this.current];
    if (this.current === 'JPY') return `${symbol}${converted.toLocaleString()}`;
    if (this.current === 'EUR') return `${converted.toFixed(2)}${symbol}`;
    return `${symbol}${converted.toFixed(2)}`;
  },

  setCurrency(code) {
    if (this.rates[code]) {
      this.current = code;
      localStorage.setItem('mpm_currency', code);
      document.dispatchEvent(new CustomEvent('currencyChange', { detail: code }));
    }
  },

  init() {
    const saved = localStorage.getItem('mpm_currency');
    if (saved && this.rates[saved]) {
      this.current = saved;
    }
  }
};

CurrencyManager.init();

// Currency Selector component
function initCurrencySelector() {
  const selectors = document.querySelectorAll('.currency-selector');
  selectors.forEach(selector => {
    const btn = selector.querySelector('.currency-btn');
    const dropdown = selector.querySelector('.currency-dropdown');
    const options = selector.querySelectorAll('.currency-option');
    const currentLabel = btn.querySelector('.currency-label');

    // Set initial
    const currentRate = CurrencyManager.rates[CurrencyManager.current];
    if (currentLabel) currentLabel.textContent = `${currentRate.flag} ${currentRate.code}`;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
      btn.classList.toggle('open');
    });

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        const code = opt.dataset.currency;
        CurrencyManager.setCurrency(code);
        const rate = CurrencyManager.rates[code];
        if (currentLabel) currentLabel.textContent = `${rate.flag} ${rate.code}`;
        options.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        dropdown.classList.remove('show');
        btn.classList.remove('open');
      });
    });

    document.addEventListener('click', () => {
      dropdown.classList.remove('show');
      btn.classList.remove('open');
    });
  });
}