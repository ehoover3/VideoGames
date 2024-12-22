import "../styles/globals.css"; // Import global CSS here

export default function Layout({ children }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
