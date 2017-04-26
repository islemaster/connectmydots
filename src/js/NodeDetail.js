/**
 * @param {jQuery} rootDiv
 * @param {NetworkGraph} networkGraph model
 * @param {Object} callbacks
 * @param {function} callbacks.selectedNode
 */
export function NodeDetail(rootDiv, networkGraph, callbacks) {
  /** @type {function} */
  var selectedNode = callbacks.selectedNode;
  let confirmingDelete = false;

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

      setConfirmingDelete(false);
    }
  };


  const setConfirmingDelete = (confirming) => {
    confirmingDelete = confirming;
    const $button = rootDiv.find('button.delete');
    const $text = $button.find('span');
    if (confirmingDelete) {
      $button.addClass('red');
      $text.text('Are you sure?');
    } else {
      $button.removeClass('red');
      $text.text('Delete');
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
  });

  rootDiv.find('button.delete')
    .click(() => {
      if (!confirmingDelete) {
        setConfirmingDelete(true);
      } else {
        setConfirmingDelete(false);
        const node = selectedNode();
        if (node) {
          networkGraph.removeNode(node);
          selectedNode(null);
        }
      }
    })
    .on('mouseleave', () => {
      setConfirmingDelete(false);
    });

  return {
    render: render
  };
}
