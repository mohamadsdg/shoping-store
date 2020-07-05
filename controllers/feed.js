exports.getPost = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "this is the first post!",
        creator: { name: "MohamadReza" },
        createdAt: new Date(),
        imageUrl: "images/tst.png",
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  console.log(req.body);

  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: "Product create successfully",
    post: [
      {
        _id: "2",
        title,
        content,
        creator: { name: "MohamadReza" },
        createdAt: new Date(),
        imageUrl: "images/tst.png",
      },
    ],
  });
};
