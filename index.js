const { program } = require('commander');
const fs = require('fs');

program.configureOutput({
  writeErr: (str) => {
    if (str.includes("option '-i, --input <path>' argument missing")) {
      console.error('Please, specify input file');
    } else {
      console.error(str);
    }
  }
});


program
  .option('-i, --input <path>', 'шлях до файлу для читання')  
  .option('-o, --output <path>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль');


program.parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

try {
  if (!fs.existsSync(options.input)) {
    console.error('Cannot find input file');
    process.exit(1);
  }

  const fileContent = fs.readFileSync(options.input, 'utf8');
  const jsonRecords = JSON.parse(fileContent);

  const filteredRecords = jsonRecords.filter(record => record.ku >= 13 && record.value > 5);

  if (filteredRecords.length === 0) {
    console.warn("Відфільтрованих об'єктів не виявлено.");
  }

  if (options.output) {
    const outputValues = filteredRecords.map(record => record.value).join('\n');
    fs.writeFileSync(options.output, outputValues, 'utf8');
    console.log(`Результати записано у файл: ${options.output}`);
  }

  if (options.display) {
    const outputValues = filteredRecords.map(record => record.value).join('\n');
    console.log("Відфільтровані значення value:", outputValues);
  }

  if (!options.output && !options.display) {
    process.exit(0);
  }

} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
