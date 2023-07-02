import { Links, LiveReload, Meta, NavLink, Outlet, Scripts, ScrollRestoration, useCatch } from '@remix-run/react';
import { LinksFunction } from '@remix-run/node';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ClientOnly, useHydrated } from 'remix-utils';

import Header from './header';
import styles from './styles/global.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export function Head({ title }: { title?: string }) {
  const [renderHead, setRenderHead] = React.useState(false);
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;

    if (!renderHead) {
      // trigger re-render so we can remove the old head
      setRenderHead(true);
      return;
    }

    removeOldHead(document.head);
  }, [renderHead, hydrated]);

  console.log('Head', title);

  return (
    <>
      {title && <title>{title}</title>}
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width,initial-scale=1' />
      <Meta />
      <Links />
    </>
  );
}

export function removeOldHead(parent: HTMLElement = document.head) {
  let foundOldHeader = false;
  const nodesToRemove: ChildNode[] = [];

  for (const node of parent.childNodes) {
    console.log(node.nodeName, node.nodeValue);

    if (!foundOldHeader && node.nodeName !== '#comment') {
      continue;
    }

    if (foundOldHeader && node.nodeName === '#comment' && node.nodeValue === `end head`) {
      nodesToRemove.push(node);
      break;
    }

    if (foundOldHeader || (node.nodeName === '#comment' && node.nodeValue === `start head`)) {
      foundOldHeader = true;
      nodesToRemove.push(node);
    }
  }

  for (const node of nodesToRemove) {
    node.remove();
  }
}

export default function App({ title, children }: { title?: string; children?: React.ReactNode }) {
  console.log('App', title);

  return (
    <>
      <ClientOnly>{() => createPortal(<Head title={title} />, document.head)}</ClientOnly>
      <Header />
      {children ? children : <Outlet />}
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </>
  );
}
