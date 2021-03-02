$(document).ready(function () {
  const baseURL = "http://127.0.0.1:3000";

  $("#createIssueForm").submit(function (e) {
    e.preventDefault();
    const title = $(this).find('input[name ="title"]').val();
    const description = $(this).find('input[name ="description"]').val();
    const attachments = $(this).find('input[name ="attachments"]').files;
    if (!title || !description)
      alert("Title and description fields can not be empty!");
    var formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("attachments", attachments);

    $.ajax({
      type: "POST",
      url: baseURL + "/issues/post",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        alert(response.message);
      },
      error: function (response) {
        alert(response.message);
      },
    });
  });
});
