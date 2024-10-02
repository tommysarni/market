"use client";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={"link"}>
        <Link href="/dual-citizen">Dual Citizen Info</Link>
      </div>

    </div>
  );
}
