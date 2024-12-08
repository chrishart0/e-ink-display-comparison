import DisplayTable from '@/components/DisplayTable';
import { displays } from '@/data/displays';

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-center">
        E-Ink Display Comparison
      </h1>
      <DisplayTable data={displays} />
    </div>
  );
}