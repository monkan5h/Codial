class PostComments {
  constructor(postId) {
    this.postId = postId;
    this.postContainer = $(`#post-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comments-form`);

    this.createComment(postId);
    let self = this;
    $(" .delete-comment-button", this.postContainer).each(function () {
      self.deleteComment($(this));
    });
  }
  createComment(postId) {
    let pSelf = this;
    this.newCommentForm.submit(function (e) {
      e.preventDefault();
      let self = this;
      $.ajax({
        type: "POST",
        url: "/comment/createComment",
        data: $(self).serialize(),
        success: function (data) {
          let newComment = pSelf.newCommentDom(
            data.data.comment,
            data.data.post
          );
          $(`#post-comments-${postId}`).prepend(newComment);
          pSelf.deleteComment($(` .delete-comment-button`, newComment));
          new ToggleLike($(" .toggle-like-button", newComment));
          document.getElementById(
            `post-${postId}-comments-formTextarea`
          ).value = "";
          new Noty({
            layout: "topRight",
            theme: "metroui",
            type: "success",
            text: "Created new comment !!!",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
          new Noty({
            layout: "topRight",
            theme: "metroui",
            type: "error",
            text: "Error Occured while creating a comment !!!",
            timeout: 1500,
          }).show();
        },
      });
    });
  }
  newCommentDom(comment, post) {
    return $(`
    <li class="list-group-item d-flex justify-content-between align-items-start"  id="comment-${comment._id}">
  <div class="ms-2 me-auto">
    ${comment.content}
    <div class="fw-bold">-${comment.user.name}</div>
  </div>

  <a
  class="delete-comment-button btn btn-sm"
  href="/comment/deleteComment/${comment._id}/${post._id}"
  ><img src="./img/bin.png" style="width: 30px; height: 30px" />
  </a>

  <a
    class="toggle-like-button badge rounded-pill text-decoration-none ms-1"
    style="vertical-align: top"
    data-likes="${comment.likes.length}"
    href="/like/toggle/?id=${comment._id}&type=comment"
  >
    <img src="./img/like.png" style="width: 30px; height: 30px" />
    <sup class="text-danger">${comment.likes.length}</sup>
  </a>

</li>
    `);
  }

  deleteComment(deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();
      $.ajax({
        type: "GET",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          console.log(data);
          $(`#comment-${data.data.comment_id}`).remove();
          new Noty({
            layout: "topRight",
            theme: "metroui",
            type: "success",
            text: "Comment and its associated likes deleted !!!",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
          new Noty({
            layout: "topRight",
            theme: "metroui",
            type: "error",
            text: "Error Occured while deleting comment !!!",
            timeout: 1500,
          }).show();
        },
      });
    });
  }
}
