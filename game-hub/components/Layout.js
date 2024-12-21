import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      {/* Navigation to go back to the home page */}
      <nav className='w-full p-4 bg-gray-200'>
        <Link href='/' className='text-blue-500 underline'>
          Back to Game Hub
        </Link>
      </nav>

      {/* Main content of the game */}
      <main className='flex flex-col items-center justify-center flex-grow'>
        {children} {/* This will render the specific game content */}
      </main>
    </div>
  );
}
