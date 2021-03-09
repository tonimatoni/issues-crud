$(document).ready(function () {
  const baseURL = "http://127.0.0.1:3000";

  $("#createCategoryForm").submit(function (e) {
    e.preventDefault();
    const title = $(this).find('input[name ="title"]').val();
    const description = $(this).find('textarea[name ="description"]').val();
    const attachments = $(this).find('input[name ="attachments"]').files;
    const category = $(this).find('input[name ="category"]').val();

    if (!title || !description || !category) {
      alert("Title, description and category fields can not be empty!");

      return;
    }
    var formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("attachments", attachments);
    $.ajax({
      type: "POST",
      url: baseURL + "/categories/post",
      data: { title: category },

      success: function (id) {
        formData.append("category_id", id);
        addIssue(formData);
      },
      error: function (response) {
        alert(response.error);
      },
    });
  });

  $.ajax({
    type: "GET",
    url: baseURL + "/categories/get",
    dataType: "JSON",
    success: function (categories) {
      addToCategoryDatalist(categories);
    },
  });

  /**
   * Appends the provided array to datalist element
   * @param {Array<Categories>} categories
   */

  function addToCategoryDatalist(categories) {
    categories.forEach((c) => {
      $("#categoriesList").append(`<option value="${c.title}" />`);
    });
  }

  /**
   * Request to add an issue
   * @param {FormData} formData
   */
  function addIssue(formData) {
    $.ajax({
      type: "POST",
      url: baseURL + "/issues/post",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        updateCategory(response.id, response.category_id);
      },
    });
  }

  /**
   * Updates category, adding new issue ID to the array
   * @param {String} id - Issue ID
   * @param {String} id - Category ID
   */

  function updateCategory(issue_id, category_id) {
    $.ajax({
      type: "PUT",
      url: baseURL + "/categories/update",
      data: { issue_id: issue_id, category_id: category_id },
      dataType: "json",
      success: function (response) {
        alert(response);
      },
    });
  }
});
