var cy = cytoscape({
    container: document.getElementById('graph-data-container'),
    elements: [
        {
            data: { id: 'D' }
        }
    ],

    style: cytoscape.stylesheet().selector('node').css({
        'background-color': '#eeeeee',
        'border-width': '5px',
        'border-color': '#333333',
        'padding': '50px',
        'label': 'data(id)',
        'text-valign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '100px'
    }).selector('node:selected').css({
        'border-color': '#ffa500'
    }).selector('node:unselected').css({
        'border-color': '#333333'
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
        data: { id: parent.id() + '-' + Math.floor(Math.random() * 1000) }
    }
    cy.add([newNode,
        { group: 'edges', data: { source: parent.id(), target: newNode.data.id }}
    ]);
}

function displayTooltip(node) {
    node.popper({
        content: function() {
            let div = document.createElement('div');
            div.className = 'node-tooltip'
            
            let title = document.createElement('h3');
            title.className = 'node-tooltip-title';
            title.innerText = node.id();

            let inner = document.createElement('p');
            inner.className = 'node-tooltip-description'
            inner.innerHTML = 'This is a test description for a node.'
            div.appendChild(title);
            div.appendChild(inner);
            
            document.body.appendChild(div);
            return div;
        },
        popper: {
            placement: 'bottom'
        } // my popper options here
    });
}

function removeTooltips() {
    let divs = document.getElementsByClassName('node-tooltip');
    for (let x of divs) {
        x.remove();
    }
}

cy.on('tap', 'node', function(e) {
    let targetNode = e.target;
    addChildNode(targetNode);
});

cy.on('add remove', function(e) {
    removeTooltips();
    cy.layout({ name: 'dagre', animate: true, animationDuration: 200 }).run();
});

cy.on('mouseover', 'node', function(e){
    let targetNode = e.target;
    targetNode.select();
    displayTooltip(targetNode);
})

cy.on('mouseout', 'node', function(e) {
    let targetNode = e.target;
    targetNode.unselect();
    removeTooltips();
})