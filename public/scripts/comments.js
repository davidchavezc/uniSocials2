var postId = getPostId();
if (postId !== null) {
  console.log(postId); // Esto imprimirá el valor de postId como un número en la consola
} else {
  console.error("postId no encontrado en la URL");
}

$(document).ready(function(){
  getPost(postId);
  getComments(postId);

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
  });

  $('main').on('click', '#sendComment', function(){
    var postContent = $('#composeBox').val();
    if(postContent.length > 3 && postContent.length < 500){
      commentPost(postId, postContent);
    }else{
      Swal.fire({
        title: 'Algo salió mal',
        text: 'No pudimos enviar el comentario, debe estar entre tres y quinientos caracteres',
        icon: 'error' 
      });
    }
  });

  $('main').on('click', '.editComment', function(){
    var commentContent = $(this).closest('.comment').children('p').text();
    $(this).closest('.comment').find('p').replaceWith(`<textarea id="editBox">${commentContent}</textarea>`);
    $(this).after('<button class="sendCommentEdit">Enviar</button>');
  });

  $('main').on('click', '.sendCommentEdit', function(){
    // let idPublicacion = $(this).closest('article').attr('postID');
    let idComentario = $(this).closest('.comment').attr('commentID');
    let contenido = $(this).closest('.comment').find('#editBox').val();
    if(contenido.length > 3 && contenido.length < 500){
      changeComment(idComentario,contenido);
      $('article').children().remove();
      getComments(postId);
    }else{
      Swal.fire({
        title: 'No pudimos enviar tu comentario',
        text: 'Tu comentario debe ser mayor a 3 caracteres y menor a 500',
        icon: 'error'
      });
    }
  })
  
  $('main').on('click', '.deleteComment', function(){
    let commentId = $(this).closest('.comment').attr('commentID');
    deleteComment(commentId);
  });
});