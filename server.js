import router from "./router.js";

const app = router();

app.get(
  "/",
  (req, next) => {
    next();
  },
  (req, next) => {
    next();
  },
  (req) => {
    req.respond({
      body: JSON.stringify({
        message: "GET: hello world",
      }),
    });
  }
);

app.post("/", (req, next) => {
  req.respond({
    body: JSON.stringify({
      message: "POST: hello world",
    }),
  });
});

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
