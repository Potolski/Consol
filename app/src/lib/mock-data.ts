export const MOCK_GROUPS = [
  {
    address: "7xKp3dFr9mNq8bWkLz4f2DaEcVn5tYhW",
    description: "Car Fund Circle",
    creator: "7xKp3dFr9mNq8bWkLz4f2D",
    monthlyContribution: 500_000_000, // $500
    totalMembers: 10,
    currentMembers: 10,
    currentRound: 3,
    status: "active" as const,
    collateralBps: 2000,
    insuranceBps: 300,
    protocolFeeBps: 150,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 90,
    formationDeadline: Math.floor(Date.now() / 1000) - 86400 * 60,
    roundStartedAt: Math.floor(Date.now() / 1000) - 86400 * 3,
    membersReceived: 3,
    activeMembers: 9,
  },
  {
    address: "9mNqBvXr2kLp5dWs7hYt3EfGcUm8qZjR",
    description: "Home Savings Group",
    creator: "9mNqBvXr2kLp5dWs7hYt3E",
    monthlyContribution: 1000_000_000, // $1,000
    totalMembers: 15,
    currentMembers: 12,
    currentRound: 0,
    status: "forming" as const,
    collateralBps: 2500,
    insuranceBps: 300,
    protocolFeeBps: 150,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 5,
    formationDeadline: Math.floor(Date.now() / 1000) + 86400 * 25,
    roundStartedAt: 0,
    membersReceived: 0,
    activeMembers: 12,
  },
  {
    address: "3dFrHnKm8wQp1bXs6jYv4GbLcTn2rWkE",
    description: "Tech Gadgets Pool",
    creator: "3dFrHnKm8wQp1bXs6jYv4G",
    monthlyContribution: 200_000_000, // $200
    totalMembers: 5,
    currentMembers: 5,
    currentRound: 1,
    status: "active" as const,
    collateralBps: 2000,
    insuranceBps: 200,
    protocolFeeBps: 150,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 45,
    formationDeadline: Math.floor(Date.now() / 1000) - 86400 * 15,
    roundStartedAt: Math.floor(Date.now() / 1000) - 86400 * 1,
    membersReceived: 1,
    activeMembers: 5,
  },
  {
    address: "5hYtLnPm7wQp3dXs8jYv6HdNcWn4sRkF",
    description: "Vacation Fund",
    creator: "5hYtLnPm7wQp3dXs8jYv6H",
    monthlyContribution: 300_000_000, // $300
    totalMembers: 8,
    currentMembers: 4,
    currentRound: 0,
    status: "forming" as const,
    collateralBps: 1500,
    insuranceBps: 300,
    protocolFeeBps: 150,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 2,
    formationDeadline: Math.floor(Date.now() / 1000) + 86400 * 28,
    roundStartedAt: 0,
    membersReceived: 0,
    activeMembers: 4,
  },
  {
    address: "8bWkTmRn4vSp9dXs2hYu5FkPcXn6tRjG",
    description: "Emergency Fund Co-op",
    creator: "8bWkTmRn4vSp9dXs2hYu5F",
    monthlyContribution: 100_000_000, // $100
    totalMembers: 20,
    currentMembers: 20,
    currentRound: 15,
    status: "active" as const,
    collateralBps: 2000,
    insuranceBps: 300,
    protocolFeeBps: 150,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 450,
    formationDeadline: Math.floor(Date.now() / 1000) - 86400 * 420,
    roundStartedAt: Math.floor(Date.now() / 1000) - 86400 * 5,
    membersReceived: 15,
    activeMembers: 18,
  },
  {
    address: "2jYvNnQm6wSp4dXs9hYt7JeLcWn3tRkH",
    description: "Motorcycle Cons\u00f3rcio",
    creator: "2jYvNnQm6wSp4dXs9hYt7J",
    monthlyContribution: 250_000_000, // $250
    totalMembers: 6,
    currentMembers: 6,
    currentRound: 5,
    status: "completed" as const,
    collateralBps: 2000,
    insuranceBps: 300,
    protocolFeeBps: 150,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 200,
    formationDeadline: Math.floor(Date.now() / 1000) - 86400 * 170,
    roundStartedAt: 0,
    membersReceived: 6,
    activeMembers: 6,
  },
];

export type MockGroup = (typeof MOCK_GROUPS)[number];

export function getMockGroup(address: string): MockGroup | undefined {
  return MOCK_GROUPS.find((g) => g.address === address);
}

// Protocol-level stats derived from mock data
export function getMockStats() {
  const totalMembers = MOCK_GROUPS.reduce((sum, g) => sum + g.currentMembers, 0);
  const totalVolume = MOCK_GROUPS.reduce(
    (sum, g) => sum + (g.monthlyContribution / 1_000_000) * g.currentMembers * (g.currentRound + 1),
    0
  );
  const totalRounds = MOCK_GROUPS.reduce((sum, g) => sum + g.membersReceived, 0);
  return {
    totalGroups: MOCK_GROUPS.length,
    activeMembers: totalMembers,
    usdcVolume: Math.floor(totalVolume),
    roundsComplete: totalRounds,
  };
}
