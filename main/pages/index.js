import Link from "next/link";
import { games } from "./games";

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold mb-6'>🎮 Welcome to the Game Hub</h1>
      <div>Choose a game to play</div>
      <ul className='space-y-4'>
        {games.map((game) => (
          <li key={game.id}>
            <Link href={`/${game.id}`} className='text-blue-500 underline'>
              {game.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
