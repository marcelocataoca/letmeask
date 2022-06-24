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
import { Box, Container, Tab, Tabs, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import {Shimmer} from "react-shimmer";
import SearchIcon from '@mui/icons-material/Search';
import { NoQuestion } from "../components/NoQuestion";

type RoomParams = {
  id: string;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
          <span>{children}</span>
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

export function AdminRoom() {
  // const { user } = useAuth();
  //generic props: tipando os param
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { questions, title } = useRoom(roomId);
  const [load, setLoad] = useState(true);

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

  useEffect(() => {
    setTimeout(()=> {
      setLoad(false);
    },1500)
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filterData = (query: any, questions: any) => {
    if (!query || query === undefined) {
      return questions;
    } else {         
      return questions.filter((d: any) => d.content.toLowerCase().includes(query));
    }
  };
  
  const dataFiltered = filterData(searchQuery, questions);

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
          <div className="center">
            <h1>Sala {title}</h1>
            {questions.length > 0 && <span className="center">{questions.length} pergunta(s)</span>}
          </div>
          <TextField
            id="search-bar"           
            onChange={(e) => {
              setSearchQuery((e.target as HTMLInputElement).value);
            }}                            
            label="Buscar pergunta"
            variant="outlined"
            placeholder="Search..."
            size="small" 
            InputProps={{
              endAdornment: <SearchIcon/>
            }}
          />
        </div>
        <div className="question-list">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                aria-label="basic tabs"
              >
                <Tab label="Frequentes" {...a11yProps(0)} />
                <Tab label="Respondidas" {...a11yProps(1)} />
              </Tabs>
            </Box>
            {dataFiltered.length > 0 && !load &&  dataFiltered.map((question: any, index: any) => {
              return (
                <div key={index}>                  
                  <TabPanel value={tabValue} index={0}>
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

                    {/* Todas perguntas respondidas */}
                    {dataFiltered.filter((value: any) => !value.isAnswered).length === 0 && index === 0 && !load &&                      
                      <Container className="container-empty">
                        <p className="msg-empty">Todas perguntas foram repondidas! </p>
                      </Container>
                    }
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
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

                    {/* Nenhuma pergunta respondida */}
                    {dataFiltered.filter((value: any) => value.isAnswered).length === 0 && index === 0 && !load &&                      
                      <Container className="container-empty">
                        <p className="msg-empty">Nenhum pergunta respondida! </p>
                      </Container>
                    }
                  </TabPanel>
                </div>
              );
            })}

            {/* Nenhum resultado encontrado */}
            {dataFiltered.length === 0 &&  !load &&
             <NoQuestion/>
            }
            {load &&
              <div className="container-shimmer">
                <Shimmer width={750} height={50} />
              </div>
            }
          </Box>
        </div>
      </main>
    </div>
  );
}
