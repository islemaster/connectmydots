var networkGraph;
var nodeListController, nodeDetailController;

var selectedNode_ = null;

var graphView = new GraphView();

let currentUser = null;
let currentMapId = null;
let lastRemoteSave = null;

let $header;
let $signInDialog, $signUpDialog;

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

function saveData() {
  saveDataToLocalStorage();
  saveToRemote();
}

function loadData() {
  if (currentUser) {
    loadFromRemote();
  } else if (hasDataInLocalStorage()) {
    loadDataFromLocalStorage();
  } else {
    loadDemo();
  }
}

function saveDataToLocalStorage() {
  localStorage.setItem('cmdots-nodes', JSON.stringify(networkGraph.getNodes()));
  localStorage.setItem('cmdots-edges', JSON.stringify(networkGraph.getEdges()));
}

function hasDataInLocalStorage() {
  return !!(localStorage.getItem('cmdots-nodes') && localStorage.getItem('cmdots-edges'));
}

function loadDataFromLocalStorage() {
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
  updateGraphVisualization();
}

function loadDemo() {
  $.get('assets/demo.json')
    .done(data => {
      networkGraph.setContent(data.nodes, data.edges);
      selectedNode(null);
    })
    .fail((jqXHR, status, errorThrown) => {
      console.warn(`${status} : ${errorThrown}`);
    });
}

// Save once every ten seconds, at most
const remoteSaveFrequency = 10000;
let isSaveInProgress = false;
const saveToRemote = $.throttle(remoteSaveFrequency, function () {
  if (!currentUser || isSaveInProgress) {
    return;
  }

  const mapData = {
    data: {
      nodes: networkGraph.getNodes(),
      edges: networkGraph.getEdges(),
    }
  };

  if (currentMapId) {
    // Update the map
    isSaveInProgress = true;
    $.post(`/api/map/${currentMapId}`, mapData)
      .done(data => {
        lastRemoteSave = Date.now();
      })
      .fail((jqxhr, textStatus, errorThrown) => {
        console.warn(textStatus, errorThrown);
      })
      .always(() => isSaveInProgress = false);
  } else {
    // Create a new map
    isSaveInProgress = true;
    $.post('/api/map', mapData)
      .done(data => {
        currentMapId = data.map_id;
        lastRemoteSave = Date.now();
      })
      .fail((jqxhr, textStatus, errorThrown) => {
        console.warn(textStatus, errorThrown);
      })
      .always(() => isSaveInProgress = false);
  }
});

function loadFromRemote() {
  $.get('/api/map/latest')
    .done(data => {
      currentMapId = data.map_id;
      const nodes = data.data.nodes || [];
      const edges = data.data.edges || [];
      networkGraph.setContent(nodes, edges);
      updateGraphVisualization();
    })
    .fail((jqxhr, textStatus, errorThrown) => {
      console.warn(textStatus, errorThrown);
    });
}

function updateLastSavedText() {
  const $lastSaved = $header.find('.last-saved');
  if (lastRemoteSave) {
    const duration = moment.duration(lastRemoteSave - Date.now());
    $lastSaved.text(`Last saved ${duration.humanize(true)}`);
  } else {
    $lastSaved.text('');
  }
}

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
  onSubmitLoginForm($signInDialog, '/auth/sign-in', err => {
    if (!err) {
      loadFromRemote();
    }
  });
}

function onSubmitSignUp() {
  onSubmitLoginForm($signUpDialog, '/auth/sign-up', err => {
    if (!err) {
      saveData();
    }
  });
}

function signOut() {
  $.post('/auth/sign-out')
    .done(() => setSignedOut())
    .fail(() => console.error('There was a problem signing out.'));
}

function onSubmitLoginForm($dialog, url, callback) {
  $dialog.find('.feedback').text('');
  $.post(url, $dialog.find('form').serialize())
    .done(loginFormSuccessHandler($dialog, callback))
    .fail(loginFormErrorHandler($dialog, callback));
}

function loginFormSuccessHandler($dialog, callback) {
  return data => {
    $.toast({
      text: `Signed in as ${displayName(data.current_user)}.`,
      showHideTransition: 'fade',
      position: 'top-center',
      icon: 'success'
    });
    $dialog.find('form')[0].reset();
    setSignedIn(data.current_user);
    $dialog.dialog('close');
    callback();
  };
}

function loginFormErrorHandler($dialog, callback) {
  return jqxhr => {
    if (jqxhr.responseJSON) {
      const error = jqxhr.responseJSON.error;
      const field = jqxhr.responseJSON.field;
      $dialog.find(`.${field}.feedback`).text(error);
      callback(new Error(error));
    } else {
      $dialog.find('.general.feedback').text('An unknown error occurred');
      callback(new Error('An unknown error occurred'));
    }
  };
}

function displayName(user) {
  return user.displayName || user.id;
}

function setSignedIn(user) {
  currentUser = user;
  $header.find('.greeting').text(`Hi, ${displayName(user)}`);
  $header.find('.sign-in-link').hide();
  $header.find('.sign-up-link').hide();
  $header.find('.sign-out-link').show();
}

function setSignedOut({toast=true} = {}) {
  currentUser = null;
  currentMapId = null;
  $header.find('.greeting').text('Sign in / Sign up');
  $header.find('.sign-in-link').show();
  $header.find('.sign-up-link').show();
  $header.find('.sign-out-link').hide();
  if (toast) {
    $.toast({
      text: 'Signed out.',
      position: 'top-center',
      icon: 'info'
    });
  }
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
  $.get('/auth/sign-in').done(data => {
    if (data.current_user) {
      setSignedIn(data.current_user);
    }
    loadData();
  });

  $header.find('.demo-link').click(event => {
    event.preventDefault();
    if (confirm("Are you sure?  This will overwrite your saved map, and cannot be undone!")) {
      loadDemo();
    }
  });

  $header.find('.clear-link').click(event => {
    event.preventDefault();
    if (confirm("Are you sure?  This will delete your saved map, and cannot be undone!")) {
      networkGraph.clearContent();
      selectedNode(null);
    }
  });

  networkGraph = NetworkGraph();
  networkGraph.onChange(() => {
    updateGraphVisualization();
    saveData();
  });

  // Set up left-column collapsers
  $('.left-column h1[data-for="node-detail"]').click(function (event) {
    const $nodeDetail = $('#node-detail');
    if ($nodeDetail.is(':visible')) {
      $nodeDetail.animate({flexBasis: '0%'}, 'fast', 'linear', () => $nodeDetail.hide());
    } else {
      $nodeDetail.show().animate({flexBasis: '50%'}, 'fast', 'linear');
    }
  });

  nodeListController = NodeList($('#node-list'), networkGraph, {
    selectedNode: selectedNode
  });
  nodeListController.render();
  nodeDetailController = NodeDetail($('#node-detail'), networkGraph, {
    selectedNode: selectedNode
  });
  nodeDetailController.render();

  setInterval(updateLastSavedText, 5000);
});
