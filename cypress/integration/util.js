export const createASimpleStreak = (streak) => {
    // Just speeding up setting up streak environment

    for (let i = 0; i < streak; i++) {
        clickCorrectPhoto()

    }
}

export const clickCorrectPhoto = () => {
    //Make sure we have not tried to select a photo if a correct one is shown
    if (!checkIfCorrectPhotoLabelNotExist()) {
        // Get the data attribute from the name
        cy.get('#name').attribute('data-n').then((datan) => {
            // Use attribute as index of correct
            cy.get('.photo').children('div.shade').eq(datan).click()
        })
    }
}

export const clickWrongPhoto = () => {
    var i = 0
    //Make sure we have not tried to select a photo if a correct one is shown
    if (!checkIfCorrectPhotoLabelNotExist()) {
        // Get the data attribute from name to ensure we do not select a correct photo
        cy.get('#name').attribute('data-n').then((datan) => {
            //Make sure we do not select a correct guess add indexer to datan
            switch (Number(datan)) {
                case 4:
                    var indexer = -1

                default:
                    var indexer = 1
                    break;
            }
            cy.get('.photo').eq(Number(datan) + indexer).should('not.have.class', 'wrong').click()
        })
    }
}

export const getNameDatanValue = () => {
    debugger
    cy.get('#name').attribute(datan).then((datanValue) => {
        return datanValue
    })
} 

const checkIfCorrectPhotoLabelNotExist = () => {
    //Quick method to avoid clicking while page reloads, possible defect
    try {
        cy.get('.photo.correct').should('not.exist')
    } catch (error) {
        return false
    }
}