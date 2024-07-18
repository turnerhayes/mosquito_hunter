import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/map">
        <button>
          <Image
            src="/standing_water.jpg"
            alt="Image depicting a source of standing water"
            width={300}
            height={200}
          />
          Log standing water locations
        </button>
      </Link>
    </main>
  );
}
