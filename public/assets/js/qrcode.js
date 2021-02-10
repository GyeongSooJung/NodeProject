$('#modalpop').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var title = button.data('title'); // Extract info from data-* attributes
  var kind = button.data('kind');
  var body = button.data('body');
  var color = button.data('color');
  
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this)
  modal.find('.modal-title').text(title);
  modal.find('.modal-kind').text("/ "+kind);
  modal.find('.modal-body').text(body);
  // modal.style.color = "red";
})