import { ValueCalculator } from './index.js';

async function testValueCalculator() {
  console.log('🧪 Testing ValueCalculator with CEROracle integration\n');

  const calculator = new ValueCalculator();

  // Test 1: Calculate pesos from ARU
  console.log('Test 1: calculatePesos(1000 ARU)');
  const pesos = await calculator.calculatePesos(1000);
  console.log(`  Result: ${pesos.toFixed(2)} ARS\n`);

  // Test 2: Calculate ARU from pesos
  console.log('Test 2: calculateAruUnits(1_000_000 ARS)');
  const aru = await calculator.calculateAruUnits(1_000_000);
  console.log(`  Result: ${aru.toFixed(2)} ARU\n`);

  // Test 3: Get CER at specific date
  //console.log('Test 3: getCERAtDate("2024-12-30")');
  //const historicalCER = await calculator.getCERAtDate('2024-12-30');
  //if (historicalCER) {
    //console.log(`  CER on 2024-12-30: ${historicalCER} ARS\n`);
  //} else {
    //console.log('  No CER found for that date\n');
  }//

  //console.log('🎉 All tests completed!');
//}

testValueCalculator().catch(console.error);