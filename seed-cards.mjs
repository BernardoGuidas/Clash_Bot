import { getDb, insertCard } from './server/db.ts';

const cardsData = [
  // Troops - Common
  { name: 'Skeletons', type: 'Troop', elixirCost: 1, rarity: 'Common', description: 'Summons 4 Skeletons to fight for you. Skeletons are very weak but very fast.', hitPoints: 20, damage: 10, deployTime: 1, speed: 'Fast', range: 'Melee: Short' },
  { name: 'Electro Spirit', type: 'Troop', elixirCost: 1, rarity: 'Common', description: 'A fast-moving spirit that stuns enemies on impact. Spawns 9 spirits.', hitPoints: 23, damage: 99, deployTime: 1, speed: 'Very Fast', range: 'Melee: Medium' },
  { name: 'Fire Spirit', type: 'Troop', elixirCost: 1, rarity: 'Common', description: 'A fiery spirit that explodes on impact, dealing damage to all nearby enemies.', hitPoints: 23, damage: 207, deployTime: 1, speed: 'Very Fast', range: 'Melee: Short' },
  { name: 'Ice Spirit', type: 'Troop', elixirCost: 1, rarity: 'Common', description: 'A frozen spirit that freezes enemies on impact.', hitPoints: 23, damage: 0, deployTime: 1, speed: 'Very Fast', range: 'Melee: Short' },
  { name: 'Heal Spirit', type: 'Troop', elixirCost: 1, rarity: 'Rare', description: 'A spirit that heals nearby troops. Heals 200 HP on spawn and 100 HP per hit.', hitPoints: 100, damage: 0, deployTime: 1, speed: 'Very Fast', range: 'Melee: Medium' },
  { name: 'Goblins', type: 'Troop', elixirCost: 2, rarity: 'Common', description: 'Three fast, unarmored troops with small swords.', hitPoints: 80, damage: 75, deployTime: 1, speed: 'Very Fast', range: 'Melee: Short' },
  { name: 'Spear Goblins', type: 'Troop', elixirCost: 2, rarity: 'Common', description: 'Three fast, unarmored troops that throw spears from range.', hitPoints: 80, damage: 75, deployTime: 1, speed: 'Very Fast', range: 'Ranged' },
  { name: 'Bomber', type: 'Troop', elixirCost: 2, rarity: 'Common', description: 'Lobs bombs at enemies. Deals splash damage.', hitPoints: 304, damage: 225, deployTime: 1, speed: 'Medium', range: 'Ranged' },
  { name: 'Bats', type: 'Troop', elixirCost: 2, rarity: 'Common', description: 'Five fast flying troops. Swarm attacks deal massive damage.', hitPoints: 81, damage: 81, deployTime: 1, speed: 'Very Fast', range: 'Melee: Medium' },
  { name: 'Zap', type: 'Spell', elixirCost: 2, rarity: 'Common', description: 'Zaps enemies, stunning them briefly and dealing damage.', hitPoints: 0, damage: 150, deployTime: 0, speed: 'Instant', range: 'Ranged' },
  { name: 'Giant Snowball', type: 'Spell', elixirCost: 2, rarity: 'Common', description: 'Throws a giant snowball that damages and slows enemies.', hitPoints: 0, damage: 200, deployTime: 0, speed: 'Instant', range: 'Ranged' },
  { name: 'Archers', type: 'Troop', elixirCost: 3, rarity: 'Common', description: 'Two ranged troops that attack from a distance. Arrows fly fast.', hitPoints: 304, damage: 112, deployTime: 1, speed: 'Medium', range: 'Ranged' },
  { name: 'Knight', type: 'Troop', elixirCost: 3, rarity: 'Common', description: 'A fast melee troop with balanced stats.', hitPoints: 1,200, damage: 150, deployTime: 1, speed: 'Medium', range: 'Melee: Short' },
  { name: 'Minions', type: 'Troop', elixirCost: 3, rarity: 'Common', description: 'Three flying troops that attack from range.', hitPoints: 200, damage: 100, deployTime: 1, speed: 'Fast', range: 'Ranged' },
  { name: 'Cannon', type: 'Building', elixirCost: 3, rarity: 'Common', description: 'A defensive building that shoots cannonballs at enemies.', hitPoints: 600, damage: 100, deployTime: 0, speed: 'Slow', range: 'Ranged' },
  { name: 'Goblin Gang', type: 'Troop', elixirCost: 3, rarity: 'Rare', description: 'A mix of goblins and spear goblins.', hitPoints: 202, damage: 120, deployTime: 1, speed: 'Very Fast', range: 'Mixed' },
  { name: 'Skeleton Barrel', type: 'Troop', elixirCost: 3, rarity: 'Common', description: 'A flying skeleton barrel that explodes into skeletons when destroyed.', hitPoints: 300, damage: 0, deployTime: 1, speed: 'Medium', range: 'Melee: Short' },
  { name: 'Firecracker', type: 'Troop', elixirCost: 3, rarity: 'Common', description: 'A ranged troop that shoots firecrackers in a spread pattern.', hitPoints: 304, damage: 64, deployTime: 1, speed: 'Medium', range: 'Ranged' },
  { name: 'Royal Delivery', type: 'Spell', elixirCost: 3, rarity: 'Common', description: 'Deploys a Royal Hog that charges forward and damages enemies.', hitPoints: 0, damage: 200, deployTime: 0, speed: 'Instant', range: 'Ranged' },
  { name: 'Arrows', type: 'Spell', elixirCost: 3, rarity: 'Common', description: 'Shoots arrows that damage all enemies in an area.', hitPoints: 0, damage: 200, deployTime: 0, speed: 'Instant', range: 'Ranged' },
  { name: 'Dart Goblin', type: 'Troop', elixirCost: 3, rarity: 'Rare', description: 'A fast ranged troop that throws darts.', hitPoints: 261, damage: 156, deployTime: 1, speed: 'Very Fast', range: 'Ranged' },
  { name: 'Musketeer', type: 'Troop', elixirCost: 4, rarity: 'Rare', description: 'A powerful ranged troop with high damage.', hitPoints: 400, damage: 200, deployTime: 1, speed: 'Medium', range: 'Ranged' },
  { name: 'Mini P.E.K.K.A', type: 'Troop', elixirCost: 4, rarity: 'Rare', description: 'A small but powerful melee troop with high damage.', hitPoints: 600, damage: 350, deployTime: 1, speed: 'Fast', range: 'Melee: Short' },
  { name: 'Hog Rider', type: 'Troop', elixirCost: 4, rarity: 'Rare', description: 'A fast melee troop that charges at enemies.', hitPoints: 800, damage: 150, deployTime: 1, speed: 'Fast', range: 'Melee: Short' },
  { name: 'Valkyrie', type: 'Troop', elixirCost: 4, rarity: 'Rare', description: 'A strong melee troop that deals splash damage.', hitPoints: 1,200, damage: 200, deployTime: 1, speed: 'Medium', range: 'Melee: Medium' },
  { name: 'Giant', type: 'Troop', elixirCost: 5, rarity: 'Rare', description: 'A very tanky troop with massive health but low damage.', hitPoints: 4090, damage: 253, deployTime: 1, speed: 'Slow', range: 'Melee: Medium' },
  { name: 'Balloon', type: 'Troop', elixirCost: 5, rarity: 'Epic', description: 'A flying troop that drops bombs. Deals massive damage on death.', hitPoints: 1679, damage: 640, deployTime: 1, speed: 'Slow', range: 'Melee: Short' },
  { name: 'Wizard', type: 'Troop', elixirCost: 5, rarity: 'Rare', description: 'A ranged troop that shoots fireballs dealing splash damage.', hitPoints: 600, damage: 200, deployTime: 1, speed: 'Medium', range: 'Ranged' },
  { name: 'Baby Dragon', type: 'Troop', elixirCost: 4, rarity: 'Epic', description: 'A flying dragon that deals splash damage.', hitPoints: 1152, damage: 161, deployTime: 1, speed: 'Medium', range: 'Ranged' },
  { name: 'Fireball', type: 'Spell', elixirCost: 4, rarity: 'Rare', description: 'Throws a fireball that damages all enemies in an area.', hitPoints: 0, damage: 400, deployTime: 0, speed: 'Instant', range: 'Ranged' },
  { name: 'Rage', type: 'Spell', elixirCost: 3, rarity: 'Epic', description: 'Increases the movement and attack speed of troops in an area.', hitPoints: 0, damage: 0, deployTime: 0, speed: 'Instant', range: 'Ranged' },
  { name: 'Freeze', type: 'Spell', elixirCost: 4, rarity: 'Epic', description: 'Freezes all enemies in an area, stunning them.', hitPoints: 0, damage: 0, deployTime: 0, speed: 'Instant', range: 'Ranged' },
  { name: 'Rocket', type: 'Spell', elixirCost: 6, rarity: 'Rare', description: 'Launches a rocket that deals massive damage in a large area.', hitPoints: 0, damage: 600, deployTime: 0, speed: 'Instant', range: 'Ranged' },
  { name: 'Poison', type: 'Spell', elixirCost: 4, rarity: 'Epic', description: 'Poisons an area, dealing damage over time to all enemies inside.', hitPoints: 0, damage: 200, deployTime: 0, speed: 'Instant', range: 'Ranged' },
  { name: 'Lightning', type: 'Spell', elixirCost: 6, rarity: 'Epic', description: 'Strikes enemies with lightning, dealing massive damage.', hitPoints: 0, damage: 500, deployTime: 0, speed: 'Instant', range: 'Ranged' },
  { name: 'Tornado', type: 'Spell', elixirCost: 3, rarity: 'Epic', description: 'Creates a tornado that pushes and damages enemies.', hitPoints: 0, damage: 100, deployTime: 0, speed: 'Instant', range: 'Ranged' },
  { name: 'Clone', type: 'Spell', elixirCost: 3, rarity: 'Epic', description: 'Creates a copy of a troop in the spell area.', hitPoints: 0, damage: 0, deployTime: 0, speed: 'Instant', range: 'Ranged' },
  { name: 'Mirror', type: 'Spell', elixirCost: 1, rarity: 'Epic', description: 'Copies the last card you played.', hitPoints: 0, damage: 0, deployTime: 0, speed: 'Instant', range: 'Ranged' },
  { name: 'P.E.K.K.A', type: 'Troop', elixirCost: 7, rarity: 'Epic', description: 'A massive melee troop with extremely high damage.', hitPoints: 2000, damage: 600, deployTime: 1, speed: 'Slow', range: 'Melee: Short' },
  { name: 'Golem', type: 'Troop', elixirCost: 8, rarity: 'Epic', description: 'A massive tanky troop that splits into smaller golems when destroyed.', hitPoints: 3500, damage: 200, deployTime: 1, speed: 'Very Slow', range: 'Melee: Short' },
  { name: 'Skeleton Army', type: 'Troop', elixirCost: 3, rarity: 'Epic', description: 'Summons 16 skeletons to swarm enemies.', hitPoints: 20, damage: 10, deployTime: 1, speed: 'Fast', range: 'Melee: Short' },
  { name: 'Witch', type: 'Troop', elixirCost: 5, rarity: 'Epic', description: 'A ranged troop that spawns skeletons to fight for her.', hitPoints: 800, damage: 150, deployTime: 1, speed: 'Medium', range: 'Ranged' },
  { name: 'Inferno Tower', type: 'Building', elixirCost: 5, rarity: 'Rare', description: 'A defensive building that shoots a beam that increases in damage.', hitPoints: 1200, damage: 100, deployTime: 0, speed: 'Slow', range: 'Ranged' },
  { name: 'Electro Dragon', type: 'Troop', elixirCost: 5, rarity: 'Epic', description: 'A flying dragon that shoots electricity at multiple enemies.', hitPoints: 949, damage: 192, deployTime: 1, speed: 'Medium', range: 'Ranged' },
  { name: 'Miner', type: 'Troop', elixirCost: 3, rarity: 'Legendary', description: 'A legendary troop that can tunnel underground to any location.', hitPoints: 800, damage: 200, deployTime: 1, speed: 'Fast', range: 'Melee: Short' },
  { name: 'Princess', type: 'Troop', elixirCost: 3, rarity: 'Legendary', description: 'A legendary ranged troop that shoots arrows from a distance.', hitPoints: 300, damage: 150, deployTime: 1, speed: 'Medium', range: 'Ranged' },
  { name: 'Ice Wizard', type: 'Troop', elixirCost: 3, rarity: 'Legendary', description: 'A legendary wizard that freezes enemies on impact.', hitPoints: 600, damage: 150, deployTime: 1, speed: 'Medium', range: 'Ranged' },
  { name: 'Lava Hound', type: 'Troop', elixirCost: 7, rarity: 'Legendary', description: 'A legendary flying troop with massive health that splits into pups when destroyed.', hitPoints: 3000, damage: 100, deployTime: 1, speed: 'Slow', range: 'Melee: Short' },
  { name: 'Sparky', type: 'Troop', elixirCost: 6, rarity: 'Legendary', description: 'A legendary troop that charges up and releases a powerful beam.', hitPoints: 1500, damage: 800, deployTime: 1, speed: 'Slow', range: 'Ranged' },
  { name: 'Inferno Dragon', type: 'Troop', elixirCost: 4, rarity: 'Legendary', description: 'A legendary flying dragon that shoots a beam of fire.', hitPoints: 900, damage: 200, deployTime: 1, speed: 'Medium', range: 'Ranged' },
  { name: 'Electro Wizard', type: 'Troop', elixirCost: 4, rarity: 'Legendary', description: 'A legendary wizard that stuns enemies on spawn and attack.', hitPoints: 714, damage: 115, deployTime: 1, speed: 'Medium', range: 'Ranged' },
  { name: 'Bandit', type: 'Troop', elixirCost: 3, rarity: 'Legendary', description: 'A legendary troop that dashes through enemies.', hitPoints: 906, damage: 194, deployTime: 1, speed: 'Very Fast', range: 'Melee: Short' },
  { name: 'Royal Ghost', type: 'Troop', elixirCost: 3, rarity: 'Legendary', description: 'A legendary invisible troop that becomes visible when attacking.', hitPoints: 1200, damage: 200, deployTime: 1, speed: 'Fast', range: 'Melee: Short' },
  { name: 'Mega Knight', type: 'Troop', elixirCost: 7, rarity: 'Legendary', description: 'A legendary super-strong melee troop with a powerful jump attack.', hitPoints: 2500, damage: 400, deployTime: 1, speed: 'Medium', range: 'Melee: Medium' },
  { name: 'The Log', type: 'Spell', elixirCost: 2, rarity: 'Legendary', description: 'A legendary spell that pushes enemies back and damages them.', hitPoints: 0, damage: 150, deployTime: 0, speed: 'Instant', range: 'Ranged' },
];

async function seedCards() {
  try {
    console.log('Starting to seed cards...');
    for (const card of cardsData) {
      await insertCard(card);
      console.log(`✓ Added card: ${card.name}`);
    }
    console.log('✓ All cards seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding cards:', error);
    process.exit(1);
  }
}

seedCards();
