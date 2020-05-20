const faker = require('faker');
const fs = require('fs');

const clerks = [];
const appointments = [];
const Issues = [
    {
        id: 0,
        issue: "Renew driver's license",
        documents: ["ID card", "Driver's license"],
        est: 10
    },
    {
        id: 1,
        issue: "Marriage",
        documents: ["ID card", "Address card", "Birth certificate"],
        est: 15
    },
    {
        id: 2,
        issue: "Birth certificate",
        documents: ["ID Card"],
        est: 5
    }
];

function generateClerk() {
    return {
        id: faker.random.number({min: 1, max: 1000}),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`
    };
}

function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function generateWeekdayDate() {
    const year = 2020;
    let month = faker.random.arrayElement([5, 6, 7]);
    let dayCount = daysInMonth(year, month + 1);
    let date = new Date();
    date.setFullYear(year, month, faker.random.number({min: 1, max: dayCount}));
    while (date.getDay() === 0 || date.getDay() === 6) {
        month = faker.random.arrayElement([5, 6, 7]);
        dayCount = daysInMonth(year, month + 1);
        date.setFullYear(year, month, faker.random.number({min: 1, max: dayCount}));
    }

    date.setHours(faker.random.number({min: 9, max: 16}));
    date.setMinutes(faker.random.arrayElement([0, 30]), 0, 0);

    return date;
}

let it = 0;

function generateIssues() {
    let _issues = Issues.slice(0);
    let issues = [];
    it++;
    const issCnt = faker.random.number({min: 1, max: 3});
    for (let i = 0; i < issCnt && _issues.length !== 0; i++) {
        const index = faker.random.number({min: 0, max: _issues.length - 1});
        if (index > -1) {
            issues.push(_issues.splice(index, 1)[0]);
        }
    }

    return issues.map(iss => iss.id);
}

function generateAppointment(clerk, id) {
    const clerkId = clerk.id;
    const date = generateWeekdayDate();
    const issues = generateIssues();
    const name = `${faker.name.firstName()} ${faker.name.lastName()}`;

    return {
        id,
        clerkId: clerkId,
        name,
        date,
        issues
    }
}

function generateDatabase() {
    for (let i = 0; i < 5; i++) {
        clerks.push(generateClerk());
    }
    for (let i = 0, j = -1; i < 100; i++) {
        if (i % 20 === 0) {
            j++;
        }
        appointments.push(generateAppointment(clerks[j], i));
    }
}

generateDatabase();
fs.writeFile(
    'database.fake.json',
    JSON.stringify({clerks, appointments, issues: Issues}),
    (err) => {
        console.log(err)
    }
);