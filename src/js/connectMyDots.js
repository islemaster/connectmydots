var nodeListController;

function updateData() {
  var nodes = nodeListController.getNodes();
  var edges = nodeListController.getEdges();
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

// Onload
$(function () {
  nodeListController = NodeList($('#node-list'), updateData);
  nodeListController.render();
  updateData();
});
