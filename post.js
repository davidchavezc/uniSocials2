document.querySelectorAll('input[type="text"]').forEach(function(node) {
  node.onchange = node.oninput = function() {
    node.style.width = node.scrollWidth+'px';
  };
});