import commandLineArgs from 'command-line-args';

const optionDefinitions = [
  { name: 'job', alias: 'j', type: String },
];

const options = commandLineArgs(optionDefinitions);
const job = options.job;

if (!job) {
  console.log('Please provide a job');
  process.exit(1);
}

import(`./tasks/${job}`)
  .then((module) => module.default())
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
