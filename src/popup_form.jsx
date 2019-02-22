import React from 'react';

class PopupForm extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        
        fetch('api-link', {
            method: 'POST',
            body: data
        });
    }

    render() {
        return (
            <form onSubmit={ this.handleSubmit }>
                <input type="submit" value="Yes"></input>
                <input type="submit" value="No"></input>
            </form>
        )
    }
}

export default PopupForm;