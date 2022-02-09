import posts from "./posts.json";

export default (req, res) => {
  res.status(200).json(posts);
}