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
      nodes = JSON.parse(storedNodes);
      edges = JSON.parse(storedEdges);
    } catch (e) {
      nodes = [];
      edges = [];
    }
  };

  var render = function () {
    var nodeTable = rootDiv.find('#node-table');
    nodeTable.empty();
    nodes.forEach(function (node) {
      var hasSelectedNode = !!(selectedNode);
      var isSelectedNode = hasSelectedNode && (selectedNode.guid === node.guid);

      var row = $('<tr>');
      var col1 = $('<td>');
      var col2 = $('<td>');
      var col3 = $('<td>');

      col1.add(col2).click(selectNode.bind(this, node));
      col2.text(node.name);

      if (isSelectedNode) {
        row.addClass('selected-node');
        col1.text('X');
      } else if (hasSelectedNode) {
        var isConnectedToSelectedNode = edges.some(
          e => Edge.connects(e, selectedNode, node));
        let checkbox = $('<input type="checkbox">')
          .attr('checked', isConnectedToSelectedNode)
          .data('from', selectedNode)
          .data('to', node);
        col3.append(checkbox);
      }

      nodeTable.append(
        row.append(col1, col2, col3)
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
    saveData();
    render();
    selectNode(newNode);
    onChange();
  }

  var selectNode = function (node) {
    selectedNode = nodes.find(n => n.guid === node.guid);
    render();
  }

  // "Add Node" button handler
  rootDiv.find("#add-node").click(() => {
    var newNodeNameField = rootDiv.find('#new-node-name');
    addNode(newNodeNameField.val());
    newNodeNameField.val('');
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

  // Initial set-up (on page loaded)
  loadData();

  // Export the public interface
  return {
    addNode: addNode,
    getNodes: () => nodes,
    getEdges: () => edges,
    render: render,
    selectNode: selectNode
  };
};
