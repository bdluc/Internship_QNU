import React from 'react';
import { MDBFooter } from 'mdbreact';

const Footer = () => {
    return (

        <MDBFooter color="blue" className="text-center fixed-bottom mt-md-0 font-small darken-2">
            <p className="footer-copyright  mb-0 pb-0 py-3 text-center">
                &copy; {new Date().getFullYear()} Copyright: <a href="/"> TMA Internship Management  </a>
            </p>
        </MDBFooter>

    );
}
export default Footer;