document.addEventListener("DOMContentLoaded", () => {
    createSquares();
    getNewWord();

    let guessedWords = [[]];
    let availableSpace = 1;

    let word;
    let guessedWordCount = 0;
    
    
    const keys = document.querySelectorAll('.keyboard-row button');


    //Function for word bank
    function getNewWord(){
        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5&?partOfSpeech=verb`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                    "x-rapidapi-key":
                        "bc83c70a70mshf126c52b8bed4fap10cd03jsn4fc9b3921659",
                },
            }

        )
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                word = res.word;
            })
            .catch((err) => {
                console.error(err);
            });

    }

  


    function getCurrentWordArr(){
        const numberOfGuessedWords = guessedWords.length;
        return  guessedWords[numberOfGuessedWords - 1];
    }



    function updateGuessedWords(letter){
        const currentWordArr = getCurrentWordArr();

        if(currentWordArr && currentWordArr.length < 5){
        currentWordArr.push(letter);

        //Makes letters fill avaliable spaces 
        const availableSpaceEL = document.getElementById(String(availableSpace));
        availableSpace = availableSpace + 1;

        availableSpaceEL.textContent = letter;
        }
    }

    //Function for tile colors
    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter)

        if(!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }

        const letterInThatPosition = word.charAt(index)
        const isCorrectPosition = letter === letterInThatPosition

        if(isCorrectPosition){
            return "rgb(83,141,78)";
        }

        return "rgb(181, 159, 59)";

    }


    //function for submitting words
    function handleSubmitWord(){
        const currentWordArr = getCurrentWordArr()
        //error message
        if (currentWordArr.length !==5) {
            window.alert("Word must be 5 letters");
        }

        const currentWord = currentWordArr.join("");


        fetch(
            `https://wordsapiv1.p.rapidapi.com/words/${currentWord}`,
            {
                method: "GET",
                headers:{
                    "X-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                    "x-rapidapi-key":
                        "bc83c70a70mshf126c52b8bed4fap10cd03jsn4fc9b3921659",
                },
            }
        ).then((res) => {
            if(!res.ok) {
                throw Error()
            }

            //Tiles changing colour & tile animation
        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) =>{
            setTimeout(() =>{
                const tileColor = getTileColor(letter, index);

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;

            }, interval * index);
        });

        guessedWordCount += 1;
       
        //Message if word is correct
        if (currentWord === word) {
            window.alert("Well done!");
        }
        
        //Game lost message
        if (guessedWords.length === 6) {
            window.alert(`No more guesses - the word is ${word}`);
        }

        //Allows user to guess another word on next line
        guessedWords.push([]);

        }).catch(() =>{
            window.alert("Word not recognised!");
        })

    }


    //function for creating squares
    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            //animation of tiles flipping
            square.classList.add("animate__animated");


            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    //funtion for deleting a letter
    function handleDeleteLetter(){
        const currentWordArr = getCurrentWordArr()
        const removedLetter = currentWordArr.pop()

        guessedWords[guessedWords.length - 1] = currentWordArr

        //removes the visual letter from box
        const lastLetterEl = document.getElementById(String(availableSpace - 1))

        lastLetterEl.textContent = ''
        availableSpace = availableSpace - 1

    }


    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({target}) =>{
            const letter = target.getAttribute("data-key");

            if (letter ==='enter') {
                handleSubmitWord()
                return;
            }

            if(letter === 'del'){
                handleDeleteLetter();
                return;
            }


            

            updateGuessedWords(letter);
        };
    }
});