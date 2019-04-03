import React from 'react';
import '../attendance.css';
import Table from '../components/mentor/Table'
import DailyTable from '../components/DailyTable'
import BarChart from '../components/BarChart'
import $ from 'jquery';


class MentorAttendance extends React.Component {

  constructor(props) {
        super(props);   
        this.state = {
            mentorId: "5c9b392b11e5e2338e4c0ee1",
            courses: [],
            names: [],
            ids: [],
            currentName:"",
            traineesData: [],
            tableData: [],
            chartData: [],
            dailyData: [],
            months: [],
            currentMonth: "",
            currentStudentId: "",
            rightArrowClass: "fa fa-chevron-right",
            leftArrowClass: "fa fa-chevron-left",
            show: 0,
            showSuccess: false,
            showError: false,
            showData: true,
            now: null
        };
        this.getStudents();
  }
  

  getStudents() {
    $.ajax({
        url: "http://localhost:8080/attendance/" + this.state.mentorId +"/mentor",
        type: "GET",
        success: function (response) {
            if(response === []){
                this.setState({
                    showData: false
                });
            }
            else{
                var names = this.getNames(response, "All");
                this.setState({traineesData: response, 
                    currentStudentId: response[0].Id, 
                    courses: this.getCourses(response),
                    names: names,
                    ids: this.getIds(response, "All"),
                    currentName: names[0],
                    now: new Date()
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
    var trainees = this.state.traineesData;
    for (var i = 0; i < trainees.length; i++) {
        trainees[i].months = this.createMonthsData(trainees[i].StartDate, trainees[i].EndDate);
    }
    var month = this.getCurrentMonth(trainees[0].Id)
    this.setState({
        months: trainees[0].months,
        currentMonth: month.Month,
        tableData: this.loadTableData(this.state.currentStudentId, month.MonthNow, month.YearNow),
        chartData: this.loadChartData(this.state.currentStudentId, month.MonthNow, month.YearNow)
    });
    this.loadDailyData();
  }

  getCourses(traineeData){
      var courses = ["All"];
      for(var i = 0 ; i < traineeData.length ; i++){
          if(!courses.includes(traineeData[i].Course))
            courses.push(traineeData[i].Course);
      }
      return courses;
  }

  getNames(traineeData, course){
    var names = [];
    if(course === "All")
        for(var i = 0 ; i < traineeData.length ; i++)
        names.push(traineeData[i].Name);
    else 
        for(var i = 0 ; i < traineeData.length ; i++){
            if(traineeData[i].Course === course)
            names.push(traineeData[i].Name);
        }
    return names;
  }

  getIds(traineeData, course){
    var ids = [];
    if(course === "All")
        for(var i = 0 ; i < traineeData.length ; i++)
        ids.push(traineeData[i].Id);
    else 
        for(var i = 0 ; i < traineeData.length ; i++){
            if(traineeData[i].Course === course)
            ids.push(traineeData[i].Id);
        }
    return ids;
  }

  handleCellChange(object){
    $.ajax({
        url: "http://localhost:8080/attendance",
        type: "PUT",
        data: JSON.stringify(object),
        success: function (response) {
            this.setState({
                showSuccess: true, 
                showError: false
            });
            return true
        }.bind(this),
        error: function (xhr, status) {
            this.setState({
                showSuccess: false, showError: true
            });
            return false
        }.bind(this)
    });
  }

  onSelectChange(event) {
    var curValue = event.target.value;
    var month = this.getCurrentMonth();
        this.setState({currentMonth: month.Month});
        if (curValue === "Calendar"){
            this.setState({
                tableData: this.loadTableData(this.state.currentStudentId, month.MonthNow, month.YearNow),
                show: 0
            });
        } else if(curValue === "Daily"){
            console.log(this.state.dailyData);
            this.loadDailyData()
            this.setState({
                show: 1
            });

        }else {
            this.setState({
                chartData: this.loadChartData(this.state.currentStudentId, month.MonthNow, month.YearNow),
                show: 2
            });
        }
        this.setState({showSuccess: false, showError: false});
  }

  onSelectStudentChange(event){
      console.log(event.target.selectedIndex);
    var studentId = this.state.ids[event.target.selectedIndex];
    var traineeData = this.getStudentById(studentId);
    var month = this.getCurrentMonth(traineeData.Id)
    this.setState({
        currentStudentId: traineeData.Id,
        currentName: traineeData.Name,
        months: this.createMonthsData(traineeData.StartDate, traineeData.EndDate),
        currentMonth: month.Month,
        tableData: this.loadTableData(traineeData.Id, month.MonthNow, month.YearNow),
        chartData: this.loadChartData(traineeData.Id, month.MonthNow, month.YearNow),
        showSuccess: false,
        showError: false
    });
  }

  onSelectCourseChange(event){
        var curValue = event.target.value;
        var ids = this.getIds(this.state.traineesData, curValue);
        var names = this.getNames(this.state.traineesData, curValue);
        var traineeData = this.getStudentById(ids[0]);
        var month = this.getCurrentMonth(ids[0])
        this.setState({
            currentStudentId: traineeData.Id,
            ids: ids,
            names: names,
            currentName: traineeData.Name,
            months: this.createMonthsData(traineeData.StartDate, traineeData.EndDate),
            currentMonth: month.Month,
            tableData: this.loadTableData(traineeData.Id, month.MonthNow, month.YearNow),
            chartData: this.loadChartData(traineeData.Id, month.MonthNow, month.YearNow),
        });
    
  }

  onLeftArrowHover(){
    this.setState ({leftArrowClass: "fa fa-chevron-left arrow-hover"});
  }

  onLeftArrowDeHover() {
      this.setState ({leftArrowClass: "fa fa-chevron-left"});
  }

  onLeftArrowClick() {
    var index = this.state.months.indexOf(this.state.currentMonth);
    if (index - 1 < 0){
        this.setState({
            currentMonth: this.state.months[this.state.months.length - 1],
            tableData: this.loadMonthData(this.state.currentStudentId, this.state.months[this.state.months.length - 1], "table"),
            chartData: this.loadMonthData(this.state.currentStudentId, this.state.months[this.state.months.length - 1], "chart")
        });
    } else {
        this.setState({
            currentMonth: this.state.months[index-1],
            tableData: this.loadMonthData(this.state.currentStudentId, this.state.months[index - 1], "table"),
            chartData: this.loadMonthData(this.state.currentStudentId, this.state.months[index - 1], "chart")
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
    var index = this.state.months.indexOf(this.state.currentMonth);
    if (index + 1 >= this.state.months.length){
        this.setState({
            currentMonth: this.state.months[0],
            tableData: this.loadMonthData(this.state.currentStudentId, this.state.months[0], "table"),
            chartData: this.loadMonthData(this.state.currentStudentId, this.state.months[0], "chart")
        });
    } else {
        this.setState({
            currentMonth: this.state.months[index + 1],
            tableData: this.loadMonthData(this.state.currentStudentId, this.state.months[index + 1], "table"),
            chartData: this.loadMonthData(this.state.currentStudentId, this.state.months[index + 1], "chart")
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

  loadMonthData(id, monthValue, type) {
    var curMonth = monthValue.substring(0, monthValue.lastIndexOf(" "));
    var curYear = monthValue.substring(monthValue.lastIndexOf(" "));
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = months.indexOf(curMonth);
    if (type === "table") {
        return this.loadTableData(id, month, parseInt(curYear));
    } else {
        return this.loadChartData(id, month, parseInt(curYear));
    }
  }

  loadTableData(id, month, year) {
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
            var attendanceData = this.getAttendanceData(id, parseInt(day), month, year);
            if (attendanceData === "N.A")
                rowData[index].attendance = "N.A"
            else {
                rowData[index].attendance = attendanceData.attendance;
                rowData[index].id = attendanceData.id;
                rowData[index].InternID = attendanceData.InternID;
                rowData[index].fullDate = attendanceData.fullDate;
            }
        }
        
        if(i === days.length - 1){
            tableData.push(rowData);
        }
    }

    return tableData;
  }

  loadDailyData(){
    $.ajax({
        url: "http://localhost:8080/attendance/"+this.state.mentorId+"/mentor/daily",
        type: "GET",
        success: function (response) {
            this.setState({
                dailyData: response,
                showData: true
            });
        }.bind(this),
        error: function (xhr, status) {
            this.setState({
                dailyData: [],
                showData: false
            });
        }.bind(this)
    });
  }

  loadChartData(id, month, year) {
    var arr = [];
    var ppCount, pCount, aCount, arCount, naCount;
    ppCount = pCount = aCount = arCount = naCount = 0;

    var days = this.getDaysInMonth(month, year);
    for (var i = 0; i < days.length; i++) {
        if (days[i].getDay() === 6 || days[i].getDay() === 0) {
            naCount++;
        } else {
            var result = this.getAttendanceData(id, days[i].getDate(), month, year);
            switch(result.attendance) {
                case "PP":
                    ppCount++;
                    break;
                case "P" :
                    pCount++;
                    break;
                case "A" :
                    aCount++;
                    break;
                case "AR" :
                    arCount++;
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
    arr.push(aCount);
    arr.push(arCount);
    arr.push(naCount);
    return arr;
  }
  
  createEmptyRow() {
    var rowData = [];
    for(var i = 0; i < 7; i++){
        rowData.push({
            id:"",
            InternID:"",
            fullDate:"",
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
  

  getAttendanceData(id, day, month, year) {
    var traineeData = this.getStudentById(id);
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
                    return {
                        id: traineeData.Attendances[i].ID,
                        InternID: id,
                        fullDate: strDate,
                        attendance: traineeData.Attendances[i].Status,
                    }
                        
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

  getCurrentMonth(id){
    var trainee = this.getStudentById(id);
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
                        <option>Daily</option> 
                        <option>Chart</option>         
                    </select>

                    {this.state.show === 1 ? 
                    <div className="card mt-6">
                        <div className="card-body">
                            <div className="center custom-table-header">
                            <span className="month-header" id="month-header" ref="monthHeader">
                            { this.state.now.getDate()+" "+ this.state.currentMonth }
                            </span>
                                <DailyTable dailyData={this.state.dailyData} text={this.state.currentMonth} onCellChange={this.handleCellChange.bind(this)}/>
                            </div>
                        </div>
                    </div> : null}  

                    {this.state.show !== 1 ?
                    <span>
                        <select className="browser-default custom-select custom-dropdown custom-margin" onChange={this.onSelectCourseChange.bind(this)}>      
                            {this.state.courses.map(function(data, index){
                                return <option key={index} value={data}>{data}</option>;
                            })}      
                        </select>
                        <select className="browser-default custom-select custom-dropdown custom-margin" value={this.state.currentName} onChange={this.onSelectStudentChange.bind(this)}>      
                            {this.state.names.map(function(data, index){
                                    return <option key={index} value={data}>{data}</option>;
                            })}      
                        </select>
                    </span> : null}
                </div>

                {this.state.show !== 1 ?
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
                </div>: null}

                {this.state.show === 0 ? 
                <div className="card mt-6">
                    <div className="card-body">
                        <Table tableData={this.state.tableData} text={this.state.currentMonth} onCellChange={this.handleCellChange.bind(this)}/>
                    </div>
                </div> : null}  

                {this.state.show === 2 ? 
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

export default MentorAttendance