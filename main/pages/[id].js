import Layout from "../components/Layout";
import { games } from "../lib/games";

// Fetch dynamic paths for static generation
export async function getStaticPaths() {
  const paths = games.map((game) => ({
    params: { id: game.id }, // This needs to match the dynamic part of the route
  }));

  return {
    paths,
    fallback: false, // Show 404 for any paths not in the list
  };
}

// Fetch data for a specific game
export async function getStaticProps({ params }) {
  const game = games.find((g) => g.id === params.id);

  if (!game) {
    return {
      notFound: true, // Return 404 if the game is not found
    };
  }

  return {
    props: { game }, // Pass game data as props to the component
  };
}

export default function GamePage({ game }) {
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
