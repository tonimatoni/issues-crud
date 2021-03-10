$(document).ready(function () {
  const baseURL = "http://127.0.0.1:3000";
  const issuesTableBody = $("table#issues tbody");
  const categorySelect = $("select#categories");

  getCategoriesAll();

  $("#createCategoryForm").submit(function (e) {
    e.preventDefault();
    const title = $(this).find('input[name ="title"]').val();
    const description = $(this).find('textarea[name ="description"]').val();
    const attachments = $(this).find('input[name ="attachments"]')[0].files;
    const category = $(this).find('input[name ="category"]').val();

    if (!title || !description || !category) {
      alert("Title, description and category fields can not be empty!");

      return;
    }
    var formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    for (var i = 0; i < attachments.length; i++) {
      var file = attachments[i];
      formData.append("attachments", file, file.name);
    }
    addCategory(formData);
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

  // On change, show issues for that category
  categorySelect.change(function (e) {
    e.preventDefault();

    getByCategory($(this).val());
  });

  /**
   * Formats given time to a more readable format (DD.MM.YYYY)
   * @function formatTime
   * @param {Date} time
   * @returns {String} Formatted date
   */
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  /**
   * Realizes the dropdown list by appending options.
   * @function appendCategoriesToDropdown
   * @param {Array.<{_id: String, title: String}>} Categories - Array of all categories with ID and title
   */

  function appendCategoriesToDropdown(categories) {
    categories.forEach((c) => {
      categorySelect.append(`<option value="${c._id}">${c.title}</option>`);
    });
  }

  $("#createCommentForm").submit(function (e) {
    e.preventDefault();
    const comment = $("#comment").val();
    const id = $("#addCommentForm #issue_id").val();
    postCommentIssue(id, comment);
  });

  $("body").on("click", ".show", function (e) {
    const id = e.target.id;
    $(`#${id}MoreDetails`).toggle();
  });
  $("body").on("click", ".delete", function (e) {
    const id = e.target.id;
    deleteIssue(id);
  });
  $("body").on("click", ".comment", function (e) {
    const id = e.target.id;
    $("#createCommentForm #issue_id").val(id);
  });
  $("body").on("click", ".finish", function (e) {
    const id = e.target.id;
    finishIssue(id);
  });

  /*
    ----------------------------------------
                Api functions
    ----------------------------------------
   */

  /**
   * Deletes an issue by it's ID.
   * @function deleteIssue
   * @param {string} issueID
   */
  const deleteIssue = (issueID) => {
    $.ajax({
      type: "DELETE",
      url: baseURL + "/issues/delete/" + issueID,
      dataType: "json",
      success: function (response) {
        alert(response);
        $(`tr.${issueID}`).remove();
      },
      error: function (response) {
        alert(response.responseText);
      },
    });
  };

  /**
   * Finishes an issue by it's ID.
   * @function finishIssue
   * @param {string} issueID
   */
  const finishIssue = (issueID) => {
    $.ajax({
      type: "PUT",
      url: baseURL + "/issues/" + issueID,
      dataType: "json",
      success: function (response) {
        alert(response);
        $(`tr.${issueID} .status`).html("finished");
      },
      error: function (response) {
        alert(response.responseText);
      },
    });
  };

  /**
   * Adds new comment to the issue
   * @function postCommentIssue
   * @param {string} issueID
   */
  const postCommentIssue = (issueID, comment) => {
    $.ajax({
      type: "POST",
      url: baseURL + "/issues/" + issueID + "/comment/post",
      data: {
        comment,
      },
      dataType: "json",
      success: function (response) {
        alert(response);
        getByCategory(categorySelect.val());
        $(`tr.${issueID} .status`).html("finished");
      },
      error: function (response) {
        alert(response.responseText);
      },
    });
  };

  /**
   * Gets issues by selected category
   * @function getByCategory
   * @param {string} categoryID
   */
  const getByCategory = (categoryID) => {
    $.ajax({
      type: "GET",
      url: baseURL + "/issues/get-by-category",
      data: {
        category_id: categoryID,
      },
      dataType: "json",
      success: function (issues) {
        appendToTableBody(issues);
      },
    });
  };

  /**
   * Gets all categories
   * @function getCategoriesAll
   */
  function getCategoriesAll() {
    $.ajax({
      type: "GET",
      url: baseURL + "/categories/get",
      dataType: "JSON",
      contentType: "application/x-www-form-urlencoded",
      success: function (categories) {
        addToCategoryDatalist(categories);
        appendCategoriesToDropdown(categories);
      },
    });
  }
  /**
   * Request to add an issue
   * @function addIssue
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
        getCategoriesAll();
        updateCategory(response.id, response.category_id);
      },
    });
  }
  /**
   * Request to add a new category (or returns ID if the title already exists)
   * @function addCategory
   * @param {FormData} formData
   */

  function addCategory(formData) {
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
  }

  /*
    ----------------------------------------
                JS functions
    ----------------------------------------
   */
  const appendToTableBody = (issues) => {
    // append to table body
    issuesTableBody.html("");

    issues.forEach((issue) => {
      issuesTableBody.append(
        `
          <tr class="${issue._id}">
            <td>${issue.title}</td>
            <td>${formatTime(issue.created_at)}</td>
            <td class="status">${issue.status}</td>
           
            
            <td>
            <button id="${
              issue._id
            }" class="btn btn-success btn-block finish">Finish</button>
            <button id="${
              issue._id
            }" class="btn btn-danger btn-block delete">Delete</button>
            <button id="${
              issue._id
            }" class="btn btn-primary btn-block comment" data-toggle="modal"
            data-target="#addCommentForm">Add comment</button>
            <button id="${
              issue._id
            }" class="btn btn-secondary btn-block show">Show more</button>
            </td>
            
          </tr>
          <tr class="${issue._id}">
            <td colspan="4">
            <table class="moreDetailsTable" id="${issue._id}MoreDetails">
                <thead>
                  <tr>
                      <th>Description</th>
                      <td>${issue.description}</td>
                  </tr>
                  <tr>
                      <th>Attachments</th>
                      <td>${issue.attachments.map((a, i) => {
                        return `<a href="${a.path}" download> Material ${
                          i + 1
                        } </a>`;
                      })} | </td>
                  </tr>
                  <tr>
                  
                      <th class="valign-top">Comments</th>
                      <td>${issue.comments.map((c) => {
                        return `<p> ${c.comment}  | <i><small>${formatTime(
                          c.created_at
                        )}</small></i>  </p>`;
                      })}</td>
                      <tr>
                      
                  </tr>
                  </tr>
                </thead>
            </table>  
            </td>
          </tr>
        `
      );
    });
  };
});
