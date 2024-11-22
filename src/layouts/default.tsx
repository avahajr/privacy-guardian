import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children, width
}: {
  children: React.ReactNode;
  width: number;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className={`container mx-auto max-w-${width}xl px-6 flex-grow pt-16`}>
        {children}
      </main>
    </div>
  );
}
