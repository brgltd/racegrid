"use client";

import { Inter } from "next/font/google";
import { WagmiProvider } from "wagmi";
import {
  RainbowKitProvider,
  darkTheme as rainbowDarkTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/wagmi";
import { Toast } from "@/components/toast";
import { Navbar } from "./navbar";
import { AppProvider } from "@/hooks/use-app-context";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { Footer } from "./footer";
import "@rainbow-me/rainbowkit/styles.css";
import "../app/globals.css";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isGamePage = pathname === "/challenge";
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={rainbowDarkTheme()}>
              <AppRouterCacheProvider>
                <ThemeProvider theme={darkTheme}>
                  <CssBaseline />
                  <AppProvider>
                    <div
                      className={cn(
                        !isGamePage ? "flex flex-row justify-center" : "",
                      )}
                    >
                      <div
                        className={!isGamePage ? "mx-12" : ""}
                        style={!isGamePage ? { width: "1200px" } : {}}
                      >
                        {!isGamePage && <Navbar />}
                        <main>{children}</main>
                        {!isGamePage && <Footer />}
                      </div>
                    </div>
                    <Toast />
                  </AppProvider>
                </ThemeProvider>
              </AppRouterCacheProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
