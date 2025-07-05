const { load, loadSync, evaluate, generateTypes } = require('../../pkl');
const path = require('path');

async function testPklEvaluator() {
  console.log('Testing PKL evaluator...\n');
  
  const testFile = path.join(__dirname, 'test.pkl');
  
  try {
    // Test async load
    console.log('1. Testing async load...');
    const result = await load(testFile);
    console.log('✓ Async load successful:', JSON.stringify(result, null, 2));
    
    // Test sync load
    console.log('\n2. Testing sync load...');
    const syncResult = loadSync(testFile);
    console.log('✓ Sync load successful:', JSON.stringify(syncResult, null, 2));
    
    // Test evaluate with inline PKL
    console.log('\n3. Testing evaluate with inline PKL...');
    const inlineResult = await evaluate('name = "Inline Test"; value = 42');
    console.log('✓ Inline evaluate successful:', JSON.stringify(inlineResult, null, 2));
    
    // Test TypeScript generation
    console.log('\n4. Testing TypeScript generation...');
    const tsCode = await generateTypes(testFile);
    console.log('✓ TypeScript generation successful:');
    console.log(tsCode);
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.stderr) {
      console.error('Error details:', error.stderr);
    }
  }
}

testPklEvaluator();
