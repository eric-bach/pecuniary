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
                <Item.Meta>{account.accountType.name} account</Item.Meta>
                <Item.Description>
                  {account.description}
                  <Button as='a' color='red' floated='right' onClick={() => deleteAccount(account)} content='Delete' />
                  <Button as={Link} to={`/accounts/${account.id}`} color='teal' floated='right' content='Edit' />
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
