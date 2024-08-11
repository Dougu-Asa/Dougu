import { useState, useRef } from "react";

/*
  hook to keep track of the page the user is on when scrolling
  and allows for scrolling to a specific page
*/
export default function useScroll() {
  const [topPage, setTopPage] = useState(0);
  const [nextTopPage, setNextTopPage] = useState(0);
  const [bottomPage, setBottomPage] = useState(0);
  const [nextBottomPage, setNextBottomPage] = useState(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // determine if the equipment item is hovering over a scroll area
  // and change the page accordingly
  const handleScroll = (isTop: boolean, position: string) => {
    const changePage = isTop ? setNextTopPage : setNextBottomPage;
    const currPage = isTop ? topPage : bottomPage;
    if (scrollTimeout.current) {
      return;
    }
    // make sure nextPage is correct before changing page
    scrollTimeout.current = setTimeout(() => {
      if (position === "left") {
        changePage(currPage - 1);
      } else if (position === "right") {
        changePage(currPage + 1);
      }
      scrollTimeout.current = null;
    }, 800);
  };

  return {
    topPage,
    setTopPage,
    nextTopPage,
    bottomPage,
    setBottomPage,
    nextBottomPage,
    scrollTimeout,
    handleScroll,
  };
}
