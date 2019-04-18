import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

class InspectorPopup extends React.Component {
  render() {
    return (
      <div className="popup">
        <div className="popup_inner">
          <div className="popup_title">
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab eventKey="home" title="Fairness">
                hello there:) this is tab1
              </Tab>
              <Tab eventKey="profile" title="Accountability">
                tab2
              </Tab>
              <Tab eventKey="contact" title="Transparency">
                tab3
              </Tab>
            </Tabs>
            <button className="popup_close" onClick={this.props.closePopup}>
              X
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default InspectorPopup;
