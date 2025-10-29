import { Geist, Geist_Mono, Bentham, Old_Standard_TT, Domine } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import '@flaticon/flaticon-uicons/css/all/all.css';
import "./globals.css";
import NavigationBar from "@/components/layout/NavigationBar";
import RouteProgressBar from "@/components/ui/RouteProgressBar";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const bentham = Bentham({
  variable: "--font-bentham",
  subsets: ["latin"],
  weight: "400",
});

const oldStandard = Old_Standard_TT({
  variable: "--font-old-standard-tt",
  subsets: ["latin"],
  weight: "400",
});

const domine = Domine({
  variable: "--font-domine",
  subsets: ["latin"],
  weight: "500",
});


export const metadata = {
  title: "SQL Kernel",
  description: "Learn SQL by doing SQL",
  // icons: {
  //   icon: "/logo1.png",
  //   shortcut: "/logo1.png",
  //   apple: "/logo1.png",
  // },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      {/* <body className={`${bentham.variable}`}> */}
      {/* <body className={`${oldStandard.variable}`}> */}
      <body className={`${domine.variable}`}>
        <NavigationBar />

        {/* Route change progress bar shown just below the fixed navbar */}
        <RouteProgressBar height={3} color="#0d6efd" shadow />

        <main className="main-content">
          {children}
        </main>


      </body>
    </html>
  );
}
