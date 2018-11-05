var cy = cytoscape({
    container: document.getElementById('graph-data-container'),
    elements: [
        {
            data: { id: 'D' }
        },
        {
            data: { id: 'E' }
        },
        {
            data: { id: 'F' }
        }
    ],

    style: cytoscape.stylesheet().selector('node').css({
        'background-color': '#DDDDDD',
        'border-width': '2px',
        'border-color': '#555555',
        'padding': '50px',
        'label': 'data(id)',
        'text-valign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '100px'
    }).selector('node:selected').css({
        'border-color': '#ff8c00'
    }).selector('node:unselected').css({
        'border-color': '#555555'
    }).selector('edge').css({
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
    }),

    autoungrabify: true,
    boxSelectionEnabled: true,
    autounselectify: false,

    layout: {
        name: 'dagre'
    }
});

function addChildNode(parent) {
    let newNode = {
        group: 'nodes',
        data: { id: parent.id() + ' ' + Math.floor(Math.random() * 1000) }
    }
    cy.add([newNode,
        { group: 'edges', data: { source: parent.id(), target: newNode.data.id }}
    ]);
}

cy.on('tap', 'node', function(e) {
    let targetNode = e.target;
    addChildNode(targetNode);
});

cy.on('add remove', function(e) {
    cy.layout({ name: 'dagre', animate: true, animationDuration: 200 }).run();
});