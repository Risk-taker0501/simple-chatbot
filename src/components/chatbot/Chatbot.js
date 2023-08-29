import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import Post from "./Post";
import Link from "./Link";
import "../../App.css";
import { useContext } from "react";
import DialogFlowContext from "../../DialogFlowContext";
import { useEffect } from "react";
const theme = {
  background: "#f5f8fb",
  fontFamily: "Helvetica Neue",
  headerBgColor: "#0f4d4a",
  headerFontColor: "#fff",
  headerFontSize: "15px",
  botBubbleColor: "#0f4d4a",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#4a4a4a"
};

// all available config props
const config = {
  width: "350px",
  height: "500px",
  hideUserAvatar: true,
  placeholder: "Type your response.",
  headerTitle: "ChatBot"
};

const Chatbot = props => {
  let [showChat, setShowChat] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  let [chatSteps, setChatSteps] = useState([
    {
      id: "1",
      message: "Welcome to our healthcare clinic. How can we assist you today?",
      trigger: "2"
    },
    {
      id: "2",
      options: [
        { value: "appointment", label: "Book an appointment", trigger: "3" },
        { value: "services", label: "Learn about our services", trigger: "4" },
        { value: "contact", label: "Contact information", trigger: "5" }
      ]
    },
    {
      id: "3",
      message:
        "Please provide your preferred date and time for the appointment.",
      trigger: "6"
    },
    {
      id: "4",
      message:
        "We offer a wide range of services including general check-ups, vaccinations, and specialized treatments. How can we assist you?",
      trigger: "2"
    },
    {
      id: "5",
      message:
        "You can reach us at 123-456-7890 or email us at info@example.com.",
      trigger: "2"
    },
    {
      id: "6",
      user: true,
      trigger: "7"
    },
    {
      id: "7",
      message:
        "Thank you! Your appointment has been booked for {previousValue}.",
      end: true
    }
  ]);
  const { jsonData } = useContext(DialogFlowContext);

  useEffect(() => {
    if (jsonData.length > 0) {
      let tempSteps = jsonData;
      tempSteps.push({
        id: "end",
        message: "Thank you!",
        end: true
      });
      setChatSteps(tempSteps);
      setChatKey(chatKey + 1);

      console.log("juju", tempSteps);
    }
  }, [jsonData]);

  const startChat = () => {
    setShowChat(true);
  };
  const hideChat = () => {
    setShowChat(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: showChat ? "none" : "" }}>
        <ChatBot
          key={chatKey}
          speechSynthesis={{ enable: true, lang: "en-US" }}
          recognitionEnable={true}
          steps={chatSteps}
          {...config}
        />
      </div>
      <div>
        {!showChat ? (
          <button className="btn" onClick={() => startChat()}>
            <i className="fa fa-minus"></i>
          </button>
        ) : (
          <button className="btn" onClick={() => hideChat()}>
            <i className="fa fa-plus"></i>
          </button>
        )}
      </div>
    </ThemeProvider>
  );
};

export default Chatbot;
