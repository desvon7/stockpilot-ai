
import { useEffect } from 'react';

/**
 * Hook to set the document title
 * @param title - The title to set for the page
 */
export const useTitle = (title: string) => {
  useEffect(() => {
    // Set the document title when the component mounts
    const previousTitle = document.title;
    document.title = `${title} | StockPilot`;

    // Reset the title when the component unmounts
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};

export default useTitle;
