import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Item } from "semantic-ui-react";
import { getAccount } from "../../domain/account/actions";

class AccountHeader extends Component {
  componentDidMount() {
    this.props.getAccount(this.props.aggregateId);
  }

  render() {
    const { account } = this.props;

    if (!account) {
      return <div></div>;
    }

    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size='tiny'>
                <div className={`ui horizontal label ${account.accountType.name === "RRSP" ? "red" : "blue"}`}>
                  {account.accountType.name}
                </div>
              </Item.Image>
              <Item.Content>
                <Item.Header>
                  <div>{account.name}</div>
                </Item.Header>
                <Item.Meta>Book Value: ${account.bookValue.toFixed(2)}</Item.Meta>
                <Item.Meta>Market Value: ${account.marketValue.toFixed(2)}</Item.Meta>
                <Item.Description>{account.description}</Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment.Group>
    );
  }
}

const mapStateToProps = state => {
  return {
    account: state.accounts.account
  };
};

const actions = {
  getAccount
};

export default connect(mapStateToProps, actions)(AccountHeader);
