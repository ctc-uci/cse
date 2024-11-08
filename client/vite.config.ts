import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [react()],

    /**
     * Configuration for proxying auth requests from our domain to firebaseapp.com.
     *
     * @see {@link client/docs/signInWithRedirect.md} for more detailed documentation.
     */
    server: {
      proxy: {
        "/__/auth": {
          target: `https://${process.env.VITE_FIREBASE_AUTHDOMAIN}`,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/__\/auth/, "/__/auth"),
        },
      },
    },
  };
});
