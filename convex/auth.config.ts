export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL, // ✅ points to convex.site, not localhost
      applicationID: "convex",
    },
  ],
};
