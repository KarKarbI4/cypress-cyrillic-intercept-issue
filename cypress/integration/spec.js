/// <reference types="cypress" />
describe('cy.intercept cyrillyc issue test', () => {
  const URL = 'https://example.com/test';

  function postRequest(data) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', URL);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data))
  }

  beforeEach(() => {
    cy.intercept(URL, {
      body: { result: 'ok' },
    }).as('testRequest');
  })

  it.only('cy.intercept cyrillyc issue test', () => {
    postRequest({name: 'Frausivanovich'});
    cy.wait('@testRequest')
        .its('request')
        .then((req) => {
          console.log(req.body); // JSON
          expect(req.body).to.be.an('object');
        });

    postRequest({name: 'Фраус'});
    cy.wait('@testRequest')
        .its('request')
        .then((req) => {
          console.log(req.body); // Sometime JSON, sometimes ArrayBuffer
          expect(req.body).to.be.an('object'); // sometimes fails
        });

    postRequest({name: 'Фраусиванович'});
    cy.wait('@testRequest')
        .its('request')
        .then((req) => {
          console.log(req.body); // ArrayBuffer
          expect(req.body).to.be.an('object'); // fails
        });
  });
})
