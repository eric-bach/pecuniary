import React from "react";
import {
  Segment,
  Container,
  Header,
  Image,
  Button,
  Icon
} from "semantic-ui-react";

const HomePage = ({ history }) => {
  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1' inverted>
          <Image
            size='massive'
            src='/favicon-32x32.png'
            alt='logo'
            style={{ marginBottom: 12 }}
          />
          Pecuniary
        </Header>
        <Button onClick={() => history.push("/home")} size='huge' inverted>
          Get started
          <Icon name='right arrow' inverted />
        </Button>
      </Container>
    </Segment>
  );
};

export default HomePage;
