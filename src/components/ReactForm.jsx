import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormResponse from "./FormResponse";

function ReactForm() {
  const [question, setQuestion] = useState("");
  const [searchDisplay, setSearchDisplay] = useState(
    JSON.parse(localStorage.getItem("savedPrompt")) || []
  );
  const sendQuestion = (e) => {
    e.preventDefault();
    const data = {
      prompt: question + "?",
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };
    fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        let saveResponse = { question: question, answer: data.choices[0].text };
        let allResponses = [saveResponse].concat(searchDisplay);
        setSearchDisplay(allResponses);
        localStorage.setItem("savedPrompt", JSON.stringify(allResponses));
      });
  };

  const clearAll = () => {
    localStorage.removeItem("savedPrompt");
    setSearchDisplay([]);
  };

  const deleteAnswer = (deleteIndex) => {
    const newSearchDisplay = searchDisplay.filter((v, index) => {
      return index !== deleteIndex;
    });
    setSearchDisplay(newSearchDisplay);
    localStorage.setItem("savedPrompt", JSON.stringify(newSearchDisplay));
  };

  return (
    <Container>
      <Form onSubmit={sendQuestion}>
        <Form.Group className="mb-3">
          <Form.Label>
            <h1>Welcome to "WOYM"</h1>
            <p>
              WOYM (What's On Your Mind), is a simple chatbox that can answer
              question a question or even right a poem!! Try it below.{" "}
            </p>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="So... what's on your mind?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </Form.Group>
        <Button variant="outline-primary" type="submit">
          Submit
        </Button>
      </Form>
      <div>
        <h3>Responses:</h3>
        {searchDisplay.map((search, index) => {
          return (
            <FormResponse
              key={index}
              question={search.question}
              answer={search.answer}
              answerIndex={index}
              deleteAnswer={deleteAnswer}
            />
          );
        })}
      </div>
      <br />
      <Button variant="danger" onClick={clearAll}>
        Clear All
      </Button>
    </Container>
  );
}

export default ReactForm;
