$(document).ready(function(){
    getMyPosts();
    $('#composeBox').val('')
    $('#sendPost').on('click', function(){
        var postContent = $('#composeBox').val();
        console.log(postContent);
        if(postContent.length > 3 && postContent.length < 500){
            createPost(postContent);
        }
    });
    $('main').on('click', '.editPost', function(){
            var postId = $(this).closest('article').attr('postID');
            var postContent = $(this).closest('article').children('p').text();
            $(this).closest('article').find('p').replaceWith(`<textarea id="editBox">${postContent}</textarea>`);
            var isEdit = true;
            $('#sendEdit').on('click', function(){
                var newContent = $('#editBox').val();
                if (newContent.length > 3 && newContent.length < 500) {
                    changePost(newContent, postId);
                    $('main').children().remove();
                    $('main').append(bioHTML)
                    getMyPosts();
                }
            });
        }  
    )
}
)
$('main').on('click','.deletePost', function(){
var postID = $(this).closest('article').attr('postID');
deletePost(postID);
// setTimeout(reloadPosts('mine'), 1000);
getMyPosts();
$('main').prepend(bioHTML);
$(this).closest('comment').remove();
})