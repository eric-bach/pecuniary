import { mount } from 'dashboard/DashboardApp';
import React, { useRef, useEffect } from 'react';

export default ({ client }: any) => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current, { client });
  }, []);

  return <div ref={ref} />;
};
