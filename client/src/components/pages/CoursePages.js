import React from 'react'
import {
  Row, Col, Card, CardBody, MDBIcon, MDBModalBody, MDBInput, MDBBtn, MDBModal,
} from 'mdbreact';
// import TextField from '@material-ui/core/TextField';
import MUIDataTable from "mui-datatables";
import DatePickers from './sections/DatePickers'
// import Checkbox from './sections/Checkbox';
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

class CoursePages extends React.Component {

  constructor() {
    super();
    this.state = {
      modal: false,
      data: [],
      value: 0,
      courseList: [],
      mentorList:[],
      isUpdate: false,
      checkValidate: true
    };
  }

  GetCourseList() {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    fetch('http://localhost:8080/courses')
      .then(response => response.json())
      .then(data => {
        let NewData = []
        let cnt = 1
        data.map(row => {
          NewData.push([cnt, row._id, row.CourseName, (new Date(row.StartDate)).toLocaleDateString('en-US', options),
          (new Date(row.EndDate)).toLocaleDateString('en-US', options),
            // format datetime
            row.MentorName,row.MentorID])
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

    this.GetCourseList()
    this.ListMentor()
  }

  handleCheckChieldElement = (event) => {
    let mentorList = this.state.mentorList
    mentorList.forEach(mentor => {
      if (mentor.ID === event.target.value)
          mentor.isChecked =  event.target.checked
    })
    this.setState({mentorList: mentorList})
    console.log(this.state.mentorList)
  }

  toggleCourse = () => {
    this.setState({
      modalCourse: !this.state.modalCourse,
    });
  };



  addCourse = () => {
    this.setState({
      courseName: "",
      startDate: "",
      endDate: "",
      // detail: "",
      mentorID: [],
      title: "ADD NEW COURSE",
      icon: "plus",
      isUpdate: false,
      checkValidate: false
    });
    this.toggleCourse()
  }



  handlerAddCourse = () => {
    if (this.state.icon === "edit") {
      fetch("http://localhost:8080/course/" + this.state.id, {
        method: 'DELETE',
        mode: 'cors'
      })
        .then(this.GetCourseList())
      this.toggleCourse()
    }
    const dts = this.state.startDate.split(/-|\s/)
    const dte = this.state.endDate.split(/-|\s/)
    let dates = new Date(dts[2], dts[1], dts[0])
    let datee = new Date(dte[2], dte[1], dte[0])
    let mentorlist = []

    this.state.mentorList.forEach(row => {
        if(row.isChecked){
          return mentorlist.push(row.ID);
        }
    })
    const data = {
      "CourseName": this.state.courseName,
      "StartDate": dates,
      "EndDate": datee,
      // "Detail": this.state.detail,
      "MentorID": mentorlist,
      "IsDeleted": false
    }
    console.log(data)
    fetch("http://localhost:8080/course",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(this.GetCourseList())
    this.toggleCourse()
    this.setState({ games: [] });
  }

  ListMentor(){
    fetch('http://localhost:8080/mentors')
      .then(response => response.json())
        .then(result => {            
          let mentorlist = []
          result.map(row => {
            return mentorlist.push( {ID : row.ID , Name : row.Name, isChecked : false})
          })
          this.setState({
            mentorList : mentorlist
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
    // window.location.reload();
  }

  // handlerEditMentor = () => {

  // }

  columnsCourse = [
    {
      name: "#",
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
      name: "COURSE NAME",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "START DATE",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "END DATE",
      options: {
        filter: false,
        sort: false,
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
    {
      name: "DETAIL",
      options: {
        filter: false,
        sort: false,
      }
    },
  ]


  optionsCourse = {
    filterType: "dropdown",
    responsive: "scroll",
    download : false,
    print : false,
    selectableRows : false,
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
      this.setState({
        id: rowData[1],
        courseName: rowData[2],
        startDate: rowData[3],
        endDate:rowData[4],
        icon: "edit",
        isUpdate: true,
        checkValidate: true
      });
      this.toggleCourse()
    }
  }

  checkValidate() {

    return false;
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
            errorName: "Course name can not be blank"
          })
          e.target.className += " invalid"
        } else if (value.trim().length < 6) {
          this.setState({
            errorName: "Course name contains more than 5 characters"
          })
          e.target.className += " invalid"
        } else {
          e.target.className += " valid"
        }
        break;
      case "startDate":
        this.setState({ startDate: value })
        e.target.className = "form-control"
        const age = Math.floor((new Date() - new Date(e.target.startDate.value)) / 1000 / 60 / 60 / 24 / 365.25)
        if (e.target.startDate.value === "") {
          this.setState({
            errorPhone: "Start date can not be blank"
          })
          e.target.className += " invalid"
        } else if (age <0) {
          this.setState({
            errorPhone: "Start date must be after current time"
          })
          e.target.className += " invalid"
        } else {
          e.target.className += " valid"
        }
        break;
      case "endDate":
      this.setState({ endDate: value})
      e.target.className="form-control"
      const ages = Math.floor((new Date(e.target.endDate.value) - new Date(e.target.startDate.value)) / 1000 / 60 / 60 / 24 / 365.25)
      if(e.target.endDate.value === ""){
        this.setState({
          errorEmail:"End date can not be blank"
        })
        e.target.className += " invalid"
      } else if (ages < 0){
        this.setState({
          errorEmail: "End date must be after Start date"
        })
        e.target.className +=" invalid"
      } else {
        e.target.className +=" valid"
      }
        break;
      default:
        break;
    }
  }

  render() {
    // const { classes } = this.props;
    // const { value } = this.state;
    // const options =    this.state.mentorList.map((value, key) => {
    //   return (<option key={key} value={value[1]}>{value[1]}</option>)
    // })
    this.state.courseList.map((value, key) => {
      return (<option key={key} value={value[1]}>{value[1]}</option>)
    })
    return (
      <React.Fragment>
        <Row>
          <Col md="12">
            <Card className="mt-5">

              <CardBody>
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
            // AddMentor, Edit table
          }
          <MDBModal
            isOpen={this.state.modalCourse}
            toggle={this.toggleCourse}
            size="md"
            cascading>

            <MDBModalBody>
            <input type="hidden" name="id" value={this.state.id} />
              <MDBInput fullwidth="true" size="" label="Course name" name="courseName" value={this.state.courseName} onChange={this.handleChangeValue.bind(this)} />
              <label>Start Date</label>
              <DatePickers
                label="Start Date"
                name="startDate"
                value={this.state.startDate}
                onChange={this.handleChangeValue.bind(this)}
              />
              <label>End Date</label>
              <DatePickers
                label="End Date"
                name="endDate"
                value={this.state.endDate}
                onChange={this.handleChangeValue.bind(this)}
              />
              <label>Mentor</label>
              {
                this.state.mentorList.map((mentor,index) => {
                  return (
                      <div key={index}>
                      <input type="checkbox" name="mentorID" value={mentor.ID} onChange={this.handleCheckChieldElement}/>
                      <span>{mentor.Name}</span>
                      </div>
                  )
                })
              }
              <div className="text-center mt-1-half">
                {
                  this.state.isUpdate === false &&
                  <MDBBtn
                    className="mb-2 blue darken-2"
                    onClick={this.handlerAddCourse}
                  >
                    Create
                  <MDBIcon icon="send" className="ml-1" />
                  </MDBBtn>
                }
                {
                  this.state.isUpdate &&


                  <MDBBtn
                    className="mb-2 blue darken-2"
                    onClick={this.handlerAddCourse}>
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
                    >
                    <Link to={`/course/${this.state.id}`} >Detail</Link>
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
export default withStyles(styles)(CoursePages);