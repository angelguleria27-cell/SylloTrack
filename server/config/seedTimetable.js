const Timetable = require('../models/Timetable');
const Subject = require('../models/Subject');

const seedTimetable = async () => {
  try {
    const count = await Timetable.countDocuments({ section: 'Section A' });
    if (count > 0) {
      console.log(`ℹ️ Timetable already contains ${count} entries for Section A.`);
      return;
    }

    // Find subjects by name
    const javaSub = await Subject.findOne({ name: 'Programming in Java' });
    const dbmsSub = await Subject.findOne({ name: 'Database Management Systems' });
    const cnSub = await Subject.findOne({ name: 'Computer Networks' });
    const tocSub = await Subject.findOne({ name: 'Theory of Computation' });
    const obSub = await Subject.findOne({ name: 'Organizational Behaviour' });

    if (!javaSub || !dbmsSub || !cnSub || !tocSub || !obSub) {
      console.log('⚠️ Could not find all core subjects required to seed Section A timetable.');
      return;
    }

    const timetableEntries = [
      // MONDAY
      {
        day: 'Monday',
        startTime: '12:00',
        endTime: '13:00',
        subject: javaSub._id,
        room: 'NR1',
        teacher: 'NTCS13',
        section: 'Section A',
      },
      {
        day: 'Monday',
        startTime: '14:00',
        endTime: '15:00',
        subject: obSub._id,
        room: 'NR1',
        teacher: 'NF6',
        section: 'Section A',
      },
      {
        day: 'Monday',
        startTime: '15:00',
        endTime: '17:00',
        subject: dbmsSub._id,
        room: 'HWL1 (P1)',
        teacher: 'NTCS14 (Lab P1)',
        section: 'Section A',
      },
      {
        day: 'Monday',
        startTime: '15:00',
        endTime: '17:00',
        subject: cnSub._id,
        room: 'HWL2 (P2)',
        teacher: 'NTCS15 (Lab P2)',
        section: 'Section A',
      },
      {
        day: 'Monday',
        startTime: '15:00',
        endTime: '17:00',
        subject: javaSub._id,
        room: 'CL3 (P3)',
        teacher: 'NTCS13 (Lab P3)',
        section: 'Section A',
      },

      // TUESDAY
      {
        day: 'Tuesday',
        startTime: '12:00',
        endTime: '13:00',
        subject: cnSub._id,
        room: 'NR1',
        teacher: 'NTCS15',
        section: 'Section A',
      },
      {
        day: 'Tuesday',
        startTime: '14:00',
        endTime: '15:00',
        subject: tocSub._id,
        room: 'NR1',
        teacher: 'NTCS20',
        section: 'Section A',
      },
      {
        day: 'Tuesday',
        startTime: '15:00',
        endTime: '16:00',
        subject: javaSub._id,
        room: 'NR1',
        teacher: 'NTCS13',
        section: 'Section A',
      },
      {
        day: 'Tuesday',
        startTime: '16:00',
        endTime: '17:00',
        subject: dbmsSub._id,
        room: 'NR1',
        teacher: 'NTCS14',
        section: 'Section A',
      },

      // WEDNESDAY
      {
        day: 'Wednesday',
        startTime: '11:00',
        endTime: '12:00',
        subject: cnSub._id,
        room: 'NR1',
        teacher: 'NTCS15',
        section: 'Section A',
      },
      {
        day: 'Wednesday',
        startTime: '12:00',
        endTime: '13:00',
        subject: dbmsSub._id,
        room: 'NR1',
        teacher: 'NTCS14',
        section: 'Section A',
      },
      {
        day: 'Wednesday',
        startTime: '14:00',
        endTime: '15:00',
        subject: obSub._id,
        room: 'NR1',
        teacher: 'NF6',
        section: 'Section A',
      },
      {
        day: 'Wednesday',
        startTime: '15:00',
        endTime: '17:00',
        subject: dbmsSub._id,
        room: 'HWL1 (P2)',
        teacher: 'NTCS14 (Lab P2)',
        section: 'Section A',
      },
      {
        day: 'Wednesday',
        startTime: '15:00',
        endTime: '17:00',
        subject: cnSub._id,
        room: 'HWL2 (P3)',
        teacher: 'NTCS15 (Lab P3)',
        section: 'Section A',
      },
      {
        day: 'Wednesday',
        startTime: '15:00',
        endTime: '17:00',
        subject: javaSub._id,
        room: 'CL3 (P1)',
        teacher: 'NTCS13 (Lab P1)',
        section: 'Section A',
      },

      // THURSDAY
      {
        day: 'Thursday',
        startTime: '12:00',
        endTime: '13:00',
        subject: cnSub._id,
        room: 'NR1',
        teacher: 'NTCS15',
        section: 'Section A',
      },
      {
        day: 'Thursday',
        startTime: '14:00',
        endTime: '15:00',
        subject: dbmsSub._id,
        room: 'NR1',
        teacher: 'NTCS14',
        section: 'Section A',
      },
      {
        day: 'Thursday',
        startTime: '15:00',
        endTime: '16:00',
        subject: javaSub._id,
        room: 'NR1',
        teacher: 'NTCS13',
        section: 'Section A',
      },
      {
        day: 'Thursday',
        startTime: '16:00',
        endTime: '17:00',
        subject: tocSub._id,
        room: 'NR1',
        teacher: 'NTCS20',
        section: 'Section A',
      },

      // FRIDAY
      {
        day: 'Friday',
        startTime: '12:00',
        endTime: '13:00',
        subject: tocSub._id,
        room: 'NR1',
        teacher: 'NTCS20',
        section: 'Section A',
      },
      {
        day: 'Friday',
        startTime: '14:00',
        endTime: '15:00',
        subject: obSub._id,
        room: 'NR1',
        teacher: 'NF6',
        section: 'Section A',
      },
      {
        day: 'Friday',
        startTime: '15:00',
        endTime: '17:00',
        subject: dbmsSub._id,
        room: 'HWL1 (P3)',
        teacher: 'NTCS14 (Lab P3)',
        section: 'Section A',
      },
      {
        day: 'Friday',
        startTime: '15:00',
        endTime: '17:00',
        subject: cnSub._id,
        room: 'HWL2 (P1)',
        teacher: 'NTCS15 (Lab P1)',
        section: 'Section A',
      },
      {
        day: 'Friday',
        startTime: '15:00',
        endTime: '17:00',
        subject: javaSub._id,
        room: 'CL3 (P2)',
        teacher: 'NTCS13 (Lab P2)',
        section: 'Section A',
      },
    ];

    await Timetable.insertMany(timetableEntries);
    console.log(`✅ Successfully seeded ${timetableEntries.length} timetable entries for B.Tech CSE Section A - Sem 5.`);
  } catch (error) {
    console.error('❌ Error seeding timetable:', error.message);
  }
};

module.exports = seedTimetable;
