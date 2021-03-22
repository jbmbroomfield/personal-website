// Variables

const announcement = document.getElementById('announcement')
const carsWon = document.getElementById('cars-won')
const goatsWon = document.getElementById('goats-won')

let phase = 1
let carIndex // The location of the car.
let chosenDoor // The location of the chosen door.


// Buttons

const button0 = {
    element: document.getElementById('button0'),
    border: document.getElementById('button-border0'),
    setText: function(text) {
        this.element.innerHTML = text
        this.element.className = text ? 'button button-visible' : 'button'
    }
}

const button1 = {...button0}
button1.element = document.getElementById('button1')
button1.border = document.getElementById('button-border1'),

button0.element.addEventListener('click', function() {
    nextPhase()
})

button1.element.addEventListener('click', function() {
    nextPhase('swap')
})

button0.element.addEventListener('mouseover', function() {
    if (phase !== 1) {
        button0.border.className = 'button-border button-border-highlighted'
    }
})
button0.element.addEventListener('mouseout', function() {
    button0.border.className = 'button-border'
})

button1.element.addEventListener('mouseover', function() {
    if (phase === 3) {
        button1.border.className = 'button-border button-border-highlighted'
    }
})
button1.element.addEventListener('mouseout', function() {
    button1.border.className = 'button-border'
})


// Doors

const doorBorders = []
for (i = 0; i < 3; i++) {
    doorBorders.push(document.getElementById(`door-border${i}`))
}

const d = {
    chosen: false,
    openDoor: function () {
        this.element.className = 'door door-open'
        this.element.innerHTML = `<img src="./images/door-${this.prize}.jpg" alt="${this.prize}" width="250.8" height="500"></img>`
        this.closed = false
    },
    closeDoor: function (i) {
        this.element.className = 'door door-closed'
        this.element.innerHTML = '<img src="./images/door.jpg" alt="Closed Door" width="250.8" height="500"></img>'
        this.border.className = 'door-border'
        this.closed = true
        this.prize = this.index === carIndex ? 'car' : 'goat'
    },
    chooseDoor: function() {
        this.chosen = true
        for (door of doors) {
            if (door === this) {
                door.chosen = true
                door.border.className = 'door-border door-border-chosen'
            } else {
                door.chosen = false
                door.border.className = 'door-border'
            }
        }
    },
}
const doors = [d,{...d},{...d}]

for (let i = 0; i < doors.length; i++) {
    let door = doors[i]
    door.index = i
    door.element = document.getElementById(`door${i}`)
    door.border = doorBorders[i]
    // door.closeDoor()
    door.element.addEventListener('click', function() {
        if (phase === 1) {
            nextPhase(i)
        }
    })
    door.element.addEventListener('mouseover', function() {
        if (phase === 1) {
            doorBorders[i].className = 'door-border door-border-highlighted'
        }
    })
    door.element.addEventListener('mouseout', function() {
        if (phase === 1) {
            doorBorders[i].className = 'door-border'
        }
    })
}




// Phase 0: Begin.
// Phase 1: Choose a door.
// Phase 2: Reveal a goat.
// Phase 3: Choose to stay or swap.
// Phase 4: Reveal result.
// Phase 5: May begin again.

function nextPhase(input=false) {
    switch(phase++) {
        case 1: // User has selected a door. Input = the index of the selected door (0, 1 or 2).
            doors[input].chooseDoor()
            button0.setText('REVEAL GOAT')
            announcement.innerHTML = `You have chosen Door ${input+1}. Let's reveal one of the goats.`
            break
        case 2: // User has selected to reveal a goat. No input.
            let unchosenGoats = []
            let doorToOpenIndex, doorToOpen
            for (i=0; i < 3; i++) {
                let door = doors[i]
                if (!door.chosen && i != carIndex) {
                    unchosenGoats.push(door)
                }
            }
            if (unchosenGoats.length == 2) {
                doorToOpenIndex = Math.floor(Math.random()*2)
            } else if (unchosenGoats.length == 1) {
                doorToOpenIndex = 0
            } else {
            }
            doorToOpen = unchosenGoats[doorToOpenIndex]
            doorToOpen.openDoor()
            button0.setText('STAY')
            button1.setText('SWAP')
            announcement.innerHTML = `Good thing you didn't choose Door ${doorToOpen.index+1}.<br>You have one final chance to change your mind.<br>You can stay with your original choice, or swap to the other remaining door.`
            break
        case 3: // User has decided to stay or swap. Input = 'stay' or 'swap'.
            if (input == 'swap') {
                for (door of doors) {
                        if (door.closed && !door.chosen) {
                            door.chooseDoor()
                            break
                        }
                    }
            }
            button0.setText('REVEAL PRIZE')
            button1.setText('')
            for (let i = 0; i < 3; i++) {
                if (doors[i].chosen) {
                    announcement.innerHTML = `You have chosen to open Door ${i+1}. Let's see what you've won!`
                }
            }
            break
        case 4: // Time to reveal the prize.
            for (let i = 0; i < 3; i++) {
                door = doors[i]
                if (door.chosen) {
                    door.openDoor()
                    if (i === carIndex) {
                        prize = 'Car'
                        carsWon.innerHTML = parseInt(carsWon.innerHTML) + 1
                    } else {
                        prize = 'Goat'
                        goatsWon.innerHTML = parseInt(goatsWon.innerHTML) + 1
                    }
                    announcement.innerHTML = `You won a ${prize}!`
                    button0.setText('PLAY AGAIN')
                    break
                }
            }
            break
        case 5: // Play again
            setupMonty()
            button0.setText('')
            announcement.innerHTML = 'Choose a door.'
            phase = 1
    }
}

function setupMonty() {
    carIndex = Math.floor(Math.random()*3)
    console.log('CI ' + carIndex)
    for (let i = 0; i < doors.length; i++) {
        doors[i].closeDoor()
    }
}


setupMonty()