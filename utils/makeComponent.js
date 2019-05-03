import fs from 'fs';
import path from 'path';
import log from 'fancy-log';
import color from 'ansi-colors';
import parseArgs from 'minimist';
import { createInterface } from 'readline';


//
// The code below is from github.com/CSSSR/csssr-project-template by CSSSR.
// (With little changes.)
// Thank you!
//


// Command line arguments

const cliArgs = parseArgs(process.argv.slice(2), {
  boolean: true
});

const componentNameFromCli = cliArgs._.join(' ');


// Default content for files in new component

const jsxClassTemplate = `import React from 'react';
import PropTypes from 'prop-types';
import { cn as makeBemClassName } from '@bem-react/classname';
import classNames from 'classnames';

import './%{componentName}.sass';

const cn = makeBemClassName('%{componentName}');

export default class %{componentName} extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    const {
      className
    } = this.props;

    const componentClass = classNames(cn(), className);

    return (
      <div className={componentClass}>
      </div>
    );
  }
}

%{componentName}.propTypes = {
  className: PropTypes.string
};

%{componentName}.defaultProps = {
  className: ''
};
`;

const jsxFunctionTemplate = `import React from 'react';
import PropTypes from 'prop-types';
import { cn as makeBemClassName } from '@bem-react/classname';
import classNames from 'classnames';

import './%{componentName}.sass';

const cn = makeBemClassName('%{componentName}');

export default function %{componentName}({ className }) {
  const componentClass = classNames(cn(), className);

  return (
    <div className={componentClass}>
    </div>
  );
}

%{componentName}.propTypes = {
  className: PropTypes.string
};

%{componentName}.defaultProps = {
  className: ''
};
`;

const sassTemplate = `.%{componentName}
  display: block
`;

const FILE_SOURCES = {
  jsx: cliArgs.functional ? jsxFunctionTemplate : jsxClassTemplate,
  sass: sassTemplate
};


// Folder with all components
const COMPONENTS_DIR = path.join(__dirname, '../src/components');


// Create rl interface
const rl = createInterface(process.stdin, process.stdout);


// Error handling

function validateComponentName(componentName) {
  return new Promise((resolve, reject) => {
    const isValid = /^(\d|\w|-)+$/.test(componentName);

    if (isValid) {
      resolve(isValid);
    } else {
      const errMsg = `An incorrect component name '${color.cyan(componentName)}'\n
        A component name must include letters, numbers and the minus symbol.`;
      reject(new Error(errMsg));
    }
  });
}

function directoryExist(componentPath, componentName) {
  return new Promise((resolve, reject) => {
    fs.stat(componentPath, (notExist) => {
      if (notExist) {
        resolve();
      } else {
        reject(new Error(`The component '${color.cyan(componentName)}' already exists.`));
      }
    });
  });
}

function createDir(dirPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, (err) => {
      if (err) {
        reject(new Error(`Failed to create a folder '${color.cyan(dirPath)}'`));
      } else {
        resolve();
      }
    });
  });
}

function createFiles(componentPath, componentName) {
  const promises = [];
  Object.keys(FILE_SOURCES).forEach((ext) => {
    const fileSource = FILE_SOURCES[ext]
      .replace(/%\{componentName}/g, componentName);
    const filename = `${componentName}.${ext}`;
    const filePath = path.join(componentPath, filename);

    promises.push(
      new Promise((resolve, reject) => {
        fs.writeFile(filePath, fileSource, 'utf8', (err) => {
          if (err) {
            reject(new Error(`Failed to create a file '${color.cyan(filePath)}'`));
          } else {
            resolve();
          }
        });
      })
    );
  });

  return Promise.all(promises);
}

function getFiles(componentPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(componentPath, (err, files) => {
      if (err) {
        reject(new Error(`Failed to get a file list from a folder '${color.cyan(componentPath)}'`));
      } else {
        resolve(files);
      }
    });
  });
}

function printErrorMessage(errText) {
  log.error(`${color.red('Error:')} ${errText.message}`);
  rl.close();
}


// Making

async function makeComponent(componentName) {
  try {
    const componentPath = path.join(COMPONENTS_DIR, componentName);

    await validateComponentName(componentName);
    await directoryExist(componentPath, componentName);
    await createDir(componentPath);
    await createFiles(componentPath, componentName);
    const files = await getFiles(componentPath);

    files.forEach(file => log(`Created: '${color.cyan(file)}'`));
    rl.close();
  } catch (err) {
    printErrorMessage(err);
  }
}

function initMakeComponent(candidateComponentName) {
  let componentNames = candidateComponentName.trim().split(/\s+/);

  // Uppercase the first letter
  componentNames = componentNames.map(name => name.charAt(0).toUpperCase() + name.slice(1));

  componentNames.forEach(name => makeComponent(name));
}


// If the user pass the name of the component in the command-line options
// that create a component. Otherwise — activates interactive mode
if (componentNameFromCli !== '') {
  initMakeComponent(componentNameFromCli);
} else {
  rl.setPrompt('Component name: ');
  rl.prompt();
  rl.on('line', (line) => {
    initMakeComponent(line);
  });
}
