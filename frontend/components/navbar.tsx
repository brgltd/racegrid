"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  return pathname === "/challenge" ? null : (
    <nav>
      <ul className="flex lg:flex-row flex-col lg:items-center mt-6 mb-8 justify-center">
        <ul className="flex flex-row flex-wrap mb-8 lg:mb-0 gap-y-6">
          {/* <li className="mr-12 hover-glow"> 
            <Link href="/">PROPOSALS</Link>
          </li>
          <li className="mr-12 hover-glow">
            <Link href="/create">CREATE</Link>
          </li>
          <li className="mr-12 hover-glow">
            <Link href="/add-new-token">ADD TOKEN</Link>
          </li>
          <li className="hover-glow">
            <Link href="/faucet">FAUCET</Link>
          </li> */}
        </ul>
        <li className="lg:ml-auto">
          <ConnectButton
            chainStatus="full"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </li>
      </ul>
    </nav>
  );
}
