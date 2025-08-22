const path = require('path');
const fs = require('fs');

module.exports = function (plop) {
  const camelCase = plop.getHelper('camelCase');

  plop.setGenerator('constant', {
    description: 'Generate a constant file',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Constant name (camelCase):',
        validate: function (input) {
          const formattedName = camelCase(input);
          const folderPath = path.resolve(__dirname, '../../src/constants', `${formattedName}.tsx`);

           if (!/^[a-z][a-zA-Z0-9]*$/.test(formattedName)) {
            return 'Constant name must be valid camelCase (e.g., myConstant)';
          }

          if (fs.existsSync(folderPath)) {
            return `Constant '${formattedName}' already exists at ${folderPath}`;
          }

          return true;
        },
      },
      {
        type: 'input',
        name: 'constantDescription',
        message: 'Please add a description for this constant:',
        validate: function (input) {
          return input.trim() !== '' ? true : 'Description cannot be empty';
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../src/constants/{{camelCase name}}.ts',
        templateFile: path.join(__dirname, './constant.ts.hbs'),
      },
    ],
  });
};
