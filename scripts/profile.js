getMyPosts();

$('main').on('click','.deletePost', function(){
var postID = $(this).closest('article').attr('postID');
deletePost(postID);
setTimeout(reloadPosts('mine'), 1000);
})