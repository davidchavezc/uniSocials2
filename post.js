$('#sendPost').on('click', function(){ 
  Swal.fire({
  title: "Publicación enviada",
  icon: "success"
})
});

$('.starPost').on('click', function(){
  $(this).children('i').toggleClass('bi-star-fill bi-star');
})
$('.commentPost').on('click', function(){
  $(this).children('i').toggleClass('bi-chat-fill bi-chat');
})