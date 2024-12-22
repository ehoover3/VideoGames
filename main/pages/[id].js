import { useRouter } from "next/router";
import { games } from "../lib/games";
import Layout from "../components/Layout";

export default function GamePage() {
  const { query } = useRouter();
  const game = games.find((g) => g.id === query.id);

  if (!game) {
    return (
      <Layout>
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
          <h1 className='text-3xl font-bold'>Game not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <h2 className='text-2xl font-bold mb-4'>{game.title}</h2>
        <h3 className='text-xl mb-4'>{game.instructions}</h3>
        <iframe src={game.iframeSrc} width={game.width} height={game.height} style={{ border: "none" }} title={game.title}></iframe>
      </div>
    </Layout>
  );
}
