import { mount } from 'dashboard/DashboardApp';
import React, { useRef, useEffect } from 'react';

export default (session: any) => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current, session);
  }, []);

  return <div ref={ref} />;
};
