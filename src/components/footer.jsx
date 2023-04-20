/* footer component */
import React, { Component } from 'react';
import '../styles/footer.css';

export default class footer extends Component {
    render() {
        return (
            <div className="footer-parent">
                <div className="footer">
                    <p>Email us: <a href="mailto:anonymous@carshare.com">anonymous@carshare.com</a></p>
                    <p>Call us: ((0261) 253 772)</p>
                    <p>Visit us: Anonymous Car Share, Sumul Dairy Road</p>
                </div>
            </div>
        )
    }
}
