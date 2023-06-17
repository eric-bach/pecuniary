import { LoaderArgs, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { requireUserId } from '~/utils/session.server';

export async function loader({ request }: LoaderArgs) {
  const session = await requireUserId(request, '/login');

  return null;
}

export default function DashboardRoute() {
  return (
    <div>
      <h1>Dashboard</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
