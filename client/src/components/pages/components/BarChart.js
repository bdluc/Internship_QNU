import React from "react";
import { Bar } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

class ChartsPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dataBar: {
                labels: ["2Present", "Present", "Present (absent)", "Absent (2reason)" , "Absent (reason)","Absent", "N.A"],
                datasets: [
                    {
                        label: 'Statistic',
                        data: props.arr,
                        backgroundColor: [
                            'rgba(0, 255, 25, 0.2)',
                            'rgba(0, 0, 255, 0.2)',
                            'rgba(255, 0, 0, 0.2)',
                            'rgba(0, 255, 25, 0.2)',
                            'rgba(0, 0, 255, 0.2)',
                            'rgba(255, 0, 0, 0.2)',
                        ],
                        borderColor: [
                            'rgba(0, 255, 25, 0.1)',
                            'rgba(0, 0, 255, 0.1)',
                            'rgba(255, 0, 0, 0.1)',
                            'rgba(0, 255, 25, 0.1)',
                            'rgba(0, 0, 255, 0.1)',
                            'rgba(255, 0, 0, 0.1)',
                        ],
                        borderWidth: 1
                    }
                ]
            },
            barChartOptions: {
                scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }]
                }
            }
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
           dataBar: {
                labels: ["2Present", "Present", "Present (absent)", "Absent (2reason)", "Absent (reason)","Absent", "N.A"],
                datasets: [
                    {
                        label: 'Statistic',
                        data: newProps.arr,
                        backgroundColor: [
                            'rgba(0, 255, 25, 0.2)',
                            'rgba(0, 0, 255, 0.2)',
                            'rgba(255, 0, 0, 0.2)',
                            'rgba(0, 255, 25, 0.2)',
                            'rgba(0, 0, 255, 0.2)',
                            'rgba(255, 0, 0, 0.2)',
                        ],
                        borderColor: [
                            'rgba(0, 255, 25, 0.1)',
                            'rgba(0, 0, 255, 0.1)',
                            'rgba(255, 0, 0, 0.1)',
                            'rgba(0, 255, 25, 0.1)',
                            'rgba(0, 0, 255, 0.1)',
                            'rgba(255, 0, 0, 0.1)',
                        ],
                        borderWidth: 1
                    }
                ]
            }
        });
    }


    render() {
        return (
            <MDBContainer>
                <Bar data={this.state.dataBar} options={this.state.barChartOptions} />
            </MDBContainer>
        );
    }
}

export default ChartsPage;