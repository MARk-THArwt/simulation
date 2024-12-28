let bar = document.getElementById("bar");
let line = document.getElementById("line");
let circle = document.getElementById("circle");

document.getElementById("save").addEventListener("click", function () {
  exportToExcel();
});
bar.addEventListener("click", function () {
    document.getElementById("chart_bar").innerHTML = "";

    document.getElementById("chart_bar").style.display     = "block";
    document.getElementById("chart_line").style.display    = "none";
    document.getElementById("char_Doughnut").style.display = "none";
  const days = [...Day]; // الأيام
  const dailyProfits = [...Daily_Profit]; // الأرباح اليومية

  let data = [];
  for (let i = 0; i < Day.length; i++) {
    data.push({ x: `Day ${Day[i]}`, value: Daily_Profit[i] });
  }

  // إنشاء الرسم باستخدام AnyChart
  anychart.onDocumentReady(function () {
    // إنشاء مخطط عمودي
    let chart = anychart.bar();

    // تعيين البيانات
    chart.data(data);

    // تخصيص الألوان
    chart.palette([
      "#4CAF50",
      "#FFC107",
      "#2196F3",
      "#FF5722",
      "#9C27B0",
      "#3F51B5",
      "#00BCD4",
      "#009688",
    ]);

    // جعل الخلفية شفافة
    chart.background().fill(null);

    // تخصيص العناوين
    chart.title("Daily Profit Bar Chart");
    chart.xAxis().title("Days");
    chart.yAxis().title("Profit");

    // ربط الرسم البياني بالحاوية
    chart.container("chart_bar");
    chart.draw();
  });
  
});
line.addEventListener("click", function () {
    document.getElementById("chart_line").innerHTML = "";

// بيانات الرسم
const data = [];
for (let i = 0; i < Day.length; i++) {
  data.push({ x: `Day ${Day[i]}`, value: Daily_Profit[i] });
}

  // إنشاء الرسم البياني
  const chart = anychart.line();

  // ضبط البيانات
  chart.data(data);

  // تخصيص العنوان
  chart.title("Daily Profits Over Days");

  // تخصيص المحاور
  chart.xAxis().title("Days");
  chart.yAxis().title("Profits");
  chart.background().fill(null);

  // ضبط اسم السلسلة
  const series = chart.getSeries(0);
  if (series) series.name("Profit Trend");

  // ضبط منطقة الرسم
  chart.container("chart_line");

  // رسم الرسم البياني
  chart.draw();

  document.getElementById("chart_bar").style.display = "none";
  document.getElementById("chart_line").style.display = "block";
  document.getElementById("char_Doughnut").style.display = "none";
});
circle.addEventListener("click", function () {
    document.getElementById("char_Doughnut").innerHTML = "";
  const dailyProfits = [...Daily_Profit]; // الأرباح اليومية

  let data = [];
  for (let i = 0; i < Day.length; i++) {
    data.push({ x: `Day ${Day[i]}`, value: Daily_Profit[i] });
  }

  // إنشاء الرسم باستخدام AnyChart
  anychart.onDocumentReady(function () {
    // إنشاء مخطط Doughnut
    let chart = anychart.pie(data);
    chart.background().fill(null);
    // تخصيص الألوان
    chart.palette([
      "#4CAF50",
      "#FFC107",
      "#2196F3",
      "#FF5722",
      "#9C27B0",
      "#3F51B5",
      "#00BCD4",
      "#009688",
    ]);

    // تخصيص العناوين
    chart.title("Daily Profit Distribution");
    chart.labels().format("{%x}: {%value}"); // تخصيص النصوص المرفقة بكل جزء

    // ربط الرسم البياني بالحاوية
    chart.container("char_Doughnut");
    chart.draw();
  });

  document.getElementById("chart_bar").style.display = "none";
  document.getElementById("chart_line").style.display = "none";
  document.getElementById("char_Doughnut").style.display = "block";
});

