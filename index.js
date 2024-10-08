const { program } = require('commander');
const fs = require('fs');

// Налаштування параметрів командного рядка
program
  .requiredOption('-i, --input <path>', 'шлях до файлу для читання')
  .option('-o, --output <path>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль');

program.parse(process.argv);

const options = program.opts();

try {
  // Перевірка наявності файлу
  if (!fs.existsSync(options.input)) {
    console.error('Cannot find input file');
    process.exit(1);
  }

  // Читання файлу
  const fileContent = fs.readFileSync(options.input, 'utf8');
  const jsonRecords = JSON.parse(fileContent);

  // Фільтрація індексів споживчих цін
  const filteredRecords = jsonRecords.filter(record => record.ku === 13 && record.value >= 0);

  // Виведення попередження, якщо результат порожній
  if (filteredRecords.length === 0) {
    console.warn("Відфільтрованих об'єктів не виявлено.");
  }

  // Якщо немає опції output або display, програма не повинна нічого виводити
  if (!options.output && !options.display) {
    process.exit(0);
  }

  // Якщо задано опцію display, вивести відфільтровані дані у консоль
  if (options.display) {
    console.log("Відфільтровані дані:", filteredRecords);
  }

  // Якщо задано опцію output, записати результат у файл
  if (options.output) {
    const outputValues = filteredRecords.map(record => record.value).join('\n');
    fs.writeFileSync(options.output, outputValues, 'utf8');
    console.log(`Результати записано у файл: ${options.output}`);
  }

} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
