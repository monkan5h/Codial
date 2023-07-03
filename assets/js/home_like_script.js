class ToggleLike {
  constructor(toggleElement) {
    this.toggler = toggleElement;
    this.toggleLike();
  }
  toggleLike() {
    $(this.toggler).click(function (e) {
      e.preventDefault();
      let self = this;
      $.ajax({
        type: "GET",
        url: $(self).attr("href"),
      })
        .done(function (data) {
          let likescount = parseInt($(self).attr("data-likes"));
          if (data.deleted == true) {
            likescount -= 1;
          } else {
            likescount += 1;
          }
          $(self).attr("data-likes", likescount);
          // $(self).html(`${likescount} likes`);
          $(
            self
          ).html(`<img src="./img/like.png" style="width: 30px; height: 30px" />
          <sup class="text-danger"><b>${likescount}</b></sup>`);
        })
        .fail(function (error) {
          console.log("error in completing the request", error);
        });
    });
  }
}
