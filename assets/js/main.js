$(function() {

  $('.ui.sidebar').sidebar({
    context: $('.bottom.segment')
  }).sidebar('attach events', '.menu .item');

  $('.ui.dropdown')
    .dropdown()
  ;

  $('.copyToClipboard').click(function(){
    let content = $(this).data('text');
    console.log('content', content);
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val(content).select();
    document.execCommand("copy");
    $temp.remove();
    noty({
      text: `Copy to clipboard`,
      type: 'success',
    });
  })

  $(document).ready(function() {

  });
});
