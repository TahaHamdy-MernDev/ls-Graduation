import  React from 'react';
import {Container,Row,Col} from 'react-bootstrap';
import  Logo19 from '../images/d1logo.png';
import { FaRegCopyright } from "react-icons/fa6";
import { BsShift } from 'react-icons/bs';

function Footer(){
 return (
<Container>
<Row className="justify-content-center">
     <Col lg={30} md={30} sm={30}>
    
           <hr></hr>
        <div className="footer">
        <img src={Logo19} alt="logo-footer" style={{ marginRight: '10px' }} />

             <span><FaRegCopyright />  DevKnowledge.com 2023-All Rights Reserved </span>
        </div>

     </Col>
 </Row>
</Container>
    
 )
}

export default Footer;