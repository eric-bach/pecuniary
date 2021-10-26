import { Dimmer, Loader } from 'semantic-ui-react';

const Loading = () => {
  return (
    <Dimmer inverted={true} active={true}>
      <Loader content='Loading...'></Loader>
    </Dimmer>
  );
};

export default Loading;
