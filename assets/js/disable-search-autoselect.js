(function () {
  if (typeof window === 'undefined') return;
  const originalAutocomplete = window.autocomplete;
  if (typeof originalAutocomplete !== 'function') return;

  window.autocomplete = function (selector, options) {
    if (options && typeof options === 'object') {
      options.autoselect = false;
    }
    return originalAutocomplete.apply(this, arguments);
  };
})();

