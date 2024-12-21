import Layout from "../components/Layout";

export default function Game1() {
  return (
    <Layout>
      <h2 className='text-2xl font-bold mb-4'>Game 1</h2>
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <h1 className='text-2xl font-bold mb-4'>🎲 Game 1</h1>
        <iframe src='http://localhost:3001' width='800' height='600' style={{ border: "none" }} title='Game 1'></iframe>
      </div>
    </Layout>
  );
}
