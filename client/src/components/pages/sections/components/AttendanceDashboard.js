import React, { PureComponent } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { MDBInput } from 'mdbreact';
import MenuItem from '@material-ui/core/MenuItem';

//LineChartHasMultiSeries http://recharts.org/en-US/examples/LineChartHasMultiSeries

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        marginLeft: theme.spacing.unit,
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    button: {
        marginLeft: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        margin: "1rem"
    },
    select: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        margin: "1rem"
    },
});



// GetInternAttendancebyDay(day){
//     if
// }

const series = [
    {

        name: 'Nguyen Van A',
        data: [
            { category: '01/03/2019', value: 8 },
            { category: '02/03/2019', value: 4 },
            { category: '03/03/2019', value: 4 },
        ],
    },

];



class AttendanceDashboard extends React.Component {
    state = {
        startDay: '',
        view: '',
        labelWidth: 0,
    };
    static jsfiddleUrl = 'https://jsfiddle.net/alidingling/ewcqxbwo/';
    //   componentDidMount() {
    //     this.setState({
    //       labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    //     });
    //   }

    handleChangeValue(e) {
        const { name, value } = e.target;
        e.target.className = "form-control"
        switch (name) {
            case "view":
                this.setState({ view: value })
                break;

            case "date":
                this.setState({ date: value })
                console.log(this.state.view)
                break;


        }
    }


    // GetInternTimeByStatus(str){
    //     switch (str) {
    //         case "":
    //             break;
    
    
    //     }
    
    // }
    render() {
        const { classes } = this.props;

        return (

            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"

            >
                <div >

                    <FormControl required className={classes.formControl}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                            // spacing={12}
                        >
                            <InputLabel htmlFor="view-native-required">View</InputLabel>
                            <Select className={classes.select} label="View" name="view" value={this.state.view} onChange={this.handleChangeValue.bind(this)}>
                                <MenuItem value="7">1 Week</MenuItem>
                                <MenuItem value="31">1 Month</MenuItem>
                            </Select>
                                <MDBInput
                                    onChange={this.handleChangeValue.bind(this)}
                                    id="date"
                                    label="Start Day"
                                    type="date"
                                    name="date"
                                    value={this.state.date}
                                    defaultValue="2019-01-01"
                                    className={classes.textField}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            <Button variant="outlined" color="primary" className={classes.button}>
                                View
                            </Button>
                        </Grid>
                    </FormControl>
                </div>
                <div>
                    <LineChart width={500} height={300}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" type="category" allowDuplicatedCategory={false} />
                        <YAxis dataKey="value" />
                        <Tooltip />
                        <Legend />
                        {series.map(s => (
                            <Line dataKey="value" data={s.data} name={s.name} key={s.name} />
                        ))}
                    </LineChart>
                </div>

            </Grid>
        );
    }
}
AttendanceDashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AttendanceDashboard);