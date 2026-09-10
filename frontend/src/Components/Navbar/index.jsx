import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import styles from "./styles.module.css";

export default function NavBarComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <h1 
          style={{ cursor: "pointer", margin: 0 }} 
          onClick={() => router.push("/")}
        >
          Pro Connect
        </h1>

        <div className={styles.navbarOptionContainer}>
          {/* Show greeting if logged in */}
          {authState?.profileFetched && (
            <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
              <p style={{ margin: 0 }}>
                Hey, {authState.user?.userId?.name || authState.user?.name}
              </p>
              <p 
                style={{ fontWeight: "bold", cursor: "pointer", margin: 0 }}
                onClick={() => router.push("/profile")}
              >
                Profile
              </p>
            </div>
          )}

          {/* Show "Be a part" ONLY if NOT logged in */}
          {!authState?.profileFetched && (
            <div 
              onClick={() => router.push("/login")} 
              className={styles.buttonJoin}
            >
              <p style={{ margin: 0 }}>Be a part</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}