import { useEffect, useState } from 'react';

function useFormattedNumberCustom(inputValue: string) {
  const [formattedNumber, setFormattedNumber] = useState<string>(formatValue(inputValue));

  useEffect(() => {
    setFormattedNumber(formatValue(inputValue));
  }, [inputValue]);

  function formatValue(value: string) {
    console.log('Raw input value:', value); // Выводим текущее значение

    // Убираем пробелы и запятые
    value = value.replace(/[\s,]+/g, '');

    // Проверка на валидность, допускаем не более одной точки
    // const validNumberPattern = /^\d*\.?\d*$/;

    // Проверяем на валидность
    // if (!validNumberPattern.test(value)) {
    //   console.log('Input contains non-numeric characters.');
    //   return value; // Если есть нечисловые символы, возвращаем без изменения
    // }

    // Удаляем ведущие нули, кроме одного перед десятичной точкой
    // let numberWithoutLeadingZeros = value.replace(/^0+(?!\.)/, '');
    // if (numberWithoutLeadingZeros.startsWith('.')) {
    //   numberWithoutLeadingZeros = '0' + numberWithoutLeadingZeros;
    // }

    // const [integerPart, decimalPart] = numberWithoutLeadingZeros.split('.');
    const [integerPart, decimalPart] = value.split('.');

    // Остается только целая часть для форматирования
    const formattedIntegerPart = parseInt(integerPart || '0', 10).toLocaleString('en-US');

    // Возвращаем отформатированное значение
    return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
  }

  // Форматируем новое значение при изменении ввода
  function handleInputChange(value: string) {
    const formattedValue = formatValue(value);
    setFormattedNumber(formattedValue);
  }

  return { formattedNumber, handleInputChange };
}

export default useFormattedNumberCustom;
