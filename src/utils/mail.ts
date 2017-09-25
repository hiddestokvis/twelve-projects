import { mail as helper } from 'sendgrid';
import * as sendgrid from 'sendgrid';
import { log, Severity } from './';

export function sendMail(name: string, email: string) {
  const subject = 'We hebben je pitch ontvangen!';
  const sg = sendgrid(process.env.SENDGRID_API_KEY);
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      from: {
        email: 'info@twelveprojects.nl',
        name: 'TwelveProjects',
      },
      personalizations: [
        {
          to: [{
            email,
            name,
          }, {
            email: 'info@twelveprojects',
            name,
          }],
          substitution: {
            '-name': name,
          }
      }],
      subject,
      template_id: 'fd433b9a-6284-41bc-af43-0a1cb5fc033e'
    }
  });
  sg.API(request, (error, response) => {
    if (error) {
      log(Severity.ERROR, 'MAIL', JSON.stringify(error));
    } else {
      log(Severity.INFO, 'MAIL', `Mail sent to ${name} <${email}>`);
    }
  });
};
