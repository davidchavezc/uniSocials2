var postId = getPostId();
if (postId !== null) {
  console.log(postId); // Esto imprimirá el valor de postId como un número en la consola
} else {
  console.error("postId no encontrado en la URL");
}

getPost(postId);
getComments(postId);