import React from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';
import '../attendance.css';

class Cell extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: props.rowId + "-td" + props.cellNum,
            date: props.cellData.date + " ",
            iconClass: this.getIconClass(props.cellData.attendance),
            showEdit: false,
            showModal: false,
            selectDefaultValue: props.cellData.attendance,
            selectCurrentValue: props.cellData.attendance,
            editClass: "fa fa-edit custom-edit"
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.cellData !== newProps.cellData){
            this.setState({
                date: newProps.cellData.date + " ",
                iconClass: this.getIconClass(newProps.cellData.attendance),
                selectDefaultValue: newProps.cellData.attendance,
                selectCurrentValue: newProps.cellData.attendance
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
            default:
                return "";
        }
    }

    onCellEnter() {
        if (this.state.iconClass !== "") {
            this.setState({showEdit: true});
        }
    }

    onCellDeHover() {
        this.setState({showEdit: false});
    }

    onSelectChange(event){
        this.setState({
            iconClass: this.getIconClass(event.target.value),
            selectCurrentValue : event.target.value
        });
    }

    onEditHover() {
        this.setState({editClass: "fa fa-edit custom-edit-hover"});
    }

    onEditDeHover() {
        this.setState({editClass: "fa fa-edit custom-edit"});
    }

    onEditClick() {
        this.setState({showModal: true});
    }

    onCloseClick() {
        this.setState({
            showModal: false, 
            showEdit: false, 
            selectCurrentValue: this.state.selectDefaultValue,
            iconClass: this.getIconClass(this.state.selectDefaultValue)
        });
    }

    onUpdateClick() {
        var object = {
            id: this.state.id,
            attendance: this.state.selectCurrentValue
        };
        this.props.onCellChange(object);
        this.setState({showModal: false, showEdit: false});
    }

    render() {
        return (
            <td id={this.state.id} onMouseEnter={this.onCellEnter.bind(this)} onMouseLeave={this.onCellDeHover.bind(this)}>
                {this.state.date}
                <i className={this.state.iconClass}></i>
                {this.state.showEdit ? 
                <i className={this.state.editClass} 
                onMouseOver={this.onEditHover.bind(this)}
                onMouseLeave={this.onEditDeHover.bind(this)}
                onClick={this.onEditClick.bind(this)}></i> : null}
                <Modal isOpen={this.state.showModal}>
                    <ModalHeader>Edit</ModalHeader>
                    <ModalBody>
                        <select className="browser-default custom-select td-dropdown" value={this.state.selectCurrentValue} onChange={this.onSelectChange.bind(this)}>
                            <option value="P" className="custom-icon-green custom-bold">P</option>
                            <option value="A" className="custom-icon-red custom-bold">A</option>
                            <option value="AR" className="custom-icon-blue custom-bold">AR</option>
                        </select>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.onCloseClick.bind(this)}>Close</Button>
                        <Button color="primary" onClick={this.onUpdateClick.bind(this)}>Update</Button>
                    </ModalFooter>
                </Modal>
            </td>
        );
    }
}

export default Cell;