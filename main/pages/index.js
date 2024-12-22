import "../styles/globals.css";
import Link from "next/link";
import { games } from "../lib/games";

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100'>
      <h1 className='text-4xl font-extrabold text-gray-800 mb-6'>🎮 Welcome to the Game Hub</h1>
      <p className='text-lg text-gray-600 mb-8'>Choose a game to play</p>
      <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl'>
        {games.map((game) => (
          <li key={game.id} className='bg-white shadow-md rounded-lg p-6 transform hover:scale-105 transition-transform'>
            <Link href={`/${game.id}`}>
              <a className='text-lg font-semibold text-blue-600 hover:underline'>{game.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
