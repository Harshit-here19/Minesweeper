document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector('.grid')
    const flagLeft = document.querySelector('#flag-left')
    const result = document.querySelector('#result')
    const btn = document.querySelector('#btn')
    const width = 10
    let isGameOver = false
    let bombAmount = 20
    let flags = 0
    let action = true

    let squares = []

    btn.addEventListener('click', () => {
        if (action) {
            btn.innerHTML = 'FLAG'
            action = false
        } else {
            btn.innerHTML = 'DIG'
            action = true
        }

    })

    //Create a new board
    function createBoard() {

        flagLeft.innerHTML = bombAmount

        //Get Shuffed the Game with Random bombs
        const bombArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)
        // console.log(shuffledArray)

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.id = i
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            // // Normal Click
            // square.addEventListener('click', () => {
            //     click(square)
            // })

            // // ctrl and left click
            // square.addEventListener('contextmenu', () => {
            //     addFlag(square)
            // })

            square.addEventListener('click', () => {
                if (action) click(square)
                else addFlag(square)
            })

        }

        //add Number
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)

            // console.log(squares);
            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++

                if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++

                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++

                if (i > 10 && squares[i - width].classList.contains('bomb')) total++

                if (i > 11 && !isLeftEdge && squares[i - width - 1].classList.contains('bomb')) total++

                if (i < 89 && squares[i + width].classList.contains('bomb')) total++

                if (i < 90 && !isLeftEdge && squares[i + width - 1].classList.contains('bomb')) total++

                if (i < 88 && !isRightEdge && squares[i + width + 1].classList.contains('bomb')) total++

                squares[i].setAttribute('data', total)
            }
        }
    }

    createBoard()

    //add flag with Right click
    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                flags++
                square.innerHTML = "🚩"
                flagLeft.innerHTML = bombAmount - flags
                checkForWin()
            } else {
                square.classList.remove('flag')
                flags--
                square.innerHTML = ""
                flagLeft.innerHTML = bombAmount - flags
            }
        }
    }

    function click(square) {
        if (isGameOver || square.classList.contains('checked') || square.classList.contains('flagged')) return

        // console.log(square)

        if (square.classList.contains('bomb')) {
            gameOver()
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                square.innerHTML = total
                return
            }

            checkSquare(square)
        }
        square.classList.add('checked')
    }

    //checked neighbouring squares once square is clicked
    function checkSquare(square) {
        const currentId = square.id
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)

        setInterval(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = parseInt(currentId) - 1
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId > 9 && !isRightEdge) {
                const newId = parseInt(currentId) + 1 - width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId > 10) {
                const newId = parseInt(currentId) - width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId > 11 && !isLeftEdge) {
                const newId = parseInt(currentId) - 1 - width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId < 98 && !isRightEdge) {
                const newId = parseInt(currentId) + 1
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId < 90 && !isLeftEdge) {
                const newId = parseInt(currentId) - 1 + width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId < 88 && !isRightEdge) {
                const newId = parseInt(currentId) + 1 + width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

            if (currentId < 89) {
                const newId = parseInt(currentId) + width
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }

        }, 10);
    }

    function checkForWin() {
        let matches = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if (matches === bombAmount) {
                result.innerHTML = "YAY! YOU WIN!"
                isGameOver = true
            }
        }
    }

    function gameOver() {
        result.innerHTML = 'BOOM! Game Over!'
        isGameOver = true

        //show all the bombs
        squares.forEach((square) => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
                square.classList.remove('bomb')
                square.classList.add('checked')
            }
        })
    }
})