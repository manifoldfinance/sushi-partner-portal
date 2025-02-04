import Footer from "app/components/Footer";
import Header from "components/Header";

export default function Layout({ children }) {
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen">
      <Header />
      <main className="mt-[100px] flex flex-col items-center justify-start flex-grow w-full h-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
