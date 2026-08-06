window.TreeQuiz = (() => {
  function render() {
    const container = document.getElementById("quizContainer");
    if (!container) return;
    const saved = TreeStorage.read();
    container.innerHTML = TreeLecture.quiz.map((item, index) => {
      const choices = item.choices ? `<div class="choice-list">${item.choices.map(choice => `<button class="choice" data-answer="${choice}" data-index="${index}">${choice}</button>`).join("")}</div>` : "";
      const state = saved.answered[index] === true ? "correct" : saved.answered[index] === false ? "wrong" : "";
      return `<article class="quiz-card ${state}">
        <p class="eyebrow">${item.type.toUpperCase()}</p>
        <h3>${item.q}</h3>
        ${choices}
        <button class="btn ghost show-answer" data-index="${index}">Show Answer</button>
        <p class="answer" id="answer-${index}" hidden>${item.answer}</p>
      </article>`;
    }).join("");
    bind();
    updateScore();
  }

  function bind() {
    document.querySelectorAll(".choice").forEach(button => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        const correct = button.dataset.answer === TreeLecture.quiz[index].answer;
        TreeStorage.setQuizResult(index, correct);
        render();
      });
    });

    document.querySelectorAll(".show-answer").forEach(button => {
      button.addEventListener("click", () => {
        const index = button.dataset.index;
        const answer = document.getElementById(`answer-${index}`);
        answer.hidden = !answer.hidden;
      });
    });
  }

  function updateScore() {
    const score = TreeStorage.read().score;
    const target = document.getElementById("quizScore");
    if (target) target.textContent = `${score}/${TreeLecture.quiz.length}`;
  }

  return { render, updateScore };
})();
