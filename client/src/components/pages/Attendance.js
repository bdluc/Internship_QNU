import React from 'react';
import './attendance.css';
import Table from './components/mentor/Table'
import BarChart from './components/BarChart'

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
        // this.getStudents();
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