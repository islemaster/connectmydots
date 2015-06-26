var nodeListController;

function updateData() {
  var nodes = nodeListController.getNodes();
  var edges = nodeListController.getEdges();
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

// Onload
$(function () {
  $('#about').dialog({
    autoOpen: false,
    title: "About Connect My Dots",
    width: 600
  });

  $('.header-row .about').click(() => {
    $('#about').dialog('open');
  });

  nodeListController = NodeList($('#node-list'), updateData);
  nodeListController.render();
  updateData();
});
