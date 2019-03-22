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
  staticGraph: false,
  node: {
    color: '#DD6E42',
    size: 4096,
    fontSize: 12,
    highlightFontSize: 12,
    highlightStrokeColor: '#4F6D7A',
    mouseCursor: 'pointer',
    renderLabel: true,
    labelProperty: 'label',
    symbolType: 'circle'
  },
  link: {
    highlightColor: '#C0D6DF',
    strokeWidth: 4
  },
  d3: {
    gravity: -500,
    linkLength: 100,
    alphaTarget: 0.7
  }
};