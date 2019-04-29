import React from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button';

class ChartArgs extends React.Component {
	constructor(props) {
		super(props);
  }
  
  submitArgs(e) {
    e.preventDefault();
    let data = new FormData(e.target);

    let argString = ''
    for(var pair of data.entries()) {
      argString += `${ pair[0] }=${ Number(pair[1]) }`;
    }

    // redownload
    this.props.redownload(argString);
  }

	render() {
    return (
      <>
        <h6 className="chart__args-title">Arguments:</h6>

        <Form onSubmit={(e) => this.submitArgs(e) }>
          { this.props.args.map((arg, arg_i) =>
            <Form.Group key={ arg } controlId="">
              <InputGroup className={ arg }>
                <InputGroup.Prepend>
                  <InputGroup.Text id={ `txt_${arg}` }>
                    { arg }
                  </InputGroup.Text>
                </InputGroup.Prepend>
                  <Form.Control name={ arg }
                                placeholder={ this.props.argsDefault[arg_i] }
                />
              </InputGroup>
            </Form.Group>
          ) }
          
          <Button variant="primary" type="submit" className="chart__args-submit">
            Apply Arguments
          </Button>
        </Form>   
      </>
    )
	}
}

ChartArgs.propTypes = {
	args: PropTypes.array,
  argsDefault: PropTypes.array,
  redownload: PropTypes.func
};

export default ChartArgs;