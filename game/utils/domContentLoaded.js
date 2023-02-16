export default function domContentLoaded(callback) {

  // boot game if browser is ready
  if (document.readyState !== 'loading') {
    callback();
    return;
  }

  // else wait for DOMContentLoaded event
  const onDomContentLoaded = () => {
    document.removeEventListener('DOMContentLoaded', onDomContentLoaded);
    callback();
  }
  document.addEventListener('DOMContentLoaded', onDomContentLoaded);
}
