import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Item, Label } from "semantic-ui-react";
import NumberFormat from "react-number-format";
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

    const bookValue = account.bookValue ? account.bookValue.toFixed(2) : 0;
    const marketValue = account.marketValue ? account.marketValue.toFixed(2) : 0;

    return (
      <Segment.Group>
        <Segment>
          <Label as='span' color={`${account.accountType.name === "RRSP" ? "red" : "blue"}`} ribbon>
            {account.accountType.name}
          </Label>
          <Item.Group>
            <Item>
              <Item.Content>
                <Item.Header>
                  <div>{account.name}</div>
                </Item.Header>
                <Item.Meta>
                  Book Value:{" "}
                  <NumberFormat value={bookValue} displayType={"text"} thousandSeparator={true} prefix={"$"} />
                </Item.Meta>
                <Item.Meta>
                  Market Value:{" "}
                  <NumberFormat value={marketValue} displayType={"text"} thousandSeparator={true} prefix={"$"} />
                </Item.Meta>
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
