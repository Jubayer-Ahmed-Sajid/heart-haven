function listFundingMocks(_req, res) {
  res.json({
    items: [
      { name: 'bKash', status: 'mock-ready', channel: 'mobile-wallet' },
      { name: 'Nagad', status: 'mock-ready', channel: 'mobile-wallet' },
      { name: 'Upay', status: 'mock-ready', channel: 'mobile-wallet' },
      { name: 'Rocket', status: 'mock-ready', channel: 'mobile-wallet' },
    ],
  });
}

module.exports = { listFundingMocks };
