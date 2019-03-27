import React from "react";
import { Bar } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

class ChartsPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dataBar: {
                labels: ["Present", "Absent", "Absent(reason)", "N.A"],
                datasets: [
                    {
                        label: 'Statistic',
                        data: props.arr,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
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
                labels: ["Present", "Absent", "Absent(reason)", "N.A"],
                datasets: [
                    {
                        label: 'Statistic',
                        data: newProps.arr,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
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