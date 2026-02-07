const express = require("express");
const morgan = require("morgan");

const todosRouter = require("./routes/todos");
const { requireApiKey } = require("./middleware/auth");

const app = express();

const APP_NAME = process.env.APP_NAME || "k8s-big-app";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Enkel logging
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.json({
    app: APP_NAME,
    status: "ok",
    logLevel: LOG_LEVEL,
    time: new Date().toISOString()
  });
});

// Health + readiness (klar for K8s probes)
app.get("/healthz", (req, res) => res.status(200).send("OKEY"));
app.get("/readyz", (req, res) => res.status(200).send("READY"));

// “Fake” metrics (vi gjør dette skikkelig med Prometheus senere)
let requestCount = 0;
app.use((req, _res, next) => {
  requestCount += 1;
  next();
});
app.get("/metrics", (_req, res) => {
  res.type("text/plain").send(
`# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${requestCount}
`
  );
});

// Beskyttet route eksempel (bruker env API_KEY)
app.use("/api", requireApiKey, todosRouter);

app.listen(PORT, () => {
  console.log(`[${APP_NAME}] listening on port ${PORT}`);
});
