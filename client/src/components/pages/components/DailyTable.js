import React from 'react';
import DailyRow from './DailyRow';
import './attendance.css';

class DailyTable extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dailyData: this.props.dailyData
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.text !== newProps.text || this.props.dailyData !== newProps.dailyData){
            this.setState({dailyData: newProps.dailyData});
        }
    }

    render() {
        return (
            <table className="table custom-table" id="table-daily">
                <thead>
                    <tr>
                        <th scope="col" className="daily" >Name</th>
                        <th scope="col" className="daily" >Course</th>
                        <th scope="col" className="daily" >Attendance</th>
                    </tr>
                </thead>
                <tbody id="tbody">
                    {this.state.dailyData.map(function(data, index){
                        return <DailyRow key={index} rowData={data} onCellChange={this.props.onCellChange} rowNum={index}/>;
                    }.bind(this))}
                </tbody>
            </table>
        );
    }
}

export default DailyTable;