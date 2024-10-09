const { program } = require('commander');
const fs = require('fs');

program
  .requiredOption('-i, --input <path>', 'шлях до файлу для читання')
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

  // Фільтрація записів після читання вхідного файлу
  const filteredRecords = jsonRecords.filter(record => record.ku >= 13 && record.value > 5);

  // Попередження, якщо не знайдено відфільтрованих записів
  if (filteredRecords.length === 0) {
    console.warn("Відфільтрованих об'єктів не виявлено.");
  }

  // Обробка виходу, якщо зазначено
  if (options.output) {
    const outputValues = filteredRecords.map(record => record.value).join('\n');
    fs.writeFileSync(options.output, outputValues, 'utf8');
    console.log(`Результати записано у файл: ${options.output}`);
  }

  // Виведення результатів, якщо зазначено
  if (options.display) {
    const outputValues = filteredRecords.map(record => record.value).join('\n');
    console.log("Відфільтровані значення value:", outputValues);
  }

  // Вихід, якщо не вказано жодної з опцій виходу або відображення
  if (!options.output && !options.display) {
    process.exit(0);
  }

} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
