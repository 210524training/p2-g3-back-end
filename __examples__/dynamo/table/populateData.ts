import dotenv from 'dotenv';
import GradingFormat from '../../models/grade-format';
import User from '../../models/user';
import gradeFormatRepository from '../../repositories/grade.format.repository';
import userRepository from '../../repositories/user.repository';
import reimbursementRepository from '../../repositories/reimbursement.repository';
import getDate from '../../utils/date';
import log from '../../log';
import Reimbursement from '../../models/reimbursement';

dotenv.config({});

const gradeFormats = [
  new GradingFormat(
    'Letter Grade',
    'D',
    'No description.',
    'fc26b014-e53e-491d-b5c6-11d9d1a8498d',
  ),
  new GradingFormat(
    '100-point Numerical Scale',
    '60',
    'No description.',
    'ec2ca76d-e2fa-4fb9-bd47-e22d8685657d',
  ),
  new GradingFormat(
    'Pass or Fail',
    'passed',
    'No description.',
    '46f82c3a-461b-4db0-a60b-8a5ed33507c7',
  ),
  new GradingFormat(
    '4-point Grade Point Average (GPA)',
    '0.67',
    'No description.',
    '329c4364-659f-4648-96ea-e744c08eda30',
  ),
];

const users = [
  new User(
    'larry-smith',
    'password',
    ['Employee'],
    'larry.smith@example.com',
    'larry',
    'smith',
    '1 Finite Loop',
    '5742340334',
    getDate('1/1/1970'),
    '40b99a37-c0b9-47da-adfc-56da73e0e3e0',
  ),
  new User(
    'corey-lam',
    'password',
    ['Employee'],
    'corey.lam@example.com',
    'corey',
    'lam',
    '250 Beck St',
    '5739262647',
    getDate('1/1/1970'),
    'e5c9a3f3-6d5f-4b20-8ba0-9f5d5c739aad',
  ),
  new User(
    'dustin-supervisor',
    'password',
    ['Director Supervisor'],
    'hi.dustin.diaz@gmail.com',
    'Dustin',
    'Díaz',
    '213 Unknown St',
    '7878474532',
    getDate('1/1/1970'),
    '04cc517b-d906-4cc8-8b5c-7da053ea84e7',
  ),
  new User(
    'dustin-head',
    'password',
    ['Department Head'],
    'hi.dustin.diaz@gmail.com',
    'Dustin',
    'Díaz',
    '213 Unknown St',
    '7878474532',
    getDate('1/1/1970'),
    '88a21185-bcd2-4484-8255-9fce6d7b155d',
  ),
  new User(
    'dustin-coordinator',
    'password',
    ['Benefits Coordinator'],
    'hi.dustin.diaz@gmail.com',
    'Dustin',
    'Díaz',
    '213 Unknown St',
    '7878474532',
    getDate('1/1/1970'),
    '43fb6747-5a2a-4dcc-9414-390b090122fe',
  ),
];

const reimbursements = [
  new Reimbursement(
    '40b99a37-c0b9-47da-adfc-56da73e0e3e0', // employee id
    'AWS Certification', // title
    'Certification', // type of event
    '46f82c3a-461b-4db0-a60b-8a5ed33507c7', // grading format id
    new Date('5/1/2021').toLocaleString(), // start date
    new Date('5/18/2021').toLocaleString(), // end date
    'Remote', // location
    'AWS Certficaiton', // description
    [
      {
        title: 'AWS Certificate', cost: 250, description: 'None.', type: 'Event Cost',
      },
      {
        title: 'Pencils', cost: 1.50, description: 'None.', type: 'Course Material',
      },
    ], // costs
    'passed', // grade
    'None.', // work releated justification
    true, // completed
    0, // amount paid to employee
    [], // attchements
    5, // work time missed
    'Submitted', // status
    [], // comments
    '5721f4f2-24c0-4a3c-a45b-e7b54e3cb1b7', // id
    new Date('4/1/2021').toLocaleString(), // created date
    new Date('5/18/2021').toLocaleString(), // updated date
  ),
];

async function populateUsers() {
  log.debug(`Popualting table TRMS - User with ${users.length} entities.`);
  users.forEach(async (user) => {
    const response = await userRepository.add(user);
    log.debug('Added user:', JSON.stringify(response));
  });
}

async function populateReimbursements() {
  log.debug(`Popualting table TRMS - Reimbursement with ${reimbursements.length} entities.`);
  reimbursements.forEach(async (reimbursement) => {
    const response = await reimbursementRepository.add(reimbursement);
    log.debug('Added reimbursement:', JSON.stringify(response));
  });
}

async function populateGradeFormats() {
  log.debug(`Popualting table TRMS - Grade Format with ${gradeFormats.length} entities.`);
  gradeFormats.forEach(async (gradeFormat) => {
    const response = await gradeFormatRepository.add(gradeFormat);
    log.debug('Added grade format:', JSON.stringify(response));
  });
}
async function populateTable() {
  await populateUsers();
  await populateGradeFormats();
  await populateReimbursements();
}

async function logData() {
  const reim = await reimbursementRepository.getById(reimbursements[0].id);
  const user = await userRepository.getById(users[0].id);
  const format = await gradeFormatRepository.getById(gradeFormats[0].id);

  log.debug('reimbursement', JSON.stringify(reim));
  log.debug('user', JSON.stringify(user));
  log.debug('grade format', JSON.stringify(format));
}

const sleep = (ms: number) => new Promise((resolve) => {
  log.debug(`Sleeping ${ms / 1000} seconds...`);
  setTimeout(resolve, ms);
});

(async () => {
  try {
    await populateTable();
    await sleep(10 * 1000); // wait 10 seconds
    await logData();
  } catch (error) {
    log.error('Failed to populate table: ', error);
  }
})();
