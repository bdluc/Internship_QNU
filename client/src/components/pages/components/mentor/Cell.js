import React from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Container, Row, Col } from 'mdbreact';
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
            now: new Date(),
            isCreate: this.props.cellData.id === "N.A"
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
        var fullDate = this.props.cellData.fullDate;
        var attendanceID  = this.props.cellData.id;
        if (this.state.iconClass !== "" || (attendanceID === "N.A" && fullDate !== "")  ) {
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
        if(this.props.cellData.id === "N.A")
                this.setState({
                    iconClass: this.getIconClass("PA"),
                    selectCurrentValue: "PA"
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
        // run when current value != default value 
        if (this.state.selectCurrentValue !== this.state.selectDefaultValue) {
            var isChange = this.props.onCellChange(object);
            if(isChange)
                this.setState({
                    showModal: false, 
                    showEdit: false, 
                    selectDefaultValue: this.state.selectCurrentValue
                });   
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
            <td id={this.state.id} onMouseEnter={this.onCellEnter.bind(this)} onMouseLeave={this.onCellDeHover.bind(this)}>
                {this.state.date}
                <i className={this.state.iconClass}></i>
                {this.state.showEdit ? 
                <i className={this.state.editClass} 
                onMouseOver={this.onEditHover.bind(this)}
                onMouseLeave={this.onEditDeHover.bind(this)}
                onClick={this.onEditClick.bind(this)}></i> : null}
                <Modal isOpen={this.state.showModal} size="lg" toggle={this.toggleIntern}>
                    <ModalHeader>{this.props.cellData.id === "N.A" ? "Create" : "Update" }</ModalHeader>
                    <ModalBody>
                        <Container>
                            <Row className="show-grid">
                                    <Col xs={12} md={7} className="custom-align-left">
                                    <Container>
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
                                            { this.state.now.getHours() > 13 || this.state.date != this.state.now.getDate()? 
                                            <option value="PP" className="custom-icon-green custom-bold">PP</option>
                                            : null}
                                            { this.state.now.getHours() > 13 || this.state.date != this.state.now.getDate()?
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
                        <Button color="primary" onClick={this.onUpdateClick.bind(this)}>{this.props.cellData.id === "N.A" ? "Create" : "Update" }</Button>
                    </ModalFooter>
                </Modal>
            </td>
        );
    }
}

export default Cell;