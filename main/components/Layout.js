// import Link from "next/link";

// export default function Layout({ game }) {
//   return (
//     <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
//       <nav className='w-full p-4 bg-gray-200'>
//         <Link href='/' className='text-blue-500 underline'>
//           Back to Game Hub
//         </Link>
//       </nav>

//       <main className='flex flex-col items-center justify-center flex-grow'>{game}</main>
//     </div>
//   );
// }

import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <nav className='w-full p-4 bg-blue-600'>
        <Link href='/'>
          <a className='text-white text-lg font-semibold hover:underline'>⬅️ Back to Game Hub</a>
        </Link>
      </nav>
      <main className='flex flex-col items-center justify-center flex-grow'>{children}</main>
      <footer className='w-full p-4 bg-gray-800 text-center text-white'>© 2024 Eric Hoover. All Rights Reserved.</footer>
    </div>
  );
}
