import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Segment, Item, Button } from "semantic-ui-react";

class AccountSummary extends Component {
  render() {
    const { account, deleteAccount } = this.props;

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
                <Item.Description>
                  {account.description}
                  <Button
                    as='a'
                    color='red'
                    floated='right'
                    onClick={() => deleteAccount(account)}
                    content='Delete'
                    data-test='delete-account-button'
                  />
                  <Button
                    as={Link}
                    to={`/accounts/edit/${account.aggregateId}`}
                    color='blue'
                    floated='right'
                    content='Edit'
                    data-test='edit-account-button'
                  />
                  <Button
                    as={Link}
                    to={{
                      pathname: `/accounts/view/${account.aggregateId}`,
                      state: {
                        account: account
                      }
                    }}
                    color='teal'
                    floated='right'
                    content='View'
                    data-test='view-account-button'
                  />
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment.Group>
    );
  }
}

export default AccountSummary;
