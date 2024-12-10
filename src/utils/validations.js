export function formatPhoneNumber(input) {
  const cleaned = input.replace(/\D/g, "").slice(0, 11);
  let formatted = "+";
  for (let i = 0; i < cleaned.length; i++) {
    if (i === 1) {
      formatted += " " + cleaned[i];
    } else if (i === 4 || i === 7 || i === 9) {
      formatted += " " + cleaned[i];
    } else {
      formatted += cleaned[i];
    }
  }

  return formatted;
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phoneNumber) {
  const phoneRegex = /^\+\d \d{3} \d{3} \d{2} \d{2}$/;

  return phoneRegex.test(phoneNumber);
}

export function formatDateString(inputDate) {
  let cleanedInput = inputDate.replace(/[^\d]/g, "");

  let formattedDate = "";
  if (cleanedInput.length > 0) {
    formattedDate += cleanedInput.substr(0, 2);
  }
  if (cleanedInput.length > 2) {
    formattedDate += "." + cleanedInput.substr(2, 2);
  }
  if (cleanedInput.length > 4) {
    formattedDate += "." + cleanedInput.substr(4, 4);
  }

  return formattedDate;
}

export function validateDate(inputDate) {
  var cleanedInput = inputDate.replace(/[^\d]/g, "");

  // Перевірити довжину введеного рядка
  if (cleanedInput.length !== 8) {
    return false;
  }

  // Отримати компоненти дати
  var day = parseInt(cleanedInput.substr(0, 2), 10);
  var month = parseInt(cleanedInput.substr(2, 2), 10);
  var year = parseInt(cleanedInput.substr(4, 4), 10);

  var inputDateObj = new Date(year, month - 1, day);
  var currentDate = new Date();

  if (isNaN(inputDateObj.getTime()) || inputDateObj < currentDate) {
    return false;
  } else if (day > 31 || month > 12) {
    return false;
  } else {
    return true; // Дата валідна
  }
}

export function is24HoursPassed(inputDate, data) {
  const currentDate = new Date();
  const inputDateTime = new Date(inputDate);

  const timeDifference = currentDate - inputDateTime;

  const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;

  if(data.postLink && data.caption){
    return { isPassed: false, hoursLeft: 24 };

  }

  if (timeDifference >= twentyFourHoursInMillis) {
    return { isPassed: true, hoursLeft: 0 };
  } else {
    const hoursLeft = Math.ceil(
      (twentyFourHoursInMillis - timeDifference) / (60 * 60 * 1000)
    );
    return { isPassed: false, hoursLeft };
  }
}

export function extractNumber(inputString) {
  if (!inputString) return 0;
  const digitsOnly = inputString.replace(/\D/g, "");

  const result = parseInt(digitsOnly, 10);

  return result;
}

export function formatDateStringReport(inputDateString) {
  const inputDate = new Date(inputDateString);

  if (isNaN(inputDate)) {
    return "No Date";
  }

  const day = inputDate.getDate();
  const month = inputDate.getMonth() + 1;
  const year = inputDate.getFullYear();

  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;

  const formattedDate = `${year}/${formattedMonth}/${formattedDay}`;

  return formattedDate;
}

export function formatLink(inputLink) {
  // Убираем пробелы
  const cleanedLink = inputLink.replace(/\s/g, "");

  // Проверяем, начинается ли строка с http:// или https://
  const hasProtocol = /^https?:\/\//i.test(cleanedLink);

  // Если протокол отсутствует, добавляем https:// в начало
  const formattedLink = hasProtocol ? cleanedLink : `https://${cleanedLink}`;

  return formattedLink;
}

export function validateTextInput(text) {
  const textRegex = /^[A-Za-z0-9.,!@#$%^&*()_+\-=\[\]{};:'"<>?/\\|\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s]*$/u;
  return textRegex.test(text);
}