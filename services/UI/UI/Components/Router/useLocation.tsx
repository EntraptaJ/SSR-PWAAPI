// UI/ui/Components/Layout/useLocation/index.tsx
import { globalHistory, HistoryLocation } from '@reach/router';
import { useEffect, useState, useContext } from 'react';
import { PropContext } from 'ui/Components/Providers/PropProvider';

export const useLocation: () => URL | HistoryLocation = () => {
  const { ctx } = useContext(PropContext);
  const path = typeof ctx !== 'undefined' ? ctx.URL : globalHistory.location;
  const [state, setState] = useState<typeof path>(path);

  useEffect(() => {
    const removeListener = globalHistory.listen(params => {
      const { location } = params;
      setState(location);
    });
    return removeListener;
  }, []);

  return state;
};
