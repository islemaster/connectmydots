/**
 * @param {jQuery} rootDiv
 * @param {NetworkGraph} networkGraph model
 */
export function NodeList(rootDiv, networkGraph) {
  var selectedNode = null;

  // What to do whenever our model data changes
  networkGraph.onChange(() => {
    render();
  });

  var render = function () {
    var nodeTable = rootDiv.find('#node-table');
    nodeTable.empty();
    networkGraph.getNodes().forEach(function (node) {
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
        var isConnectedToSelectedNode = networkGraph.getEdges().some(
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

  var toggleNodeSelection = function (node) {
    if (!node || selectedNode && node.guid === selectedNode.guid) {
      selectNode(null);
    } else {
      selectNode(node);
    }
  };

  var selectNode = function (node) {
    if (node) {
      selectedNode = networkGraph.getNodes().find(n => n.guid === node.guid);
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
    var newNode = networkGraph.addNode(newNodeNameField.val());
    selectNode(newNode);
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
      networkGraph.addEdge(left, right);
    } else {
      networkGraph.removeEdge(left, right);
    }
  });

  // Capture backspace/delete for removing nodes
  $('html').keydown(e => {
    if (!$(e.target).is('input')) {
      if (e.which === 8 || e.which === 46) { // backspace or delete
        e.preventDefault();
        if (selectedNode) {
          networkGraph.removeNode(selectedNode);
        }
      }
    }
  });

  // Initial set-up (on page loaded)
  loadData();

  // Export the public interface
  return {
    render: render,
    selectNode: selectNode
  };
};
