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
    // console.log(
    //   `isFetching: ${isFetching} window.innerHeight: ${window.innerHeight} window.scrollY: ${window.scrollY}  document.body.offsetHeight: ${
    //     document.documentElement.offsetHeight
    //   } result: ${window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching}`
    // );

    // BUG: This is loading when scrolling back to top
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) return;

    console.log('BOTTOM');
    setIsFetching(true);
  }
  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
