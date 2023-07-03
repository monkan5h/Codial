module.exports.postTemplate = (post) => {
  return `
<div>
  <p>Hi ${post.user.name}!</p>
  <br />
  <p>Your published a post on codeial.</p>
  <br />
  <p><b>${post.content}</b></p>
  <br />
  <P>Thanks!</P>
</div>
`;
};
