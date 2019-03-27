import React from 'react';
import '../attendance.css';

class Cell extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: props.rowId + "-td" + props.cellNum,
            date: props.cellData.date + " ",
            iconClass: this.getIconClass(props.cellData.attendance)
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.cellData !== newProps.cellData){
            this.setState({
                date: newProps.cellData.date + " ",
                iconClass: this.getIconClass(newProps.cellData.attendance)
            });
        }
    }

    getIconClass(attendance) {
        switch(attendance){
            case "P":
                return "fa fa-check custom-icon-green";
            case "A":
                return "fa fa-remove custom-icon-red";
            case "AR":
                return "fa fa-remove custom-icon-blue";
            case "O":
                return "fa fa-circle-o custom-icon-gray";
            default:
                return "";
        }
    }

    render() {
        return (
            <td id={this.state.id}>
                {this.state.date}
                <i className={this.state.iconClass}></i>
            </td>
        );
    }
}

export default Cell;