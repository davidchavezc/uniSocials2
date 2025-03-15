var matricula = 2177862;
var apiKey = "43de612c-3ab2-4c5e-9695-89660336460a";
var url = 'https://redsocial.luislepe.tech/api';
moment.locale('es-MX');  
// Obtener posts
function getPosts(){
  $.ajax({
    url: url + '/Publicaciones/all/' + matricula,
    type: 'GET',
    dataType: 'json',
    crossDomain: true
  }).done(function(result) {
    console.log(result.length)
    $(result).each(function(index, post) {
      html = getHTML(post);
      $('main').append(html);
    });

    // Asignar eventos después de agregar los elementos al DOM
    $('.starPost').on('click', function(){
      var postId = $(this).closest('article').attr('postID');
      var isLiked = $(this).children('i').hasClass('bi-star-fill');
      likePost(postId, isLiked, $(this));
      $(this).children('i').toggleClass('bi-star-fill bi-star');
    });

    $('.commentPost').on('click', function(){
      $(this).children('i').toggleClass('bi-chat-fill bi-chat');
    });

    $('.editPost').on('click', function(){
      var postId = $(this).closest('article').attr('postID');
      var postContent = $(this).closest('article').children('p').text();
      $(this).closest('article').find('p').replaceWith(`<textarea id="editBox">${postContent}</textarea>`);
      $(this).after('<button id="sendEdit" class="sendPost">Enviar</button>');

      $('#sendEdit').on('click', function(){
        var newContent = $('#editBox').val();
        if (newContent.length > 3 && newContent.length < 500) {
          changePost(newContent, postId);
        }
      });
    });
  }).fail(function(jqXHR, errorStatus, errorMsg) {
    Swal.fire({
      title: "Algo salió mal",
      text: "No pudimos conectarnos al servidor, revisa tu conexión",
      icon: "error"
    });
    console.error("Error: " + errorStatus + ", " + errorMsg);
  });
}

// Poner un like a un post
function likePost(postId, isLiked, buttonElement){
  var type = isLiked ? 'DELETE' : 'POST';
  $.ajax({
    url: url + '/Likes',
    dataType: 'json',
    type: type,
    contentType: 'application/json',
    crossDomain: true,
    data: JSON.stringify({
      idPublicacion: postId,
      idUsuario: matricula,
      llave_Secreta: apiKey
    })
  }).done(function(response) {
    console.log("Like toggled successfully:", response);
    var likeCount = parseInt(buttonElement.text());
    likeCount = isLiked ? likeCount - 1 : likeCount + 1;
    buttonElement.contents().first()[0].textContent = likeCount + ' ';
  }).fail(function(jqXHR, errorStatus, errorMsg) {
    console.error("Error: " + errorStatus + ", " + errorMsg);
  });
}

// Mostrar likes 
function getFavoritePosts(){
  $.ajax({
    url: url + '/Likes/' + matricula + '/' + matricula,
    type: 'GET',
    dataType: 'json',
    crossDomain: true
  }).done(function(result) {
    $('main').append(`<article class="d-flex green-container">
      <span>Publicar</span>
      <textarea placeholder="Escribe lo que tengas en mente..." id="composeBox"></textarea>
      <button id="sendPost">Enviar <i class="bi bi-send-fill"></i></button>
    </article>`);
    $(result).each(function(index, post) {
      let html = getHTML(post)
      $('main').append(html);
    });

    // Asignar eventos después de agregar los elementos al DOM
    $('.starPost').on('click', function(){
      var postId = $(this).closest('article').attr('postID');
      var isLiked = $(this).children('i').hasClass('bi-star-fill');
      likePost(postId, isLiked, $(this));
      $(this).children('i').toggleClass('bi-star-fill bi-star');
    });

    $('.commentPost').on('click', function(){
      $(this).children('i').toggleClass('bi-chat-fill bi-chat');
    });
  }).fail(function(jqXHR, errorStatus, errorMsg) {
    console.error("Error: " + errorStatus + ", " + errorMsg);
  });
}

