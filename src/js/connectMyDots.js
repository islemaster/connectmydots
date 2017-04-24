var networkGraph;
var nodeListController, nodeDetailController;

var selectedNode_ = null;

var graphView = new GraphView();

/**
 * Getter/setter for selected node
 * @param {Object|null} [node] - if provided, sets selected node.  If omitted,
          returns current selected node.
 */
function selectedNode(node) {
  // Getter form - no argument
  if (undefined === node) {
    return selectedNode_;
  }

  // Setter form - object or null argument.
  if (node) {
    selectedNode_ = networkGraph.getNodes().find(n => n.guid === node.guid);
    graphView.links().classed('to-selected-node', (l) => {
        return l.source.guid === selectedNode_.guid ||
               l.target.guid === selectedNode_.guid;
      });
  } else {
    selectedNode_ = null;
    graphView.links().classed('to-selected-node', false);
  }
  nodeListController.render();
  nodeDetailController.render();
  return selectedNode_;
}

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

let $signInDialog, $signUpDialog;

function prepareLoginDialogs() {
  $signInDialog = $('#sign-in');
  $signInDialog.dialog({
    autoOpen: false,
    title: "Sign In",
    width: 700,
    modal: true,
    resizable: false,
  });

  $('.header-row .sign-in').click(() => {
      $signInDialog.dialog('open');
  });

  $signUpDialog = $('#sign-up');
  $signUpDialog.dialog({
    autoOpen: false,
    title: "Sign Up",
    width: 700,
    modal: true,
    resizable: false,
  });

  $signUpDialog.find('.sign-in-link').click(event => {
    $signUpDialog.dialog('close');
    $signInDialog.dialog('open');
    event.preventDefault();
  });

  $signInDialog.find('.sign-up-link').click(event => {
    $signInDialog.dialog('close');
    $signUpDialog.dialog('open');
    event.preventDefault();
  });
}

function onSubmitSignIn() {
  $.post('/sign-in', $signInDialog.find('form').serialize())
    .done(data => {
      alert(data);
    })
    .fail((jqxhr, textStatus, errorThrown) => {
      alert('Fail! ' + textStatus + ' ' + errorThrown);
    });
}

function onSubmitSignUp() {
  $signUpDialog.find('.feedback').text('');
  $.post('/sign-up', $signUpDialog.find('form').serialize())
    .done(data => {
      $signUpDialog.dialog('close');
      // TODO: Finish sign-in?
      alert(data);
    })
    .fail((jqxhr, textStatus, errorThrown) => {
      if (jqxhr.responseJSON) {
        const error = jqxhr.responseJSON.error;
        const field = jqxhr.responseJSON.field;
        $signUpDialog.find(`.${field}.feedback`).text(error);
      } else {
        $signUpDialog.find('.general.feedback').text('An unknown error occurred');
      }
    });
}


// Onload
$(function () {
  $('#about').dialog({
    autoOpen: false,
    title: "About Connect My Dots",
    width: 600,
    modal: true,
    resizable: false,
  });

  $('.header-row .about').click(() => {
    $('#about').dialog('open');
  });

  prepareLoginDialogs();

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

  nodeListController = NodeList($('#node-list'), networkGraph, {
    selectedNode: selectedNode
  });
  nodeListController.render();
  nodeDetailController = NodeDetail($('#node-detail'), networkGraph, {
    selectedNode: selectedNode
  });
  nodeDetailController.render();
  loadData();
  updateGraphVisualization();
});
