var cy = cytoscape({
    container: document.getElementById('graph-data-container'),
    elements: [
        {
            data: { id: 'D' }
        },
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
        'border-color': '#55BB55'
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
});