export default class TemplateEngine {
  constructor() {
    this.template = `
    function render(text) {
        return text;
      };

      let ___vrml = '';
      let ___tmp;

      const context = { %context% };

      const fields = { %fields% };

      %body%
    `;

    this.gOpeningToken = '%<';
    this.gClosingToken = '>%';
  };

  parseBody(body) {
    let indexClosingToken = 0;
    let lastIndexClosingToken = -1;
    const expressionToken = this.gOpeningToken + '=';

    let jsBody = '';
    while (1) {
      let indexOpeningToken = body.indexOf(this.gOpeningToken, indexClosingToken);
      if (indexOpeningToken === -1) { // no more matches
        if (indexClosingToken < body.length) {
          // what comes after the last closing token is plain vrml
          // note: ___vrml is a local variable to the generateVrml javascript function
          jsBody += '___vrml += render(`' + body.substr(indexClosingToken, body.length - indexClosingToken) + '`);';
          break;
        }
      }

      indexClosingToken = body.indexOf(this.gClosingToken, indexOpeningToken);
      if (indexClosingToken === -1)
        throw new Error('Expected JavaScript closing token \'>%\' is missing.');

      indexClosingToken = indexClosingToken + this.gClosingToken.length; // point after the template token

      if (indexOpeningToken > 0 && lastIndexClosingToken === -1)
        // what comes before the first opening token should be treated as plain vrml
        jsBody += '___vrml += render(`' + body.substr(0, indexOpeningToken) + '`);';

      if (lastIndexClosingToken !== -1 && indexOpeningToken - lastIndexClosingToken > 0) {
        // what is between the previous closing token and the current opening token should be treated as plain vrml
        jsBody += '___vrml += render(`' + body.substr(lastIndexClosingToken, indexOpeningToken - lastIndexClosingToken) + '`);';
      }

      // anything inbetween the tokens is either an expression or plain JavaScript
      let statement = body.substr(indexOpeningToken, indexClosingToken - indexOpeningToken);
      // if it starts with '%<=' it's an expression
      if (statement.startsWith(expressionToken)) {
        statement = statement.replace(expressionToken, '').replace(this.gClosingToken, '');
        // note: ___tmp is a local variable to the generateVrml javascript function
        jsBody += '___tmp = ' + statement + '; ___vrml += eval(\'___tmp\');';
      } else {
        // raw javascript snippet, remove the tokens
        jsBody += statement.replace(this.gOpeningToken, '').replace(this.gClosingToken, '');
      }

      lastIndexClosingToken = indexClosingToken;
    }

    return jsBody;
  };

  generateVrml(fields, body) {
    const jsBody = this.parseBody(body);
    // fill template
    this.template = this.template.replace('%import%', '');
    this.template = this.template.replace('%context%', '');
    this.template = this.template.replace('%fields%', fields);
    this.template = this.template.replace('%body%', jsBody);

    console.log('Filled Template: \n' + this.template);

    return eval(this.template);
  };
}
