import React from 'react'
import {
  Row, Col, Card, CardBody, MDBIcon, MDBModalBody, MDBInput, MDBBtn, MDBModal,
} from 'mdbreact';
import MUIDataTable from "mui-datatables";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import {
  createBrowserHistory,
} from 'history';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'
// /* Import MUIDataTable using command "npm install mui-datatables --save" */

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  main: {
    backgroundColor: "#007bff",
  }
});


class CoursePageForMentor extends React.Component {

  constructor() {
    super();
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
    this.state = {
      modal: false,
      data: [],
      value: 0,
      courseList: [],
      mentorList: [],
      numberofCheck: 0,
      isUpdate: false,
      checkValidate: true,
      user: JSON.parse(sessionStorage.getItem('user')),
      CourseID: ""
    };
  }

  addNotification(kind) {
    switch (kind) {
      case "successAdd":
        this.notificationDOMRef.current.addNotification({
          title: "Success",
          message: "Add course successfully !",
          type: "success", //success, danger, default, info, warning or custom
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 },
          dismissable: { click: true }
        });
        break;
      case "errorAdd":
        this.notificationDOMRef.current.addNotification({
          title: "Error",
          message: "Add course fail",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 },
          dismissable: { click: true }
        });
        break;
      case "successUpdate":
        this.notificationDOMRef.current.addNotification({
          title: "Success",
          message: "Update course successfully !",
          type: "success", //success, danger, default, info, warning or custom
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 },
          dismissable: { click: true }
        });
        break;
      case "successDelete":
        this.notificationDOMRef.current.addNotification({
          title: "Success",
          message: "Delete course successfully !",
          type: "success", //success, danger, default, info, warning or custom
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
        title: "Failed",
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
  GetCourseList() {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    fetch('http://localhost:8080/courses')
      .then(response => response.json())
      .then(data => {
        let NewData = []
        let cnt = 1
        data.map(row => {
          NewData.push([cnt, row._id, row.CourseName, this.convertDate2((new Date(row.StartDate)).toLocaleDateString('en-US', options)),
            this.convertDate2((new Date(row.EndDate)).toLocaleDateString('en-US', options)),
            // format datetime
            row.MentorName, row.MentorID])
          cnt++
          return NewData
        })
        this.setState({
          courseList: NewData,
        })
      });
  }
  

  handleChangeTab = (event, value) => {
    this.setState({ value });
  };

  componentDidMount() {

  }
  componentWillMount() {
    this.GetCourseList()
    this.ListMentor()
    }
  handleCheckChieldElement = (event) => {
    let mentorList = this.state.mentorList
    mentorList.forEach(mentor => {
      if (mentor.ID === event.target.value) {
        mentor.isChecked = event.target.checked
      }
    })
    let ischeck = event.target.checked
    let count = this.state.numberofCheck
    if (ischeck)
      count += 1
    else
      count -= 1
    this.setState({
      mentorList: mentorList,
      numberofCheck: count
    },this.valiedateForm)
  }

  toggleCourse = () => {
    this.setState({
      modalCourse: !this.state.modalCourse,
    });
  };



  addCourse = () => {
    let count =0 ;
    
      this.state.mentorList.map((v ,i)=> {
        if(this.state.user.ID === v.ID){
          v.isChecked = true
          count +=1
        }
      })
    
    this.setState({
      courseName: "",
      startDate: '',
      endDate: '',
      numberofCheck : count,
      title: "ADD NEW COURSE",
      icon: "plus",
      isUpdate: false,
      checkValidate: false
    }
    );
    this.toggleCourse()
  }


  handlerUpdateCourse = () => {
    var moment = require('moment');
    const std = moment.utc(this.state.startDate).format(); //=> "2013-10-06T00:00:00+00:00"
    const etd = moment.utc(this.state.endDate).format();
    let mentorlist = []

    this.state.mentorList.forEach(row => {
      if (row.isChecked) {
        return mentorlist.push(row.ID);
      }
    })
    const data = {
      "ID": this.state.id,
      "CourseName": this.state.courseName,
      "StartDate": std,
      "EndDate": etd,
      "MentorID": mentorlist,
      "IsDeleted": false
    }
    fetch("http://localhost:8080/course",
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(this.GetCourseList())
    this.toggleCourse()
    this.addNotification("successUpdate")
  }
  handlerAddCourse = () => {
    var moment = require('moment');
    const std = moment.utc(this.state.startDate).format(); //=> "2013-10-06T00:00:00+00:00"
    const etd = moment.utc(this.state.endDate).format();
    let mentorlist = []

    this.state.mentorList.forEach(row => {
      if (row.isChecked) {
        return mentorlist.push(row.ID);
      }
    })
    const data = {
      "CourseName": this.state.courseName,
      "StartDate": std,
      "EndDate": etd,
      "MentorID": mentorlist,
      "IsDeleted": false
    }
    fetch("http://localhost:8080/course",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(this.GetCourseList())
      .then(response => {
        if(response.status === 400){
          this.addNotification("errorAdd")
        }else {
          this.addNotification("successAdd")
        }
      })
    this.toggleCourse()
    this.setState({ games: [] })
  }

  ListMentor() {
    fetch('http://localhost:8080/mentors')
      .then(response => response.json())
      .then(result => {
        let mentorlist = []
        result.map(row => {
          return mentorlist.push({ ID: row.ID, Name: row.Name, isChecked: false })
        })
        this.setState({
          mentorList: mentorlist
        })
      });
  }

  handlerDeleteCourse = () => {
    fetch("http://localhost:8080/course/" + this.state.id, {
      method: 'DELETE',
      mode: 'cors'
    })
      .then(this.GetCourseList())
    this.toggleCourse()
    this.addNotification("successDelete")
    // window.location.reload();
  }

  // handlerEditMentor = () => {

  // }

  columnsCourse = [
    {
      name: "No.",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "ID",
      options: {
        filter: false,
        sort: false,
        display: "excluded"
      }
    },
    {
      name: "NAME",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "STARTDATE",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "ENDDATE",
      options: {
        filter: true,
        sort: true,
      }
    },
    // {
    //   name: "DETAIL",
    //   options: {
    //     filter: false,
    //     sort: false,
    //   }
    // },
    {
      name: "MENTOR",
      options: {
        filter: false,
        sort: false,
        customBodyRender: value => value.map((v , i) => {
          if(i === value.length-1){
            return v
          }else 
          return v+', '
        })
      }
    },
    {
      name: "MENTOR ID",
      options: {
        filter: false,
        sort: false,
        display: "excluded"
      }
    },
  ]


  optionsCourse = {
    filterType: "dropdown",
    responsive: "scroll",
    download: false,
    viewColumns: false,
    print: false,
    selectableRows: false,
    textLabels: {
      body: {
        noMatch: "Sorry, no matching records found",
        toolTip: "Sort",
      },
      pagination: {
        next: "Next Page",
        previous: "Previous Page",
        rowsPerPage: "Rows per page:",
        displayRows: "of",
      },
      toolbar: {
        search: "Search",
        downloadCsv: "Download CSV",
        print: "Print",
        viewColumns: "View Columns",
        filterTable: "Filter Table",
      },
      filter: {
        all: "All",
        title: "FILTERS",
        reset: "RESET",
      },
      viewColumns: {
        title: "Show Columns",
        titleAria: "Show/Hide Table Columns",
      },
      selectedRows: {
        text: "rows(s) selected",
        delete: "Delete",
        deleteAria: "Delete Selected Rows",
      },
    },
    onRowClick: (rowData, rowState) => {
      let std = this.convertDate(rowData[3]);
      let etd = this.convertDate(rowData[4]);
      let lm = this.state.mentorList;
      let count = 0;
      lm.map((value, i) => {
        rowData[6].map((value2 , i2)=> {
          if(value.ID === value2){
            value.isChecked = true
            count += 1
          }
        })
      })
      this.setState({
        id: rowData[1],
        courseName: rowData[2],
        startDate: std,
        endDate: etd,
        mentorList : lm,
        numberofCheck : count,
        icon: "edit",
        isUpdate: true,
        checkValidate: true
      });
      this.toggleCourse()
    }
  }
  // handleCheck(val) {
  //   return this.state.mentorList.some(item => val === item.Name);
  // }
  convertDate(rowData) {
    var moment = require('moment')
    let strDate = ""
    let strMon = ""
    let strYea = ""
    let ye = moment(rowData, "DD-MM-YYYY").get('year');
    let mo = moment(rowData, "DD-MM-YYYY").get('month') + 1;  // 0 to 11
    let da = moment(rowData, "DD-MM-YYYY").get('date');
    if (da < 10)
      strDate = "0" + da
    else
      strDate = '' + da
    if (mo < 10)
      strMon = "0" + mo
    else
      strMon = '' + mo
    if (ye < 1000) {
      strYea = "0" + ye
      if (ye < 100) {
        strYea = "0" + strYea
        if (ye < 10)
          strYea = "0" + strYea
      }
    }
    else
      strYea = '' + ye
    return strYea + "-" + strMon + "-" + strDate
  }

  convertDate2(rowData) {
    var moment = require('moment')
    let strDate = ""
    let strMon = ""
    let strYea = ""
    let ye = moment(rowData).get('year');
    let mo = moment(rowData).get('month') + 1;  // 0 to 11
    let da = moment(rowData).get('date');
    if (da < 10)
      strDate = "0" + da
    else
      strDate = '' + da
    if (mo < 10)
      strMon = "0" + mo
    else
      strMon = '' + mo
    if (ye < 1000) {
      strYea = "0" + ye
      if (ye < 100) {
        strYea = "0" + strYea
        if (ye < 10)
          strYea = "0" + strYea
      }
    }
    else
      strYea = '' + ye
    return strDate + "/" + strMon + "/" + strYea
  }

  checkValidate() {

    return false;
  }

  onChangeDate = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({ [name]: value },
      () => { this.validateField(name, value) });
  }
  validateField(fieldname, value) {
    var constDate = new Date('2016/1/1');
    var standard = constDate.getTime();
    var startDateValid = 0;
    var endDateValid = 0;
    var courseNameValid = 0;
    switch (fieldname) {
      case "startDate":
        var sdNumber = new Date(new Date(value).toLocaleString()).getTime();
        var cp = sdNumber - standard;
        if (value === "") {
          startDateValid = 1;
          courseNameValid = this.state.courseNameValid;
        } else {
          if (cp <= 0) {
            startDateValid = 2;
            courseNameValid = this.state.courseNameValid;
          }
          else {
            startDateValid = 0;
            courseNameValid = this.state.courseNameValid;
          }
        }
        if (this.state.endDate === "") {
          endDateValid = 2 // end date undefine
          courseNameValid = this.state.courseNameValid;
        } else {
          var edNumber2 = new Date(new Date(this.state.endDate).toLocaleString()).getTime();
          var nurse = edNumber2 - sdNumber;
          if (nurse > 0) {
            courseNameValid = this.state.courseNameValid;
            endDateValid = 0
          } else {
            courseNameValid = this.state.courseNameValid;
            endDateValid = 1 // end date is before start date
          }
        }
        break;

      case "endDate":
        var edNumber = new Date(new Date(value).toLocaleString()).getTime();
        var sdNumber2 = new Date(new Date(this.state.startDate).toLocaleString()).getTime();
        var hieu = edNumber - sdNumber2;
        if (value === "") {
          endDateValid = 2;
          courseNameValid = this.state.courseNameValid;
        }else{
          if (hieu <= 0) {
            courseNameValid = this.state.courseNameValid;
            endDateValid = 1;
          }
          // end date is not after start date
          else {
            endDateValid = 0; //  end date is after start date
            courseNameValid = this.state.courseNameValid;
          }
        }
        
        break;
      case "courseName":
        if (value === ""){
          courseNameValid = 1;
          startDateValid = this.state.startDateValid;
          endDateValid = this.state.endDateValid;
        }
        else {
          if (value.length <= 5){
            startDateValid = this.state.startDateValid;
            endDateValid = this.state.endDateValid;
            courseNameValid = 2;
          }
            
          else{
            startDateValid = this.state.startDateValid;
            endDateValid = this.state.endDateValid;
            courseNameValid = 0;
          }
            
        }
    }
    this.setState({
      startDateValid: startDateValid,
      endDateValid: endDateValid,
      courseNameValid: courseNameValid
    },this.valiedateForm)
  }
  valiedateForm(){
    this.setState({
      formValid : this.state.startDateValid === 0 && this.state.endDateValid === 0 && this.state.courseNameValid ===0 && this.state.numberofCheck !== 0 
    })
  }
  handleChangeValue(e) {
    const { name, value } = e.target;
    e.target.className = "form-control"
    switch (name) {
      case "courseName":
        this.setState({ courseName: value })
        if (value.trim().length === 0) {
          this.setState({
            courseName: " ",
            errorName: "Course name can not be blank",
          })
          e.target.className += " invalid"
        } else if (value.trim().length < 6) {
          this.setState({
            errorName: "Course name contains more than 5 characters",
          })
          e.target.className += " invalid"
        } else {
          e.target.className += " valid"
        }
        break;
      default:
        break;
    }
  }

  render() {
      this.state.courseList.map((value, key) => {
        return (<option key={key} value={value[1]}>{value[1]}</option>)
      })
      return (
        <React.Fragment>
          <Row>
            <Col md="12">
              <Card className="mt-5">

                <CardBody>
                  <div className="app-content">
                    <ReactNotification ref={this.notificationDOMRef} />
                  </div>
                  <MDBBtn
                    className="mb-3 blue darken-2"
                    onClick={this.addCourse}>
                    Add
                      </MDBBtn>

                  <hr></hr>
                  <MUIDataTable
                    title={"Course List"}
                    data={this.state.courseList}
                    columns={this.columnsCourse}
                    options={this.optionsCourse} />
                </CardBody>
              </Card>
            </Col>
            {
              this.state.modalCourse === false &&
              this.state.mentorList.map((v , i) => {
                v.isChecked = false
              })
            }
            <MDBModal
              isOpen={this.state.modalCourse}
              toggle={this.toggleCourse}
              size="md"
              cascading>
              <MDBModalBody>
                <input type="hidden" name="id" value={this.state.id} />
                <MDBInput fullwidth="true" size="" label="Course Name" name="courseName" value={this.state.courseName} onChange={this.onChangeDate.bind(this)} />
                {
                  this.state.courseNameValid === 1 &&
                  <div className="alert alert-danger custom-top"> Course name must be not blank</div>
                }
                {
                  this.state.courseNameValid === 2 &&
                  <div className="alert alert-danger custom-top"> Course name must be more than 5 characters</div>
                }
                <label>Start Date</label>
                <input type="date" className="form-control" name="startDate" value={this.state.startDate} onChange={this.onChangeDate.bind(this)} />
                {
                  this.state.startDateValid === 1 &&
                  <div className="alert alert-danger custom-top"> Start Date undefined</div>
                }
                {
                  this.state.startDateValid === 2 &&
                  <div className="alert alert-danger custom-top"> Start must be after 1/1/2016</div>
                }
                <label>End Date</label>
                <input type="date" className="form-control" name="endDate" value={this.state.endDate} onChange={this.onChangeDate.bind(this)} />
                {
                  this.state.endDateValid === 1 &&
                  <div className="alert alert-danger custom-top"> End date must be after Start date </div>
                }
                <label>Mentor</label>
                {
                  this.state.mentorList.map((mentor, index) => {
                    return (
                      <div key={index}>
                        <input type="checkbox" name="mentorID" value={mentor.ID} checked={mentor.isChecked} onChange={this.handleCheckChieldElement} />
                        <span>{mentor.Name.trim()}</span>
                      </div>
                    )
                  })
                }
                {
                  this.state.numberofCheck === 0 &&
                  <div className="alert alert-danger custom-top">Please ! Choose mentor</div>
                }
                <div className="text-center mt-1-half">
                  {
                    this.state.isUpdate === false &&
                    <MDBBtn
                      className="mb-2 blue darken-2"
                      onClick={this.handlerAddCourse}
                      disabled={!this.state.formValid}
                    >
                      Create
                  <MDBIcon icon="send" className="ml-1" />
                    </MDBBtn>
                  }
                  {
                    this.state.isUpdate &&


                    <MDBBtn
                      className="mb-2 blue darken-2"
                      onClick={this.handlerUpdateCourse}
                      >
                      Update
                  <MDBIcon icon="edit" className="ml-1" />
                    </MDBBtn>
                  }
                  {
                    this.state.isUpdate &&


                    <MDBBtn
                      className="mb-2 blue darken-2"
                      onClick={this.handlerDeleteCourse}>
                      Delete
                  <MDBIcon icon="trash" className="ml-1" />
                    </MDBBtn>
                  }
                  {
                    this.state.isUpdate &&
                    <MDBBtn
                      className="mb-2 blue darken-2"
                      href={`/course/${this.state.id}`}
                    >
                      Detail
                    </MDBBtn>
                  }
                </div>
              </MDBModalBody>
            </MDBModal>
          </Row>


        </React.Fragment>

      )
  }
}
export default withStyles(styles)(CoursePageForMentor);