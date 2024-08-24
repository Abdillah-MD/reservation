import Image from "next/image";
import styles from "./page.module.css";
import DateRange from "./ui/SelectDateRange/dateRange";
import CreateObjet from "./ui/CreateObjetALouer/createObjetALouer";
import LocationsList from "./ui/LocationsList/LocationList";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Démo réservation &nbsp;
          <code className={styles.code}>app/page.tsx</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/Dynect.png"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={100}
              priority
            />
          </a>
        </div>
      </div>
      <div className="createObject">
        <CreateObjet />
        <DateRange />
        <LocationsList />
      </div>
    </main>
  );
}
