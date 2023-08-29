import React, { useState } from "react";
import Chatbot from "./components/chatbot/Chatbot";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./App.css";
import Faq from "./components/Faq";
import Help from "./components/Help";
import QuestionEditor from "./components/QuestionEditor";
import DialogFlowContext from "./DialogFlowContext";

const App = () => {
  const [jsonData, setJsonData] = React.useState([]);
  return (
    <DialogFlowContext.Provider value={{jsonData, setJsonData}}>
      <Router>
        <Header />
        <main className="py-3">
          <Container className="bg-white">
            <div className="bot">
              <Route path="/" component={Chatbot} exact />
            </div>
            <Route path="/faq" component={Faq} />
            <Route path="/help" component={Help} />
            <Route path="/" component={QuestionEditor} exact />
          </Container>
        </main>
        <Footer />
      </Router>
    </DialogFlowContext.Provider>
  );
};

export default App;
