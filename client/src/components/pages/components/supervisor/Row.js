import React from 'react';
import Cell from './Cell';
import '../attendance.css';

class Row extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            rowData: props.data,
            id: "tr" + props.rowNum
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.rowData !== newProps.rowData){
            this.setState({rowData: newProps.data});
        }
    }

    render() {
        return (
            <tr id={this.state.id}>
                {this.props.rowData.map(function(data, index){
                    return <Cell key={index} cellData={data} rowId={this.state.id} cellNum={index} onCellChange={this.props.onCellChange} />;
                }.bind(this))}
            </tr>
        );
    }
}

export default Row;