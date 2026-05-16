import { HomePageContent } from "@/components/home/home-page-content";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomePageContent />
      <Footer />
    </>
  );
}