import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/challenge">Play Challenge</Link>
        </li>
        <li>Multiplayer (Comming Soon)</li>
      </ul>
    </div>
  );
}
