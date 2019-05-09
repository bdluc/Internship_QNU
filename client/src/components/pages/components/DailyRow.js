import React from 'react';
import './attendance.css';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Container, Row, Col } from 'mdbreact';

class DailyRow extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: this.props.rowData.Name,
            course: this.props.rowData.Course,
            InternID: this.props.rowData.Id,
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
            this.setState({showEdit: true});
        
    }

    onCellDeHover() {
        this.setState({showEdit: false});
    }

    onSelectChange(event){
        if(event.target.value == "AR")
            if(this.state.selectDefaultValue === "PA")
                this.setState({
                    iconClass: this.getIconClass("P"),
                    selectCurrentValue: "P"
                });
            else
                    this.setState({
                        iconClass: this.getIconClass("AR"),
                        selectCurrentValue: "AR"
                });
        else 
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
        // set PA is default if intern not attendance today
        if(this.state.attendances.length === 0)
            this.setState({
                iconClass: this.getIconClass("PA"),
                selectCurrentValue: "PA"
            });
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
            ID: "N.A",
            Date: "",
            InternID: this.state.InternID,
            Status: this.state.selectCurrentValue,
            IsDeleted: false
        };
        // attendance not empty 
        if(this.state.attendances.length !== 0){
            object.ID = this.state.attendances[0].ID;
            object.Date = this.state.attendances[0].Date;
        }else{
            var month = this.state.now.getMonth() + 1;
            var date = this.state.now.getDate();
            object.Date = this.state.now.getFullYear() + "-" + (( month < 10) ? "0" + month : month)+ "-" + (( date < 10) ? "0" + date : date) + "T00:00:00+07:00"
        }
        // run when current value != default value 
        if (this.state.selectCurrentValue !== this.state.selectDefaultValue) {
            var isChange = this.props.onCellChange(object);
            if(isChange)
                this.setState({showModal: false, showEdit: false, selectDefaultValue: this.state.selectCurrentValue});  
        }
    }

    getYear(strDate) {
        return parseInt(strDate.substring(0, 4));
      }
    
      getMonth(strDate) {
          return parseInt(strDate.substring(5, 7));
      }
    
      getDay(strDate) {
          return parseInt(strDate.substring(8, 10));
      }

    toggleIntern = () => {

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
                    <Modal isOpen={this.state.showModal} size="lg" toggle={this.toggleIntern}>
                        <ModalHeader>{this.state.attendances.length === 0 ? "Create" : "Update" }</ModalHeader>
                        <ModalBody>
                        <Container>
                            <Row className="show-grid">
                                    <Col xs={12} md={7} className="custom-align-left">
                                    <Container>
                                        <Row>
                                            <Col className="custom-bold">Manual: </Col>
                                        </Row>
                                        <Row>
                                            <Col xs md={2} className="custom-icon-green custom-bold">PP</Col>
                                            <Col>: Present full day</Col>
                                        </Row>
                                        <Row>
                                            <Col xs md={2} className="custom-icon-blue custom-bold">P</Col>
                                            <Col>: Present 1 session, the rest is absent with reason</Col>
                                        </Row>
                                        <Row>
                                            <Col xs md={2} className="custom-icon-red custom-bold">PA</Col>
                                            <Col>: Present 1 session, the rest is absent</Col>
                                        </Row>
                                        <Row>
                                            <Col xs md={2} className="custom-icon-green custom-bold">ARR</Col>
                                            <Col>: Absent full day with reason</Col>
                                        </Row>
                                        <Row>
                                            <Col xs md={2} className="custom-icon-blue custom-bold">AR</Col>
                                            <Col>: Absent with reason 1 session</Col>
                                        </Row>
                                        <Row>
                                            <Col xs md={2} className="custom-icon-red custom-bold">A</Col>
                                            <Col>: Absent full day</Col>
                                        </Row>
                                    </Container>
                                    </Col>
                                    <Col xs={12} md={5} className = "center">
                                        <select className="browser-default custom-select td-dropdown" value={this.state.selectCurrentValue} onChange={this.onSelectChange.bind(this)}>
                                            { this.state.now.getHours() > 13 ? 
                                            <option value="PP" className="custom-icon-green custom-bold">PP</option>
                                            : null}
                                            { this.state.now.getHours() > 13 ?
                                            <option value="P" className="custom-icon-blue custom-bold">P</option>
                                            : null}
                                            <option value="PA" className="custom-icon-red custom-bold">PA</option>
                                            <option value="ARR" className="custom-icon-green custom-bold">ARR</option>
                                            <option value="AR" className="custom-icon-blue custom-bold">AR</option>
                                            <option value="A" className="custom-icon-red custom-bold">A</option>
                                        </select>
                                    </Col>
                                </Row>
                            </Container>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.onCloseClick.bind(this)}>Close</Button>
                            <Button color="primary" onClick={this.onUpdateClick.bind(this)}>{this.state.attendances.length === 0 ? "Create" : "Update" }</Button>
                        </ModalFooter>
                    </Modal>
            </td>       
            </tr>
        );
    }
}

export default DailyRow;