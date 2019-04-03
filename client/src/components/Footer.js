import React from 'react';
import { MDBFooter } from 'mdbreact';

const Footer = () => {
    return (

        <MDBFooter color="blue" className="text-center mt-md-0 font-small darken-2 fixed-bottom">
            <p className="footer-copyright mb-0 pb-0 py-3 text-center">
                &copy; {new Date().getFullYear()} Copyright: <a href="/"> TMA InternshipManagerment </a>
            </p>
        </MDBFooter>

    );
}
export default Footer;