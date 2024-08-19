import { ErrorCallback, callErrorCallbackOnErrorAsync } from "./common";

const rootEndpoint = "/api/v1/twitch_channel_messages";

export interface ChannelMessage {
  id: string;
  displayName: string;
  message: string;
}

function constructEndpoint(endpoint = "") {
  return endpoint.length > 0 ? `${rootEndpoint}/${endpoint}` : rootEndpoint;
}

class ChannelMessageRepository {
  async getLastChannelMessage(
    channelName: string,
    onErrorCallback?: ErrorCallback
  ) {
    const response = await fetch(constructEndpoint(channelName));
    if (response.ok) {
      if (response.status === 200) {
        return (await response.json()) as ChannelMessage;
      }
      if (response.status === 204) {
        return null;
      }
    }

    callErrorCallbackOnErrorAsync(response, onErrorCallback);

    return null;
  }

  async GetAllChannelMessagesFromCertainMessage(
    channelName: string,
    messageFromId: string,
    onErrorCallback?: ErrorCallback
  ) {
    const response = await fetch(
      constructEndpoint(`${channelName}/from/${messageFromId}`)
    );
    if (response.ok) {
      if (response.status === 200) {
        return (await response.json()) as Array<ChannelMessage>;
      }
      if (response.status === 204) {
        return null;
      }
    }

    callErrorCallbackOnErrorAsync(response, onErrorCallback);

    return null;
  }

  async GetAll(onErrorCallback?: ErrorCallback) {
    const response = await fetch(constructEndpoint());
    if (response.ok) {
      return (await response.json()) as Array<ChannelMessage>;
    }

    callErrorCallbackOnErrorAsync(response, onErrorCallback);

    return null;
  }
}

const channelMessageRepository = new ChannelMessageRepository();
export default channelMessageRepository;
