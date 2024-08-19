import React from "react";
import Head from "next/head";
import Code from "../components/Code";

const DocsPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>ArchieMate | Docs</title>
      </Head>
      <h1>Docs</h1>
      <h2>Built-in variables</h2>
      <p>
        In your created commands you can refer to any built-in variable using
        this syntax
      </p>
      <Code>
        {
          "${variable:param1=value,param2='longer value' ; param3 = \"another longer value\", paramwithoutvalue}"
        }
      </Code>
      <p>for maximum configuration or just</p>
      <Code>{"${variable}"}</Code>
      <p>for a simple usage.</p>
      <p>For details please see each built-in variable</p>
      <p>
        Parameters for built-in variables can be separated either using colon or
        semicolon. Spaces between parameters and equal signs are ignored (as
        seen in the example).
      </p>
      <h3>Time</h3>
      <p>Usage:</p>
      <Code>{"${time} | ${time:format=timeformat,zone=timezone}"}</Code>
      <p>
        Returns the current time either using default format
        &quot;HH:mm:ss&quot; and default zone &quot;UTC&quot; if format and zone
        parameters are not specified
      </p>
      <p>
        You can also use built-in variable{" "}
        {"${time:format=timeformat,zone=timezone}"}
        to format the current time. The format parameter should be a valid date
        format string (e.g. &quot;HH:mm:ss&quot;, &quot;YYYY-MM-DD&quot;, etc.).
        The timezone parameter should be a valid timezone string (e.g.
        &quot;UTC&quot;, &quot;Europe/Prague&quot;, etc.).
      </p>
      <h3>Chatters</h3>
      <p>Usage:</p>
      <Code>{"${chatters} | ${chatters:separator=sep}"}</Code>
      <p>
        Returns a list of chatters specified before a command call. Optionally a
        separator can be configured. By default this is one space character.
      </p>
      <p>
        Example of response for command !somecommand with the response &quot;
        {"${chatters:separator=' and '}"}&quot; for the user input &quot;
        {"@user1 @user2 @user3 !somecommand parameters"}&quot;:
      </p>
      <Code>@user1 @user2 @user3</Code>
      <h3>Sender</h3>
      <p>Usage:</p>
      <Code>{"${sender} | ${sender:notag}"}</Code>
      <p>
        Returns the display name of the user who called the command. Parameter
        notag can be specified with either no value or any value so that the
        response doesn&apos;t contain the &apos;@&apos; letter.
      </p>
      <h3>Random</h3>
      <p>Usage:</p>
      <Code>{"${random} | ${random:from=numberfrom;to=numberto"}</Code>
      <p>
        Returns a random number between from to to parameters (including both
        numbers). The default is 0 for the from parameter and 100 for the to
        parameter.
      </p>
      <h2>Interaction on Twitch</h2>
      <h3>Managing commands for a channel</h3>
      <p>
        You can use the built-in command !command to create, edit or delete a
        command. For detailed usage please see subchapters. Here&apos;s the full
        usage:
      </p>
      <Code>
        !commands (add/create|edit/update/change|remove/delete) ([!]command)
        [response]
      </Code>
      <h4>Creating a command</h4>
      <p>
        To create a simple command on Twitch use the built-in command !command
        with the add or create parameter. The command must not exist yet. If it
        already exists, an error message is replied. Here are some examples:
      </p>
      <Code>!commands add !from France</Code>
      <p>
        This will create a command &quot;!from&quot; with a response
        &quot;France&quot;.
      </p>
      <Code>{"!commands create time It is ${time}"}</Code>
      <p>
        This will create a command &quot;!time&quot; with a response &quot;It is
        [evaluated value of built-in variable time]&quot;.
      </p>
      <h4>Editing a command</h4>
      <p>
        To edit a simple command on Twitch use the built-in command !command
        with the edit, update or change parameter. The command must already
        exist. If it doesn&apos;t, an error message is replied. Here is an
        example that changes the command &quot;!from&quot; so it will newly
        respond with &quot;Austria&quot;:
      </p>
      <Code>!commands update !from Austria</Code>
      <h4>Deleting a command</h4>
      <p>
        To delete a command, use the built-in command !command with the delete
        or remove parameter. The command must already exist. If it doesn&apos;t,
        an error message is replied. Here is an example that deletes the command
        &quot;!time&quot;:
      </p>
      <Code>!commands delete !time</Code>
    </React.Fragment>
  );
};

export default DocsPage;
