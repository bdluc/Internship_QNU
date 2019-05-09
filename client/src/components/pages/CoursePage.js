import React from 'react'
// import ReactToExcel from 'react-html-table-to-excel'
import {
  Row, Col, View, Card, CardBody, MDBIcon, MDBBtn, MDBModal, MDBModalHeader,
  MDBModalBody, MDBInput
} from 'mdbreact';
import MUIDataTable from "mui-datatables";
import {
  createBrowserHistory,
} from 'history';


class CoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseName: "",
      startDateCourse: "",
      endDateCourse: "",
      detailList: [],
      mentorList: [],
      mentorNameList: [],
      objectvalid : "",
      traniningvalid : "",
      progressvalid : "",
      notevalid : "",
      user: JSON.parse(sessionStorage.getItem('user')),
    };

  }
  static defaultProps = {
    showConditionalColumn: true
  }
  // Get data of course from DB
  GetCourse(id) {
    const history = createBrowserHistory();
    const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric' };
    fetch('http://localhost:8080/course/' + id)
      .then(response => {
        if (!response.ok) {
          history.push({ pathname: '/404' })
        } else {
          response.json()
            .then(result => {
              let DetailSchedule = []
              let cnt = 0;
        
              result.Detail.map(row => {
                DetailSchedule.push([cnt, row.TrainingOutline, row.Content, row.DurationPlan, row.DurationActual, row.Objectives, row.TrainingMethod,
                  (new Date(row.StartDate)).toLocaleDateString('en-US', DATE_OPTIONS), (new Date(row.EndDate)).toLocaleDateString('en-US', DATE_OPTIONS),
                  row.Progress, row.Note])
                cnt++
                return DetailSchedule
              })
              
              this.setState({
                courseName: result.CourseName,
                // Format date time
                startDateCourse: (new Date(result.StartDate)).toLocaleDateString('en-US', DATE_OPTIONS),
                endDateCourse: (new Date(result.EndDate)).toLocaleDateString('en-US', DATE_OPTIONS),
                detailList: DetailSchedule,
                mentorList: result.MentorID,
              })
            });
        }
      }
      )

  }
  // Show modal popup to edit data
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  // Handle when change value in textbox
  handleChangeValue = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value },
      () => { this.validateField(name, value) });
  }
  validateField(name, value) {
    switch (name) {
      case "trainingOutline":
        var trainingOutlineValid = 0;
        if (value === "") {
          trainingOutlineValid = 1; // value null
        } else {
          trainingOutlineValid = 0;
        }
        this.setState({
          trainingOutlineValid: trainingOutlineValid
        })
        break;
      case "content":
        var contentValid = 0;
        if (value === "") {
          contentValid = 1; // value null
        } else {
          contentValid = 0;
        }
        this.setState({
          contentValid: contentValid
        })
        break;
      case "durationPlan":
        var dplanvalid = 0;
        const re = /^[0-9\b]+$/ ;
        if (value === "") {
          dplanvalid = 1; // value null
        } else {
          if(!re.test(value)) {
            dplanvalid = 2; //value's not match number type
          }else {
          dplanvalid = 0;
          }
        }
        this.setState({
          dplanvalid: dplanvalid
        })
        break;
      case "durationActual":
        var dactualvalid = 0;
        const vali = /^[0-9\b]+$/ ;
        if (value === "") {
          dactualvalid = 1; // value null
        } else {
          if(!vali.test(value)) {
            dactualvalid = 2; //value's not match number type
          }else {
          dactualvalid = 0;
          }
        }
        this.setState({
          dactualvalid: dactualvalid
        })
        break;
      case "startDate":
        var stdvalid = 0;
        var etdvalid = 0;
        const sdCourse = new Date(new Date(this.state.startDateCourse).toLocaleString()).getTime();
        const edCourse = new Date(new Date(this.state.endDateCourse).toLocaleString()).getTime();
        const vl = new Date(new Date(value).toLocaleString()).getTime();
        if (value === "") {
          stdvalid = 1 // value undefined
        } else {
          if ((sdCourse - vl) > 0) {
            stdvalid = 2; // value not after course's startdate
          } else {
            if ((edCourse - vl) <= 0) {
              stdvalid = 3; // value not before course's enddate
            } else {
              stdvalid = 0;
            }
          }
        }
        if (this.state.endDate === "") {
          etdvalid = 1 // end date undefine
        } else {
          var edNumber2 = new Date(new Date(this.state.endDate).toLocaleString()).getTime();
          var nurse = edNumber2 - vl;
          if (nurse > 0) {
            etdvalid = 0
          } else {
            etdvalid = 2 // end date is not before start date
          }
        }
        this.setState({
          stdvalid: stdvalid,
          etdvalid: etdvalid
        })
        break;
      case "endDate":
        etdvalid = 0;
        const eCourse = new Date(new Date(this.state.endDateCourse).toLocaleString()).getTime();
        const vle = new Date(new Date(value).toLocaleString()).getTime();
        var std = new Date(new Date(this.state.startDate).toLocaleString()).getTime();
        if ((vle - std) <= 0) {
          etdvalid = 2 // end date is not after startdate
        } else {
          if ((eCourse - vle) < 0) {
            etdvalid = 3 // end date is not before course's endate
          } else {
            etdvalid = 0
          }
        }
        this.setState({
          etdvalid: etdvalid
        })
        break;
    }
    // this.setState({
    //   trainingOutlineValid : trainingOutlineValid,
    //   contentValid : contentValid,
    //   dplanvalid : dplanvalid,
    //   dactualvalid : dactualvalid,
    //   stdvalid : stdvalid,
    //   etdvalid : etdvalid
    // })
  }
  // Value of header
  columnsHeader = [
    {
      name: "No.",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "Training Outline",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "Content",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "Duration Plan",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "Duration Actual",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "Objectives",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "Training Method",
      options: {
        filter: true,
        sort: false,
        display: "true",
      }
    },
    {
      name: "Start Date",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "End Date",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "Progress",
      options: {
        filter: true,
        sort: false,
        display : "true",
      }
    },
    {
      name: "Note",
      options: {
        filter: true,
        sort: false,
        display : "true",
      }
    },
  ]

  // Option of table (search, filter, ...)
  options = {
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
    // Handle when click on row in table data

    onRowClick: (rowData, rowState) => {
      let std = this.convertDate(rowData[7])
      let etd = this.convertDate(rowData[8])
      this.setState({
        cnt: rowData[0],
        trainingOutline: rowData[1],
        content: rowData[2],
        durationPlan: rowData[3],
        durationActual: rowData[4],
        objectives: rowData[5],
        trainingMethod: rowData[6],
        startDate: std,
        endDate: etd,
        progress: rowData[9],
        note: rowData[10],
        title: "EDIT INFORMATION",
        icon: "edit",
        isUpdate: true,
      });
     
        this.toggle()
    
    }
  }
  convertDate(rowData) {
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
    return strYea + "-" + strMon + "-" + strDate
  }
  componentDidMount() {
  }
  componentWillMount() {
    this.handlerListMentor()
    const { match: { params } } = this.props
    this.GetCourse(params.id)
  }
  handlerListMentor() {
    fetch('http://localhost:8080/mentors')
      .then(response => response.json())
      .then(result => {
        let ml = []
        result.map(row => {
          return ml.push({ ID: row.ID, Name: row.Name })
        })
        this.setState({
          mentorNameList: ml
        })
      });
  }

  addDetailCourse = () => {
    this.setState({
      trainingOutline: "",
      content: "",
      durationPlan: "",
      durationActual: "",
      objectives: "",
      trainingMethod: "",
      startDate: "",
      endDate: "",
      progress: "",
      note: "",
      title: "ADD INFORMATION",
      icon: "plus",
      isUpdate: false
    });
    this.toggle()
  }

  handlerAddCourse = (e) => {
    e.preventDefault();

    const { match: { params } } = this.props

    var moment = require('moment');
    const std = moment.utc(this.state.startDate).format(); //=> "2013-10-06T00:00:00+00:00"
    const etd = moment.utc(this.state.endDate).format();

    const data = {
      "TrainingOutline": this.state.trainingOutline,
      "Content": this.state.content,
      "DurationPlan": this.state.durationPlan,
      "DurationActual": this.state.durationActual,
      "Objectives": this.state.objectives,
      "TrainingMethod": this.state.trainingMethod,
      "StartDate": std,
      "EndDate": etd,
      "Progress": this.state.progress,
      "Note": this.state.note
    }
    fetch("http://localhost:8080/coursedetailindex/" + params.id,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(this.GetCourse(params.id))
    this.toggle()

  }

  handlerUpdate = (e) => {
    e.preventDefault();

    const { match: { params } } = this.props
    var moment = require('moment');
    const std = moment.utc(this.state.startDate).format(); //=> "2013-10-06T00:00:00+00:00"
    const etd = moment.utc(this.state.endDate).format();
    const data = {
      "TrainingOutline": this.state.trainingOutline,
      "Content": this.state.content,
      "DurationPlan": this.state.durationPlan,
      "DurationActual": this.state.durationActual,
      "Objectives": this.state.objectives,
      "TrainingMethod": this.state.trainingMethod,
      "StartDate": std,
      "EndDate": etd,
      "Progress": this.state.progress,
      "Note": this.state.note
    }
    fetch("http://localhost:8080/coursedetailupdate/" + params.id + "/" + this.state.cnt,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(this.GetCourse(params.id))
    this.toggle()
  }
  handlerDelete = () => {
    const { match: { params } } = this.props
    fetch("http://localhost:8080/coursedetailindex/" + params.id + "/" + this.state.cnt, {
      method: 'DELETE',
      mode: 'cors'
    })
      .then(this.GetCourse(params.id))
    this.toggle()
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col md="12">
            <Card className="mt-1">
              <View className="gradient-card-header blue darken-2">
                <h3 className="h3 text-white"><strong>Schedule Training</strong></h3>
              </View>
              <CardBody>
                {
                  this.state.isIntern === false &&
                  <MDBBtn
                    className="mb-3 blue darken-2"
                    onClick={this.addDetailCourse}>
                    Add
                     </MDBBtn>
                }
                <hr></hr>
                <h4 className="mt-2 text-center">Course Name: {this.state.courseName}</h4>
                <h5 className="text-center">From: {this.state.startDateCourse} To: {this.state.endDateCourse}</h5>
                <h5 className="text-center">Mentor:</h5>
                {
                  this.state.mentorList.map((mentor, dex) => {
                    return this.state.mentorNameList.map(function (element, index) {
                      if (mentor === element.ID)
                        return <div key={index} className="text-center">{element.Name}</div>
                    })
                  })
                }
                <MUIDataTable
                  title={"Schedule Training"}
                  data={this.state.detailList}
                  columns={this.columnsHeader}
                  options={this.options} />
                {/*Button to export data to excel file */}
                {/* <ReactToExcel 
              id="test-table-xls-button"
              className="btn_export"
              table="table_exe"
              filename="Schedule"
              sheet="Schedule"
              buttonText="EXPORT"
            /> */}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/*Handle show modal and load data into modal popup */}
        <MDBModal
          isOpen={this.state.modal}
          toggle={this.toggle}
          size="md"
          cascading>
          <MDBModalHeader
            toggle={this.toggle}
            titleClass="d-inline title"
            className="text-center light-blue darken-3 white-text">
            {/* <Fa><MDBIcon icon={this.state.icon} /></Fa> */}
            {this.state.title}
          </MDBModalHeader>
          <form>
            <MDBModalBody>
              <MDBInput label="Training Outline" icon="subway" name="trainingOutline" value={this.state.trainingOutline} onChange={this.handleChangeValue.bind(this)} />
              {
                this.state.trainingOutlineValid === 1 &&
                <div className="alert alert-danger custom-top"> Training outline must be not blank</div>
              }
              <MDBInput label="Content" icon="clipboard" name="content" value={this.state.content} onChange={this.handleChangeValue.bind(this)} />
              {
                this.state.contentValid === 1 &&
                <div className="alert alert-danger custom-top"> Content must be not blank</div>
              }
              <MDBInput label="Duration Plan" icon="clock-o" name="durationPlan" value={this.state.durationPlan} onChange={this.handleChangeValue.bind(this)} />
              {
                this.state.dplanvalid === 1 &&
                <div className="alert alert-danger custom-top"> Duration Plan must be not blank</div>
              }
              {/* {
                  this.state.dplanvalid === 2 &&
                  <div className="alert alert-danger custom-top"> Duration Plan must be number</div>
              } */}
              <MDBInput label="Duration Actual" icon="clock-o" name="durationActual" value={this.state.durationActual} onChange={this.handleChangeValue.bind(this)} />
              {
                this.state.dactualvalid === 1 &&
                <div className="alert alert-danger custom-top"> Duration Actual must be not blank</div>
              }
              {/* {
                  this.state.dactualvalid === 2 &&
                  <div className="alert alert-danger custom-top"> Duration Actual must be number</div>
              } */}
              <MDBInput label="Objectives" icon="paper-plane" name="objectives" value={this.state.objectives} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput label="Training Method" icon="suitcase" name="trainingmethod" value={this.state.trainingMethod} onChange={this.handleChangeValue.bind(this)} />
              {/* <MDBInput label="Start Date" icon="calendar" iconClass="dark-grey" name="startdate" value={this.state.startDate} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput label="End Date" icon="calendar" name="enddate" value={this.state.endDate} onChange={this.handleChangeValue.bind(this)} /> */}
              <label>Start Date</label>
              <input type="date" className="form-control" name="startDate" value={this.state.startDate} onChange={this.handleChangeValue.bind(this)} />
              {
                this.state.stdvalid === 1 &&
                <div className="alert alert-danger custom-top"> Start date is undefined</div>
              }
              {
                this.state.stdvalid === 2 &&
                <div className="alert alert-danger custom-top"> Start date must be not before Course's StartDate</div>
              }
              {
                this.state.stdvalid === 3 &&
                <div className="alert alert-danger custom-top"> Start date must be not after Course's EndDate</div>
              }
              <label>End Date</label>
              <input type="date" className="form-control" name="endDate" value={this.state.endDate} onChange={this.handleChangeValue.bind(this)} />
              {
                this.state.etdvalid === 1 &&
                <div className="alert alert-danger custom-top"> End date is undefined</div>
              }
              {
                this.state.etdvalid === 2 &&
                <div className="alert alert-danger custom-top"> End date must be after StartDate</div>
              }
              {
                this.state.etdvalid === 3 &&
                <div className="alert alert-danger custom-top"> End date must be not after Course's EndDate</div>
              }
              <MDBInput label="Progress" icon="battery-1" name="progress" value={this.state.progress} onChange={this.handleChangeValue.bind(this)} />
              <MDBInput label="Note" icon="address-book" name="note" value={this.state.note} onChange={this.handleChangeValue.bind(this)} />
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
                    onClick={this.handlerUpdate}
                  >
                    send
                  <MDBIcon icon="send" className="ml-1" />
                  </MDBBtn>
                }
                {
                  this.state.isUpdate &&
                  <MDBBtn
                    className="mb-2 blue darken-2"
                    onClick={this.handlerDelete}>
                    delete
                  <MDBIcon icon="trash" className="ml-1" />
                  </MDBBtn>
                }
              </div>
            </MDBModalBody>
          </form>
        </MDBModal>
      </React.Fragment>
    )
  }


}

export default CoursePage;