import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [storeName, setStoreName] = useState(process.env.NEXT_PUBLIC_SHOPIFY_STORE);

  const login = async (e) => {
    e.preventDefault()
		try {
			const res = await fetch(`/api/auth/login?shop=${storeName}.myshopify.com`);
			const { authRoute } = await res.json();
      window.location.href = authRoute;
		} catch (err) {
			console.log(err);
		}
	};

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={login}>
          <input value={storeName} onChange={(e) => {
            setStoreName(e.target.value)
          }} />
          <button onClick={login}>Authenticate</button>
        </form>
      </main>
    </div>
  )
}
