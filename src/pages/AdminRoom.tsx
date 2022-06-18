import { useHistory, useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useRoom } from "../hooks/useRoom";
import "../styles/room.scss";
import { database } from "../services/firebase";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";

type RoomParams = {
  id: string;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function AdminRoom() {
  // const { user } = useAuth();
  //generic props: tipando os param
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [tabValue, setTabValue] = useState(0);

  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAT: new Date(),
    });
    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }} key={index}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="LetmeAsk" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Frequentes" {...a11yProps(0)} />
                <Tab label="Respondidas" {...a11yProps(1)} />
              </Tabs>
            </Box>
            {questions.map((question, index) => {
              return (
                <>                  
                  <TabPanel value={tabValue} index={0} key={index}>
                    {!question.isAnswered && (
                      <Question
                        key={question.id}
                        content={question.content}
                        author={question.author}
                        isAnswered={question.isAnswered}
                        isHighlighted={question.isHighlighted}
                      >
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleCheckQuestionAsAnswered(question.id)
                            }
                          >
                            <img
                              src={checkImg}
                              alt="Marcar como respondida"
                              title="Marcar como respondida"
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHighlightQuestion(question.id)}
                          >
                            <img
                              src={answerImg}
                              alt="Destacar pergunta"
                              title="Destacar pergunta"
                            />
                          </button>
                        </>

                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <img
                            src={deleteImg}
                            alt="Remover pergunta"
                            title="Remover pergunta"
                          />
                        </button>
                      </Question>
                    )}
                  </TabPanel>
                  <TabPanel value={tabValue} index={1} key={index}>
                    {question.isAnswered && (
                      <Question
                        key={question.id}
                        content={question.content}
                        author={question.author}
                        isAnswered={question.isAnswered}
                        isHighlighted={question.isHighlighted}
                      >
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <img
                            src={deleteImg}
                            alt="Remover pergunta"
                            title="Remover pergunta"
                          />
                        </button>
                      </Question>
                    )}
                  </TabPanel>
                </>
              );
            })}
          </Box>
        </div>
      </main>
    </div>
  );
}
