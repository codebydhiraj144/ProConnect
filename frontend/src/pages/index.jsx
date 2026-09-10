import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import UserLayout from "@/layout/UserLayout";
export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <Head>
        <title>ProConnect</title>
        <meta name="description" content="A True social media platform" />
      </Head>

      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer__left}>
            <p>connect with your friends without exaggeration</p>
            <p>A True social media platform, with stories no blufs !</p>

            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.Buttonjoin}
            >
              <p>Join Now</p>
            </div>
          </div>

          <div className={styles.mainContainer__right}>
            <Image
              src="/images/logo.png"
              alt="connecting people illustration"
              width={500}
              height={400}
              priority
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}