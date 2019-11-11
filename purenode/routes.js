const fs = require("fs");

const requestHandler = (req, res) => {
  const { url, method, headers } = req;
  res.setHeader("Content-Type", "text/html");
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>my first app</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", chunk => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsBody = Buffer.concat(body).toString();
      fs.writeFile("myMessage.txt", parsBody.split("=")[1], () => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.write("<html>");
  res.write("<head><title>my first app</title></head>");
  res.write("<body> <h1>Hello world </h1> </body>");
  res.write("</html>");
  res.end();
};

module.exports = requestHandler;
// exports.requestHandler = requestHandler;
// module.exports.requestHandler = requestHandler;
// module.exports = {
//   requestHandler: requestHandler,
//   static: "ssdsdsdsd"
// };
