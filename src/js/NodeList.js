/**
 * @param {jQuery} rootDiv
 * @param {function} onChange callback
 */
export function NodeList(rootDiv, onChange) {
  var selectedNode = null;
  var nodes = [];
  var edges = [];

  var saveData = function () {
    localStorage.setItem('cmdots-nodes', JSON.stringify(nodes));
    localStorage.setItem('cmdots-edges', JSON.stringify(edges));
  };

  var loadData = function () {
    try {
      var storedNodes = localStorage.getItem('cmdots-nodes');
      var storedEdges = localStorage.getItem('cmdots-edges');
      nodes = JSON.parse(storedNodes) || [];
      edges = JSON.parse(storedEdges) || [];
    } catch (e) {
      nodes = [];
      edges = [];
    }
  };

  var setContent = function (nodeData, edgeData) {
    nodes = nodeData;
    edges = edgeData;
    saveData();
    render();
    onChange();
  };

  var clearContent = function () {
    nodes = [];
    edges = [];
    saveData();
    render();
    onChange();
  };

  var render = function () {
    var nodeTable = rootDiv.find('#node-table');
    nodeTable.empty();
    nodes.forEach(function (node) {
      var hasSelectedNode = !!(selectedNode);
      var isSelectedNode = hasSelectedNode && (selectedNode.guid === node.guid);

      var row = $('<tr>');

      // Clicking on the first column should select the node.
      var col1 = $('<td>')
        .click(toggleNodeSelection.bind(this, node))
        .text(node.name);

      // Not the second column, since it contains the checkbox.
      var col2 = $('<td>')
        .addClass('shrink-to-fit');
      var checkbox = $('<input type="checkbox">')
        .appendTo(col2);


      if (isSelectedNode) {
        row.addClass('selected-node');
        checkbox.hide();
      } else if (hasSelectedNode) {
        var isConnectedToSelectedNode = edges.some(
          e => Edge.connects(e, selectedNode, node));
        checkbox
          .attr('checked', isConnectedToSelectedNode)
          .data('from', selectedNode)
          .data('to', node);
      } else {
        checkbox.css('visibility', 'hidden');
      }

      nodeTable.append(
        row.append(col1, col2)
      );
    });
  };

  var addNode = function (nodeName) {
    var newNode = {
      name: nodeName,
      type: 'person',
      date: '1987-08-18',
      guid: guid()
    };
    nodes.push(newNode);
    nodes.sort((a, b) => a.name < b.name ? -1 : 1);
    saveData();
    render();
    selectNode(newNode);
    onChange();
  }

  var removeNode = function (node) {
    edges.removeIf(x => x.guidA === node.guid || x.guidB === node.guid);
    nodes.removeIf(x => x.guid === node.guid);
    saveData();
    render();
    selectNode(null);
    onChange();
  }

  var toggleNodeSelection = function (node) {
    if (!node || selectedNode && node.guid === selectedNode.guid) {
      selectNode(null);
    } else {
      selectNode(node);
    }
  };

  var selectNode = function (node) {
    if (node) {
      selectedNode = nodes.find(n => n.guid === node.guid);
    } else {
      selectedNode = null;
    }
    render();
  }

  // "Add Node" handlers
  rootDiv.find('#new-node-name').keydown((e) => {
    if (e.which === 13) { // Enter key
      rootDiv.find('#add-node').click();
      e.preventDefault();
    }
  });
  rootDiv.find("#add-node").click(() => {
    var newNodeNameField = rootDiv.find('#new-node-name');
    addNode(newNodeNameField.val());
    newNodeNameField.val('');
    $('#node-list').animate({
        scrollTop: $(".selected-node").offset().top
    }, 800);
  });

  // Change handler for edge checkboxes
  $('#node-table').on('change', 'input[type=checkbox]', event => {
    var left = $(event.target).data('from'),
        right = $(event.target).data('to');

    if ($(event.target).is(':checked')) {
      edges.push(Edge.createFromNodes(left, right));
    } else {
      edges.removeIf(e => Edge.connects(e, left, right));
    }
    saveData();
    onChange();
  });

  // Capture backspace/delete for removing nodes
  $('html').keydown(e => {
    if (!$(e.target).is('input')) {
      if (e.which === 8 || e.which === 46) { // backspace or delete
        e.preventDefault();
        if (selectedNode) {
          removeNode(selectedNode);
        }
      }
    }
  });

  // Initial set-up (on page loaded)
  loadData();

  // Export the public interface
  return {
    addNode: addNode,
    getNodes: () => nodes,
    getEdges: () => edges,
    render: render,
    selectNode: selectNode,
    setContent: setContent,
    clearContent: clearContent
  };
};
