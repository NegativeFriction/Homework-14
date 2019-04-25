$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    //   $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    console.log(data[i]);
  }
});

$.getJSON("/articles_with_comments",function(data){
    console.log(data[0])
    for (let i =0; i<data.length;i++){
        let title = data[i].headline;
        let summary = data[i].summary;
        let link = data[i].link;
        let comments = data[i].comment
        let id = data[i]._id
        if(summary){
        let newDiv = $("<div>")
        newDiv.append("<a data-id =" + id + " href = " + link + ">" + title + "</a>")
        newDiv.append("<h5>" + summary + "</h5>")
        let commentsDiv = $("<div class='comments'>")
        commentsDiv.append("<button data-id = " + id + " class='newComment'>Leave a Comment</button>")
        commentsDiv.append("<button data-id = " + id + " class='seeComment'>See Comments</button>")
        $("#articles-list").append(newDiv)
        $("#articles-list").append(commentsDiv)
        }
        } 
    }
)

$(document.body).on('click', '.newComment', function() {
    let id = $(this).attr("data-id")
    $(this).parent().empty()
    let commentDiv = $('<textarea id="comment">')
    let authorDiv = $('<textarea id="author">')
    let submitButton = $('<button class="make-new" data-id =' + id + '>Submit</button>')
    $(this).parent().append(commentDiv)
    $(this).parent().append(authorDiv)
$(this).parent().append(submitButton)
   
});

$(document.body).on("click",)