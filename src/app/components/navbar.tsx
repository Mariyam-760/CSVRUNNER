import Link from 'next/link';
import { Activity } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Activity className="h-6 w-6 text-blue-600" />
            <span>CSV Runner Dashboard</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}