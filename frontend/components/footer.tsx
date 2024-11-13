import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isShortPage = pathname === "/" || pathname === "/nft";
  return (
    <footer
      style={{
        color: "rgb(108, 134, 173)",
        borderTop: "1px solid rgba(156, 163, 175, 0.3)",
        marginTop: isShortPage ? 300 : "",
      }}
      className={cn(
        "flex sm:flex-row flex-col sm:justify-between text-sm my-12 pt-4 gap-6",
      )}
    >
      <div>© {new Date().getFullYear()} RaceGrid</div>
      <div>
        <a
          href="https://github.com/brgltd/racegrid"
          target="_blank"
          className="underline mr-8"
        >
          Source Code
        </a>
        <a href="https://taiko.xyz" target="_blank" className="underline">
          Powered by Taiko
        </a>
      </div>
    </footer>
  );
}
