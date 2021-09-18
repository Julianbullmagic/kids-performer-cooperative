import React from "react";
import moment from 'moment';

function ChatCard(props) {
    return (
        <div style={{ width: '90%',background:"#e0e8e6",margin:"10px",padding:"10px" }}>
        <p>author:{props.sender.name}</p>
        <p>message:{props.message}</p>
        </div>
    )
}

export default ChatCard;
