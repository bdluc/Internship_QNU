import React from 'react'
import { Row, Col, View, Card, CardBody, Table, TableHead, TableBody } from 'mdbreact';

const InternshipPage =  () => {
  return (
    <React.Fragment>
      <Row>
      <Col md="12">
        <Card className="mt-5">
          <View className="gradient-card-header blue darken-2">
            <h4 className="h4-responsive text-white">Basic tables</h4>
          </View>
          <CardBody>
            <Table>
              <TableHead color="primary-color" textWhite>
                <tr>
                  <th>#</th>
                  <th>First</th>
                  <th>Last</th>
                  <th>Handle</th>
                </tr>
              </TableHead>
              <TableBody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Larry</td>
                  <td>the Bird</td>
                  <td>@twitter</td>
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

export default InternshipPage;