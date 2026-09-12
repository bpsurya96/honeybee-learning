
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  MessageSquare,
  LogOut,
  ShoppingBag
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/organisations', label: 'Organisations', icon: Building2 },
    { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white shadow-xl flex flex-col fixed inset-y-0 z-20">
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
            Admin Panel
          </h2>
          <p className="text-slate-400 text-sm mt-1">HoneyBee Learning</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-500 font-medium border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-amber-500' : 'text-slate-400'} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto bg-slate-50 relative min-h-screen">
        {/* Subtle background element */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-200/50 to-transparent -z-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
