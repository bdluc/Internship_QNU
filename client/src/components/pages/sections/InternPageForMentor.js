
import React from 'react'
import $ from 'jquery';
import {
  Row, Col, Card, CardBody, MDBIcon, MDBModalBody, MDBInput, MDBBtn, MDBModal,
} from 'mdbreact';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import TextField from '@material-ui/core/TextField';
import MUIDataTable from "mui-datatables";
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';

/* Import MUIDataTable using command "npm install mui-datatables --save" */

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


class InternPage extends React.Component {

  constructor() {
    super();
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
    this.state = {
      modal: false,
      data: [],
      value: 0,
      internList: [],
      courseList: [],
      isUpdate: false,
      isClose: false,
      checkValidate: true,
      CourseName: ''
    };
    this.errorName = "";
    this.errorPhone = "";
    this.errorEmail = "";
    this.errorGender = "";
    this.errorCourse = "";
    this.errorDOB = "";
    this.errorUniversity = "";
    this.errorFaculty = "";

  }

  addNotification(kind, mess = "") {
    switch (kind) {
      case "successAdd":
        this.notificationDOMRef.current.addNotification({
          message: "Add course successfully !",
          type: "success", //success, danger, default, info, warning or custom
          message: "This is a success message!",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 3000 },
          dismissable: { click: true }
        });
        break;
      case "error":
        this.notificationDOMRef.current.addNotification({
          message: mess,
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 3000 },
          dismissable: { click: true }
        });
        break;
        // case "errorCREATE":
        // this.notificationDOMRef.current.addNotification({
        //   title: "Error",
        //   message: "Name can't blank ",
        //   type: "danger",
        //   insert: "top",
        //   container: "top-right",
        //   animationIn: ["animated", "fadeIn"],
        //   animationOut: ["animated", "fadeOut"],
        //   dismiss: { duration: 5000 },
        //   dismissable: { click: true }
        // });
        // break;
      case "successUpdate":
        this.notificationDOMRef.current.addNotification({
          message: "Update course successfully !",
          type: "success", //success, danger, default, info, warning or custom
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 3000 },
          dismissable: { click: true }
        });
        break;
      case "successDelete":
        this.notificationDOMRef.current.addNotification({
          message: "Delete course successfully !",
          type: "success", //success, danger, default, info, warning or custom
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 3000 },
          dismissable: { click: true }
        });
        break;
    }
  }

  GetInternList() {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    fetch('http://localhost:8080/intern')
      .then(response => response.json())
      .then(data => {
        let NewData = []
        let stt = 1
        data.map(row => {
          NewData.push([stt, row.Intern.ID, row.Intern.Name, row.Intern.PhoneNumber, row.Intern.Email, row.Intern.Gender ? "Male" : "Female",
            this.convertDate2((new Date(row.Intern.DoB)).toLocaleDateString('en-US', options)),
            row.Intern.University, row.Intern.Faculty, row.Course, row.Intern.CourseID,
            // format datetime,
          ])
          stt++
          return NewData,
            console.log(NewData)
        })
        this.setState({
          internList: NewData
        })
      });
  }


  componentDidMount() {

    this.GetInternList()
    this.GetListCourse()
  }

  toggleIntern = () => {
    this.setState({
      modalIntern: !this.state.modalIntern,
    });
  };

  addIntern = () => {
    this.setState({
      name: "",
      phone: "",
      email: "",
      gender: "",
      CourseName: "",
      DoB: "",
      University: "",
      Faculty: "",
      icon: "plus",
      isUpdate: false,
      // checkValidate: false
      btnMode: 'off',
      doneName: false,
      donePhone: false,
      doneEmail: false,
      doneGender: false,
      doneCourse: false,
      doneDOB: false,
      doneUniversity: false,
      doneFaculty: false,
    });
    this.errorName = "";
    this.errorPhone = "";
    this.errorEmail = "";
    this.errorGender = "";
    this.errorCourse = "";
    this.errorDOB = "";
    this.errorUniversity = "";
    this.errorFaculty = "";
    this.toggleIntern()
  }

  handlerAddIntern = () => {

    var moment = require('moment');
    const date = moment.utc(this.state.dob).format();
    const data = {
      "Name": this.state.name,
      "PhoneNumber": this.state.phone,
      "Email": this.state.email,
      "Gender": this.state.gender === "Male" ? true : false,
      "DOB": date,
      "University": this.state.University,
      "Faculty": this.state.Faculty,
      "CourseID": this.state.courseID,
      "IsDeleted": false
    }
    var checkAdd = false
    $.ajax({
      url: "http://localhost:8080/checkemail/" + data['Email'],
      type: "GET",
      async: false,
      success: function (response) {
        if (response['message'] == "Success") {
          $.ajax({
            url: "http://localhost:8080/intern",
            type: "POST",
            async: false,
            dataType: "json",
            data: JSON.stringify(data),
            success: function (response) {
              if (response.ID === undefined) {
                checkAdd = false
              } else {
                checkAdd = true
              }
            }
          });
        }
      }
    });
    if (checkAdd == true) {
      this.toggleIntern()
      this.addNotification("successAdd")
    }
    else {
      this.addNotification("error","Email has been duplicated")
    }

  }

  GetListCourse() {
    fetch('http://localhost:8080/courses')
      .then(response => response.json())
      .then(data => {
        let NewData = []
        data.map(row => {
          NewData.push({ ID: row._id, Name: row.CourseName })
          return NewData
        })
        this.setState({
          courseList: NewData,
        })
      });
  }

  handlerDeleteIntern = () => {
    if (confirm("bạn chắc chắn muốn xóa ?")) { //eslint-disable-line
      fetch("http://localhost:8080/intern/" + this.state.id, {
        method: 'DELETE',
        mode: 'cors',
      })
        .then(this.GetInternList())

      this.toggleIntern()
      alert("OK")
      window.location.reload();
    }
    else {
      this.toggleIntern()
      alert("FAIL")
    }
  }

  handlerEditIntern = () => {
    var moment = require('moment');

    const date = moment.utc(this.state.dob).format();
    const data = {
      "Name": this.state.name,
      "PhoneNumber": this.state.phone,
      "Email": this.state.email,
      "Gender": this.state.gender === "Male" ? true : false,
      "DoB": date,
      "University": this.state.University,
      "Faculty": this.state.Faculty,
      "CourseID": this.state.courseID,
      "IsDeleted": false
    }
    fetch("http://localhost:8080/internu/" + this.state.id, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(this.GetInternList())
    this.toggleIntern()
    this.addNotification("successUpdate")
    window.location.reload();
  }

  columnsIntern = [
    {
      name: "NO.",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "ID",
      options: {
        filter: false,
        sort: true,
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
      name: "PHONE",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "EMAIL",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "GENDER",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "DOB",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "UNIVERSITY",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "FACULTY",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "COURSE",
      options: {
        filter: true,
        sort: false,
      }
    },
  ]


  optionsIntern = {
    filterType: "dropdown",
    responsive: "scroll",
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20],
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
      let std = this.convertDate(rowData[6])
      this.setState({

        id: rowData[1],
        name: rowData[2],
        phone: rowData[3],
        email: rowData[4],
        gender: rowData[5],
        dob: std,
        University: rowData[7],
        Faculty: rowData[8],
        course: rowData[9],
        courseID: this.state.internList[rowState.rowIndex][10],
        isUpdate: true,
        checkValidate: true,
        doneName: true,
        donePhone: true,
        doneEmail: true,
        doneGender: true,
        doneCourse: true,
        doneDOB: true,
        doneUniversity: true,
        doneFaculty: true,
        first: true
      });
      this.errorName = "";
      this.errorPhone = "";
      this.errorEmail = "";
      this.errorGender = "";
      this.errorCourse = "";
      this.errorDOB = "";
      this.errorUniversity = "";
      this.errorFaculty = "";
      this.toggleIntern()
    }
  }

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

  handleChangeValue(e) {
    const { name, value } = e.target;
    e.target.className = "form-control"
    switch (name) {
      case "name":
        this.setState({ name: value })
        if (value.trim().length === 0) {
          this.setState({
            btnMode: 'off',
            name: " ",
            doneName: false
          })
          this.errorName = "Name can not be blank";
          e.target.className += " invalid"
        } else if (value.trim().length < 3) {
          this.setState({
            btnMode: 'off',
            doneName: false
          })
          this.errorName= "Name contains more than 5 characters";
          e.target.className += " invalid"
        } else if (value.length > 50) {
          this.setState({
            name: this.state.name,
            btnMode: 'off',
            doneName: false
          })
          this.errorName= "Name may be very long";
          e.target.className += " invalid"
        }
        else {
          this.setState({
            doneName: true,
          })
          this.errorName= "";
          e.target.className += " valid"
        }
        break;
      case "phone":
        this.setState({ phone: value })
        e.target.className = "form-control"
        const regexPhone = /^[0-9\b]+$/
        if (value.trim().length === 0) {
          this.setState({
            btnMode: 'off',
            // phone: " ",
            donePhone: false
          })
          this.errorPhone= "Phone can not be blank";
          e.target.className += " invalid"
        } else if (!regexPhone.test(value.trim())) {
          this.setState({
            btnMode: 'off',
            donePhone: false
          })
          this.errorPhone= "Phone contains only numeric characters";
          e.target.className += " invalid"
        }
          else if (value.trim().length < 10) {
            this.setState({
              btnMode: 'off',
              donePhone: false
            })
            this.errorPhone= "Phone contains more than 10 number";
            e.target.className += " invalid"
          } else if (value.length > 11) {
            this.setState({
              name: this.state.name,
              btnMode: 'off',
              donePhone: false
            })
            this.errorPhone= "Phone contains more than 10 number";
            e.target.className += " invalid"
        } else {
          this.setState({
            donePhone: true,
          })
          this.errorPhone= "";
          e.target.className += " valid"
        }
        break;
      case "email":
      this.setState({ email: value })
      e.target.className = "form-control"
      const regexEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      if (value.trim().length === 0) {
        this.setState({
          btnMode: 'off',
          email: " ",
          doneEmail: false
        })
        this.errorEmail= "Email can not be blank";
        e.target.className += " invalid"
      } else if (!regexEmail.test(value.trim())) {
        this.setState({
          btnMode: 'off',
          doneEmail: false
        })
        this.errorEmail= "Not a valid email address";
        e.target.className += " invalid"
      } else if (value.length > 50) {
        this.setState({
          email: this.state.email,
          btnMode: 'off',
          doneEmail: false
        })
        this.errorEmail= "Email may be very long";
        e.target.className += " invalid"
      } else {
        this.setState({
          doneEmail: true,
        })
        this.errorEmail= "";
        e.target.className += " valid"
      }
      break;
      case "gender":
        this.setState({ gender: value })
        if (value.trim().length > 0) {
          this.setState({
            doneGender: true,
          })
          this.errorGender= "";
        } else {
          this.setState({
            doneGender: false,
          })
          e.target.className += " invalid"
          this.errorGender= "Gender can not be blank";
        }
        break;
      case "course":
        this.setState({ courseID: value })
        if (value.trim().length > 0) {
          this.setState({
            doneCourse: true,
          })
          this.errorCourse= "";
        } else {
          this.setState({
            doneCourse: false,
          })
          e.target.className += " invalid"
          this.errorCourse= "Course can not be blank";
        }
        break;
      case "dob":
        var standard = new Date('1988/1/1').getTime();
        var currentDate = new Date().getTime();
        var valueofUser = new Date(value).getTime();
        this.setState({ dob: value })
        if (value.trim().length > 0) {
          if ((currentDate - valueofUser) < standard || valueofUser < 0) {
            this.setState({
              doneDOB: false,
            })
            this.errorDOB= "The age of the intern must be over 17";
            e.target.className += " invalid"
          } else {
            this.setState({
              doneDOB: true,
            })
            this.errorDOB= "";
            e.target.className += " valid"
          }
        } else {
          this.setState({
            doneDOB: false,
          })
          this.errorDOB= "DOB can not be blank";
          e.target.className += " invalid"
        }
        break;
      case "University":
        this.setState({ University: value })
        if (value.trim().length > 0) {
          this.setState({
            doneUniversity: true,
          })
          this.errorUniversity= ""
          e.target.className += " valid"
        } else {
          this.setState({
            doneUniversity: false,
          })
          e.target.className += " invalid"
          this.errorUniversity= "University can not be blank";
        }
        break;
      case "Faculty":
        this.setState({ Faculty: value })
        if (value.trim().length > 0) {
          this.setState({
            doneFaculty: true,
          })
          this.errorFaculty= "";
          e.target.className += " valid"
        } else {
          this.setState({
            doneFaculty: false,
          })
          e.target.className += " invalid"
          this.errorFaculty= "Faculty can not be blank";
        }
        break;
      default:
        break;
    }
    if (this.errorName != "" ){
      this.addNotification("error",this.errorName)
    }
    if (this.errorPhone!= "" ){
      this.addNotification("error",this.errorPhone)
    }
    if (this.errorEmail!= "" ){
      this.addNotification("error",this.errorEmail)
    }
    if (this.errorGender!= "" ){
      this.addNotification("error",this.errorGender)
    }
    if (this.errorCourse!= "" ){
      this.addNotification("error",this.errorCourse)
    }
    if (this.errorDOB!= "" ){
      this.addNotification("error",this.errorDOB)
    }
    if (this.errorUniversity!= "" ){
      this.addNotification("error",this.errorUniversity)
    }
    if (this.errorFaculty!= "" ){
      this.addNotification("error",this.errorFaculty)
    }
   if(this.state.first)
      this.setState({
        first: false
      })
  }

  handleChanges() {
    this.setState({
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <div className="app-content">
                  <ReactNotification ref={this.notificationDOMRef} />
                </div>
                <MDBBtn
                  className="mb-3 blue darken-2"
                  onClick={this.addIntern}>
                  Add
                </MDBBtn>

                <hr></hr>
                <MUIDataTable
                  title={"Intern List"}
                  data={this.state.internList}
                  columns={this.columnsIntern}
                  options={this.optionsIntern} />
              </CardBody>
            </Card>
          </Col>

          {
            // AddIntern, Edit table
          }
          <MDBModal
            isOpen={this.state.modalIntern}
            toggle={this.toggleIntern}
            size="md"
            cascading>

            <MDBModalBody >
              <MDBInput fullwidth="true" size="" label="Name" name="name" value={this.state.name} onInput={this.handleChangeValue.bind(this)} />
              <MDBInput fullwidth="true" label="Phone" name="phone" value={this.state.phone} onInput={this.handleChangeValue.bind(this)} />
              <MDBInput fullwidth="true" label="Email" iconClass="dark-grey" name="email" value={this.state.email} onInput={this.handleChangeValue.bind(this)} />
              <FormControl fullWidth>
                <InputLabel htmlFor="select-multiple">Gender</InputLabel>
                <Select  label="Gender" name="gender" value={this.state.gender} onChange={this.handleChangeValue.bind(this)}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl ><br />
              <FormControl fullWidth>
                <InputLabel htmlFor="select-multiple">Course</InputLabel>
                <Select fullWidth label="Course" name="course" value={this.state.courseID} onChange={this.handleChangeValue.bind(this)}>
                  {this.state.courseList.map(function (course, index) {
                    return <MenuItem key={index} value={course.ID}>{course.Name}</MenuItem>;
                  })}
                </Select>
              </FormControl>

              <MDBInput
                label="DOB" name="dob" id="date" type="date"
                value={this.state.dob}
                onInput={this.handleChangeValue.bind(this)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <MDBInput fullWidth="true" label="University" name="University" value={this.state.University} onInput={this.handleChangeValue.bind(this)} />
              <div className="text-center mt-1-half">
                <MDBInput fullWidth label="Faculty" name="Faculty" value={this.state.Faculty} onInput={this.handleChangeValue.bind(this)} />
                <div className="text-center mt-1-half">

                  {
                    (this.state.isUpdate === false &&
                    this.state.doneName === true &&
                    this.state.donePhone === true &&
                    this.state.doneEmail === true &&
                    this.state.doneGender === true &&
                    this.state.doneDOB === true &&
                    this.state.doneUniversity === true &&
                    this.state.doneFaculty === true ) ?
                    <MDBBtn
                      className="mb-2 blue darken-2"
                      onClick={this.handlerAddIntern}
                    >
                      Create
                  <MDBIcon icon="send" className="ml-1" />
                    </MDBBtn>
                  : (this.state.isUpdate === false) ?
                  <MDBBtn
                    className="mb-2 blue darken-2"
                    onClick={this.handlerAddIntern}
                    disabled="true"
                  >
                  Create
              <MDBIcon icon="send" className="ml-1" />
                </MDBBtn>
                  : null}
                  {
                    (this.state.isUpdate && 
                      this.state.doneName === true &&
                      this.state.donePhone === true &&
                      this.state.doneEmail === true &&
                      this.state.doneGender === true &&
                      this.state.doneDOB === true &&
                      this.state.doneUniversity === true &&
                      this.state.doneFaculty === true &&
                      this.state.first === false ) ?
                      <MDBBtn
                        className="mb-2 blue darken-2"
                        onClick={this.handlerEditIntern}
                        >
                        Update
                        <MDBIcon icon="edit" className="ml-1" />
                      </MDBBtn>
                  : (this.state.isUpdate) ?
                      <MDBBtn
                          className="mb-2 blue darken-2"
                          onClick={this.handlerEditIntern}
                          disabled="true">
                          Update
                        <MDBIcon icon="edit" className="ml-1" />
                      </MDBBtn>
                  : null}
                  {
                    (this.state.isUpdate )?
                    <MDBBtn
                      className="mb-2 blue darken-2"
                      onClick={this.handlerDeleteIntern}>
                      Delete
                  <MDBIcon icon="trash" className="ml-1" />
                    </MDBBtn>
                  : null}
                </div>
              </div>
            </MDBModalBody>
          </MDBModal>
        </Row>
      </React.Fragment>
    )
  }
}
export default withStyles(styles)(InternPage);
