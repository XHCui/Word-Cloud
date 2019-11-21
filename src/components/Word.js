import React from 'react';

class Word extends React.Component {
    render() {
        return (
            <div className="word">
                <div>{this.props.value}</div>
            </div>
        )
    }
}   

export default Word;