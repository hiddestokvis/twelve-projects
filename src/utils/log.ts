import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';

export enum Severity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
};

/*
* log()
* add a line to the log
*
* @params <string> type: Describes the log type
* @params <string> content: the content of the log line
*/
export function log(severity: Severity, type: string, content: string) {
  fs.appendFile(
    path.join(__dirname, `../../logs/${moment().format('YYYY-MM-DD')}.log`),
    `[${severity}][${type}]: ${content}\n`,
    (error) => {
      if (error) console.error(error);
    }
  );
}
