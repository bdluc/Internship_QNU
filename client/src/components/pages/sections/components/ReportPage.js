import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'; //npm install --save react-tabs
import "react-tabs/style/react-tabs.css";
import './report.css';
import $ from 'jquery';
import MUIDataTable from "mui-datatables";
import {
  createBrowserHistory
} from 'history';

class ReportPage extends React.Component {

    constructor(props) {
        super(props);
        var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var date = new Date();
        var strDate = weekDays[date.getDay()] + ", " + months[date.getMonth()] + " " + this.getDate(date.getDate()) + ", " + date.getFullYear();
        this.state = {
            traineeId: JSON.parse(sessionStorage.getItem('user')),
            currentDate: strDate,
            textSubject: "",
            textBody: "",
            fileUpload : "",
            showSuccess: false,
            showWarning: false,
            showError: false,
            disableButton: false,
            historyList : [],
        };
    }

    onSubjectChange(event) {
        this.setState({textSubject: event.target.value});
    }
    onSubjectBlur(event) {
        this.setState({textSubject: event.target.value});
    }

    onBodyChange(event) {
        this.setState({textBody: event.target.value});
    }
    onFileChange(event){
        this.setState({fileUpload: event.target.files[0]})
    }
    onDateChange(event){
        this.setState({dateAbsent: event.target.value})
    }
    handleSubmit(event) {     
        this.resetAlerts();
        if(this.state.textSubject === "" || this.state.textBody === ""){
            this.setState({showWarning: true});
        } else {
            var data = {
                subject : document.getElementById("subject").value,
                body : document.getElementById("body").value
            };
   
            this.setState({disableButton: true});

            $.ajax({
                url: "http://localhost:8080/intern/" + this.state.traineeId.ID +"/report",
                type: "POST",
                data: JSON.stringify(data),
                success: function (response) {
                    if (response.status === "Success") {
                        this.setState({showSuccess: true});
                    } else {
                        this.setState({showError: true});
                    }
                    this.setState({disableButton: false});
                }.bind(this),
                error: function (xhr, status) {
                    this.setState({showError: true});
                    this.setState({disableButton: false});
                }.bind(this)
            });

        }
        event.preventDefault();
    }
    handleAbsent(event){
        event.preventDefault();
        var moment = require('moment');
        let dateAbsent = moment.utc(document.getElementById("date").value).format();
        if(this.state.textSubject === "" || !this.state.dateAbsent){
            this.setState({showWarning: true});
        } else {
            var data = {
                "Message" : document.getElementById("subject").value,
                "Date" : dateAbsent,
                "InternID" : this.state.traineeId.ID,
                "Status" : 1,
                "IsDeleted" : false
            };
            this.setState({disableButton: true});
            fetch("http://localhost:8080/absent",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(data),
            })
            .then(response => {
                 if (response.status === 201) {
                    this.setState({showSuccess: true});
                } else {
                    this.setState({showError: true});
                }
                this.setState({disableButton: false});
            });
        }
    }
    handleSendFile(event){
        event.preventDefault();
        this.resetAlerts();
        this.uploadFile(this.state.fileUpload);
        
    }
    componentDidMount(){
        this.GetHistoryList();
    }
    uploadFile(file){
        if(file === "" ){
            this.setState({showWarning: true});
        } else {
            let formData = new FormData();
            formData.append('file', file);            
            this.setState({disableButton: true});
            fetch("http://localhost:8080/intern/" + this.state.traineeId.ID +"/reportweek",
            {
              method: "POST",
              body: formData
            })
            .then(response => {
                 if (response.status === 200) {
                    this.setState({showSuccess: true});
                } else {
                    this.setState({showError: true});
                }
                this.setState({disableButton: false});
            });
        }
    }
    resetAlerts(){
        this.setState({showSuccess: false});
        this.setState({showWarning: false});
        this.setState({showError: false});
    }
    
    getDate(day) {
        switch(day) {
            case 1:
            case 21:
            case 31:
                return day.toString() + "st";
            case 2:
            case 22:
                return day.toString() + "nd";
            case 3:
            case 23:
                return day.toString() + "rd";
            default:
                return day.toString() + "th";
        }
    }
    GetHistoryList(){
        const history = createBrowserHistory();
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        fetch('http://localhost:8080/intern/'+this.state.traineeId.ID+'/historyabsent')
        .then(response => {
            if (!response.ok) {
            history.push({ pathname: '/404' })
            } else {
            response.json()
                .then(result => {
                let NewData = []
                let cnt = 1
                result.map(row => {
                    NewData.push([cnt,row.InternName, (new Date(row.Date)).toLocaleDateString('en-US', options),
                    row.Status])
                    cnt++
                    return NewData
                })
                this.setState({
                    historyList: NewData,
                })
                });
            }
        })
    }
    columnsHeader = [
        {
          name: "#",
          options: {
            filter: false,
            sort: true,
          }
        },
        {
          name: "Name",
          options: {
            filter: true,
            sort: false,
          }
        },
        {
          name: "Date",
          options: {
            filter: false,
            sort: false,
          }
        },
        {
          name: "Status",
          options: {
            filter: false,
            sort: false,
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
      }
    render() {
        return (
            <div>
                {this.state.showSuccess ?
                <div className="alert alert-success">
                    Report sent successfully.
                </div> : null}
                {this.state.showWarning ?
                <div className="alert alert-warning custom-border">
                    You must fulfill subject and body.
                </div> : null}
                {this.state.showError ?
                <div className="alert alert-danger">
                    Send report failed.
                </div> : null}
                <div className="card mt-6">
                    <div className="col-example">
                        <h5 className="custom-margin">Report on <b>{this.state.currentDate}</b></h5>
                    </div>
                    <div className="card-body">  
                    <Tabs>
                        <TabList>
                            <Tab>Report per day</Tab>
                            <Tab>Report per week</Tab>
                            <Tab>Ask for permission absent</Tab>
                            <Tab>Absent history</Tab>
                        </TabList>
                        <TabPanel>
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="subject"><b>Subject</b></label>
                                <input type="text" id="subject" name="subject" className="form-control" value={this.state.textSubject} placeholder="YourName - ReportDate"
                                 onChange={this.onSubjectChange.bind(this)}
                                 onBlur={this.onSubjectBlur.bind(this)}/>
                            </div>
                            <hr/>
                            <div className="form-group">
                                <label htmlFor="body"><b>Body</b></label>
                                <textarea spellCheck="false" className="form-control" id="body" name="body" rows="5" value={this.state.textBody} onChange={this.onBodyChange.bind(this)}/>
                            </div>
                            <hr/>
                            <input type="submit" id="submit" className="btn btn-primary" value="Submit" disabled={this.state.disableButton}/>
                        </form>
                        </TabPanel>
                        <TabPanel>
                        <form onSubmit={this.handleSendFile.bind(this)} encType="multipart/form-data">
                            <div className="form-group">
                                <label htmlFor="file"><b>Choose your report file</b></label>
                                <input type="file" id="file" name="file" className="form-control" 
                                 onChange={this.onFileChange.bind(this)}
                                />
                            </div>
                            <hr/>
                            <input type="submit" id="submit" className="btn btn-primary" value="Send report" disabled={this.state.disableButton}/>
                        </form>
                        </TabPanel>
                        <TabPanel>
                        <form onSubmit={this.handleAbsent.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="subject"><b>Reason</b></label>
                                <input type="text" id="subject" name="subject" className="form-control" value={this.state.textSubject} placeholder="Your reason"
                                 onChange={this.onSubjectChange.bind(this)}
                                 onBlur={this.onSubjectBlur.bind(this)}/>
                            </div>
                            <hr/>
                            <div className="form-group">
                                <label htmlFor="date"><b>Date absent</b></label>
                                <input type="date" id="date" name="date" className="form-control" value={this.state.dateAbsent}
                                 onChange={this.onDateChange.bind(this)}
                                />
                            </div>
                            <hr/>
                            <input type="submit" id="submit" className="btn btn-primary" value="Submit" disabled={this.state.disableButton}/>
                        </form>
                        </TabPanel>
                        <TabPanel>
                            
                        <MUIDataTable
                            data={this.state.historyList}
                            columns={this.columnsHeader}
                            options={this.options} />
                        </TabPanel>                     
                    </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

export default ReportPage;