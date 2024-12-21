import Link from "next/link";

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold mb-6'>🎮 Welcome to the Game Hub</h1>
      <ul className='space-y-4'>
        <li>
          <Link href='/game1' className='text-blue-500 underline'>
            Play Game 1
          </Link>
        </li>
        <li>
          <Link href='/game2' className='text-blue-500 underline'>
            Play Game 2
          </Link>
        </li>
        <li>
          <Link href='/game3' className='text-blue-500 underline'>
            Play Game 3
          </Link>
        </li>
      </ul>
    </div>
  );
}
