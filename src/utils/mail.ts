import { mail as helper } from 'sendgrid';
import * as sendgrid from 'sendgrid';
import { log, Severity } from './';

export function sendMail(name: string, email: string) {
  const from = new helper.Email('info@twelveprojects.nl');
  const to = new helper.Email(email);
  const subject = 'We hebben je pitch ontvangen!';
  const substitution = new helper.Substitution('name', name);
  const personalization = new helper.Personalization();
  personalization.addSubstitution(substitution);
  const mail = new helper.Mail(from, subject, to, new helper.Content('terxt/plain', ''));
  mail.setTemplateId('fd433b9a-6284-41bc-af43-0a1cb5fc033e');
  mail.addPersonalization(personalization);
  const sg = sendgrid(process.env.SENDGRID_API_KEY);
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });
  sg.API(request, (error, response) => {
    if (error) {
      log(Severity.ERROR, 'MAIL', JSON.stringify(error));
    } else {
      log(Severity.INFO, 'MAIL', `Mail sent to ${name} <${email}>`);
    }
  });
};
