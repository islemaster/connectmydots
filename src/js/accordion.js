$(function () {
  // Set up left-column collapsers
  $('.left-column h1').click(function (event) {
    var targetId = $(event.target).attr('data-for');
    $('.left-column .collapsable:not(#' + targetId + ')').slideUp('fast');
    $('.left-column #' + targetId).slideDown('fast');
  });
});
