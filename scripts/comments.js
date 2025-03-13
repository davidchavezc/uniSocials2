var postId = getPostId();
if (postId !== null) {
  console.log(postId); // Esto imprimirá el valor de postId como un número en la consola
} else {
  console.error("postId no encontrado en la URL");
}

$(document).ready(function(){
  getPost(postId);
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
    getComments(postId);
    $('main').on('click', '#sendComment', function(){
      var postContent = $('#composeBox').val();
      console.log(postContent);
      if(postContent.length > 3 && postContent.length < 500){
        commentPost(postId, postContent);
      }else{
        Swal.fire({
        title: 'Algo salió mal',
        text: 'No pudimos enviar el comentario',
        icon: 'error' 
        })
      }
    });
  })