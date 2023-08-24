import { redirect } from '@remix-run/node';

import config from '../aws-exports';

export const loader = async () =>
  redirect(
    `https://login.questrade.com/oauth2/authorize?client_id=${config.qt_client_id}&response_type=token&redirect_uri=${config.qt_redirect_url}/qtimplicit_cb`
  );

export default function () {
  return <div />;
}
