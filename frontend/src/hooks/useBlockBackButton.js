import { useEffect } from 'react';

function useBlockBackButton() {
  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    const onPopState = () => {
      window.history.pushState(null, document.title, window.location.href);
    };
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);
}

export default useBlockBackButton;
