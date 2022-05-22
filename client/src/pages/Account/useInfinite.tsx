import { useState, useEffect } from 'react';

const useInfiniteScroll = (callback: any) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', isScrolling);
    return () => window.removeEventListener('scroll', isScrolling);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching]);

  function isScrolling() {
    // BUG: This is loading when scrolling back to top
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) {
      console.log(
        `window.innerHeight: ${window.innerHeight} windows.outerHeight: ${window.outerHeight} window.scrollY: ${
          window.scrollY
        }  document.body.offsetHeight: ${document.documentElement.offsetHeight} result: ${
          window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching
        }`
      );

      return;
    }

    console.log('🔚 REACTHED TO BOTTOM 🔚');
    setIsFetching(true);
  }

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
