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
    var $nodeList = rootDiv.find('ul');
    $nodeList.empty();
    nodes.forEach(function (node) {
      $('<li>')
        .text(node.name)
        .click(selectNode.bind(this, node))
        .appendTo($nodeList);
    });

    var $connectionsList = $('.connections-list');
    $connectionsList.empty();
    if (selectedNode) {
      nodes.forEach(function (otherNode) {
        if (otherNode === selectedNode) {
          return;
        }

        $('<div>')
          .append(
            $('<input type="checkbox">')
              .attr('checked', edges.some(e => Edge.connects(e, selectedNode, otherNode)))
              .data('from', selectedNode)
              .data('to', otherNode))
          .append(
            $('<label>')
              .text(otherNode.name))
          .appendTo($connectionsList);

      });
    }
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
  $('.connections-list').on('change', 'input[type=checkbox]', event => {
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
