export function getFakeName(): string {
  const names = [
    'Alice',
    'Bob',
    'Charlie',
    'David',
    'Eve',
    'Frank',
    'Grace',
    'Heidi',
    'Ivan',
    'Judy',
    'Karl',
    'Leo',
    'Mallory',
    'Nina',
    'Oscar',
    'Peggy',
    'Quentin',
    'Rupert',
    'Sybil'
  ];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}
