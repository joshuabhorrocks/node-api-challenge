const server = require('./server.js');

const projectRouter = require("./data/helpers/projectRouter");

server.use("/api/projects", projectRouter)

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`\n* Server Running on http://localhost:${port} *\n`);
});
