import React from 'react';
import Row from './Row';
import '../attendance.css';

class Table extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tableData: props.tableData
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.text !== newProps.text || this.props.tableData !== newProps.tableData){
            this.setState({tableData: newProps.tableData});
        }
    }

    render() {
        return (
            <table className="table custom-table" id="table-calendar">
                <thead>
                    <tr>
                        <th scope="col" className="weekday" colSpan="2">Monday</th>
                        <th scope="col" className="weekday" colSpan="2">Tuesday</th>
                        <th scope="col" className="weekday" colSpan="2">Wednesday</th>
                        <th scope="col" className="weekday" colSpan="2">Thursday</th>
                        <th scope="col" className="weekday" colSpan="2">Friday</th>
                        <th scope="col" className="weekday" colSpan="2">Saturday</th>
                        <th scope="col" className="weekday" colSpan="2">Sunday</th>
                    </tr>
                </thead>
                <tbody id="tbody">
                    {this.state.tableData.map(function(data, index){
                        return <Row key={index} rowData={data} onCellChange={this.props.onCellChange} rowNum={index}/>;
                    }.bind(this))}
                </tbody>
            </table>
        );
    }
}

export default Table;