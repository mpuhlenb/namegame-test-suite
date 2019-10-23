import { clickCorrectPhoto, clickWrongPhoto, createASimpleStreak } from './util'
/// <reference types="Cypress" />


context('HomePage', () => {
    beforeEach(() => {
        cy.visit('http://www.ericrochester.com/name-game/')
    })

    // Setting Title test as failure since should be in Title Case
    it('Title text matches name of application', () => {

        cy.get('.header')
            .should('have.text', 'Name Game')
    })

    //Setting as a failure as sentence should begin in Sentence Case
    it('Question is a sentence', () => {

        cy.get('h1.text-center')
            .should(($textcenter) => {

                const sentence = $textcenter.text()

                expect(sentence).to.match(/^Who is /)
            })

        cy.get('#name')
            .should(($fullname) => {

                const fullname = $fullname.text()

                expect(fullname).to.length.greaterThan(1)
            })

    })

    //Click any photo and check that attempts counter increments
    it('Attempts/Tries counter increments after selecting a photo', () => {

        cy.get('.attempts')
            .invoke('text')
            .then((initialTries) => {

                cy.get('.photo')
                    .first()
                    .click()

                cy.get('.attempts')
                    .invoke('text')
                    .should((nextAttempt) => {

                        expect(Number(nextAttempt)).to.eq(Number(initialTries) + 1)
                    })
            })
    })

    it('All counter increment when correct photo is found x times', () => {
        var streak = 2
        cy.get('span.correct')
            .invoke('text')
            .then((initialCorrect) => {

                cy.get('.streak')
                    .invoke('text')
                    .then((initialStreak) => {

                        cy.get('.attempts')
                            .invoke('text')
                            .then((initialAttempts) => {

                                // Set a streak and check incremented by streak
                                createASimpleStreak(streak)

                                cy.get('.streak')
                                    .should('not.be.equal', initialStreak)
                                    .invoke('text').then((finalStreak) => {

                                        cy.get('span.correct')
                                            .invoke('text')
                                            .then((finalCorrect) => {

                                                cy.get('.attempts')
                                                    .invoke('text')
                                                    .then((finalAttempt) => {

                                                        // All counters should have increased by streak amount
                                                        expect(Number(finalCorrect))
                                                            .to.eq(Number(initialCorrect) + streak)
                                                        expect(Number(finalStreak))
                                                            .to.eq(Number(initialStreak) + streak)
                                                        expect(Number(finalAttempt))
                                                            .to.eq(Number(initialAttempts) + streak)
                                                    })
                                            })


                                    })
                            })
                    })
            })
    })

    it('Streak counter resets, correct stays the same, tries increments when wrong photo selected', () => {

        //Set initial state of streak x times
        createASimpleStreak(2)

        // Get initial counters after streak started
        cy.get('span.correct')
            .invoke('text')
            .then((initialCorrect) => {

                cy.get('.streak')
                    .invoke('text')
                    .then((initialStreak) => {

                        expect(Number(initialStreak)).to.be.greaterThan(0)

                        cy.get('.attempts').invoke('text').then((initialAttempts) => {

                            clickWrongPhoto()

                            // Get after streak ends counters and compare
                            cy.get('.streak')
                                .invoke('text')
                                .then((endofStreak) => {

                                    cy.get('span.correct')
                                        .invoke('text')
                                        .then((finalCorrect) => {

                                            cy.get('.attempts')
                                                .invoke('text')
                                                .then((lastAttempt) => {

                                                    expect(Number(finalCorrect))
                                                        .to.eq(Number(initialCorrect))

                                                    expect(Number(endofStreak))
                                                        .to.not.equal(Number(initialStreak))

                                                    expect(Number(endofStreak))
                                                        .to.equal(0)

                                                    expect(Number(lastAttempt))
                                                        .to.equal(Number(initialAttempts) + 1)
                                                })
                                        })
                                })
                        })
                    })
            })
    })

    it('Photos and names update when correct guess made', () => {
        // Get initial photo array and specific photo names divs
        cy.get('.gallery')
            .should('not.be.empty')

        cy.get('div.photo')
            .children('div.name')
            .invoke('text').as('names')

        cy.get('div.photo')
            .then((initialPhotos) => {

                cy.get('@names')
                    .then((initialNames) => {

                        clickCorrectPhoto()

                        //After correct photo get photo array and names and ensure not equal to initial
                        cy.get('.photo.correct')
                            .should('not.exist')
                        cy.get('.photo')
                            .should('not.be.empty')
                        cy.get('div.photo')
                            .then((finalPhotos) => {

                                cy.get('div.photo')
                                    .children('div.name')
                                    .invoke('text')
                                    .then((finalNames) => {

                                        expect(finalPhotos).to.not.equal(initialPhotos)
                                        expect(finalNames).to.not.equal(initialNames)
                                    })
                            })
                    })

            })

    })

    it('The proper decorator appears for wrong guesses', () => {

        var wrongcolor = 'rgba(184, 20, 20, 0.5)'

        cy.get('.photo.wrong')
            .should('not.exist')

        cy.get('#name')
            .attribute('data-n')
            .then((datan) => {

                //Make sure we do not select a correct guess add indexer to datan
                switch (Number(datan)) {
                    case 4:
                        var indexer = -1

                    default:
                        var indexer = 1
                        break;
                }

                cy.get('.photo')
                    .children('div.name')
                    .eq(Number(datan) + indexer)
                    .should('have.css', 'top')
                    .then((beforeText) => {

                        cy.get('.photo')
                            .eq(Number(datan) + indexer)
                            .click()

                        cy.get('.photo.wrong').should('exist')

                        cy.get('.photo')
                            .children('div.shade')
                            .eq(Number(datan) + indexer)
                            .should('have.css', 'background-color')
                            .and('equal', wrongcolor)

                        cy.get('.photo')
                            .children('div.name')
                            .eq(Number(datan) + indexer)
                            .should('have.css', 'top')
                            .then((afterText) => {

                                expect(beforeText).to.not.be.equal(afterText)
                            })
                    })
            })
    })

    it('The proper decorator appears for correct guesses', () => {

        var correctcolor = 'rgba(20, 184, 20, 0.5)'

        cy.get('#name')
            .attribute('data-n')
            .then((datan) => {

                cy.get('.photo')
                    .children('div.shade')
                    .eq(datan)
                    .as('correctoverlay')

                cy.get('.photo')
                    .children('div.name')
                    .eq(datan)
                    .as('correctname')

                cy.get('@correctname')
                    .should('have.css', 'top')
                    .then((beforeText) => {

                        cy.get('@correctoverlay')
                            .click()

                        cy.get('@correctoverlay')
                            .should('have.css', 'background-color')
                            .and('equal', correctcolor)

                        cy.get('@correctname')
                            .should('have.css', 'top')
                            .then((afterText) => {

                                expect(beforeText).to.not.be.equal(afterText)
                            })
                    })
            })
    })

    it('Pictures have # label indicating position in list in top right corner', () => {

        cy.get('.photo')
            .each(($pic) => {
                cy.get($pic)
                    .children('div.shade')
                    .as('decoratorText')

                cy.get('@decoratorText')
                    .should('have.css', 'text-align')
                    .and('equal', 'right')

                cy.get('@decoratorText')
                    .should('have.css', 'top')

                    .and('equal', '0px')

                cy.get('@decoratorText')
                    .invoke('text')
                    .then((placenumber) => {

                        cy.get('@decoratorText')
                            .attribute('data-n').then((datan) => {

                                expect(Number(datan) + 1).to.eq(Number(placenumber))

                            })
                    })
            })
    })

    it('If correct photo selected cannot select any photo until new photos reload', () => {

        cy.get('#name')
            .attribute('data-n')
            .then((datan) => {
                switch (datan) {
                    case 4:
                        var indexer = -1
                        break;

                    default:
                        var indexer = 1
                        break;
                }
                //Click a correct photo
                clickCorrectPhoto(1)

                // Then click wrong photo immediately after
                cy.get('.photo')
                    .eq(Number(datan) + indexer)
                    .click()

                // Expect only a correct photo and decorator on page
                expect(cy.get('.photo.correct')).to.exist
                expect(cy.get('.photo.wrong')).to.not.exist
            })
    })

    it('The name displayed is matches name of correct guess', () => {

        cy.get('#name').attribute('data-n').then((datan) => {

            cy.get('.photo').children('.name').eq(datan).invoke('text').then((photoname) => {
                cy.get('#name').invoke('text').then((displayname) => {
                    expect(photoname).to.equal(displayname)
                })
            })
        })
    })
})