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
            showEdit: false,
            showModal: false,
            selectDefaultValue: props.cellData.attendance,
            selectCurrentValue: props.cellData.attendance,
            editClass: "fa fa-edit custom-edit",
            now: new Date()
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.cellData !== newProps.cellData){
            this.setState({
                date: newProps.cellData.date,
                iconClass: this.getIconClass(newProps.cellData.attendance),
                selectDefaultValue: newProps.cellData.attendance,
                selectCurrentValue: newProps.cellData.attendance
            });
        }
    }

    getIconClass(attendance) {
        switch(attendance){
            case "PP":
                return "fa fa-check custom-icon-green";
            case  "P":
                return "fa fa-check custom-icon-blue";
            case "PA":
                return "fa fa-check custom-icon-red";
            case "A":
                return "fa fa-remove custom-icon-red";
            case "AR":
                return "fa fa-remove custom-icon-blue"
            case "ARR":
                return "fa fa-remove custom-icon-green";
            default:
                return "";
        }
    }

    onCellEnter() {
        var date = new Date().getDate()
        if (this.state.iconClass !== "" || this.state.date == date ) {
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
        if(this.props.cellData.id === "now")
            this.setState({
                iconClass: this.getIconClass("AR"),
                selectCurrentValue: "AR"
            });
        this.setState({
            showModal: true
        })
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
                ID: this.props.cellData.id,
                Date: this.props.cellData.fullDate,
                InternID: this.props.cellData.InternID,
                Status: this.state.selectCurrentValue,
                IsDeleted: false
            };
            if (this.state.selectCurrentValue !== this.state.selectDefaultValue) {

                var isChange = this.props.onCellChange(object);
                if(isChange)
                    this.setState({showModal: false, showEdit: false, selectDefaultValue: this.state.selectCurrentValue});   
            }
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
                        {this.state.date == this.state.now.getDate() ?
                            <select className="browser-default custom-select td-dropdown" value={this.state.selectCurrentValue} onChange={this.onSelectChange.bind(this)}>
                                <option value="AR" className="custom-icon-blue custom-bold">AR</option>
                                <option value="ARR" className="custom-icon-green custom-bold">ARR</option>
                                <option value="A" className="custom-icon-red custom-bold">A</option>
                            </select>
                        :
                            <select className="browser-default custom-select td-dropdown" value={this.state.selectCurrentValue} onChange={this.onSelectChange.bind(this)}>
                                { this.state.now.getHours() > 13 || this.state.date != this.state.now.getDate()? 
                                <option value="PP" className="fa fa-check custom-icon-green custom-bold">PP</option>
                                : null}
                                { this.state.date != this.state.now.getDate()?
                                <option value="P" className="custom-icon-blue custom-bold">P</option>
                                : null}
                                <option value="PA" className="custom-icon-red custom-bold">PA</option>
                                <option value="AR" className="custom-icon-blue custom-bold">AR</option>
                                <option value="ARR" className="custom-icon-green custom-bold">ARR</option>
                                <option value="A" className="custom-icon-red custom-bold">A</option>
                            </select>
                        }
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