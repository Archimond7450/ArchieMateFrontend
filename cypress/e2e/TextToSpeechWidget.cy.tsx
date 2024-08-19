import { type ChannelMessage } from "../../repositories/ChannelMessageRepository";

describe("<TextToSpeechWidget />", () => {
  const firstMessage: ChannelMessage = {
    id: "1",
    displayName: "Archimond7450",
    message: "test",
  };

  const lastMessage: ChannelMessage = {
    id: "2",
    displayName: "HivePhaser",
    message: "PeepoArrive",
  };

  beforeEach(() => {
    // Visit the page where the TextToSpeechWidget component is rendered
    cy.visit("/widgets/tts/archimond7450");

    // Mock the API responses for getting the last message and newest messages
    cy.intercept("GET", "**/api/v1/twitch_channel_messages/archimond7450", {
      body: { firstMessage },
    }).as("getLastMessage");
    cy.intercept(
      "GET",
      "**/api/v1/twitch_channel_messages/archimond7450/from/1",
      { body: [lastMessage] }
    ).as("getNewMessages");
  });

  it("should display initial loading state", () => {
    cy.contains("Loading (0/2)").should("be.visible");
  });

  it("should change status to GettingLastMessage and display loading state", () => {
    cy.wait("@getLastMessage");
    cy.contains("Loading (1/2)").should("be.visible");
  });

  it("should handle and display an error message", () => {
    cy.intercept("GET", "**/**/api/v1/twitch_channel_messages/archimond7450", {
      statusCode: 500,
      body: { error: "Error fetching message" },
    }).as("getLastMessageError");

    cy.reload(); // Reload to trigger the intercept

    cy.wait("@getLastMessageError");
    cy.contains("Error while getting last message").should("be.visible");
  });

  it("should display the retrieved message", () => {
    cy.wait("@getLastMessage");
    cy.contains(lastMessage.displayName).should("be.visible");
    cy.contains(lastMessage.message).should("be.visible");
  });

  //it('should play audio with the correct URI', () => {
  //    cy.wait('@getLastMessage');
  //    cy.get('audio')
  //      .should('have.attr', 'src')
  //      .and('include', `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${mockMessageEncoded}`);
  //  });

  //it('should handle queue and play the next message', () => {
  //    cy.wait('@getNewMessages');
  //    cy.get('audio').then((audio) => {
  //      audio[0].dispatchEvent(new Event('ended')); // Simulate audio ending
  //    });
  //    cy.wait(1000); // wait for the state change
  //    cy.get('audio')
  //      .should('have.attr', 'src')
  //      .and('include', `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${mockMessageEncoded}`);
  //});

  //  it('should handle an empty queue scenario', () => {
  //    cy.intercept('GET', '**/getAllChannelMessagesFromCertainMessage*', { body: [] }).as('getEmptyMessages');
  //
  //    cy.reload(); // Reload to trigger the intercept
  //
  //    cy.wait('@getEmptyMessages');
  //    cy.contains('Queue is empty').should('be.visible');
  //  });

  //  it('should clear the audio source after cooldown', () => {
  //    cy.wait('@getNewMessages');
  //    cy.get('audio').then((audio) => {
  //      audio[0].dispatchEvent(new Event('ended')); // Simulate audio ending
  //    });
  //    cy.wait(1000);
  //    cy.get('audio').should('have.attr', 'src', '');
  //});
  //});
});
