'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User'}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-gray-700 hidden sm:inline">
          {session.user?.name}
        </span>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Sign In
    </button>
  );
}