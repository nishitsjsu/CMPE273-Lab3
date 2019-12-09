import React, { Component, Fragment } from "react";
import "../../App.css";
import axios from 'axios';
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import BuyerMenuDetails from "../Menu/BuyerMenuDetails";
import { buyerMenuDetails } from '../../queries/queries'
import { graphql, compose, withApollo } from 'react-apollo';

class MenuData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            section: this.props.data.sectionid,
            items: []
        }

    }


    componentDidMount() {
        // axios.get('http://localhost:3001/sectiondetailsbuyer', {
        //     params: {
        //         sectionid: this.props.data.sectionid,
        //         ownerid: this.props.data.ownerid
        //     }
        // })
        //     .then((response) => {
        //         console.log("Received response")
        //         //update the state with the response data
        //         this.setState({

        //             items: this.state.items.concat(response.data)
        //         });
        //     });
        this.props.client.query({
            query: buyerMenuDetails,
            // this.props.getOwnerProfile({
            variables: {
                ownername: this.props.data.sectionname,
                sectionname: this.props.data.sectionname
            }
        }).then(response => {
            console.log("get ownersection", response);
            this.setState({
                items: response.data.buyerMenuDetails,
            })
        }).catch(e => {
            console.log("error", e);
            this.setState({
                status: 400
            })
        })
    }





    render() {

        let details = this.state.items.map(item => {
            return (
                <tr>
                    <BuyerMenuDetails key={Math.random} data={item}></BuyerMenuDetails>
                </tr>
                // <tr key="index">
                //     <td>{book.BookID}</td>
                //     <td>{book.Title}</td>
                //     <td>{book.Author}</td>
                //     <td>{book.Status}</td>
                //     <input type="button" onClick={this.viewButton(index)} value="view details"></input>
                // </tr>
            )
        })

        return (
            <div>
                <h3>{this.props.data.sectionname}</h3>
                <br />
                <table class="table table-bordered table-hover" style={{ textAlign: "left", backgroundColor: "#fafafa" }}>
                    <thead class="thead-dark" style={{ textAlign: "center" }}>
                        <tr>

                            <th>Item Name</th>
                            <th>Item Image</th>
                            <th>Item Description</th>
                            <th>Price($)</th>
                            <th>Quantity</th>
                            <th>Add to Cart</th>

                        </tr>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                        {/*Display the Tbale row based on data recieved*/}
                        {details}
                    </tbody>
                </table>


            </div>
        )


    }
}

// export default MenuData;
export default withApollo(MenuData);