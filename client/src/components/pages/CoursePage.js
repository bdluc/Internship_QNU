import React from 'react'
// import ReactToExcel from 'react-html-table-to-excel'
import { Row, Col, View, Card, CardBody, MDBIcon, MDBBtn ,MDBModal, MDBModalHeader,
  MDBModalBody,MDBInput } from 'mdbreact';
import MUIDataTable from "mui-datatables"; 
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory
} from 'history';

class CoursePage extends React.Component {
  constructor(){
    super();
    this.state = {
      courseName:"",
      startDateCourse: "",
      endDateCourse: "",
      detailList: [],
      mentorList: [],
      mentorNameList:[],
      user : JSON.parse(sessionStorage.getItem('user')),
      isIntern : false
    };
    
  }

  // Get data of course from DB
  GetCourse(id){
    const history = createBrowserHistory();
    const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric' };
    fetch('http://localhost:8080/course/'+id)
      .then(response =>  {
        console.log(id)
        if(!response.ok){
          history.push({ pathname: '/404' })
        }else {
          response.json()
          .then(result => {
            let DetailSchedule = []
            let cnt = 0
            result.Detail.map(row => {
              DetailSchedule.push([cnt, row.TrainingOutline, row.Content, row.DurationPlan, row.DurationActual, row.Objectives, row.TrainingMethod,
              (new Date(row.StartDate)).toLocaleDateString('en-US', DATE_OPTIONS), (new Date(row.EndDate)).toLocaleDateString('en-US', DATE_OPTIONS),
              row.Progress, row.Note])
              cnt++
              return DetailSchedule
            })
            this.setState({
              courseName : result.CourseName,
              // Format date time
              startDateCourse : (new Date(result.StartDate)).toLocaleDateString('en-US', DATE_OPTIONS),
              endDateCourse : (new Date(result.EndDate)).toLocaleDateString('en-US', DATE_OPTIONS),
              detailList : DetailSchedule,
              mentorList : result.MentorID,
          })
        });
        }}
      )
      
  }

  // Show modal popup to edit data
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  // Handle when change value in textbox
  handleChangeValue(e){
    const {name , value} = e.target;
    e.target.className = "form-control"
    switch (name) {
      case "trainingoutline":
        this.setState({trainingOutline: value})
        break;
      case "content":
        this.setState({content: value})
        break;
      case "durationplan":
        this.setState({durationPlan: value})
        break;
      case "durationactual":
        this.setState({durationActual: value})
        break;
      case "objectives":
        this.setState({objectives: value})
        break;
      case "trainingmethod":
        this.setState({trainingMethod:value})
        break;
      case "startdate":
        this.setState({startDate: value})
        break;
      case "enddate":
        this.setState({endDate: value})
        break;
      case "progress":
        this.setState({progress: value})
        break;
      case "note":
        this.setState({note: value})
        break;
      default:
        break;
    }
  }

