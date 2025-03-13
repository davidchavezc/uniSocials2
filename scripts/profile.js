$(document).ready(function(){
    getMyPosts();
    $('main').on('click', '.editPost', function(){
        if(isEdit){
            reloadPosts();  
        }else{
            var postId = $(this).closest('article').attr('postID');
            var postContent = $(this).closest('article').children('p').text();
            $(this).closest('article').find('p').replaceWith(`<textarea id="editBox">${postContent}</textarea>`);
            var isEdit = true;
            $('#sendEdit').on('click', function(){
                var newContent = $('#editBox').val();
                if (newContent.length > 3 && newContent.length < 500) {
                    changePost(newContent, postId);
                    reloadPosts();
                }
            });
        }  
    })
})

$('main').on('click','.deletePost', function(){
var postID = $(this).closest('article').attr('postID');
deletePost(postID);
setTimeout(reloadPosts('mine'), 1000);
})