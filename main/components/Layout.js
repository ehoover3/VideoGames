import Link from "next/link";

export default function Layout({ game }) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <nav className='w-full p-4 bg-gray-200'>
        <Link href='/' className='text-blue-500 underline'>
          Back to Game Hub
        </Link>
      </nav>

      <main className='flex flex-col items-center justify-center flex-grow'>{game}</main>
    </div>
  );
}
