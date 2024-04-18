/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        //in my case i used cdn.pixabay.com
      },
    ],
  },
};

module.exports = nextConfig;