  // Value of header
  columnsHeader = [
    {
      name: "No",
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
      }
     },
     {
      name: "Note",
      options: {
       filter: true,
       sort: false, 
      }
     },
  ]
  
  // Option of table (search, filter, ...)
  options = {
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
    // Handle when click on row in table data
    
    onRowClick: (rowData, rowState) => {
        this.setState({
          cnt: rowData[0],
          trainingOutline : rowData[1],
          content : rowData[2],
          durationPlan : rowData[3],
          durationActual : rowData[4],
          objectives : rowData[5],
          trainingMethod : rowData[6],
          startDate : rowData[7],
          endDate : rowData[8],
          progress : rowData[9],
          note : rowData[10],
          title : "EDIT INFORMATION",
          icon : "edit",
          isUpdate : true,
        });
      if (this.state.isIntern === false){
        this.toggle()
      }
    }
  }
  componentDidMount() {
    
  }
  componentWillMount(){
    this.handlerListMentor()
    this.checkRole()
    const { match: { params } } = this.props
    this.GetCourse(params.id)
  }
  handlerListMentor() {
    fetch('http://localhost:8080/mentors')
    .then(response => response.json())
      .then(result => {
        let ml = []
        result.map(row => {
          return ml.push( {ID : row.ID , Name : row.Name})
        })
        this.setState({
          mentorNameList : ml
        })
      });
  }

  addDetailCourse = () => {
    this.setState({
      trainingOutline : "",
      content : "",
      durationPlan : "",
      durationActual : "",
      objectives : "",
      trainingMethod : "",
      startDate : "",
      endDate : "",
      progress : "",
      note : "",
      title : "ADD INFORMATION",
      icon : "plus",
      isUpdate : false
    });
    this.toggle()
  }

  handlerAddCourse = (e) => {
    e.preventDefault();
    
    const { match: { params } } = this.props
    let ds = new Date(this.state.startDate+"T01:00:00+07:00")
    let de = new Date(this.state.endDate+"T01:00:00+07:00")
    const data = {
      "TrainingOutline" : this.state.trainingOutline,
      "Content" : this.state.content,
      "DurationPlan" : this.state.durationPlan,
      "DurationActual" : this.state.durationActual,
      "Objectives" : this.state.objectives,
      "TrainingMethod" : this.state.trainingMethod,
      "StartDate": ds,
      "EndDate": de,
      "Progress": this.state.progress,
      "Note": this.state.note
    }
    fetch("http://localhost:8080/coursedetailindex/"+params.id,
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

  handlerUpdate = (e) =>{
    e.preventDefault();
    
    const { match: { params } } = this.props
    

    // const dts = this.state.startDate.split(/-|\s/)
    // const dte = this.state.endDate.split(/-|\s/)
    // let dates = new Date(dts[2], dts[1], dts[0])
    // let datee = new Date(dte[2], dte[1], dte[0])
    let ds = new Date(this.state.startDate+"T01:00:00+07:00")
    let de = new Date(this.state.endDate+"T01:00:00+07:00")

    const data = {
      "TrainingOutline" : this.state.trainingOutline,
      "Content" : this.state.content,
      "DurationPlan" : this.state.durationPlan,
      "DurationActual" : this.state.durationActual,
      "Objectives" : this.state.objectives,
      "TrainingMethod" : this.state.trainingMethod,
      "StartDate": ds,
      "EndDate": de,
      "Progress": this.state.progress,
      "Note": this.state.note
    }
    fetch("http://localhost:8080/coursedetailupdate/"+params.id+"/"+ this.state.cnt,
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
    fetch("http://localhost:8080/coursedetailindex/" + params.id+"/"+this.state.cnt, {
      method: 'DELETE',
      mode: 'cors'
    })
      .then(this.GetCourse(params.id))
    this.toggle()
  }

  checkRole() {
    if( this.state.user.Role === 1) {
      this.setState ({
        isIntern : true
      })
    }
  }

  render(){
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
                return this.state.mentorNameList.map(function(element,index){
                  if (mentor === element.ID) 
                    return <div key={index}  className="text-center">{element.Name}</div>
                })
               })
            }
            <MUIDataTable
              title={"Schedule Training"}
              data={this.state.detailList}
              columns={this.columnsHeader}
              options={this.options}/>  
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
            <form onSubmit={this.handlerUpdate} noValidate>
            <MDBModalBody>
              <MDBInput label="Training Outline" icon="subway" name="trainingoutline" value={this.state.trainingOutline} onChange={this.handleChangeValue.bind(this)}/>
              <MDBInput label="Content" icon="clipboard" name="content" value={this.state.content} onChange={this.handleChangeValue.bind(this)}/>
              <MDBInput label="Duration Plan" icon="clock-o" name="durationplan" value={this.state.durationPlan} onChange={this.handleChangeValue.bind(this)}/>
              <MDBInput label="Duration Actual" icon="clock-o" name="durationactual" value={this.state.durationActual} onChange={this.handleChangeValue.bind(this)}/>
              <MDBInput label="Objectives" icon="paper-plane" name="objectives" value={this.state.objectives} onChange={this.handleChangeValue.bind(this)}/>
              <MDBInput label="Training Method" icon="suitcase" name="trainingmethod" value={this.state.trainingMethod} onChange={this.handleChangeValue.bind(this)}/>
              <MDBInput label="Start Date" icon="calendar" iconClass="dark-grey" name="startdate" value={this.state.startDate} onChange={this.handleChangeValue.bind(this)}/>
              <MDBInput label="End Date" icon="calendar" name="enddate" value={this.state.endDate} onChange={this.handleChangeValue.bind(this)}/>
              <MDBInput label="Progress" icon="battery-1" name="progress" value={this.state.progress} onChange={this.handleChangeValue.bind(this)}/>
              <MDBInput label="Note" icon="address-book" name="note" value={this.state.note} onChange={this.handleChangeValue.bind(this)}/>
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
                  type="submit"
                  >
                  send
                  <MDBIcon icon="send" className="ml-1"/>
                </MDBBtn>
              }
                {
                  this.state.isUpdate &&
                  <MDBBtn
                  className="mb-2 blue darken-2"
                  onClick={this.handlerDelete}>
                  delete
                  <MDBIcon icon="trash" className="ml-1"/>
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