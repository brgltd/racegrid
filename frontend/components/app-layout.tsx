"use client";

import { Inter } from "next/font/google";
import { WagmiProvider } from "wagmi";
import {
  RainbowKitProvider,
  darkTheme as rainbowDarkTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
import { wagmiConfig } from "@/wagmi";
// import { Toast } from "@/components/toast";
// import { Footer } from "@/components/footer";
import "@rainbow-me/rainbowkit/styles.css";
import "../app/globals.css";
import { Navbar } from "./navbar";
import { AppProvider } from "@/hooks/use-app-context";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

// export const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//   },
// });

// export const lightTheme = createTheme({
//   palette: {
//     mode: "light",
//   },
// });

// export function AppLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <WagmiProvider config={wagmiConfig}>
//           <QueryClientProvider client={queryClient}>
//             <RainbowKitProvider theme={rainbowDarkTheme()}>
//               <AppProvider>
//                 {/* <EquitoVoteProvider>
//                 <AppRouterCacheProvider>
//                   <ThemeProvider theme={darkTheme}>
//                     <CssBaseline /> */}
//                 <div className="">
//                   <div className="">
//                     <Navbar />
//                     <main>{children}</main>
//                     {/* <Footer /> */}
//                   </div>
//                 </div>
//                 {/* <Toast />
//                   </ThemeProvider>
//                 </AppRouterCacheProvider>
//               </EquitoVoteProvider> */}
//               </AppProvider>
//             </RainbowKitProvider>
//           </QueryClientProvider>
//         </WagmiProvider>
//       </body>
//     </html>
//   );
// }

export function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={rainbowDarkTheme()}>
              <AppProvider>
                {/* <div className="flex flex-row justify-center">
                  <div className="mx-12" style={{ width: "1200px" }}> */}
                <div className="">
                  <div className="">
                    <Navbar />
                    <main className="main">{children}</main>
                  </div>
                </div>
              </AppProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
