import Image from "next/image";
import styles from "./page.module.css";
import MainCard from "@/components/features/home/MainCard";
import ModulesSection from "@/components/features/home/ModulesSection";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className="container">
        <MainCard />
        <hr />
        <ModulesSection />
      </div>
    </div>
  );
}
