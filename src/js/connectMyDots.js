var networkGraph;
var nodeListController;

function updateGraphVisualization() {
  var nodes = networkGraph.getNodes();
  var edges = networkGraph.getEdges();
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

var saveData = function () {
  localStorage.setItem('cmdots-nodes', JSON.stringify(networkGraph.getNodes()));
  localStorage.setItem('cmdots-edges', JSON.stringify(networkGraph.getEdges()));
};

var loadData = function () {
  var nodes, edges;
  try {
    var storedNodes = localStorage.getItem('cmdots-nodes');
    var storedEdges = localStorage.getItem('cmdots-edges');
    nodes = JSON.parse(storedNodes) || [];
    edges = JSON.parse(storedEdges) || [];
  } catch (e) {
    nodes = [];
    edges = [];
  }
  networkGraph.setContent(nodes, edges);
};

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

  $('.header-row .loadDemoContent').click(() => {
    if (!confirm("Are you sure?  This will overwrite your saved graph!")) {
      return;
    }
    $.ajax({
      accepts: 'json',
      cache: true,
      dataType: 'json',
      local: true,
      url: 'assets/demo.json',
      success: (data, status) => {
        networkGraph.setContent(data.nodes, data.edges);
      },
      error: (jqXHR, status, errorThrown) => {
        console && console.log(`${status} : ${errorThrown}`);
      }
    });
  });

  $('.header-row .clearContent').click(() => {
    if (confirm("Are you sure?  This will overwrite your saved graph!")) {
      networkGraph.clearContent();
    }
  });

  networkGraph = NetworkGraph();
  networkGraph.onChange(() => {
    updateGraphVisualization();
    saveData();
  });

  nodeListController = NodeList($('#node-list'), networkGraph);
  nodeListController.render();
  updateGraphVisualization();
});
