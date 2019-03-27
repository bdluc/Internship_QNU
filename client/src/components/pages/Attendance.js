import React from 'react';
import './attendance.css';
import Table from './components/mentor/Table'
import BarChart from './components/BarChart'
import $ from 'jquery';

//https://github.com/patientslikeme/react-calendar-heatmap


class AttendancePage extends React.Component {

  constructor(props) {
        super(props);   
        this.state = {
            mentorId: "",
            traineesData: [],
            tableData: [],
            chartData: [],
            months: [],
            currentMonth: "",
            currentStudentId: "",
            rightArrowClass: "fa fa-chevron-right",
            leftArrowClass: "fa fa-chevron-left",
            showChart: false,
            showSuccess: false,
            showError: false,
            showData: true
        };
        this.getStudents();
  }

  getStudents() {
    $.ajax({
        url: "http://localhost:8080/attendance/" + "5c9998a7ba3c261ba46034c1" +"/mentor",
        type: "GET",
        success: function (response) {
            // var arr = []
            // for (var i = 0; i < response.length; i++) {
            //     arr.push({
            //         "Name": response[i].Name,
            //         "Id": response[i].Id,
            //         "Data": [],
            //         "months": [],
            //         "startDate": "",
            //         "endDate": ""
            //     });
            // }
            this.setState({traineesData: response, currentStudentId: response[0].Id});
            //this.getAttendancesData();
        }.bind(this),
        error: function (xhr, status) {
            this.setState({showData: false});
        }.bind(this)
    });
}

  onSelectChange(event) {

  }

  onSelectStudentChange(event){

  }

  onLeftArrowHover(){
    this.setState ({leftArrowClass: "fa fa-chevron-left arrow-hover"});
  }

  onLeftArrowDeHover() {
      this.setState ({leftArrowClass: "fa fa-chevron-left"});
  }

  onLeftArrowClick() {
    // var index = this.state.months.indexOf(this.state.currentMonth);
    // if (index - 1 < 0){
    //     this.setState({
    //         currentMonth: this.state.months[this.state.months.length - 1],
    //         tableData: this.loadMonthData(this.state.currentStudentId, this.state.months[this.state.months.length - 1], "table"),
    //         chartData: this.loadMonthData(this.state.currentStudentId, this.state.months[this.state.months.length - 1], "chart")
    //     });
    // } else {
    //     this.setState({
    //         currentMonth: this.state.months[index-1],
    //         tableData: this.loadMonthData(this.state.currentStudentId, this.state.months[index - 1], "table"),
    //         chartData: this.loadMonthData(this.state.currentStudentId, this.state.months[index - 1], "chart")
    //     });
    // }
    // this.setState({showSuccess: false, showError: false});
  }

  onRightArrowHover() {
    this.setState ({rightArrowClass: "fa fa-chevron-right arrow-hover"});
  }

  onRightArrowDeHover() {
    this.setState ({rightArrowClass: "fa fa-chevron-right"});
  }

  onRightArrowClick() {
    // var index = this.state.months.indexOf(this.state.currentMonth);
    // if (index + 1 >= this.state.months.length){
    //     this.setState({
    //         currentMonth: this.state.months[0],
    //         tableData: this.loadMonthData(this.state.currentStudentId, this.state.months[0], "table"),
    //         chartData: this.loadMonthData(this.state.currentStudentId, this.state.months[0], "chart")
    //     });
    // } else {
    //     this.setState({
    //         currentMonth: this.state.months[index + 1],
    //         tableData: this.loadMonthData(this.state.currentStudentId, this.state.months[index + 1], "table"),
    //         chartData: this.loadMonthData(this.state.currentStudentId, this.state.months[index + 1], "chart")
    //     });
    // }
    // this.setState({showSuccess: false, showError: false});
  }

  handleCellChange(value) {

  }


  createEmptyRow() {
    var rowData = [];
    for(var i = 0; i < 7; i++){
        rowData.push({
            date: "",
            attendance: "N.A",
            weekDay: this.getWeekDay(i)
        });
    }
    return rowData;
  }

