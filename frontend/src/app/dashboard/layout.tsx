import Sidebar from '@/components/sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Layout is a server component, while Sidebar is a client component so it can pass the component function 'icon' 
      to SidebarButton (a server component cannot pass a function to a client component) */}
      <Sidebar />
      <main className='ml-[280px] mt-3'>{children}</main>
    </>
  );
}