// Crear un comentario
function commentPost(postId, comentario){
  $.ajax({
    url: url + '/Comentarios',
    dataType: 'json',
    type: 'POST',
    contentType: 'application/json',
    crossDomain: true,
    data: JSON.stringify({
      idPublicacion: postId,
      idUsuario: matricula,
      llave_Secreta: apiKey,
      contenido: comentario
    })
  }).done(function() {
    console.log("Comentario creado correctamente");
    $('main').children().remove(),
    getPost(postId);
    getComments(postId);
  });
}

function createPost(publicacion){
  $.ajax({
    url: url + '/Publicaciones',
    dataType: 'json',
    type: 'POST',
    contentType: 'application/json',
    crossDomain: true,
    data: JSON.stringify({
      idPublicacion: 0,
      idUsuario: matricula,
      llave_Secreta: apiKey,
      contenido: publicacion
    })
  }).done(function() {
    Swal.fire({
      title: "Publicación enviada",
      text: "Tu publicación fue enviada exitosamente",
      icon: "success"
    })
    console.log("Post creado correctamente");
    $('#composeBox').val('');
    reloadPosts();
  }).fail(function(jqXHR, errorStatus, errorMsg){
    Swal.fire({
      title: "Algo salió mal",
      text: "No pudimos enviar tu publicación, intenta de nuevo",
      icon: "error"
    })
    console.error("Error: " + errorStatus + ", " + errorMsg);
  });
}

// Cambiar una publicación
function changePost(publicacion, postId){
  $.ajax({
    url: url + '/Publicaciones/' + postId,
    dataType: 'json',
    type: 'PUT',
    contentType: 'application/json',
    crossDomain: true,
    data: JSON.stringify({
      idPublicacion: postId,
      idUsuario: matricula,
      llave_Secreta: apiKey,
      contenido: publicacion
    })
  }).done(function(response) {
    console.log("Post actualizado correctamente:", response);
    // Actualizar el DOM con la publicación actualizada
    getPosts();
  }).fail(function(jqXHR, errorStatus, errorMsg) {
    console.error("Error: " + errorStatus + ", " + errorMsg);
  });
}

function reloadPosts(show){
  $('main').children().remove();
  if(show === 'mine'){
    $('main').append(bioHTML);
    getMyPosts()
  }else{
    $('main').append(composeHTML)
    getPosts();
  }
}

function getMyPosts(){
  $.ajax({
    url: url + '/Publicaciones/all/' + matricula + '/' + matricula,
    type: 'GET',
    dataType: 'json',
    crossDomain: true
  }).done(function(result) {
    $(result).each(function(index, post) {
      let html = getHTML(post)
      $('main').append(html);
    });

    // Asignar eventos después de agregar los elementos al DOM
    $('.starPost').on('click', function(){
      var postId = $(this).closest('article').attr('postID');
      var isLiked = $(this).children('i').hasClass('bi-star-fill');
      likePost(postId, isLiked, $(this));
      $(this).children('i').toggleClass('bi-star-fill bi-star');
    });

    $('.commentPost').on('click', function(){
      $(this).children('i').toggleClass('bi-chat-fill bi-chat');
    });

    $('.editPost').on('click', function(){
      var postId = $(this).closest('article').attr('postID');
      var postContent = $(this).closest('article').children('p').text();
      $(this).closest('article').find('p').replaceWith(`<textarea id="editBox">${postContent}</textarea>`);
      $(this).after(`
        <button id="sendEdit" class="sendPost">Enviar</button>`);
      $('#sendEdit').on('click', function(){
        var newContent = $('#editBox').val();
        if (newContent.length > 3 && newContent.length < 500) {
          changePost(newContent, postId);
        }
      });
    });
  }).fail(function(jqXHR, errorStatus, errorMsg) {
    console.error("Error: " + errorStatus + ", " + errorMsg);
  });
}


