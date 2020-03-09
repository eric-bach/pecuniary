import React, { Component } from "react";
import { Message, Icon, Progress } from "semantic-ui-react";
import { API, graphqlOperation } from "aws-amplify";
import {
  onCreateAccountReadModel,
  onUpdateAccountReadModel,
  onDeleteAccountReadModel
} from "../../graphql/subscriptions";

class Processing extends Component {
  state = { percent: 0 };

  createAccountListener = API.graphql(graphqlOperation(onCreateAccountReadModel)).subscribe({
    next: () => {
      this.setState(prevState => ({
        percent: prevState.percent === 0 ? 100 : 0
      }));

      if (this.state.percent === 100) {
        setTimeout(() => {
          this.props.history.push(this.props.location.state.path);
        }, 500);
      }
    }
  });

  updateAccountListener = API.graphql(graphqlOperation(onUpdateAccountReadModel)).subscribe({
    next: () => {
      this.setState(prevState => ({
        percent: prevState.percent === 0 ? 100 : 0
      }));

      if (this.state.percent === 100) {
        setTimeout(() => {
          this.props.history.push(this.props.location.state.path);
        }, 500);
      }
    }
  });

  deleteAccountListener = API.graphql(graphqlOperation(onDeleteAccountReadModel)).subscribe({
    next: () => {
      this.setState(prevState => ({
        percent: prevState.percent === 0 ? 100 : 0
      }));

      if (this.state.percent === 100) {
        setTimeout(() => {
          this.props.history.push(this.props.location.state.path);
        }, 500);
      }
    }
  });

  componentWillUnmount() {
    this.createAccountListener.unsubscribe();
    this.updateAccountListener.unsubscribe();
    this.deleteAccountListener.unsubscribe();
  }

  render() {
    return (
      <div>
        <Message icon>
          <Icon name='circle notched' loading />
          <Message.Content>
            <Message.Header>Just one second</Message.Header>
            {this.props.location.state.message}
          </Message.Content>
        </Message>
        <Progress percent={this.state.percent} autoSuccess />
      </div>
    );
  }
}

export default Processing;
