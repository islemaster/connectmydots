
var dataEditor, scriptEditor, dataSrc, scriptSrc, data, render;

function rebuildGraph() {
  var rawData = dataEditor.getValue();
  var rawScript = scriptEditor.getValue();

  if (dataSrc === rawData && scriptSrc == rawScript) {
    return;
  }

  dataSrc = rawData;
  scriptSrc = rawScript;

  // Put latest raw values in local storage
  localStorage.setItem('data', rawData);
  localStorage.setItem('script', rawScript);

  try {
    data = JSON.parse(dataEditor.getValue());
    try {
      eval('render = function (data, target, forceGraph) { ' + scriptEditor.getValue() + ' };');
      var target = document.createElement('div');
      target.className = 'center-column';
      document.forceGraph = d3.layout.force();
      render(data, target, document.forceGraph);
      $('.center-column').replaceWith(target);
      $('#data-parse-status').html('<span class="success">Data parsed successfully</span>');
      $('#script-parse-status').html('<span class="success">Script parsed successfully</span>');
      $('#output-status').html('Last rendered ' + (new Date()).toLocaleTimeString());

      // Update graph layout controls to match current graph values
      $('#gravity-slider').slider('option', 'value', document.forceGraph.gravity() * 100);
      $('#charge-slider').slider('option', 'value', document.forceGraph.charge());
      $('#link-distance-slider').slider('option', 'value', document.forceGraph.linkDistance());
      $('#link-strength-slider').slider('option', 'value', document.forceGraph.linkStrength());
    } catch (e) {
      var errorHtml = '<span class="failure">' + e.name + '</span> ' +
          '(' + e.lineNumber + ', ' + e.columnNumber + ') ' + e.message;
      $('#script-parse-status').html(errorHtml);
    }
  } catch (e) {
    var errorHtml = '<span class="failure">' + e.name + '</span> ' + e.message;
    $('#data-parse-status').html(errorHtml);
  }
}

$(function () {

  // Set up left-column collapsers
  $('.left-column h1').click(function (event) {
    var targetId = $(event.target).attr('data-for');
    $('.left-column .collapsable:not(#' + targetId + ')').slideUp('fast');
    $('.left-column #' + targetId).slideDown('fast', function () {
      dataEditor.resize();
      scriptEditor.resize();
    });
  });

  $('#ace-data-editor').keyup(rebuildGraph);
  $('#ace-script-editor').keyup(rebuildGraph);

  dataEditor = ace.edit('ace-data-editor');
  dataEditor.setTheme('ace/theme/monokai');
  dataEditor.getSession().setMode('ace/mode/json');
  dataEditor.$blockScrolling = Infinity;

  scriptEditor = ace.edit('ace-script-editor');
  scriptEditor.setTheme('ace/theme/monokai');
  scriptEditor.getSession().setMode('ace/mode/javascript');
  scriptEditor.$blockScrolling = Infinity;

  // Try to retrieve previous data and script from local storage
  var storedData = localStorage.getItem('data');
  var storedScript = localStorage.getItem('script');
  if (storedData) {
    dataEditor.setValue(storedData);
  }

  if (storedScript) {
    scriptEditor.setValue(storedScript);
  }

  rebuildGraph();
});