// Borrar un post 

function deletePost(postId){
  $.ajax({
    url: url + '/Publicaciones/' + postId,
    dataType: 'json',
    type: 'DELETE',
    contentType: 'application/json',
    crossDomain: true,
    data: JSON.stringify({
      idPublicacion: postId,
      idUsuario: matricula,
      llave_Secreta: apiKey,
      contenido: ''
    })
  }).done(function(response) {
    console.log("Post eliminado correctamente:", response);
    Swal.fire({
      title: "Post eliminado",
      text: "Publicacion eliminada exitosamente",
      icon: "success"
    });
    // reloadPosts();
  }).fail(function(jqXHR, errorStatus, errorMsg) {
    console.error("Error: " + errorStatus + ", " + errorMsg);
    Swal.fire({
      title: "Algo salió mal",
      text: "No pudimos eliminar la publicación",
      icon: "error"
    });
  });
}

// Obtener ID de un post de la url

function getPostId() {
  var params = {};
  var queryString = window.location.search.substring(1);
  var queryArray = queryString.split('&');
  queryArray.forEach(function(param) {
    var pair = param.split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  });
  return params['postId'] ? parseInt(params['postId'], 10) : null;
}

// Obtener los comentarios de un post con su ID

function getComments(postId){
  $.ajax({
    url: url + '/Comentarios/Publicacion/'+ matricula + '/' + postId,
    type: 'GET',
    dataType: 'json',
    contentType: 'applications/json',
    crossDomain: 'true',
  }).done(function (result){
    $(result).each(function(index, comment){
      let html = getCommentHTML(comment)
      $('main').children('article').append(html);
    })
    $('main').children('article').append(composeCommentHTML);
  })
}
// Obtener un post espeifico
function getPost(postId){
  $.ajax({
    url: url + '/Publicaciones/' + matricula + '/' + postId,
    type: 'GET',
    dataType: 'json',
    contentType: 'applications/json',
    crossDomain: 'true',
  }).done(function (result){
    $(result).each(function(index, post){
      let html = getHTML(post); 
      $('main').append(html);
    })
  })
}

// Modificar comentario
function changeComment(idComentario, contenido){
  console.log(idComentario, contenido)
  $.ajax({
    url: url + '/Comentarios/' + idComentario,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    crossDomain: true,
    data: JSON.stringify({
      idComentario: idComentario,
      idPublicacion: 0,
      idUsuario: matricula,
      llave_Secreta: apiKey,
      contenido: contenido
    })
  }).done(function(index, comment){
    console.log(`Comentario ${comment.idComentario} modificado exitosamente!`);
    Swal.fire({
      title: 'Comentario cambiado',
      text: 'Cambiaste tu comentario con éxito',
      icon: 'success'
    })
     $('main').children().remove();
     getPost(postId);
     getComments(postId);
   }).fail(function(jqXHR, errorStatus, errorMsg){
     console.log(`${errorStatus} Error: ${errorMsg}`);
     Swal.fire({
       title: 'Algo salió mal',
       text: 'No pudimos cambiar el comentario',
       icon: 'error'
     })
   })
 }

//  Borrar comentario
function deleteComment(commentId){
  $.ajax({
    url: url + '/Comentarios/' + commentId,
    type: 'DELETE',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({
      idComentario: commentId,
      idPublicacion: 0,
      idUsuario: matricula,
      llave_Secreta: apiKey,
      contenido: ''
    })
  }).done(function(){
    $('.comment[commentId=' + commentId + ']').remove()
    Swal.fire({
      title: 'Comentario eliminado',
      text: 'Tu comentario se elimino exitosamente',
      icon: 'success'
    })
    return true;
  }).fail(function(jqXHR, errorStatus, errorMsg){
    console.log(`${errorStatus} Error: ${errorMsg}`);
     Swal.fire({
       title: 'Algo salió mal',
       text: 'No pudimos eliminar el comentario',
       icon: 'error'
     })
  })
}

