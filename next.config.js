// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   rewrites: async () => {
//     return [
//       {
//         source: "/api/:path*",
//         destination:
//           process.env.NODE_ENV === "development"
//             ? "http://127.0.0.1:5000/api/:path*"
//             : "/api/",
//       },
//     ];
//   },
// };

// module.exports = nextConfig;
// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         //destination: "http://127.0.0.1:5000/:path*",  Proxy to Backend
//         destination: "http://localhost:5000/api/:path*",
//       },
//     ];
//   },
// };
