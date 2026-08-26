const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Increase Server Actions body size limit so uploads and large actions work reliably
  experimental: {
    serverActions: {
      // Accept up to 8 MB bodies for server actions; adjust as needed.
      bodySizeLimit: "8mb",
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "afyuusybalmnipkytwqm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

module.exports = nextConfig;
