$(document).ready(function () {
  const issuesTableBody = $("table#issues tbody");
  const categorySelect = $("select#categories");
  const baseURL = "http://localhost:3000";

  $.ajax({
    type: "GET",
    url: baseURL + "/categories/get",
    success: function (categories) {
      appendCategoriesToDropdown(categories);
      console.log(categories);
    },
  });

  // On change, show issues for that category
  categorySelect.change(function (e) {
    e.preventDefault();
    $.ajax({
      type: "GET",
      url: baseURL + "/issues/get-by-category",
      data: {
        category_id: categorySelect.val(),
      },
      dataType: "json",
      success: function (issues) {
        // append to table body
        issuesTableBody.html("");

        issues.forEach((issue) => {
          issue.comments = [
            "fdkjasfkldjasklfjasdkfj fasd fjkl asdf la;skdf ",
            "fdkjasfkldjasklfjasdkfj fasd fjkl asdf la;skdf ",
            "fdkjasfkldjasklfjasdkfj fasd fjkl asdf la;skdf ",
            "fdkjasfkldjasklfjasdkfj fasd fjkl asdf la;skdf ",
          ];
          issuesTableBody.append(
            `
              <tr>
                <td>${issue.title}</td>
                <td>${formatTime(issue.created_at)}</td>
                <td>${issue.status}</td>
               
                
                <td>
                <button id="${
                  issue._id
                }" class="btn btn-success btn-block finish">Finish</button>
                <button id="${
                  issue._id
                }" class="btn btn-danger btn-block delete">Delete</button>
                <button id="${
                  issue._id
                }" class="btn btn-primary btn-block comment">Add comment</button>
                <button id="${
                  issue._id
                }" class="btn btn-secondary btn-block show">Show more</button>
                </td>
                
              </tr>
              <tr>
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
                            return `<a href="${a.path}" download>Material ${
                              i + 1
                            } </a>`;
                          })} | </td>
                      </tr>
                      <tr>
                      
                          <th class="valign-top">Comments</th>
                          <td>${issue.comments.map((c) => {
                            return `<p> ${c} </p>`;
                          })}</td>
                      </tr>
                    </thead>
                </table>  
                </td>
              </tr>
            `
          );
        });
      },
    });
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

  $("body").on("click", ".show", function (e) {
    const id = e.target.id;
    $(`#${id}MoreDetails`).toggle();
  });
});