// Plantillas

var bioHTML = `
  <div class="profile-section green-container whitey">
  <div class="card roundie">
    <img src="assets/galaxy.png" alt="Foto de portada" class="img-fluid profileBanner" style="width: 100%; height: 200px; object-fit: cover;">
    <div class="profile-info text-center mt-3" style="height: 60px;">
      <img src="assets/foto.jpg" alt="Foto de perfil" class="profilePicture" style="width: 150px; height: 150px; object-fit: cover;">
    </div>
    <div class="text-center mt-3">
      <h2 class="displayName">David Chávez</h2>
      <p class="profileBio">Me gusta el fortnite, lo juego todo el día</p>
      <div class="text-start card-body">
        <h5 class="coolhover">Descripción</h5>
        <p>David estudia Ingeniería en Software en la UANL. Le interesan la música, la tecnología, los cómics y One Piece. También disfruta explorar distintos entornos de software y aprender cosas nuevas.</p>
        <button class="ms-auto">Editar presentación</button>
      </div>
    </div>
  </div>
</div>`

var composeHTML = `<article class="d-flex green-container">
  <span>Publicar</span>
  <textarea placeholder="Escribe lo que tengas en mente..." id="composeBox"></textarea>
  <button id="sendPost">Enviar <i class="bi bi-send-fill"></i></button>
</article>`

var composeCommentHTML = `
<section class="d-flex green-container mini">
  <span>Comentar</span>
  <textarea placeholder="Escribe lo que tengas en mente..." id="composeBox"></textarea>
  <button id="sendComment">Enviar <i class="bi bi-send-fill"></i></button>
  </section>`

function getHTML(post){
  let html = `
    <article class="d-flex green-container" postID="${post.idPublicacion}" idUsuario="${post.idUsuario}">
      <div class='d-flex'>
        <span>${post.nombre}</span>
      </div>
      <div class='text-card'>
        <p class="mb-0">${post.contenido}</p> 
      </div>
      <div class='date&options d-flex ms-3'>
        <datetime class='mt-2 align-middle'>${moment(post.fechaCreacion).calendar()}</datetime>
        <section class="ms-auto">
        ${post.idUsuario == matricula ? `<button class="editPost"><i class="editIcon bi bi-pencil"></i></button>
        <button class="deletePost"><i class="removeIcon bi bi-trash"></i></button>` : ''}
        <button class="starPost">${post.cantidadLikes} <i class="${post.likePropio ? `bi bi-star-fill` : `bi bi-star`}"></i></button>
        <button class="commentPost"><a href="publicacion.html?postId=${post.idPublicacion}">${post.cantidadComentarios} <i class="commentIcon bi bi-chat"></a></i></button>
        </section>
      </div>
    </article>
      `
      return html;
}

function getCommentHTML(comment){
  let html = `
    <section class='ms-4 mb-3 comment' commentId="${comment.idComentario}" idUsuario="${comment.idUsuario}">
      <div class='d-flex'>
        <span>${comment.nombre}</span>
      </div>
      <div class='text-card'>
        <p class="mb-0">${comment.contenido}</p> 
      </div>
      <div class='date&options d-flex ms-3'>
        <datetime class='mt-2 align-middle'>${moment(comment.fechaCreacion).calendar()}</datetime>
        <section class="ms-auto">
        ${comment.idUsuario == matricula ? `<button class="editPost"><i class="editIcon bi bi-pencil"></i></button>
        <button class="deleteComment"><i class="removeIcon bi bi-trash"></i></button>` : ''}
        <button class="starPost">${comment.cantidadLikes} <i class="${comment.likePropio ? `bi bi-star-fill` : `bi bi-star`}"></i></button>
        </section>
      </div>
    </section>
      `
  return html;
}
