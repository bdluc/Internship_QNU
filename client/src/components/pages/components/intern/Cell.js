import React from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import '../attendance.css';
import $ from 'jquery';

class Cell extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: props.rowId + "-td" + props.cellNum,
            date: props.cellData.date,
            iconClass: this.getIconClass(props.cellData.attendance),
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.cellData !== newProps.cellData){
            this.setState({
                date: newProps.cellData.date,
                iconClass: this.getIconClass(newProps.cellData.attendance)
            });
        }
    }

    getIconClass(attendance) {
        switch(attendance){
            case "PP":
                return "fa fa-check custom-icon-green";
            case "P":
                return "fa fa-check custom-icon-yellow";
            case "A":
                return "fa fa-remove custom-icon-red";
            case "AR":
                return "fa fa-remove custom-icon-blue";
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