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

const seedVents = [
  {
    alias: 'Anonymous',
    body: 'আজ মনটা ভারী, তবু এখানে লিখে একটু হালকা লাগছে।',
    mood: 'heavy',
    isAnonymous: true,
  },
  {
    alias: 'Silent River',
    body: 'No contact today. একদিন করে এগোচ্ছি।',
    mood: 'hopeful',
    isAnonymous: true,
  },
];

module.exports = { seedResources, seedVents };
