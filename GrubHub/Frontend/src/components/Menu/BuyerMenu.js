import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Link } from "react-router-dom";
import { Redirect } from 'react-router';
import BuyerMenuData from "../Menu/BuyerMenuData"
import { buyerMenu } from '../../queries/queries'
import { graphql, compose, withApollo } from 'react-apollo';

class BuyerMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: []
        }
    }
    //get the books data from backend  
    componentDidMount() {
        // axios.get('http://localhost:3001/buyersection', {
        //     params: {
        //         restaurantid: this.props.match.params.restaurantid
        //     }
        // })
        //     .then((response) => {
        //         console.log("Received response")
        //         //update the state with the response data
        //         this.setState({

        //             sections: this.state.sections.concat(response.data)
        //         });
        //     });
        this.props.client.query({
            query: buyerMenu,
            // this.props.getOwnerProfile({
            variables: {
                ownername: this.props.match.params.restaurantid
            }
        }).then(response => {
            console.log("get ownersection", response);
            this.setState({
                sections: response.data.buyerMenu,
            })
        }).catch(e => {
            console.log("error", e);
            this.setState({
                status: 400
            })
        })

    }

    render() {
        //iterate over books to create a table row
        let details = this.state.sections.map(section => {
            return (
                <tr>
                    <BuyerMenuData key={Math.random} data={section}></BuyerMenuData>
                </tr>

            )
        })
        //if not logged in go to login page
        let redirectVar = null;
        return (
            <div>
                {/* {redirectVar} */}
                <div class="container">
                    <h2>Select Items from the Menu!</h2>
                    {/* <table class="table">
                        <thead>
                            <tr>
                                <th>Section ID</th>
                                <th>Section Name</th>
                                {/* <th>Person Address</th>
                                <th>Order Status</th>
                                <th>Action</th> */}
                    {/* </tr>
                        </thead>
                        <tbody>
                            {/*Display the Tbale row based on data recieved*/}
                    {/* {details} */}
                    {/* </tbody> */}
                    {/* </table> */}
                    <div>
                        {details}
                    </div>
                    <Link to={`/viewcart`} > <button class="btn btn-success" type="submit">View Cart</button></Link>
                </div>

            </div>

        )
    }
}
//export Home Component
// export default BuyerMenu;
export default withApollo(BuyerMenu);
