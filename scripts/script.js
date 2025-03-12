var matricula = 2177862;
var apiKey = "43de612c-3ab2-4c5e-9695-89660336460a";
var url = 'https://redsocial.luislepe.tech/api';

// Obtener posts
function getPosts(){
    $.ajax({
        url: url + '/Publicaciones/all/' + matricula,
        type: 'GET',
        dataType: 'json',
        crossDomain: true
    }).done(function(result) {
        $(result).each(function(index, post) {
            var postHtml = `
            <article class="d-flex composeContainer" postID="${post.idPublicacion}" idUsuario="${post.idUsuario}">
            <span>${post.nombre}</span>
            <p class="mb-0">${post.contenido}</p>
            <datetime class="me-3">${moment(post.fechaCreacion).subtract(6, 'days').calendar()}</datetime>
            <section class="ms-auto gap-3">
            ${post.idUsuario == matricula ? `<button class="editPost"><i class="editIcon bi bi-pencil"></i></button>
                <button class="deletePost"><i class="removeIcon bi bi-trash"></i></button>` : ''}
                <button class="starPost">${post.cantidadLikes} <i class="starIcon bi bi-star"></i></button>
            <button class="commentPost"><a href="publicacion.html">${post.cantidadComentarios} <i class="commentIcon bi bi-chat"></a></i></button>
            </section>
            </article>
            `;
            $('main').append(postHtml);
        });

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
        $('main').append(`<article class="d-flex composeContainer">
            <span>Publicar</span>
            <textarea placeholder="Escribe lo que tengas en mente..." id="composeBox"></textarea>
            <button id="sendPost">Enviar <i class="bi bi-send-fill"></i></button>
          </article>`);
        $(result).each(function(index, post) {
            var postHtml = `
            <article class="d-flex composeContainer" postID="${post.idPublicacion}">
            <span>${post.nombre}</span>
            <p class="mb-0">${post.contenido}</p>
            <section class="ms-auto">
            <datetime class="me-3">${moment(post.fechaCreacion).subtract(6, 'days').calendar()}</datetime>
            <button class="starPost">${post.cantidadLikes} <i class="starIcon bi bi-star-fill"></i></button>
            <button class="commentPost"><a href="publicacion.html">${post.cantidadComentarios} <i class="commentIcon bi bi-chat"></a></i></button>
            </section>
            </article>
            `;
            $('main').append(postHtml);
        });
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
        // contentType: 'application/json',
        crossDomain: true,
        data: JSON.stringify({
           idPublicacion: postId,
           idUsuario: matricula,
           llave_Secreta: apiKey,
           contenido: comentario
        })
    }).done(function() {
        console.log("Comentario creado correctamente");
        reloadPosts();
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
        console.log("Post creado correctamente");
        $('#composeBox').val('');
        reloadPosts();
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

function reloadPosts(){
    $('main').children().remove();
    getPosts();
}

function getMyPosts(){
    $.ajax({
        url: url + '/Publicaciones/all/' + matricula + '/' + matricula,
        type: 'GET',
        dataType: 'json',
        crossDomain: true
    }).done(function(result) {
        $(result).each(function(index, post) {
            var postHtml = `
            <article class="d-flex composeContainer" postID="${post.idPublicacion}" idUsuario="${post.idUsuario}">
            <span>${post.nombre}</span>
            <p class="mb-0">${post.contenido}</p>
            <datetime class="me-3">${moment(post.fechaCreacion).subtract(6, 'days').calendar()}</datetime>
            <section class="ms-auto">
            ${post.idUsuario == matricula ? `<button class="editPost"><i class="editIcon bi bi-pencil"></i></button>
                <button class="deletePost"><i class="removeIcon bi bi-trash"></i></button>` : ''}
            <button class="starPost">${post.cantidadLikes} <i class="starIcon bi bi-star"></i></button>
            <button class="commentPost"><a href="publicacion.html">${post.cantidadComentarios} <i class="commentIcon bi bi-chat"></a></i></button>
            </section>
            </article>
            `;
            $('main').append(postHtml);
        });

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