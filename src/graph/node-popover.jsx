import React from 'react';
import Popover from 'react-bootstrap/Popover';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiceD6, faEdit, faSearch, faSuperscript, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import Nav from 'react-bootstrap/Nav';
import PropTypes from 'prop-types';
import NodeModalEdit from './node-modal-edit.jsx';
import NodeModalApply from './node-modal-apply.jsx';

// register icons for the popup
library.add(faSearch);      // search
library.add(faDiceD6);      // dice-d6
library.add(faEdit);        // edit
library.add(faSuperscript); // superscript
library.add(faTrashAlt);    // trash-alt

export default class NodePopover extends React.Component {
  constructor(props) {
    super(props);

    this.optionsList = [
      {
        name: 'Inspect',
        icon: 'search',
        action: () => {
        }
      },
      {
        name: 'Convert to Model',
        icon: 'dice-d6',
        action: () => {
        }
      },
      {
        name: 'Edit',
        icon: 'edit',
        action: () => {
          this.setState({showEdit: true});
        }
      },
      {
        name: 'Apply Function',
        icon: 'superscript',
        action: () => {
          this.setState({showApply: true})
        }
      },
      {
        name: 'Delete Node',
        icon: 'trash-alt',
        action: () => {
        }
      }
    ];
    this.state = {
      showApply: false,
      showEdit: false,
      showDelete: false
    }
  }

  render() {
    return (
      <>
        <NodeModalEdit node={this.props.node}
                       onHide={() => this.setState({showEdit: false})}
                       onEdit={this.props.onEdit}
                       show={this.state.showEdit}/>
        <NodeModalApply functions={this.props.functions}
                        node={this.props.node}
                        onApply={this.props.onApply}
                        onHide={() => this.setState({showApply: false})}
                        show={this.state.showApply}/>
        <Popover className="node-popover"
                 id="popover-basic"
                 title={this.props.node.label}>
          <Nav className="flex-column">
            {
              this.props.node.func &&
              <p>Function: {this.props.node.func}</p>
            }
            {
              this.props.node.desc &&
              <p>Description: {this.props.node.desc}</p>
            }
            {
              this.optionsList.map(option => (
                <Nav.Item key={option.name} onClick={option.action}>
                  <FontAwesomeIcon fixedWidth icon={option.icon}/>
                  <Nav.Link className="node-popover-nav-link">
                    {option.name}
                  </Nav.Link>
                </Nav.Item>
              ))
            }
          </Nav>
        </Popover>
      </>
    );
  }
}

NodePopover.propTypes = {
  functions: PropTypes.arrayOf(PropTypes.string).isRequired,
  node: PropTypes.shape({
    desc: PropTypes.string,
    func: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  onApply: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
