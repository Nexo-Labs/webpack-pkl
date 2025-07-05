#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { PklFileProcessor } = require('../../pkl-eval/file-processor');
const path = require('path');
const glob = require('glob');

const argv = yargs(hideBin(process.argv))
  .command('$0 [files..]', 'Process PKL files to generate types and JSON', (yargs) => {
    yargs.positional('files', {
      describe: 'PKL files to process (supports glob patterns)',
      type: 'string',
      array: true,
      default: ['**/*.pkl']
    });
  })
  .option('outdir', {
    alias: 'd',
    describe: 'Output directory (default: same as input file)',
    type: 'string',
  })
  .option('watch', {
    alias: 'w',
    describe: 'Watch for file changes',
    type: 'boolean',
    default: false
  })
  .option('types-suffix', {
    describe: 'Suffix for generated type files',
    type: 'string',
    default: '-types'
  })
  .option('no-types', {
    describe: 'Skip TypeScript generation',
    type: 'boolean',
    default: false
  })
  .option('no-json', {
    describe: 'Skip JSON generation',
    type: 'boolean',
    default: false
  })
  .help()
  .argv;

async function main() {
  const processor = new PklFileProcessor({
    outputDir: argv.outdir,
    generateTypes: !argv.noTypes,
    generateJson: !argv.noJson,
    typesSuffix: argv.typesSuffix
  });

  // Resolve all files from patterns
  const allFiles = new Set();
  for (const pattern of argv.files) {
    const matches = glob.sync(pattern);
    matches.forEach(file => allFiles.add(path.resolve(file)));
  }

  const files = Array.from(allFiles);
  
  if (files.length === 0) {
    console.log('No PKL files found matching the patterns');
    return;
  }

  console.log(`Processing ${files.length} PKL file(s)...`);

  // Process all files
  for (const file of files) {
    try {
      console.log(`\n📄 Processing: ${path.relative(process.cwd(), file)}`);
      
      const result = await processor.processFile(file);
      
      if (result.paths.json) {
        console.log(`  ✅ JSON: ${path.relative(process.cwd(), result.paths.json)}`);
      }
      
      if (result.paths.types) {
        console.log(`  ✅ Types: ${path.relative(process.cwd(), result.paths.types)}`);
      }
      
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }

  // Watch mode
  if (argv.watch) {
    console.log('\n👀 Watching for changes... (Press Ctrl+C to stop)');
    
    processor.watch(files, (error, { path, result }) => {
      if (error) {
        console.error(`❌ Error processing ${path}: ${error.message}`);
      } else {
        console.log(`🔄 Updated: ${path.relative(process.cwd(), path)}`);
      }
    });

    // Keep the process alive
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping file watcher...');
      processor.stopWatching();
      process.exit(0);
    });
  } else {
    console.log('\n✅ Processing complete!');
  }
}

main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});