import React from 'react'
import { Row, Col, Card, CardBody, Table, TableHead, TableBody } from 'mdbreact';



const CourcePages = () => {
  return (
    <React.Fragment>
      <Row>
        <Col md="12">
          <Card className="mt-5">
      
            <CardBody>
            <tr>
                <h4>Content Coure</h4><hr/>
                Coure: Go <br/>          
                DateBegin: 28/12/2018<br/>
                DateEnd: 19/05/2019
                </tr>
                <hr></hr>
              <Table>

                <TableHead color="primary-color" textWhite>

                  <tr>
                    <th>#</th>
                    <th>First</th>
                    <th>Last</th>
                    <th>Date</th>
                    <th>Week</th>
                  </tr>
                </TableHead>
                <TableBody>
                  <tr>
                  <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                  </tr>
                  <tr>
                  <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                  </tr>
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default CourcePages;