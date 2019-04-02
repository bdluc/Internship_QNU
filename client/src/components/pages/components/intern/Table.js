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
                        <th scope="col" className="weekday" >Monday</th>
                        <th scope="col" className="weekday" >Tuesday</th>
                        <th scope="col" className="weekday" >Wednesday</th>
                        <th scope="col" className="weekday" >Thursday</th>
                        <th scope="col" className="weekday" >Friday</th>
                        <th scope="col" className="weekday" >Saturday</th>
                        <th scope="col" className="weekday" >Sunday</th>
                    </tr>
                </thead>
                <tbody id="tbody">
                    {this.state.tableData.map(function(data, index){
                        return <Row key={index} rowData={data} rowNum={index}/>;
                    }.bind(this))}
                </tbody>
            </table>
        );
    }
}

export default Table;