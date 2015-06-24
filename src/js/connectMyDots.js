function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var nodes = [
  {
    id: 0,
    name: 'Alleson Buchanan',
    type: 'person',
    date: '1987-08-18',
    guid: 'ABC'
  }
];

var edges = [

];

$(function () {
  renderNodeList();
  $('#node-list input[type=button]').click(function () {
    var newName = $('#node-list input[type=text]').val();
    addNode(newName);
    $('#node-list input[type=text]').val('');
  });

  // Change handler for edge checkboxes
  $('.connections-list').on('change', 'input[type=checkbox]', event => {
    var left = $(event.target).data('from'),
        right = $(event.target).data('to');

    if ($(event.target).is(':checked')) {
      edges.push(edge(left, right));
    } else {
      edges.removeIf(e => e.connects(left, right));
    }
    updateData();
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

function addNode(name) {
  var newNode = {
    id: 0,
    name: name,
    type: 'person',
    date: '1987-08-18',
    guid: guid()
  };
  nodes.push(newNode);
  renderNodeList();
  showNodeDetails(newNode);
  updateData();
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
          .attr('checked', edges.some(e => e.connects(node, otherNode)))
          .data('from', node)
          .data('to', otherNode))
      .append(
        $('<label>')
          .text(otherNode.name))
      .appendTo($connectionsList);

  });
}

function updateData() {
  nodes.sort((a, b) => a.name < b.name ? -1 : 1);
  var i = 0;
  var nodeData = nodes.map(n => $.extend({}, n, {id: i++}));
  var edgeData = edges.map(e => {
    var nodeA = nodeData.find(x => x.guid === e.guidA);
    var nodeB = nodeData.find(x => x.guid === e.guidB);
    return {
      "//": nodeA.name + "-" + nodeB.name,
      "source": nodeA.id,
      "target": nodeB.id,
      "value": 1
    };
  });
  var newData = {
    "nodes": nodeData,
    "links": edgeData
  }
  dataEditor.setValue(JSON.stringify(newData, null, 2));
  rebuildGraph();
}
