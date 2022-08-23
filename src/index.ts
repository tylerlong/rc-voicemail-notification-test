import RingCentral from '@rc-ex/core';
import PubNubExtension from '@rc-ex/pubnub';
import waitFor from 'wait-for-async';

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  // await rc.authorize({
  //   username: process.env.RINGCENTRAL_USERNAME!,
  //   extension: process.env.RINGCENTRAL_EXTENSION,
  //   password: process.env.RINGCENTRAL_PASSWORD!,
  // });
  rc.token = {access_token: process.env.token};
  const extInfo = await rc.restapi().account().extension().get();
  console.log(JSON.stringify(extInfo, null, 2));
  const pubnubExtension = new PubNubExtension();
  await rc.installExtension(pubnubExtension);
  const subInfo = await pubnubExtension.subscribe(
    [
      '/restapi/v1.0/account/~/extension/~/voicemail',
      '/restapi/v1.0/account/~/extension/~/message-store',
    ],
    event => {
      console.log(JSON.stringify(event, null, 2));
    }
  );
  console.log(JSON.stringify(subInfo._subscriptionInfo, null, 2));
  await waitFor({interval: 999999999});
};

main();
