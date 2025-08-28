import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';
import Image from 'next/image';

export function Logo({ className = '', footer = false }: { className?: string, footer?: boolean }) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      {/* <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">U</span>
      </div>
      <span className="text-xl font-bold text-gray-900">{APP_CONFIG.name}</span> */}
      <img
        src={footer ? "/logo/darkmodeuhi.svg" : "/logo/urbanhousein.svg"}
        alt={APP_CONFIG.name}
        width={100}
        height={100}
      />
    </Link>
  );
}