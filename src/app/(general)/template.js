
import Navbar from "../components/navigation/Navbar"
import Footer from "../components/Footer";

export default function Template({children}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
