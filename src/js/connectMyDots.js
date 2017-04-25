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

let $header;
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

  // Attach handlers related to auth
  $header.find('.sign-in-link').click(event => {
    $signInDialog.dialog('open');
    event.preventDefault();
  });

  $header.find('.sign-up-link').click(event => {
    $signUpDialog.dialog('open');
    event.preventDefault();
  });

  $header.find('.sign-out-link').click(event => {
    signOut();
    event.preventDefault();
  });
}

function onSubmitSignIn() {
  onSubmitLoginForm($signInDialog, '/sign-in');
}

function onSubmitSignUp() {
  onSubmitLoginForm($signUpDialog, '/sign-up');
}

function signOut() {
  $.post('/sign-out')
    .done(() => setSignedOut())
    .fail(() => console.error('There was a problem signing out.'));
}

function onSubmitLoginForm($dialog, url) {
  $dialog.find('.feedback').text('');
  $.post(url, $dialog.find('form').serialize())
    .done(loginFormSuccessHandler($dialog))
    .fail(loginFormErrorHandler($dialog));
}

function loginFormSuccessHandler($dialog) {
  return data => {
    $.toast({
      text: `Signed in as ${data.current_user}.`,
      showHideTransition: 'fade',
      position: 'top-center',
      icon: 'success'
    });
    $dialog.find('form')[0].reset();
    setSignedIn(data.current_user);
    $dialog.dialog('close');
  };
}

function loginFormErrorHandler($dialog) {
  return jqxhr => {
    if (jqxhr.responseJSON) {
      const error = jqxhr.responseJSON.error;
      const field = jqxhr.responseJSON.field;
      $dialog.find(`.${field}.feedback`).text(error);
    } else {
      $dialog.find('.general.feedback').text('An unknown error occurred');
    }
  };
}

function setSignedIn(userId) {
  $header.find('.greeting').text(`Hi, ${userId}`);
  $header.find('.sign-in-link').hide();
  $header.find('.sign-up-link').hide();
  $header.find('.sign-out-link').show();
}

function setSignedOut({toast=true} = {}) {
  if (toast) {
    $.toast({
      text: 'Signed out.',
      position: 'top-center',
      icon: 'info'
    });
  }
  $header.find('.greeting').text('Sign in / Sign up');
  $header.find('.sign-in-link').show();
  $header.find('.sign-up-link').show();
  $header.find('.sign-out-link').hide();
}

// Onload
$(function () {
  $header = $('.header-row');

  $('#about').dialog({
    autoOpen: false,
    title: "About Connect My Dots",
    width: 600,
    modal: true,
    resizable: false,
  });

  $header.find('.about').click(() => {
    $('#about').dialog('open');
  });

  prepareLoginDialogs();

  // Check login state on load
  setSignedOut({toast: false});
  $.get('/sign-in').done(data => {
    if (data.current_user) {
      setSignedIn(data.current_user);
    }
  });

  $header.find('.loadDemoContent').click(() => {
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

  $header.find('.clearContent').click(() => {
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
