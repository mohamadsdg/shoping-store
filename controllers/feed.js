exports.getPost = (req, res, next) => {
  res
    .status(200)
    .json({ title: "First Post", content: "this is the first post!" });
};

exports.createPost = (req, res, next) => {
  // console.log(req.body); 

  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: "Product create successfully",
    post: {
      id: new Date().toISOString(),
      title,
      content,
    },
  });
};
