#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { generate } = require('../index');
const path = require('path');

const argv = yargs(hideBin(process.argv))
  .command('$0 <file>', 'Generate TypeScript definitions from a Pkl file', (yargs) => {
    yargs.positional('file', {
      describe: 'The Pkl file to generate TypeScript definitions from',
      type: 'string',
    });
  })
  .option('output', {
    alias: 'o',
    describe: 'The output file path',
    type: 'string',
  })
  .option('outdir', {
    alias: 'd',
    describe: 'The output directory',
    type: 'string',
  })
  .help()
  .argv;

async function main() {
  try {
    const filePath = argv.file;
    let outputPath = argv.output;

    if (!outputPath) {
      const baseName = path.basename(filePath, '.pkl');
      const outputDir = argv.outdir || './generated';
      outputPath = path.join(outputDir, `${baseName}.ts`);
    }

    console.log(`Generating TypeScript definitions for: ${filePath}`);
    console.log(`Output file: ${outputPath}`);

    const result = await generate(filePath, { outputPath });
    
    console.log('TypeScript definitions generated successfully!');
    
    if (!argv.output && !argv.outdir) {
      console.log('\nGenerated TypeScript code:');
      console.log('─'.repeat(50));
      console.log(result);
    }
  } catch (error) {
    console.error('Error generating TypeScript definitions:', error.message);
    process.exit(1);
  }
}

main();
