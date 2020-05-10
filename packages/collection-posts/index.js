module.exports = function (collection) {
  const now = new Date();
  const livePosts = (post) => post.date <= now && !post.data.draft;
  return [
    ...collection.getFilteredByGlob('./src/posts/*.md').filter(livePosts),
  ].reverse();
};
