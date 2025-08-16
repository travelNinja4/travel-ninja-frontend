const path = require('path');
const fs = require('fs');

module.exports = function (plop) {
  const camelCase = plop.getHelper('camelCase');

  plop.setGenerator('utility', {
    description: 'Generate a utility file',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'utility name (camelCase):',
        validate: function (input) {
          const formattedName = camelCase(input);
          const folderPath = path.resolve(__dirname, '../../src/utils', `${formattedName}.tsx`);

           if (!/^[a-z][a-zA-Z0-9]*$/.test(formattedName)) {
            return 'utility name must be valid camelCase (e.g., myConstant)';
          }

          if (fs.existsSync(folderPath)) {
            return `utility '${formattedName}' already exists at ${folderPath}`;
          }

          return true;
        },
      },
      {
        type: 'input',
        name: 'utilityDescription',
        message: 'Please add a description for this utility:',
        validate: function (input) {
          return input.trim() !== '' ? true : 'Description cannot be empty';
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../src/utils/{{camelCase name}}.ts',
        templateFile: path.join(__dirname, './utility.ts.hbs'),
      },
    ],
  });
};
