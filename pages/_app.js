import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import "../styles/globals.css"; // Global styles
import Layout from "@/components/Layout.jsx"; // Main layout
// import { SWRConfig } from "swr"; // SWR for data fetching

// // Data fetching function for SWR
// const fetcher = async (...args) => {
//   const response = await fetch(...args);

//   if (!response.ok) {
//     throw new Error(`Request failed with status: ${response.status}`);
//   }

//   return response.json();
// };

// export default function App({ Component, pageProps }) {
//   return (
//     <SWRConfig value={{ fetcher }}>
//       <Layout>
//         {/* Render the page component */}
//         <Component {...pageProps} />
//       </Layout>
//     </SWRConfig>
//   );
// }

import { UserProvider } from "../context/UserContext";
// import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}

export default MyApp;