document.getElementById("upload").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    const n = +document.getElementById("numbertest").value;
    processExcelData(jsonData, n);
    document.getElementById("show").addEventListener("click", function () {
      const table = document.getElementById("mytable");
      document.querySelector(".container1").classList.add("he");
      table.innerHTML = "";
      table.innerHTML += `<thead>
        <tr>
            <th scope="col">Day</th>
            <th scope="col">R.D. for Type of Newsday</th>
            <th scope="col">Type of Newsday</th>
            <th scope="col">R.D. for Demand</th>
            <th scope="col">Demand</th>
            <th scope="col">Revenue from Sales</th>
            <th scope="col">Excess Demand</th>
            <th scope="col">Lost Profit from Excess Demand</th>
            <th scope="col">Number of Scrap Papers</th>
            <th scope="col">Salvage from Sale of Scrap</th>
            <th scope="col">Daily Profit</th>
        </tr>
        </thead>`;
      for (let i = 0; i < n; i++) {
        let content = `
                <tr>
            <th scope="row">${Day[i]}</th>
            <td>${R_D_for_Type_of_Newsday[i]}</td>
            <td>${Type_Newsday[i]}</td>
            <td>${R_D_for_Demand[i]}</td>
            <td>${Demand[i]}</td>
            <td>${Revenue_from_Sales[i]}</td>
            <td>${Excess_Demand[i]}</td>
            <td>${Lost_Profit_from_Excess_Demand[i]}</td>
            <td>${Number_of_Scrap_Papers[i]}</td>
            <td>${Salvage_from_Sale_of_Scrap[i]}</td>
            <td>${Daily_Profit[i]}</td>
                </tr>`;
        table.innerHTML += content;
      }
      table.innerHTML += `<th scope="row"></th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>total Daily Profit</td>
            <td>${total_Daily_Profit}</td>
                </tr>`;
    });
  };

  reader.readAsArrayBuffer(file);
});

let Revenue_from_Sales = [];
let Excess_Demand = [];
let Lost_Profit_from_Excess_Demand = [];
let Number_of_Scrap_Papers = [];
let Salvage_from_Sale_of_Scrap = [];
let Daily_Profit = [];
let from = [1];
let to = [];
let from_Good = [1];
let to_Good = [];
let from_Fair = [1];
let to_Fair = [];
let from_Poor = [1];
let to_Poor = [];
let Cumulative_Probability = [];
let Cumulative_Probability_Good = [];
let Cumulative_Probability_Poor = [];
let Cumulative_Probability_Fair = [];
let Day = [];
let R_D_for_Type_of_Newsday = [];
let R_D_for_Demand = [];
let Type_Newsday = [];
let Demand = [];
let total_Daily_Profit = 0;

