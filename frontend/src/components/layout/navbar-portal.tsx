import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface NavbarPortalProps {
  id: string;
  children: React.ReactNode;
}

export function NavbarPortal({ id, children }: NavbarPortalProps) {
  const [mounted, setMounted] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setTarget(document.getElementById(id));
  }, [id]);

  if (!mounted || !target) return null;

  return createPortal(children, target);
}

export function NavbarTitle({ children }: { children: React.ReactNode }) {
  return <NavbarPortal id='navbar-page-title'>{children}</NavbarPortal>;
}

export function NavbarActions({ children }: { children: React.ReactNode }) {
  return <NavbarPortal id='navbar-page-actions'>{children}</NavbarPortal>;
}
