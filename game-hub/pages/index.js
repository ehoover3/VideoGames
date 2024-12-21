import Link from "next/link";

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold mb-6'>🎮 Welcome to the Game Hub</h1>
      <ul className='space-y-4'>
        <li>
          <Link href='/flappyBird' className='text-blue-500 underline'>
            Play Flappy Bird
          </Link>
        </li>
        <li>
          <Link href='/dinoRun' className='text-blue-500 underline'>
            Play Dino Run
          </Link>
        </li>
        <li>
          <Link href='/platformer' className='text-blue-500 underline'>
            Play Platformer
          </Link>
        </li>
      </ul>
    </div>
  );
}
