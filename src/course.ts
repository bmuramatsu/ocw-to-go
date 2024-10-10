console.log('navigated', document.location.href);

function overrideHomeButton() {
  document.querySelectorAll("[href='https://ocw.mit.edu/']").forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.parent.postMessage({ type: 'goBack' });
    });
  });
}

function overridePdfDownload() {
  const button = document.querySelector('.download-button-container .button-wrapper .download-file')
  if (!button) return;

  let href = button.getAttribute('href');
  if (href && href.startsWith('./static_resources')) {
    href = href.replace(/^\.\//, '../../');
    href = href + '?forcedownload=true';
    button.setAttribute('href', href);
  }
}

function init() {
  overrideHomeButton()
  overridePdfDownload()
}

init();
