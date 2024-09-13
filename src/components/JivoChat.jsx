import React, { Component } from 'react';

class JivoChat extends Component {
  componentDidMount() {
    // Create script element and set its attributes
    const script = document.createElement('script');
    script.src = '//code.jivosite.com/widget/BCyqCB2cwk'; // Replace 'YourWidgetID' with the actual ID from your JivoChat script
    script.async = true;

    // Append the script to the 'body' of the document
    document.body.appendChild(script);
  }

  render() {
    return <div id="jivo-chat-container"/>;
  }
}

export default JivoChat;
