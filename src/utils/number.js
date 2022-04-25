export function moneyMask(amount) {
  if (amount === undefined || amount === null) {
    return '0 ₫';
  } else {
    return formatText(amount, ' ₫');
  }
}

export function moneyMaskInput(amount) {
  while (/(\d+)(\d{3})/.test(amount.toString())) {
    amount = amount.toString().replace(/(\d+)(\d{3})/, '$1' + '.' + '$2');
  }
  return amount;
}

export function formatText(amount, suffix) {
  while (/(\d+)(\d{3})/.test(amount.toString())) {
    amount = amount.toString().replace(/(\d+)(\d{3})/, '$1' + '.' + '$2');
  }
  return amount + suffix;
}

export function sumMoney(arrayNumber, number) {
  let sum = 0;
  arrayNumber?.map(item => {
    sum += item;
  });

  if (number) return sum;

  return moneyMask(sum);
}

export function sumMoneyNumber(arrayNumber) {
  let sum = 0;
  arrayNumber?.map(item => {
    sum += item;
  });

  return sum;
}
