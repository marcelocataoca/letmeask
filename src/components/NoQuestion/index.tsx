import emptyQuestion from "../../assets/images/empty-questions.svg";
import "./style.scss"

export function NoQuestion() {
  return (
    <div className="no-questions">
      <img src={emptyQuestion} alt="" />
      <h3>Nenhuma pergunta criada</h3>
      <span>
        Envie o código desta sala para seus amigos e comece a responder
        perguntas!
      </span>
    </div>
  );
}
