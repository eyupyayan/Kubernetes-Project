function requireApiKey(req, res, next) {
  const expected = process.env.API_KEY;
  if (!expected) {
    // I dev kan du la den være tom, men i k8s vil vi bruke Secret.
    return res.status(500).json({ error: "API_KEY is not configured" });
  }
  const provided = req.header("x-api-key");
  if (provided !== expected) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

module.exports = { requireApiKey };
