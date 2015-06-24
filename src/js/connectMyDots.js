

var nodes = [
  {
    id: 0,
    name: 'Alleson Buchanan',
    type: 'person',
    date: '1987-08-18'
  },
  {name:'dick'},
  {name:'harry'}
];

var edges = [

];

$(function () {
  renderNodeList();
  $('#node-list input[type=button]').click(function () {
    newNode($('#node-list input[type=text]').val());
    $('#node-list input[type=text]').val('');
  });

  // Change handler for edge checkboxes
  $('.connections-list').on('change', 'input[type=checkbox]', event => {
    var left = $(event.target).data('from'),
        right = $(event.target).data('to');

    if ($(event.target).is(':checked')) {
      // Add edge
      edges.push({
        left: left,
        right: right
      });
    } else {
      // Remove edge
      var index = edges.findIndex(e => e.left === left && e.right === right);
      if (index >= 0) {
        edges.splice(index, 1);
      }
    }
  });
});

function renderNodeList() {
  var $nodeList = $('#node-list ul');
  $nodeList.empty();
  nodes.forEach(function (node) {
    $('<li>')
      .text(node.name)
      .click(showNodeDetails.bind(this, node))
      .appendTo($nodeList);
  });
}

function newNode(name) {
  nodes.push({
    id: 0,
    name: name,
    type: 'person',
    date: '1987-08-18'
  });
  renderNodeList();
}

function showNodeDetails(node) {
  var $connectionsList = $('.connections-list');
  $connectionsList.empty();
  nodes.forEach(function (otherNode) {
    if (otherNode === node) {
      return;
    }

    $('<div>')
      .append(
        $('<input type="checkbox">')
          .attr('checked', edges.some(e => e.left === node && e.right === otherNode))
          .data('from', node)
          .data('to', otherNode))
      .append(
        $('<label>')
          .text(otherNode.name))
      .appendTo($connectionsList);

  });
}
