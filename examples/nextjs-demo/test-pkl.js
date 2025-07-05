const { load } = require('@nexo-labs/pkl');

async function test() {
  try {
    console.log('Testing PKL configuration loading...');
    const config = await load('./config.pkl');
    console.log('✅ PKL configuration loaded successfully:');
    console.log(JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('❌ Error loading PKL configuration:', error.message);
  }
}

test();