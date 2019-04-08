const ilmoconfig = require('../../config/ilmomasiina.config.js'); // eslint-disable-line
const Email = require('email-templates');
const path = require('path');

// Temp sendgrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(ilmoconfig.sendgridApiKey);
// /temp sendgrid

/*
Hide mailgun for a while

const mailgun = require('mailgun-js')({
  apiKey: ilmoconfig.mailgunApiKey,
  domain: ilmoconfig.mailgunDomain,
});
*/

const EmailService = {
  send: (to, subject, html) => {
    const msg = {
      to,
      from: ilmoconfig.mailFrom,
      subject,
      html,
    };

    // temp sendgrid
    sgMail
      .send(msg)
      .then(res => {
        console.log('SUCCESS', res);
      })
      .catch(error => {
        console.log('ERROR', error);
      });
    // /temp sendgrid

    /* hide mailgun for a while

    mailgun.messages().send(msg, (error, body) => {
      console.log(body);
    });
*/
  },

  sendConfirmationMail(to, params) {
    const email = new Email({
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, 'css'),
        },
      },
    });
    const brandedParams = {
      ...params,
      branding: {
        footerText: ilmoconfig.brandingMailFooterText,
        footerLink: ilmoconfig.brandingMailFooterLink,
      },
    };

    return email
      .render('../server/mail/emails/confirmation/html', brandedParams)
      .then(html => {
        const subject = `${params.edited ? 'Muokkaus' : 'Ilmoittautumis'}vahvistus: ${params.event.title}`;
        return EmailService.send(to, subject, html);
      });
  },

  sendNewUserMail(to, params) {
    const email = new Email({
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, 'css'),
        },
      },
    });
    const brandedParams = {
      ...params,
      branding: {
        footerText: ilmoconfig.brandingMailFooterText,
        footerLink: ilmoconfig.brandingMailFooterLink,
        siteUrl: ilmoconfig.baseUrl,
      },
    };

    return email
      .render('../server/mail/emails/newUser/html', brandedParams)
      .then(html => {
        const subject = 'Käyttäjätunnukset Ilmomasiinaan';
        return EmailService.send(to, subject, html);
      });
  },
};

module.exports = EmailService;
