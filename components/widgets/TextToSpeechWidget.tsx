import React from "react";
import { useRouter } from "next/router";
import channelMessageRepository, {
  ChannelMessage,
} from "../../repositories/ChannelMessageRepository";
import WidgetTextWrapper from "./common/WidgetTextWrapper";
import HighlightWrapper from "./common/HighlightWrapper";

enum TextToSpeechWidgetStatus {
  Initial,
  GettingLastMessage,
  GettingNewestMessages,
}

const brianBaseURI =
  "https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=";

const makeBrianURI = (channelMessage: ChannelMessage): string => {
  let changedMessage = channelMessage.message;
  type Replacement = { regex: RegExp; replace: string };
  const replacements: Replacement[] = [
    {
      regex:
        /(\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi,
      replace: "[link]",
    },
    { regex: /wtii/gi, replace: "witty" },
    { regex: /kekw/gi, replace: "kek w" },
  ];

  replacements.forEach((replacement) => {
    changedMessage = changedMessage.replace(
      replacement.regex,
      replacement.replace
    );
  });

  return `${brianBaseURI}${encodeURIComponent(
    `${channelMessage.displayName} said: ${changedMessage}`
  )}`;
};

interface TextToSpeechWidgetState {
  status: TextToSpeechWidgetStatus;
  errorMessage: string;
  lastRetrievedMessage: ChannelMessage | null;
  queue: Array<ChannelMessage>;
  currentURI: string;
  cooldownSeconds: number;
  currentMessageData: ChannelMessage | null;
  //playing: boolean;
}

const initialState: TextToSpeechWidgetState = {
  status: TextToSpeechWidgetStatus.Initial,
  errorMessage: "",
  lastRetrievedMessage: null,
  queue: [],
  currentURI: "",
  cooldownSeconds: 10,
  currentMessageData: null,
  //playing: false,
};

const TextToSpeechWidget = () => {
  const router = useRouter();
  const { channelName } = router.query;

  const [state, setState] =
    React.useState<TextToSpeechWidgetState>(initialState);

  const createUpdatedState = React.useCallback(
    (newState: Partial<TextToSpeechWidgetState>): TextToSpeechWidgetState => {
      return { ...state, ...newState };
    },
    [state]
  );

  const {
    status,
    errorMessage,
    lastRetrievedMessage,
    queue,
    currentURI,
    cooldownSeconds,
    currentMessageData,
  } = state;

  const removeOneFromQueue = React.useCallback(() => {
    const newQueue = [...queue];
    newQueue.splice(0, 1);
    return newQueue;
  }, [queue]);

  const afterPlayCooldown = () => {
    console.log("Clearing current audio source");
    setState(createUpdatedState({ currentURI: "", currentMessageData: null }));
  };

  const onPlayEnded = () => {
    console.log("onPlayEnded");
    if (cooldownSeconds > 0) {
      setTimeout(() => {
        afterPlayCooldown();
      }, cooldownSeconds * 1000);
    } else {
      afterPlayCooldown();
    }
  };

  React.useEffect(() => {
    if (status === TextToSpeechWidgetStatus.Initial) {
      const interval = setInterval(() => {
        if (typeof channelName === "string" && channelName.length > 0) {
          console.log("Channel name retrieved, changing status");
          setState(
            createUpdatedState({
              status: TextToSpeechWidgetStatus.GettingLastMessage,
              errorMessage: "",
            })
          );
        }
      }, 100);

      const timeout = setTimeout(() => {
        console.log("Invalid channelName in address bar");
        setState(
          createUpdatedState({
            errorMessage: "Invalid channelName",
          })
        );
      }, 2500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [channelName, createUpdatedState, status]);

  React.useEffect(() => {
    if (status === TextToSpeechWidgetStatus.GettingLastMessage) {
      const interval = setInterval(() => {
        channelMessageRepository
          .getLastChannelMessage(channelName as string, (error) => {
            clearInterval(interval);
            console.log("Error while getting last message");
            setState(
              createUpdatedState({
                errorMessage: `Error while getting last message: ${error}`,
              })
            );
            setTimeout(() => {
              setState(
                createUpdatedState({
                  status: TextToSpeechWidgetStatus.GettingLastMessage,
                  errorMessage: "",
                })
              );
            }, 1000);
          })
          .then((channelMessage) => {
            if (channelMessage !== null) {
              clearInterval(interval);
              console.log(channelMessage);
              console.log(
                "Last message retrieved, changing status one last time"
              );
              setState(
                createUpdatedState({
                  status: TextToSpeechWidgetStatus.GettingNewestMessages,
                  lastRetrievedMessage: channelMessage,
                  queue: [],
                  errorMessage: "",
                })
              );
            } else {
              console.log("No message yet");
            }
          })
          .catch(null);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [channelName, createUpdatedState, status, lastRetrievedMessage]);

  React.useEffect(() => {
    if (status === TextToSpeechWidgetStatus.GettingNewestMessages) {
      const interval = setInterval(() => {
        //if (!state.playing) {
        channelMessageRepository
          .GetAllChannelMessagesFromCertainMessage(
            channelName as string,
            (lastRetrievedMessage as ChannelMessage).id,
            (error) => {
              clearInterval(interval);
              console.log("Error while getting newest messages");
              setState(
                createUpdatedState({
                  errorMessage: `Error while getting newest messages: ${error}`,
                })
              );
              setTimeout(() => {
                setState(
                  createUpdatedState({
                    status: TextToSpeechWidgetStatus.GettingLastMessage,
                    errorMessage: "",
                  })
                );
              }, 1000);
            }
          )
          .then((channelMessages) => {
            if (channelMessages !== null) {
              console.log(channelMessages);
              console.log("Newest messages retrieved");
              //const prefix = `@${(channelName as string).toLowerCase()}`;
              const filteredMessages = channelMessages; /*
                  .filter((messageData) => {
                    return messageData.message.toLowerCase().startsWith(prefix);
                  })
                  .map((messageData) => {
                    const newMessageData = {
                      ...messageData,
                      message: messageData.message.substring(prefix.length),
                    };
                    return newMessageData;
                  })*/
              setState(
                createUpdatedState({
                  queue: [...queue, ...filteredMessages],
                  lastRetrievedMessage:
                    channelMessages[channelMessages.length - 1],
                  errorMessage: "",
                })
              );
            } else {
              console.log("No newer messages");
            }
          })
          .catch(null);
        //}
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [
    channelName,
    createUpdatedState,
    lastRetrievedMessage,
    queue,
    //state.playing,
    status,
  ]);

  React.useEffect(() => {
    if (
      status === TextToSpeechWidgetStatus.GettingNewestMessages &&
      currentURI === "" &&
      currentMessageData === null
    ) {
      if (queue.length === 0) {
        //createUpdatedState({ playing: false });
        console.log("Queue is empty");
      } else if (queue.length > 0) {
        console.log("Queue is not empty, changing audio source");
        setState(
          createUpdatedState({
            currentURI: makeBrianURI(queue[0]),
            currentMessageData: queue[0],
            queue: removeOneFromQueue(),
            //playing: true,
          })
        );
      }
    }
  }, [
    currentURI,
    createUpdatedState,
    queue,
    queue.length,
    status,
    removeOneFromQueue,
    currentMessageData,
  ]);

  return (
    <React.Fragment>
      <audio
        src={currentURI}
        autoPlay
        preload="auto"
        onEnded={() => {
          onPlayEnded();
        }}
      />
      {status === TextToSpeechWidgetStatus.Initial && <p>Loading (0/2)</p>}
      {status === TextToSpeechWidgetStatus.GettingLastMessage && (
        <p>Loading (1/2)</p>
      )}
      {errorMessage !== "" && <WidgetTextWrapper errorMessage={errorMessage} />}
      {currentMessageData !== null && (
        <React.Fragment>
          <WidgetTextWrapper
            header={
              <React.Fragment>
                <HighlightWrapper text={currentMessageData.displayName} />
                &nbsp;said
              </React.Fragment>
            }
            message={currentMessageData.message}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default TextToSpeechWidget;
