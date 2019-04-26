import React from 'react';
import Popover from 'react-bootstrap/Popover';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDiceD6,
  faEdit,
  faSearch,
  faSitemap,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import Nav from 'react-bootstrap/Nav';
import PropTypes from 'prop-types';
import NodeModalEdit from '../modals/node-modal-edit.jsx';
import ModalConfirmation from '../modals/modal-confirmation.jsx';
import NodeModalInspect from '../modals/node-modal-inspect.jsx';

// register icons for the popup
library.add(faSearch); // search
library.add(faDiceD6); // dice-d6
library.add(faEdit); // edit
library.add(faSitemap); // sitemap
library.add(faTrashAlt); // trash-alt

export default class NodePopover extends React.Component {
  constructor(props) {
    super(props);

    this.optionsList = [
      {
        name: 'Inspect',
        icon: 'search',
        action: () => {
          this.setState({ showInspector: true });
        },
      },
      {
        name: 'Convert to Model',
        icon: 'dice-d6',
        action: () => { this.props.convert(this.props.node.id) },
      },
      {
        name: 'Add Child',
        icon: 'sitemap',
        action: () => {
          this.setState({ showApply: true });
        },
      },
      {
        name: 'Edit',
        icon: 'edit',
        action: () => {
          this.setState({ showEdit: true });
        },
      },
      {
        name: 'Delete',
        icon: 'trash-alt',
        action: () => {
          this.setState({ showDelete: true });
        },
      },
    ];
    this.state = {
      showApply: false,
      showEdit: false,
      showDelete: false,
      showInspector: false,
    };
  }

  render() {
    const confirmMessage = `Are you sure that you want to delete node '${
      this.props.node.label
      }' and all of its children? This change is permanent cannot be undone. ${
      this.props.node.desc ? <p>Description: {this.props.node.desc}</p> : ''
      }`;
    return (
      <>
        <NodeModalInspect
          node={this.props.node}
          onHide={() => this.setState({ showInspector: false })}
          show={this.state.showInspector}
          dataset={this.props.dataset}
          mode={this.props.mode}
          graph={this.props.graph}
        />
        <NodeModalEdit
          functions={this.props.functions}
          node={this.props.node}
          onHide={() => this.setState({ showEdit: false })}
          onSubmit={this.props.onEdit}
          show={this.state.showEdit}
        />
        <NodeModalEdit
          functions={this.props.functions}
          node={this.props.node}
          onSubmit={this.props.onApply}
          onHide={() => this.setState({ showApply: false })}
          show={this.state.showApply}
          add
        />
        <ModalConfirmation
          message={confirmMessage}
          onConfirm={() => this.props.onDelete(this.props.node.id)}
          onHide={() => this.setState({ showDelete: false })}
          show={this.state.showDelete}
        />
        <Popover
          className="node-popover"
          id="popover-basic"
          title={this.props.node.label}
        >
          <Nav className="flex-column">
            {this.props.node.desc && <p>Description: {this.props.node.desc}</p>}
            {this.props.node.function && (
              <>
                <p>
                  Function: {this.props.node.function.name.toString()} <br />
                  Indices: [{this.props.node.function.indices.toString()}]<br />
                  Axis: {this.props.node.function.axis}
                </p>
              </>
            )}
            {this.optionsList.map(option => (
              <Nav.Item key={option.name} onClick={option.action}>
                <FontAwesomeIcon fixedWidth icon={option.icon} />
                <Nav.Link className="node-popover-nav-link">
                  {option.name}
                </Nav.Link>
              </Nav.Item>
            ))}
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
    function: PropTypes.object,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  onApply: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  convert: PropTypes.func
};
