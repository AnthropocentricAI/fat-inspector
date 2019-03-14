import React from 'react';
import Form from 'react-bootstrap/Form';

/**
 * Wraps up a file input form control in a label to allow for button styling.
 *
 * Regular HTML file inputs are usually styled by the browser - instead this
 * hides the button and mimics it with a stylable button.
 */
export default class FileFacade extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedFile: undefined}
    }

    updateSelectedFile(e) {
        let filename = e.target.value.split(/([\\/])/g).pop();
        this.setState({
            ...this.state,
            selectedFile: filename
        });
    }

    render() {
        return (
            <div className="file-facade-wrapper">
                <Form.Label>
                    <Form.Control onChange={this.updateSelectedFile.bind(this)}
                                  style={{display: 'none'}}
                                  name={this.props.inputName || ''}
                                  type='file'
                                  accept={this.props.accept}/>
                    <span className='file-facade-button'>{this.props.children}</span>
                    <span className='file-facade-name'>{this.state.selectedFile || ''}</span>
                </Form.Label>
            </div>
        )
    }
}