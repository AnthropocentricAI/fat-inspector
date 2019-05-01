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
import PropTypes from 'prop-types';
import NodeModalEdit from '../modals/node-modal-edit.jsx';
import ModalConfirmation from '../modals/modal-confirmation.jsx';
import NodeModalInspect from '../modals/node-modal-inspect.jsx';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

// register icons for the popup
library.add(faSearch); // search
library.add(faDiceD6); // dice-d6
library.add(faEdit); // edit
library.add(faSitemap); // sitemap
library.add(faTrashAlt); // trash-alt

export default class NodePopover extends React.Component {
  constructor(props) {
    super(props);

    this.optionsListData = [
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
        action: () => {
          this.props.models(this.props.node.id);
        },
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

    this.optionsListModel = [
      {
        name: 'Inspect',
        icon: 'search',
        action: () => {
          this.setState({ showInspector: true });
        },
      },
      {
        name: 'See Predictions',
        icon: 'dice-d6',
        action: () => {
          this.props.predictions(this.props.node.id);
        },
      },
      {
        name: 'Apply Function',
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

    this.optionsListPrediction = [
      {
        name: 'Inspect',
        icon: 'search',
        action: () => {
          this.setState({ showInspector: true });
        },
      },
      {
        name: 'Apply Function',
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

  chooseOptions() {
    if (this.props.mode === 'data') {
      return this.optionsListData;
    } else if (this.props.mode === 'model') {
      return this.optionsListModel;
    } else if (this.props.mode === 'prediction') {
      return this.optionsListPrediction;
    }
  }

  render() {
    const confirmMessage = `Are you sure that you want to delete node '${
      this.props.node.label
    }' and all of its children? This change is permanent cannot be undone. ${
      this.props.node.desc ? <p>Description: {this.props.node.desc}</p> : ''
    }`;
    const popoverInfo = [
      { attr: 'Description', content: this.props.node.desc },
      {
        attr: 'Function',
        content: this.props.node.function && this.props.node.function.name,
      },
      {
        attr: 'Indices',
        content:
          this.props.node.function &&
          `[${this.props.node.function.indices.toString()}]`,
      },
      {
        attr: 'Axis',
        content: this.props.node.function && this.props.node.function.axis,
      },
    ];
    const hasInfo = popoverInfo.reduce(
      (acc, { attr, content }) => acc || content,
      false
    );
    //console.log(this.props.model);
    return (
      <>
        <NodeModalInspect
          node={this.props.node}
          onHide={() => this.setState({ showInspector: false })}
          show={this.state.showInspector}
          dataset={this.props.dataset}
          mode={this.props.mode}
          graph={this.props.graph}
          model={this.props.model}
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
          <div className="node-popover-wrapper">
            {hasInfo && (
              <div className="node-popover-info-wrapper">
                {popoverInfo.map(
                  ({ attr, content }) =>
                    content !== undefined &&
                    content !== null &&
                    content !== '' && (
                      <p key={`node-popover-${attr}`}>
                        <span className="node-popover-info-attr">{attr}</span>:{' '}
                        {content}
                      </p>
                    )
                )}
              </div>
            )}
            <div className="node-popover-button-wrapper">
              <ButtonGroup className="node-popover-buttongroup" vertical>
                {this.chooseOptions().map(option => (
                  <Button
                    style={{ textAlign: 'center' }}
                    key={`popover-option-${option.name}`}
                    onClick={option.action}
                    variant="outline-secondary"
                    className="node-popover-button"
                  >
                    <FontAwesomeIcon
                      fixedWidth
                      className="node-popover-icon"
                      icon={option.icon}
                    />
                    <span className="node-popover-text">{option.name}</span>
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </div>
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
  model: PropTypes.string,
};
