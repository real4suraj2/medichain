import React, {Component} from 'react';
import { css } from "@emotion/core";
import { CircleLoader } from "react-spinners";

import {Button} from 'react-bootstrap';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  background-color : transparent;
`;

export default class Mine extends Component {
    state = {loading : false}
    constructor(props){
        super(props);
    }
    componentDidMount(){
    }
    onMine = () => {
        this.setState({loading : true});
        fetch(`${document.location.origin}/api/mine-transactions`)
        .then(res => res.json())
        .then(json => this.setState({loading: false}));
    }
    render(){
        return(
            <div>
                {
			    this.state.loading ? (<div className="sweet-loading">
					<CircleLoader
					  css={override}
					  size={150}
					  color={"#F71B56"}
					  loading={this.state.loading}
					/>
					</div>) : (<div className="centrify occupy">
                        <Button bsStyle="danger" onClick={this.onMine}> Mine</Button>
                    </div>)
			    }
            </div>
        )
    }
}