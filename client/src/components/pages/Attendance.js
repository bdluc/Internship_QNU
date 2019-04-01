import React from 'react'
import CalendarHeatmap from 'react-calendar-heatmap';
import './dist/stylesCalendar.css';

//https://github.com/patientslikeme/react-calendar-heatmap



class AttendancePage extends React.Component {

  constructor(props) {
        super(props);   
        this.state = {
            mentorId: "5c9998a7ba3c261ba46034c1",
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
        url: "http://localhost:8080/attendance/" + this.state.mentorId +"/mentor",
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
            this.processAttendancesData();
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
    if (this.state.months.length === 0) {
        var month = this.getCurrentMonth()
        this.setState({
            months: trainees[0].months,
            currentMonth: month.Month,
            tableData: this.loadTableData(this.state.currentStudentId, month.MonthNow, month.YearNow),
            chartData: this.loadChartData(this.state.currentStudentId, month.MonthNow, month.YearNow)
        });
    }else{
        var curMonth = this.state.currentMonth.substring(0, this.state.currentMonth.lastIndexOf(" "));
        var curYear = this.state.currentMonth.substring(this.state.currentMonth.lastIndexOf(" "));
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var month = months.indexOf(curMonth);
        this.setState({
            tableData: this.loadTableData(this.state.currentStudentId, month, parseInt(curYear)),
            chartData: this.loadChartData(this.state.currentStudentId, month, parseInt(curYear))
        });
    
    }
  }

  onSelectChange(event) {
    var curValue = event.target.value;
    var month = this.getCurrentMonth();
        this.setState({currentMonth: month.Month});
        if (curValue === "Calendar"){
            this.setState({
                tableData: this.loadTableData(this.state.currentStudentId, month.MonthNow, month.YearNow),
                showChart: false
            });
        } else {
            this.setState({
                chartData: this.loadChartData(this.state.currentStudentId, month.MonthNow, month.YearNow),
                showChart: true
            });
        }
        this.setState({showSuccess: false, showError: false});
  }

  onSelectStudentChange(event){
    var curValue = event.target.value;
    var traineeData = this.getStudentByName(curValue);
    var month = this.getCurrentMonth();
    this.setState({
        currentStudentId: traineeData.Id,
        months: this.createMonthsData(traineeData.StartDate, traineeData.EndDate),
        currentMonth: month.Month,
        tableData: this.loadTableData(traineeData.Id, month.MonthNow, month.YearNow),
        chartData: this.loadChartData(traineeData.Id, month.MonthNow, month.YearNow),
        showSuccess: false,
        showError: false
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
            rowData[index].attendance = this.getAttendanceData(id, parseInt(day), month, year);
        }

        if(i === days.length - 1){
            tableData.push(rowData);
        }
    }

    return tableData;
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
            switch(result) {
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

  handleCellChange(value) {
    var row = value.id.substring(value.id.lastIndexOf("tr") + 2, value.id.lastIndexOf("-"));
    var col = value.id.substring(value.id.lastIndexOf("td") + 2);
    var tableData = this.state.tableData;
    var curAttendance = tableData[row][col].attendance;
    var curDay = tableData[row][col].date;
    if (value.attendance !== curAttendance) {
        var requestObject = {
            
        };
        $.ajax({
            url: "#",
            type: "POST",
            data: JSON.stringify(requestObject),
            success: function (response) {
                this.setState({showSuccess: true, showError: false});
                //this.getAttendancesData();
            }.bind(this),
            error: function (xhr, status) {
                this.setState({showSuccess: false, showError: true});
            }.bind(this)
        });
    }
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
                    return traineeData.Attendances[i].Status;
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

  getCurrentMonth(){
    var trainees = this.state.traineesData;
    var now = new Date()
        var monthNow = now.getMonth();
        var yearNow = now.getFullYear();
        var curtMonth = this.getMonthString(monthNow + 1) + " " + yearNow
        if(!trainees[0].months.includes(curtMonth)){
            curtMonth = trainees[0].months[0]
            monthNow = this.getMonth(trainees[0].StartDate) - 1
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
master
}

export default AttendancePage