function processExcelData(data, n) {
  const Type_of_Newsday = data.map((row) => row.Type_of_Newsday);
  const Probability = data.map((row) => row.Probability);
  const Probability_Good = data.map((row) => row.Good);
  const Probability_Poor = data.map((row) => row.Poor);
  const Probability_Fair = data.map((row) => row.Fair);
  const demand = data.map((row) => row.demand);

  Cumulative_Probability.push(Probability[0]);
  Cumulative_Probability_Good.push(Probability_Good[0]);
  Cumulative_Probability_Poor.push(Probability_Poor[0]);
  Cumulative_Probability_Fair.push(Probability_Fair[0]);

  for (let i = 1; i < 3; i++) {
    Cumulative_Probability.push(Probability[i] + Cumulative_Probability[i - 1]);
  }

  for (let i = 0; i < 3; i++) {
    to.push(Cumulative_Probability[i] * 100);
  }

  for (let i = 0; i < 2; i++) {
    from.push(to[i] + 1);
  }

  for (let i = 1; i < 7; i++) {
    Cumulative_Probability_Good.push(
      Probability_Good[i] + Cumulative_Probability_Good[i - 1]
    );
  }

  for (let i = 1; i < 5; i++) {
    Cumulative_Probability_Poor.push(
      Probability_Poor[i] + Cumulative_Probability_Poor[i - 1]
    );
  }

  for (let i = 1; i < 6; i++) {
    Cumulative_Probability_Fair.push(
      Probability_Fair[i] + Cumulative_Probability_Fair[i - 1]
    );
  }

  for (let i = 0; i < 7; i++) {
    to_Good.push(Cumulative_Probability_Good[i] * 100);
  }

  for (let i = 0; i < 6; i++) {
    from_Good.push(to_Good[i] + 1);
  }

  for (let i = 0; i < 6; i++) {
    to_Fair.push(Math.round(Cumulative_Probability_Fair[i] * 100));
  }

  for (let i = 0; i < 5; i++) {
    from_Fair.push(to_Fair[i] + 1);
  }

  for (let i = 0; i < 5; i++) {
    to_Poor.push(Math.round(Cumulative_Probability_Poor[i] * 100));
  }

  for (let i = 0; i < 4; i++) {
    from_Poor.push(to_Poor[i] + 1);
  }

  for (let i = 1; i <= n; i++) {
    Day.push(i);
  }
  for (let i = 1; i <= n; i++) {
    R_D_for_Type_of_Newsday.push(Math.ceil(Math.random() * 100));
  }
  for (let i = 1; i <= n; i++) {
    R_D_for_Demand.push(Math.ceil(Math.random() * 100));
  }

  R_D_for_Type_of_Newsday.forEach((R_D_for_Type_of_Newsday) => {
    for (let i = 0; i < 3; i++) {
      if (
        R_D_for_Type_of_Newsday >= from[i] &&
        R_D_for_Type_of_Newsday <= to[i]
      ) {
        Type_Newsday.push(Type_of_Newsday[i]);
        break;
      }
    }
  });

  for (let j = 0; j < n; j++) {
    if (Type_Newsday[j] == Type_of_Newsday[0]) {
      for (let i = 0; i < 7; i++) {
        if (
          R_D_for_Demand[j] >= from_Good[i] &&
          R_D_for_Demand[j] <= to_Good[i]
        ) {
          Demand.push(demand[i]);
          break;
        }
      }
    } else if (Type_Newsday[j] == Type_of_Newsday[1]) {
      for (let i = 0; i < 6; i++) {
        if (
          R_D_for_Demand[j] >= from_Fair[i] &&
          R_D_for_Demand[j] <= to_Fair[i]
        ) {
          Demand.push(demand[i]);
          break;
        }
      }
    } else {
      for (let i = 0; i < 5; i++) {
        if (
          R_D_for_Demand[j] >= from_Poor[i] &&
          R_D_for_Demand[j] <= to_Poor[i]
        ) {
          Demand.push(demand[i]);
          break;
        }
      }
    }
  }
  console.log(Demand[n - 1]);

  for (let i = 0; i < n; i++) {
    if (Demand[i] > 70) Revenue_from_Sales.push(70 * data[0].Selling_price);
    else Revenue_from_Sales.push(Demand[i] * data[0].Selling_price);
  }

  for (let i = 0; i < n; i++) {
    if (Demand[i] > 70) Excess_Demand.push(Demand[i] - 70);
    else Excess_Demand.push(0);
  }

  for (let i = 0; i < n; i++) {
    Lost_Profit_from_Excess_Demand.push(
      (Excess_Demand[i] * data[0].Profit).toFixed(2)
    );
  }

  for (let i = 0; i < n; i++) {
    if (Demand[i] < 70) Number_of_Scrap_Papers.push(70 - Demand[i]);
    else Number_of_Scrap_Papers.push(0);
  }

  for (let i = 0; i < n; i++) {
    Salvage_from_Sale_of_Scrap.push(
      (Number_of_Scrap_Papers[i] * data[0].Price_of_scrap).toFixed(2)
    );
  }

  for (let i = 0; i < n; i++) {
    Daily_Profit.push(
      (
        Number(Revenue_from_Sales[i]) +
        Number(Salvage_from_Sale_of_Scrap[i]) -
        data[0].Daily_purchase * data[0].Cost
      ).toFixed(2)
    );
  }

  for (let i = 0; i < n; i++) {
    total_Daily_Profit += +Daily_Profit[i];
  }
}

//
function exportToExcel() {
  // إنشاء البيانات التي سيتم تصديرها
  const headers = [
    [
      "Day",
      "R.D. for Type of Newsday",
      "Type of Newsday",
      "R.D. for Demand",
      "Demand",
      "Revenue from Sales",
      "Excess Demand",
      "Lost Profit from Excess Demand",
      "Number of Scrap Papers",
      "Salvage from Sale of Scrap",
      "Daily Profit",
    ],
  ];

  const excelData = Day.map((_, index) => [
    Day[index],
    R_D_for_Type_of_Newsday[index],
    Type_Newsday[index],
    R_D_for_Demand[index],
    Demand[index],
    `$${Revenue_from_Sales[index]}`,
    Excess_Demand[index],
    `$${Lost_Profit_from_Excess_Demand[index]}`,
    Number_of_Scrap_Papers[index],
    `$${Salvage_from_Sale_of_Scrap[index]}`,
    `$${Daily_Profit[index]}`,
  ]);

  // إضافة البيانات النهائية
  const worksheetData = headers.concat(excelData);

  // إنشاء workbook و worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // إضافة worksheet إلى workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Newspaper Data");

  // حفظ الملف
  XLSX.writeFile(workbook, "newspaper_sellers_problem.xlsx");
}
