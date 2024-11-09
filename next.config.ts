import type { NextConfig } from "next";
import dotenv from 'dotenv'
dotenv.config({ path: './app/.env.local' });



const nextConfig: NextConfig = {
  
  /* config options here */

  reactStrictMode: true,
  env: {
    MONGO_URI: process.env.MONGO_URI,
  },
};



export default nextConfig;
