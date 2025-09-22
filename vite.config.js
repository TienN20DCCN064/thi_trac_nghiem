import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      // parse cả các file .js chứa JSX
      include: "**/*.{js,jsx,ts,tsx}",
    }),
  ],
});
