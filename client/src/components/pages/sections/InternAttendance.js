import React from 'react';
import '../attendance.css';
import Table from '../components/intern/Table'
import BarChart from '../components/BarChart'
import $ from 'jquery';
import {SERVER_NAME} from "../../../Constants"

class MentorAttendance extends React.Component {

  constructor(props) {
        super(props);   
        this.state = {
            internId: JSON.parse(sessionStorage.getItem('user')).ID,
            traineeData: null,
            tableData: [],
            chartData: [],
            currentMonth: "",
            rightArrowClass: "fa fa-chevron-right",
            leftArrowClass: "fa fa-chevron-left",
            showChart: false,
            showSuccess: false,
            showError: false,
            showData: true,
            now: null
        };
        
  }
  
  componentWillMount(){
    this.getIntern();
  }

  getIntern() {
    $.ajax({
        url: SERVER_NAME + "attendance/" + this.state.internId +"/intern",
        type: "GET",
        success: function (response) {
            if(response.length === 0){
                this.setState({
                    showData: false
                });
            }
            else{
                this.setState({
                    traineeData: response
                });
                this.processAttendancesData();
            }
        }.bind(this),
        error: function (xhr, status) {
            this.setState({showData: false});
        }.bind(this)
    });
  }

  processAttendancesData(){
        var trainee = this.state.traineeData;
        trainee.months = this.createMonthsData(trainee.StartDate, trainee.EndDate);
        var month = this.getCurrentMonth()
        this.setState({
            months: trainee.months,
            currentMonth: month.Month,
            tableData: this.loadTableData(month.MonthNow, month.YearNow),
            chartData: this.loadChartData(month.MonthNow, month.YearNow)
        });
            console.log("OK")
  }

  onSelectChange(event) {
    var curValue = event.target.value;
    var month = this.getCurrentMonth();
        this.setState({currentMonth: month.Month});
        if (curValue === "Calendar"){
            this.setState({
                tableData: this.loadTableData(month.MonthNow, month.YearNow),
                showChart: false
            });
        }else {
            this.setState({
                chartData: this.loadChartData(month.MonthNow, month.YearNow),
                showChart: true
            });
        }
        this.setState({showSuccess: false, showError: false});
  }

  onLeftArrowHover(){
    this.setState ({leftArrowClass: "fa fa-chevron-left arrow-hover"});
  }

  onLeftArrowDeHover() {
      this.setState ({leftArrowClass: "fa fa-chevron-left"});
  }

  onLeftArrowClick() {
    var index = this.state.traineeData.months.indexOf(this.state.currentMonth);
    if (index - 1 < 0){
        this.setState({
            currentMonth: this.state.traineeData.months[this.state.traineeData.months.length - 1],
            tableData: this.loadMonthData(this.state.traineeData.months[this.state.traineeData.months.length - 1], "table"),
            chartData: this.loadMonthData(this.state.traineeData.months[this.state.traineeData.months.length - 1], "chart")
        });
    } else {
        this.setState({
            currentMonth: this.state.traineeData.months[index-1],
            tableData: this.loadMonthData(this.state.traineeData.months[index - 1], "table"),
            chartData: this.loadMonthData(this.state.traineeData.months[index - 1], "chart")
        });
    }
    this.setState({showSuccess: false, showError: false});
  }

  onRightArrowHover() {
    this.setState ({rightArrowClass: "fa fa-chevron-right arrow-hover"});
  }

  onRightArrowDeHover() {
    this.setState ({rightArrowClass: "fa fa-chevron-right"});
  }

  onRightArrowClick() {
    var index = this.state.traineeData.months.indexOf(this.state.currentMonth);
    if (index + 1 >= this.state.traineeData.months.length){
        this.setState({
            currentMonth: this.state.traineeData.months[0],
            tableData: this.loadMonthData(this.state.traineeData.months[0], "table"),
            chartData: this.loadMonthData(this.state.traineeData.months[0], "chart")
        });
    } else {
        this.setState({
            currentMonth: this.state.traineeData.months[index + 1],
            tableData: this.loadMonthData(this.state.traineeData.months[index + 1], "table"),
            chartData: this.loadMonthData(this.state.traineeData.months[index + 1], "chart")
        });
    }
    this.setState({showSuccess: false, showError: false});
  }

  getDaysInMonth(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
  }

  loadMonthData(monthValue, type) {
    var curMonth = monthValue.substring(0, monthValue.lastIndexOf(" "));
    var curYear = monthValue.substring(monthValue.lastIndexOf(" "));
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = months.indexOf(curMonth);
    if (type === "table") {
        return this.loadTableData(month, parseInt(curYear));
    } else {
        return this.loadChartData(month, parseInt(curYear));
    }
  }

