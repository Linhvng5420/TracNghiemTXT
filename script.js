document.addEventListener('DOMContentLoaded', function() {
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
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            generateQuestions(content);
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

    lines.forEach(line => {
        if (line.match(/^\d+:/)) {
            if (question) {
                addQuestionToContainer(question, answers, correctAnswer);
            }
            question = line.split(':')[1].trim();
            answers = [];
            correctAnswer = null;
        } else if (line.match(/^[A-D]-:/)) {
            correctAnswer = line.substring(2).trim();
            answers.push(correctAnswer);
        } else if (line.match(/^[A-D]:/)) {
            answers.push(line.substring(2).trim());
        }
    });

    if (question) {
        addQuestionToContainer(question, answers, correctAnswer);
    }
}

function addQuestionToContainer(question, answers, correctAnswer) {
    console.log('Adding question to container:', question);
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    const questionTitle = document.createElement('h2');
    questionTitle.textContent = question;
    questionDiv.appendChild(questionTitle);

    const answersList = document.createElement('ul');
    answersList.classList.add('answers');

    answers.forEach(answer => {
        const answerItem = document.createElement('li');
        answerItem.textContent = answer;
        if (answer === correctAnswer) {
            answerItem.classList.add('correct');
        }
        answersList.appendChild(answerItem);
    });

    questionDiv.appendChild(answersList);
    document.getElementById('questionsContainer').appendChild(questionDiv);
}
