import React from "react";
 
  import {
    Row, Col, Card, CardBody, Fa, CardText ,MDBIcon, MDBModalBody, MDBInput, MDBBtn, MDBModal,
  } from 'mdbreact';
  import MUIDataTable from "mui-datatables";
  import ReactNotification from "react-notifications-component";
  import "react-notifications-component/dist/theme.css";
import './scroll.css';
import $ from 'jquery';
// import AttendanceDashboard from './AttendanceDashboard';
class InternReportDay extends React.Component {
  constructor() {
    super();
    this.state = {
        absentList : [],
        user: JSON.parse(sessionStorage.getItem('user')),
        count:0,
        countReport:0,
        countReportWeek:0,
        showAtendance: false,
        position: "mentor"
    };
    this.showModal = this.showModal.bind(this)
    this.handleAgree = this.handleAgree.bind(this)
    this.handleDeny = this.handleDeny.bind(this)
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
  }
  toggleCourse = () => {
    this.setState({
      modalReason: !this.state.modalReason,
    });
  };
  showModal =(e) => {
    let value = e.currentTarget.dataset.value
    this.state.absentList.forEach(r => {
      if(value === r.ID){
        this.setState({
          ID : r.ID,
          InternName : r.InternName,
          InternID : r.InternID,
          Date : r.Date,
          Message : r.Message,
        })
        return
      }
    })
    this.toggleCourse()
  }
  handleAgree(){
    var moment = require('moment');
    const std = moment.utc(this.state.Date).format();
    const data = {
      "ID"  : this.state.ID,
      "Message"   : this.state.Message,
      "Date"      : std,
      "InternID"  : this.state.InternID,
      "Status"    : 3,
      "IsDeleted": false,
    }
    fetch("http://localhost:8080/absent",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if(response.status !== 200){
          this.addNotification("errorAgree")
        }else {
          this.addNotification("successAgree")
        }
        this.Getreason()
      })
    this.toggleCourse()
    
  }
  handleDeny(){
    var moment = require('moment');
    const std = moment.utc(this.state.Date).format();
    const data = {
      "ID"  : this.state.ID,
      "Message"   : this.state.Message,
      "Date"      : std,
      "InternID"  : this.state.InternID,
      "Status"    : 2,
      "IsDeleted": false,
    }
    fetch("http://localhost:8080/absent",
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if(response.status !== 200){
          this.addNotification("errorDeny")
        }else {
          this.addNotification("successDeny")
        }
        this.Getreason()
      })
    this.toggleCourse()
  }
  addNotification(kind) {
    switch (kind) {
      case "successAgree":
        this.notificationDOMRef.current.addNotification({
          title: "",
          message: "Agree successfully !",
          type: "success", //success, danger, default, info, warning or custom
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 },
          dismissable: { click: true }
        });
        break;
      case "errorAgree":
        this.notificationDOMRef.current.addNotification({
          title: "",
          message: "Agree fail !",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 },
          dismissable: { click: true }
        });
        break;
      case "successDeny":
        this.notificationDOMRef.current.addNotification({
          title: "",
          message: "Deny successfully !",
          type: "success", //success, danger, default, info, warning or custom
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 },
          dismissable: { click: true }
        });
        break;
      case "errorDeny":
        this.notificationDOMRef.current.addNotification({
          title: "",
          message: "Deny fail !",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 },
          dismissable: { click: true }
        });
        break;
      default :
      this.notificationDOMRef.current.addNotification({
        title: "",
        message: "Action is failed !",
        type: "danger", //success, danger, default, info, warning or custom
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: { duration: 2000 },
        dismissable: { click: true }
      });
      break;
    }

  }

  getAttendance(){
    $.ajax({
      url: "http://localhost:8080/" + "attendance/"+this.state.user.ID+"/"+this.state.position+"/daily",
      type: "GET",
      success: function (response) {
        console.log(response)
        var cur = 0 ;
        for (var i = 0 ; i < response.length ; i++)
          if(response[i].Attendances.length !== 0)
            cur += 1;
          this.setState({
              max: response.length,
              cur: cur,
              showAtendance: true
          });
      }.bind(this),
      error: function (xhr, status) {
          this.setState({
              max: 0,
              cur: 0,
              showAtendance: false,
          });
      }.bind(this)
    });
  }

  Getreason(){
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    fetch("http://localhost:8080/absents")
    .then(response => response.json())
      .then(result => {
        let list = [];
        let no = 0;
        result.map(row => {
          list.push({ID : row._id ,Message: row.Message ,Date :(new Date(row.Date)).toLocaleDateString('en-US', options),InternID: row.InternID , Status : row.Status , IsDeleted :row.IsDeleted ,InternName: row.InternName})
          no++
          return result
        })
        this.setState({
          absentList : list
        })
      })
  }
  GetIntern(){
    // const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    let c = 0;
    fetch("http://localhost:8080/course/"+this.state.user.ID+"/mentorid")
    .then(response => response.json())
      .then(result => {
          c = result.length
          this.setState({
            count : c
        })
      })
  }
  GetReported(){
    let c = 0;
    fetch("http://localhost:8080/report/today/"+this.state.user.ID)
    .then(response => response.json())
      .then(result => {
        result.map(r=> {
          if(r.Reports.length !== 0)
            c +=1
        })
        this.setState({
          countReport : c
        })
      })  
  }
  GetReportedWeek(){
    let c = 0;
    var today = new Date();
    var day = today.getDay() || 7; 
    if( day !== 1 )                
      today.setHours(-24 * (day - 1)); 
    var moment = require('moment');
    const std = moment.utc(today).format();
    fetch("http://localhost:8080/report/week/"+this.state.user.ID+"/"+std)
    .then(response => response.json())
      .then(result => {
        result.map(r=> {
          if(r.Reports.length !== 0)
            c +=1
        })
        this.setState({
          countReportWeek : c
        })
      })  
  }
  componentDidMount(){
    this.getAttendance();
    this.Getreason();
    this.GetIntern();
    this.GetReported();
    this.GetReportedWeek();
  }
    render() {
        return (
        <div>    
          <div className="app-content">
                    <ReactNotification ref={this.notificationDOMRef} />
                  </div>
        <div class="left">  
        <Row className="mb-4">
        
        {this.state.showAtendance ?
          <Col xl="3" md="4" className="mb-r">
            <Card className="cascading-admin-card">
                <div className="admin-up">
                <Fa icon="line-chart" className="warning-color"/>
                  <div className="data">
                    <p>Attendance</p>
                    <h4>
                      <strong>{this.state.cur}/{this.state.max}</strong>
                    </h4>
                  </div>
                </div>
                <CardBody>
                  <div className="progress">
                    <div aria-valuemax={this.state.max} aria-valuemin="0" aria-valuenow={this.state.cur} className="progress-bar bg-primary" role="progressbar"
                      style={{width: (this.state.cur/this.state.max) * 100 +"%"}}></div>
                  </div>
                  <CardText>Complete {(this.state.cur/this.state.max) * 100 +"%"}</CardText>
                </CardBody>
              </Card>
          </Col>
          :null}
           <Col xl="4" md="4" className="mb-r">
       <Card className="cascading-admin-card">
         <div className="admin-up">
            <Fa icon="line-chart" className="warning-color"/>
            <div className="data">
              <p>Day RP</p>
              <h4>
               <strong>{this.state.countReport}/{this.state.count}</strong>
              </h4>
           </div>
         </div>
          <CardBody>
            <div className="progress">
             <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar bg grey" role="progressbar"
                style={{width: `${parseFloat(this.state.countReport/this.state.count).toFixed(2)*100}%`}}></div>
            </div>
            <CardText>Complete {parseFloat(this.state.countReport/this.state.count).toFixed(2)*100}%</CardText>
          </CardBody>
        </Card>
    </Col>
    <Col xl="4" md="4" className="mb-r">
      <Card className="cascading-admin-card">
          <div className="admin-up">
            <Fa icon="pie-chart" className="light-blue lighten-1"/>
            <div className="data">
              <p>Week RP</p>
              <h4>
                <strong>{this.state.countReportWeek}/{this.state.count}</strong>
              </h4>
            </div>
          </div>
          <CardBody>
            <div className="progress">
              <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" className="progress-bar grey darken-2" role="progressbar"
                style={{width:  `${parseFloat(this.state.countReportWeek/this.state.count).toFixed(2)*100}%`}}></div>
            </div>
            <CardText>Complete {parseFloat(this.state.countReportWeek/this.state.count).toFixed(2)*100}%</CardText>
          </CardBody>
        </Card>
    </Col>
          </Row>
            </div>

            

        <div class="right">
          <label><b>List Intern want to absent</b></label>
          <div class="scroll">
          <ul class="list-group">
                      
            {
              this.state.absentList.map((v , k) => {
                if(v.Status === 1){
                  return (
                    <li class="list-group-item list-group-item-warning d-flex justify-content-between align-items-center" onClick={this.showModal} key={k} data-value={v.ID}>{v.InternName}
                      <span class="badge badge-warning badge-pill">Haven't agreed</span>
                    </li>
                  )
                }else {
                  if(v.Status === 2){
                    return (
                      <li class="list-group-item list-group-item-danger d-flex justify-content-between align-items-center" onClick={this.showModal} key={k} data-value={v.ID}>{v.InternName}
                      <span class="badge badge-danger badge-pill">Denied</span>
                      </li>
                    )
                  }else {
                    return (
                      <li class="list-group-item list-group-item-success d-flex justify-content-between align-items-center" onClick={this.showModal} key={k} data-value={v.ID}>{v.InternName}
                      <span class="badge badge-success badge-pill">Agreed</span>
                      </li>
                    )
                  }
                }
              })
            }
          </ul>
          </div>
          <MDBModal
              isOpen={this.state.modalReason}
              toggle={this.toggleCourse}
              size="md"
              cascading>
              <MDBModalBody>
              <input type="hidden" name="id" value={this.state.ID} />
              <input type="hidden" name="id" value={this.state.InternID} />
              <MDBInput fullwidth="true" size="" label="From" name="internName" value={this.state.InternName} disabled/>
              <MDBInput fullwidth="true" size="" label="Want to absent on" name="date" value={this.state.Date} disabled/>
              <MDBInput fullwidth="true" size="" label="Reason" name="message" value={this.state.Message} disabled/>
              <div className="text-center mt-1-half">
                    <MDBBtn
                      className="mb-2 green darken-2"
                      onClick={this.handleAgree}
                     >
                      Agree
                  {/* <MDBIcon icon="trash" className="ml-1" /> */}
                    </MDBBtn>
                
                    
                    <MDBBtn
                      className="mb-2 red darken-2"
                      onClick={this.handleDeny}
                    >
                     Deny
                    </MDBBtn>
                    </div>
              </MDBModalBody>
            </MDBModal>
        </div>
        
        
  </div>


       
        )
    }
}
export default InternReportDay;