  // load attendances with calendar
  loadTableData(month, year) {
    var days = this.getDaysInMonth(month, year);
    var tableData = [];
    var rowData = this.createEmptyRow();
    var weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for(var i = 0; i < days.length; i++){
        var strDay = days[i].toDateString();
        var weekDay = strDay.substring(0,3);
        var day = strDay.substring(8,10);

        if(weekDay === "Mon" && i !== 0){
            tableData.push(rowData);
            rowData =  this.createEmptyRow();

        }

        var index = weekDays.indexOf(weekDay);
        rowData[index].date = day;

        if (weekDay !== "Sat" && weekDay !== "Sun") {
            var attendance = this.getAttendanceData(parseInt(day), month, year);
            if (attendance === "N.A")
                rowData[index].attendance = "N.A"
            else {
                rowData[index].attendance = attendance;
            }
        }
        
        if(i === days.length - 1){
            tableData.push(rowData);
        }
    }

    return tableData;
  }

  // load attendance with chart
  loadChartData( month, year) {
    var arr = [];
    var ppCount, pCount, paCount , aCount, arCount, a2rCount ,naCount;
    ppCount = pCount = paCount = aCount = arCount = a2rCount = naCount = 0;

    var days = this.getDaysInMonth(month, year);
    for (var i = 0; i < days.length; i++) {
        if (days[i].getDay() === 6 || days[i].getDay() === 0) {
            naCount++;
        } else {
            var result = this.getAttendanceData(days[i].getDate(), month, year);
            switch(result) {
                case "PP":
                    ppCount++;
                    break;
                case "P" :
                    pCount++;
                    break;
                case "PA" :
                    paCount++;
                    break;
                case "A" :
                    aCount++;
                    break;
                case "AR" :
                    arCount++;
                    break;
                case "ARR" :
                    a2rCount++;
                    break;
                case "N.A" :
                    naCount++;
                    break;
                default :
                    naCount++;
                    break;
            }
        }
    }

    arr.push(ppCount);
    arr.push(pCount);
    arr.push(paCount);
    arr.push(arCount);
    arr.push(a2rCount);
    arr.push(aCount);
    arr.push(naCount);
    console.log(arr)
    return arr;
  }
  
  // craete week attendances
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

  //get attendance of date
  getAttendanceData(day, month, year) {
    var traineeData = this.state.traineeData
    if (traineeData === null) {
        return "N.A";
    }
    var startDate, endDate, startYear, startMonth, startDay, endYear, endMonth, endDay;
    startDate = traineeData.StartDate;
    endDate = traineeData.EndDate
    startYear = this.getYear(startDate);
    startMonth = this.getMonth(startDate) - 1;
    startDay = this.getDay(startDate);
    endYear = this.getYear(endDate);
    endMonth = this.getMonth(endDate) - 1;
    endDay = this.getDay(endDate);

    var start = new Date(startYear, startMonth, startDay);
    var end = new Date(endYear, endMonth, endDay);
    var mid = new Date(year, month, day);
    var today = new Date();

    if (mid >= start && mid <= end) {
        if (mid >= start && mid <= today) {
            for (var i = 0; i < traineeData.Attendances.length; i++) {
                var strDate = traineeData.Attendances[i].Date;
                var date = new Date(this.getYear(strDate), this.getMonth(strDate)-1, this.getDay(strDate));
                if (mid.getTime() === date.getTime()) {
                    return traineeData.Attendances[i].Status
                }
            }
            return "N.A"
        } else {
            return "N.A"
        }
    } else {
        return "N.A"
    }
  }

  //create day in month
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

  getSession(strDate) {
    return parseInt(strDate.substring(11, 13));
}


  getMonthString(iMonth) {
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      if (!(iMonth >= 1 && iMonth <= 12)) {
          return "";
      }
      return months[iMonth - 1];
  }

  getCurrentMonth(){
    var trainee = this.state.traineeData;
    var now = new Date()
    var monthNow = now.getMonth();
    var yearNow = now.getFullYear();
    var curtMonth = this.getMonthString(monthNow + 1) + " " + yearNow
    if(!trainee.months.includes(curtMonth)){
        curtMonth = trainee.months[0]
        monthNow = this.getMonth(trainee.StartDate) - 1
    }
    return {
        Month: curtMonth,
        MonthNow: monthNow,
        YearNow: yearNow
    };
  }
  componentDidMount() {
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

                {!this.state.showChart? 
                <div className="card mt-6">
                    <div className="card-body">
                        <Table tableData={this.state.tableData} text={this.state.currentMonth} />
                    </div>
                </div> : null}  

                {this.state.showChart ? 
                <div className="card mt-6">
                    <div className="card-body"> 
                        <BarChart arr={this.state.chartData}/> 
                    </div>
                </div> : null}
            </div> : null}
        </div>
    );
  }
}

export default MentorAttendance
