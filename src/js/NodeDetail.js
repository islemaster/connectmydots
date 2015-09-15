/**
 * @param {jQuery} rootDiv
 * @param {NetworkGraph} networkGraph model
 * @param {Object} callbacks
 * @param {function} callbacks.selectedNode
 */
export function NodeDetail(rootDiv, networkGraph, callbacks) {
  /** @type {function} */
  var selectedNode = callbacks.selectedNode;

  var render = () => {
    // Toggle selected/deselected views
    var withoutSelectedDiv = rootDiv.find('.without-selected');
    var withSelectedDiv = rootDiv.find('.with-selected');
    var hasSelectedNode = !!(selectedNode());
    withoutSelectedDiv.toggle(!hasSelectedNode);
    withSelectedDiv.toggle(hasSelectedNode);

    if (hasSelectedNode) {
      var nameInput = withSelectedDiv.find('#node-name');
      nameInput.val(selectedNode().name);

      var notesInput = withSelectedDiv.find('#node-notes');
      notesInput.val(selectedNode().notes);
    }
  };

  rootDiv.find('#node-name').change((e) => {
    var updated = selectedNode();
    updated.name = $(e.target).val();
    networkGraph.editNode(updated);
  });

  rootDiv.find('#node-notes').change((e) => {
    var updated = selectedNode();
    updated.notes = $(e.target).val();
    networkGraph.editNode(updated);
  })

  return {
    render: render
  };
}
