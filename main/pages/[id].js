import { useRouter } from "next/router";
import { games } from "../lib/games";
import Layout from "../components/Layout";

export default function GamePage() {
  const { query } = useRouter();
  const game = games.find((g) => g.id === query.id);

  if (!game) {
    return (
      <Layout>
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100'>
          <h1 className='text-3xl font-extrabold text-red-600'>Game not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100'>
        <h2 className='text-3xl font-bold text-gray-800 mb-4'>{game.title}</h2>
        <p className='text-lg text-gray-600 mb-6'>{game.instructions}</p>
        <iframe src={game.iframeSrc} width={game.width} height={game.height} className='border rounded-lg shadow-md' title={game.title}></iframe>
      </div>
    </Layout>
  );
}
