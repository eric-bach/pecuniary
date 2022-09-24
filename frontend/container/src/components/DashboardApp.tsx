import { mount } from 'dashboard/DashboardApp';
import React, { useRef, useEffect } from 'react';

export default ({ auth, client }: any) => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current, { auth, client });
  }, []);

  return <div ref={ref} />;
};