  getWeekDay(num) {
      var weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return weekDays[num];
  }

  getStudentById(id) {
      for (var i = 0; i < this.state.traineesData.length; i++) {
          if (this.state.traineesData[i].Id === id) {
              return this.state.traineesData[i];
          }
      }

      return null;
  }

  getStudentByName(name) {
      for (var i = 0; i < this.state.traineesData.length; i++) {
          if (this.state.traineesData[i].Name === name) {
              return this.state.traineesData[i];
          }
      }

      return null;
  }

  createMonthsData(startDate, endDate) {
    var startMonth, startYear, endMonth, endYear;
    startMonth = this.getMonth(startDate);
    startYear = this.getYear(startDate);
    endMonth = this.getMonth(endDate);
    endYear = this.getYear(endDate);

    var arr = [];
    if (startYear === endYear) {           
        for (var i = startMonth; i <= endMonth; i++) {
            var strMonth = this.getMonthString(i) + " " + startYear.toString();
            arr.push(strMonth);
        }
    } else {
        for (var i = startMonth; i <= 12; i++) {
            var strMonth = this.getMonthString(i) + " " + startYear.toString();
            arr.push(strMonth);
        }
        for (var i = 1; i <= endMonth; i++) {
            var strMonth = this.getMonthString(i) + " " + endYear.toString();
            arr.push(strMonth);
        }
    }

    return arr;
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

  getMonthString(iMonth) {
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      if (!(iMonth >= 1 && iMonth <= 12)) {
          return "";
      }
      return months[iMonth - 1];
  }

  render() {
    return (
        <div>
            {!this.state.showData ?
            <div className="alert alert-danger">
                Couldn't load data.
            </div> : null}
            {this.state.showData ?
            <div>
                <div>
                    <select className="browser-default custom-select custom-dropdown" onChange={this.onSelectChange.bind(this)}>      
                        <option>Calendar</option>
                        <option>Chart</option>         
                    </select>
                    <select className="browser-default custom-select custom-dropdown custom-margin" onChange={this.onSelectStudentChange.bind(this)}>      
                        {this.state.traineesData.map(function(data, index){
                            return <option key={index} value={data.Name}>{data.Name}</option>;
                        })}      
                    </select>
                </div>
                <div className="center custom-table-header">
                    <div className="left-arrow">
                        <i className={this.state.leftArrowClass} aria-hidden="true" id="arrow-left"
                        onMouseOver={this.onLeftArrowHover.bind(this)}
                        onMouseOut={this.onLeftArrowDeHover.bind(this)}
                        onClick={this.onLeftArrowClick.bind(this)}></i>
                    </div>
                    <span className="month-header" id="month-header" ref="monthHeader">{this.state.currentMonth}</span>
                    <div className="right-arrow">
                        <i className={this.state.rightArrowClass} aria-hidden="true" id="arrow-right" 
                        onMouseOver={this.onRightArrowHover.bind(this)}
                        onMouseOut={this.onRightArrowDeHover.bind(this)}
                        onClick={this.onRightArrowClick.bind(this)}></i>
                    </div>
                </div>
                {!this.state.showChart ? 
                <div className="card mt-6">
                    <div className="card-body">
                        <Table tableData={this.state.tableData} text={this.state.currentMonth} onCellChange={this.handleCellChange.bind(this)}/>
                    </div>
                </div> : null}       
                {this.state.showChart ? 
                <div className="card mt-6">
                    <div className="card-body"> 
                        <BarChart arr={this.state.chartData}/> 
                    </div>
                </div> : null}
                {this.state.showSuccess ?
                <div className="alert alert-success custom-top">
                    Update attendance successfully.
                </div> : null}
                {this.state.showError ?
                <div className="alert alert-danger custom-top">
                    Update attendance failed.
                </div> : null}
            </div> : null}
        </div>
    );
  }
}

export default AttendancePage;