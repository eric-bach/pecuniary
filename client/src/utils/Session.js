import Pool from '../UserPool';

const isUserLoggedIn = async () => {
  const accessToken = await getAccessToken();

  return accessToken;
};

const getAccessToken = async () => {
  var session = await new Promise((resolve, reject) => {
    const user = Pool.getCurrentUser();

    if (user) {
      user.getSession((err, session) => {
        if (!err) {
          resolve(session);
        }
      });
    }

    /*
      if (user) {
        user.getSession((err: any, session: any) => {
          if (err) {
            reject();
          } else {
            resolve(session);
          }
        });
      } else {
        reject();
      }
      */
  });

  return session.accessToken.jwtToken;
};

export { isUserLoggedIn, getAccessToken };
