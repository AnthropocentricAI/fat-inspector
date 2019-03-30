module.exports = {
  width: 1280,
  height: 720,
  automaticRearrangeAfterDropNode: true,
  directed: true,
  collapsible: false,
  highlightDegree: true,
  highlightOpacity: 0.2,
  linkHighlightBehavior: true,
  nodeHighlightBehavior: true,
  minZoom: 0.75,
  staticGraph: false,
  node: {
    color: '#DD6E42',
    size: 4096,
    fontSize: 16,
    highlightFontSize: 16,
    highlightStrokeColor: '#4F6D7A',
    mouseCursor: 'pointer',
    renderLabel: true,
    labelProperty: 'label',
    symbolType: 'circle'
  },
  link: {
    highlightColor: '#C0D6DF',
    strokeWidth: 3
  },
  d3: {
    gravity: -1000,
    linkLength: 200,
    alphaTarget: 0.7
  }
};