// Demo-safe fallback plan. Used when the LLM call fails or returns invalid JSON.
const day = (d, b, l, dn, chores = []) => ({
  day: d,
  meals: {
    breakfast: { name: b[0], prepMinutes: b[1] },
    lunch: { name: l[0], prepMinutes: l[1] },
    dinner: { name: dn[0], prepMinutes: dn[1] },
  },
  chores,
});

export const samplePlan = {
  days: [
    day('Mon', ['Overnight oats with banana', 5], ['Chicken & veggie wrap', 10], ['Sheet-pan chicken and potatoes', 15], [{ name: 'Laundry', start: '18:30', end: '19:30' }]),
    day('Tue', ['Overnight oats with berries', 5], ['Leftover chicken rice bowl', 5], ['Veggie stir-fry with rice', 20], [{ name: 'Wash dishes', start: '19:30', end: '19:50' }]),
    day('Wed', ['Yogurt with granola', 3], ['Veggie stir-fry bowl', 5], ['Pasta with tomato and spinach', 20], []),
    day('Thu', ['Scrambled eggs on toast', 10], ['Pasta salad', 10], ['Bean and veggie chili', 25], [{ name: 'Take out trash', start: '19:00', end: '19:10' }]),
    day('Fri', ['Overnight oats with banana', 5], ['Chili with rice', 5], ['Homemade veggie pizza', 25], []),
    day('Sat', ['Veggie omelette', 15], ['Chicken salad sandwich', 10], ['Slow-cooker curry with rice', 20], [{ name: 'Clean bathroom', start: '10:00', end: '10:45' }, { name: 'Vacuum', start: '11:00', end: '11:30' }]),
    day('Sun', ['Pancakes with berries', 20], ['Curry leftovers', 5], ['Meal-prep: roast veggies and grains', 40], [{ name: 'Laundry', start: '15:00', end: '16:00' }]),
  ],
  groceries: [
    {
      aisle: 'Produce',
      items: [
        { name: 'Bananas', quantity: '6', estCost: 2.5 },
        { name: 'Mixed berries', quantity: '2 packs', estCost: 7 },
        { name: 'Potatoes', quantity: '2 lb', estCost: 3 },
        { name: 'Spinach', quantity: '1 bag', estCost: 3 },
        { name: 'Bell peppers', quantity: '4', estCost: 5 },
        { name: 'Onions', quantity: '3', estCost: 2.5 },
      ],
    },
    {
      aisle: 'Meat & Dairy',
      items: [
        { name: 'Chicken thighs', quantity: '2 lb', estCost: 9 },
        { name: 'Eggs', quantity: '1 dozen', estCost: 4 },
        { name: 'Greek yogurt', quantity: '1 large tub', estCost: 5 },
        { name: 'Mozzarella', quantity: '1 bag', estCost: 4 },
      ],
    },
    {
      aisle: 'Pantry',
      items: [
        { name: 'Rolled oats', quantity: '1 canister', estCost: 4 },
        { name: 'Rice', quantity: '2 lb', estCost: 3 },
        { name: 'Pasta', quantity: '1 lb', estCost: 2 },
        { name: 'Canned beans', quantity: '3 cans', estCost: 3.5 },
        { name: 'Canned tomatoes', quantity: '3 cans', estCost: 4 },
        { name: 'Curry paste', quantity: '1 jar', estCost: 4 },
        { name: 'Granola', quantity: '1 bag', estCost: 4.5 },
        { name: 'Bread & tortillas', quantity: '1 each', estCost: 5 },
      ],
    },
  ],
  estimatedTotal: 76,
  timeSavedMinutes: 90,
  tip: 'Cook rice and roast veggies once on Sunday to reuse all week.',
};
