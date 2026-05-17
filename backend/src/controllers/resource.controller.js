const ResourceRepository = require('../repositories/resource.repository');

const seedResources = [
  {
    name: 'National Institute of Mental Health & Hospital',
    type: 'Hospital',
    location: 'Sher-e-Bangla Nagar, Dhaka',
    phone: '+880 2-9145874',
    website: '',
    note: 'Public mental health support in Dhaka.',
  },
  {
    name: 'Kaan Pete Roi',
    type: 'Helpline',
    location: 'Bangladesh',
    phone: '01900-000000',
    website: 'https://kaanpeteroi.org',
    note: 'Peer listening and emotional support.',
  },
  {
    name: 'Moner Bondhu',
    type: 'Counseling',
    location: 'Dhaka / Online',
    phone: '',
    website: 'https://monerbondhu.com',
    note: 'Counseling and mental wellness support.',
  },
];

async function listResources(_req, res, next) {
  try {
    const existing = await ResourceRepository.listAll();
    if (!existing.length) {
      await ResourceRepository.model.insertMany(seedResources);
      const seeded = await ResourceRepository.listAll();
      return res.json({ items: seeded });
    }
    res.json({ items: existing });
  } catch (error) {
    next(error);
  }
}

module.exports = { listResources };
