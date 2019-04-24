import React from 'react';
import './attendance.css';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';

class DailyRow extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: this.props.rowData.Name,
            course: this.props.rowData.Course,
            id: "tr" + this.props.rowNum,
            attendances: this.props.rowData.Attendances,
            attendance: this.getAttendace(this.props.rowData.Attendances),
            iconClass: this.getIconClass(this.getAttendace(this.props.rowData.Attendances)),
            showEdit: false,
            showModal: false,
            selectDefaultValue: this.getAttendace(this.props.rowData.Attendances),
            selectCurrentValue: this.getAttendace(this.props.rowData.Attendances),
            editClass: "fa fa-edit custom-edit",
            now: new Date()
        }
        console.log(this.state.name)
    }

    componentWillReceiveProps(newProps) {
        if (this.props.rowData !== newProps.rowData){
            this.setState({rowData: newProps.data});
        }
    }

    getAttendace(attendances) {
        if(attendances.length === 0)
            return "";
        return attendances[0].Status;
    }

    getIconClass(attendance) {
        switch(attendance){
            case "PP":
                return "fa fa-check custom-icon-green";
            case  "P":
                return "fa fa-check custom-icon-yellow";
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
            this.setState({showEdit: true});
        
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
        if(this.state.attendances.length !== 0){
            var object = {
                ID: this.state.attendances[0].ID,
                Date: this.state.attendances[0].Date,
                InternID: this.state.attendances[0].InternID,
                Status: this.state.selectCurrentValue,
                IsDeleted: false
            };
            if (this.state.selectCurrentValue !== this.state.selectDefaultValue) {
                this.props.onCellChange(object);
                this.setState({showModal: false, showEdit: false});   
            }
        }
    }

    render() {
        return (
            <tr id={this.state.id}>
                <td id={this.state.id + "-td0"} >
                    {this.state.name}
                </td>

                <td id={this.state.id + "-td1"}  >
                {this.state.course}
                </td>

                <td id={this.state.id + "-td2"} onMouseEnter={this.onCellEnter.bind(this)} onMouseLeave={this.onCellDeHover.bind(this)}>
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
                                <option value="AR" className="custom-icon-blue custom-bold">AR</option>
                                <option value="ARR" className="custom-icon-green custom-bold">ARR</option>
                                <option value="A" className="custom-icon-red custom-bold">A</option>
                            </select>
                    </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.onCloseClick.bind(this)}>Close</Button>
                            <Button color="primary" onClick={this.onUpdateClick.bind(this)}>Update</Button>
                        </ModalFooter>
                    </Modal>
            </td>       
            </tr>
        );
    }
}

export default DailyRow;