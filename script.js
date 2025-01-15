document.addEventListener('DOMContentLoaded', function () {
     console.log('DOM fully loaded and parsed');
     // Remove fetch call to avoid CORS issues
     // fetch('questions.txt')
     //     .then(response => {
     //         console.log('Fetching questions.txt');
     //         if (!response.ok) {
     //             throw new Error('Network response was not ok ' + response.statusText);
     //         }
     //         return response.text();
     //     })
     //     .then(content => {
     //         console.log('File content loaded');
     //         generateQuestions(content);
     //     })
     //     .catch(error => console.error('There has been a problem with your fetch operation:', error));
     updateFloatingButton();
});

document.getElementById('fileInput').addEventListener('change', function (event) {
     const file = event.target.files[0];
     if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
               const content = e.target.result;
               generateQuestions(content);
               updateFloatingButton();
          };
          reader.readAsText(file);
     }
});

function generateQuestions(content) {
     console.log('Generating questions');
     const questionsContainer = document.getElementById('questionsContainer');
     questionsContainer.innerHTML = '';

     const lines = content.split('\n');
     let question = null;
     let answers = [];
     let correctAnswer = null;
     let questionNumber = 0;

     // Extract title and subtitles
     const title = lines.shift().split(':')[1].trim();
     const subtitles = [];
     while (lines[0].startsWith('SubTitle:')) {
          subtitles.push(lines.shift().split(':')[1].trim());
     }
     lines.shift(); // Remove the "Questions" line

     // Display title and subtitles
     document.getElementById('title').textContent = title;
     document.getElementById('subtitle').innerHTML = subtitles.map(sub => `<div>${sub}</div>`).join('');

     lines.forEach(line => {
          if (line.match(/^\d+\./)) {
               if (question) {
                    addQuestionToContainer(questionNumber, question, answers, correctAnswer);
               }
               questionNumber++;
               question = line.split('.')[1].trim();
               answers = [];
               correctAnswer = null;
          } else if (line.match(/^[A-D]:/)) {
               answers.push({ label: line[0], text: line.substring(2).trim() });
          } else if (line.match(/^-[A-D]:/)) {
               correctAnswer = line[1];
               answers.push({ label: line[1], text: line.substring(3).trim() });
          }
     });

     if (question) {
          addQuestionToContainer(questionNumber, question, answers, correctAnswer);
     }
}

function addQuestionToContainer(questionNumber, question, answers, correctAnswer) {
     console.log('Add QS:', question);
     const questionDiv = document.createElement('div');
     questionDiv.classList.add('question');

     const questionTitle = document.createElement('h2');
     questionTitle.textContent = `${questionNumber}. ${question}`;
     questionDiv.appendChild(questionTitle);

     const answersList = document.createElement('ul');
     answersList.classList.add('answers');

     answers.forEach(answer => {
          const answerItem = document.createElement('li');
          answerItem.textContent = `${answer.label}: ${answer.text}`;
          answerItem.addEventListener('click', function () {
               if (answer.label === correctAnswer) {
                    answerItem.classList.add('correct');
               } else {
                    answerItem.classList.add('incorrect');
               }
               updateFloatingButton();
          });
          answersList.appendChild(answerItem);
     });

     questionDiv.appendChild(answersList);
     document.getElementById('questionsContainer').appendChild(questionDiv);
}

function updateFloatingButton() {
     const totalQuestions = document.querySelectorAll('.question').length;
     const correctAnswers = document.querySelectorAll('.answers li.correct').length;
     const incorrectAnswers = document.querySelectorAll('.answers li.incorrect').length;

     const floatingButton = document.getElementById('floatingButton');
     floatingButton.innerHTML = `<span>Q-${totalQuestions} <span style="color: green;">C-${correctAnswers}</span> <span style="color: red;">I-${incorrectAnswers}</span></span>`;
}
