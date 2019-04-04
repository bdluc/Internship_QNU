
import { Row, Col, Card, CardBody, Table, TableHead, TableBody } from 'mdbreact';
// import Fab from '@material-ui/core/Fab';
//  import DeleteIcon from '@material-ui/icons/Delete';
// import CreateIcon from '@material-ui/icons/Create';
//  import AddIcon from '@material-ui/icons/Add';

import AddCourse from './sections/AddCourse'
import React, { Component } from 'react';

class CourcePage extends Component {
  constructor() {
    super();
    this.state = {
      Course: []
    };
  }

  componentDidMount() {
    this.GetListCourse()
  }

  GetListCourse(){
    fetch('http://localhost:8080/courses')
      .then(response => response.json())
      .then(result => {
        // console.log(result);
        this.setState({
          Course: result
        });
      })
  }
  handlerDeleteCourse(id){
    fetch("http://localhost:8080/course/"+id, {
      method: 'DELETE',
      mode: 'cors'
    })
    .then(this.GetListCourse())
    // window.location.reload();
  }

  render() {
    const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return (
      <div>
      <React.Fragment>
        <Row>
          <Col md="12">
            <Card className="mt-5">

              <CardBody>
                
                    <AddCourse></AddCourse>
                  {/* </Fab> */}
      
                <hr></hr>
                <Table>

                  <TableHead color="primary-color" textWhite>

                    <tr>
                      <th>#</th>
                      <th>Course Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Mentor</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {this.state.Course.map((item, index) =>
                      (
                        <tr key={index}>
                          <th>{index}</th>
                          <th>{item.CourseName}</th>
                          <th>{(new Date(item.StartDate)).toLocaleDateString('en-US', DATE_OPTIONS)}</th>
                          <th>{(new Date(item.EndDate)).toLocaleDateString('en-US', DATE_OPTIONS)}</th>
                          <th>
                          {item.MentorName.map((element, indexMentor) => 
                            (
                              <div key={indexMentor}>{element}</div>
                            )
                          )}
                          </th>
                         
                          <th><button className="btn btn-primary"
                            onClick={()=>{}}
                            >EDIT</button></th>

                          <th><button className="btn btn-primary"
                             onClick={()=>{this.handlerDeleteCourse(item._id)}}
                             >DEL</button></th>
                        </tr>
                      )
                    )}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
      </div>
    );
  }
}

export default CourcePage;