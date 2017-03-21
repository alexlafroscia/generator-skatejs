import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

test.serial('prompts for a component name if not given one', async () => {
  await helpers.run(path.join(__dirname, '../../generators/component'))
    .withPrompts({ componentName: 'x-foo' })
    .toPromise();

  // Make sure that the initial component was created
  assert.file('src/components/x-foo/component.js');
  assert.file('src/components/x-foo/styles.scss');

  // Make sure that the file was added to the index
  assert.fileContent('src/index.js', 'import XFoo from "./components/x-foo/component.js";');
  assert.fileContent('src/index.js', 'define(XFoo);');
});

test.serial('can be given a component name to generate', async () => {
  await helpers.run(path.join(__dirname, '../../generators/component'))
    .withArguments([ 'x-foo' ])
    .toPromise();

  // Make sure that the initial component was created
  assert.file('src/components/x-foo/component.js');
  assert.file('src/components/x-foo/styles.scss');
});

test.serial('throws an error if no name is provided', async () => {
  let caughtError = false;

  try {
    await helpers.run(path.join(__dirname, '../../generators/component'))
      .toPromise();
  } catch({ message }) {
    // Make sure that the error has the right messaging
    assert.equal(message, 'A component name must be provided');
    caughtError = true;
  }

  assert(caughtError, 'The generator threw an error');
});

test.serial('prevents creating components without a hyphen', async () => {
  let caughtError = false;

  try {
    await helpers.run(path.join(__dirname, '../../generators/component'))
      .withPrompts({ componentName: 'foo' })
      .toPromise();
  } catch({ message }) {
    // Make sure that the error has the right messaging
    assert.equal(message, "The component name must include a hyphen, was 'foo'");
    caughtError = true;
  }

  // We want to make sure that an error was actually thrown
  assert(caughtError, 'The generator threw an error');
});

test.serial('registers the component with the correct name', async () => {
  await helpers.run(path.join(__dirname, '../../generators/component'))
    .withPrompts({ componentName: 'x-foo' })
    .toPromise();

  assert.fileContent('src/components/x-foo/component.js', /return 'x-foo';/);
  assert.fileContent('src/components/x-foo/component.js', /Hello, world! I am x-foo!/);
});

test.serial('adds a class name for the component', async () => {
  await helpers.run(path.join(__dirname, '../../generators/component'))
    .withPrompts({ componentName: 'x-foo' })
    .toPromise();

  assert.fileContent('src/components/x-foo/component.js', /export default class XFoo extends Component/);
});

test.serial('makes a `describe` block with the right name', async () => {
  await helpers.run(path.join(__dirname, '../../generators/component'))
    .withPrompts({ componentName: 'x-foo' })
    .toPromise();

  assert.file('test/components/x-foo-test.js');
  assert.fileContent('test/components/x-foo-test.js', "describe('x-foo component', function() {");
});

test.serial('generates the index file when one does not exist', async () => {
  await helpers.run(path.join(__dirname, '../../generators/component'))
    .withPrompts({ componentName: 'x-foo' })
    .toPromise();

  assert.file('src/index.js');
});

test.serial('adds the new component to an existing index file', async () => {
  await helpers.run(path.join(__dirname, '../../generators/component'))
    .inTmpDir((dir) => {
      fs.copySync(path.join(__dirname, '../../generators/component/templates/src'), dir);
    })
    .withPrompts({ componentName: 'x-foo' })
    .toPromise();

  // Make sure that the file was added to the index
  assert.fileContent('src/index.js', 'import XFoo from "./components/x-foo/component.js";');
  assert.fileContent('src/index.js', 'define(XFoo);');

  assert.fileContent('src/index.js', 'const { define } = skate;');
});

test.serial('adds the new class to the index file', async () => {
  await helpers.run(path.join(__dirname, '../../generators/component'))
    .withPrompts({ componentName: 'x-foo' })
    .toPromise();

  // Make sure that the file was added to the index
  assert.fileContent('src/index.js', 'import XFoo from "./components/x-foo/component.js";');
  assert.fileContent('src/index.js', 'define(XFoo);');
});
