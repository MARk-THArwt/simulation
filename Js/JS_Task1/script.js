let bar = document.getElementById("bar");
let line = document.getElementById("line");
let circle = document.getElementById("circle");
let counter = 1;
let content = [];
let simulate = document.getElementById("excelInputSimultaion");
let num = document.getElementById("CustNumber");
let table = document.querySelectorAll("table")[1];
readData();
let arrivalTimes;
let serviceStartTimes;
let serviceEndTimes;
let issueTypes;
let issueCounts = {};

bar.addEventListener("click", function () {
  document.getElementById("chart_bar").innerHTML = "";

  document.getElementById("chart_bar").style.display = "block";
  document.getElementById("chart_line").style.display = "none";
  document.getElementById("char_Doughnut").style.display = "none";
  anychart.onDocumentReady(function () {
    let barChart = anychart.bar();

    let data = [];
    for (let i = 0; i < content.length; i++) {
      data.push({
        x: `Customer ${content[i].id}`,
        value: content[i].serviceTime,
      });
    }

    // تعيين البيانات
    barChart.data(data);
    barChart.title("Service Time per Customer");
    barChart.xAxis().title("Customer");
    barChart.yAxis().title("Service Time");
    barChart.background().fill(null);

    barChart.container("chart_bar");
    barChart.draw();
  });
});
line.addEventListener("click", function () {
  document.getElementById("chart_line").innerHTML = "";

  document.getElementById("chart_bar").style.display = "none";
  document.getElementById("chart_line").style.display = "block";
  document.getElementById("char_Doughnut").style.display = "none";

  anychart.onDocumentReady(function () {
    let lineChart = anychart.line();

    // إضافة السلاسل
    lineChart.line(arrivalTimes).name("Arrival Time");
    lineChart.line(serviceStartTimes).name("Service Start Time");
    lineChart.line(serviceEndTimes).name("Service End Time");
    lineChart.background().fill(null);

    // ضبط العنوان والمحور
    lineChart.title("Customer Arrival, Service Start, and End Times");
    lineChart.xAxis().title("Customer ID");
    lineChart.yAxis().title("Time");

    // وضع الرسم في العنصر
    lineChart.container("chart_line");
    lineChart.draw();
  });
});
circle.addEventListener("click", function () {
  document.getElementById("char_Doughnut").innerHTML = "";

  document.getElementById("chart_bar").style.display = "none";
  document.getElementById("chart_line").style.display = "none";
  document.getElementById("char_Doughnut").style.display = "block";

  anychart.onDocumentReady(function () {
    let doughnutData = [];
    for (let issue in issueCounts) {
      doughnutData.push({ x: issue, value: issueCounts[issue] });
    }

    let doughnutChart = anychart.pie(doughnutData);
    doughnutChart.innerRadius("50%"); // لتحويله إلى Doughnut
    doughnutChart.background().fill(null);

    doughnutChart.title("Distribution of Issue Types");
    doughnutChart.container("char_Doughnut");
    doughnutChart.draw();
  });
});

num.addEventListener("change", (event) => {
  table.innerHTML = `<tr>
                <th>Customer#</th>
                <th>Inter Arrival time</th>
                <th>Issue code</th>
                <th>Issue</th>
                <th>Arrival time</th>
                <th>Time service (begin)</th>
                <th>Service time</th>
                <th>Time service (end)</th>
                <th>Customer state</th>
                <th>System State</th>
            </tr>`;
  for (i = 0; i < event.target.value; i++) {
    if (i == 0) {
      table.innerHTML += `<tr>
        <td>
            ${i + 1}
        </td>
        <td>
            <input type="text" onfocus="${() => {
              navigate(this, i);
            }}" class="inputOfTable int_inputs">
        </td>
        <td>
            <input type="text" onfocus="${() => {
              navigate(this, i);
            }}" class="inputOfTable code_inputs">
        </td>
        <td id="rowspanning" colspan="7">
            This content will be auto-generated
        </td>
    </tr>`;
    } else {
      table.innerHTML += `<tr>
        <td>
            ${i + 1}
        </td>
        <td>
            <input type="text" onfocus="${() => {
              navigate(this, i);
            }}" class="inputOfTable int_inputs">
        </td>
        <td>
            <input type="text" onfocus="${() => {
              navigate(this, i);
            }}" class="inputOfTable code_inputs">
        </td>`;
    }
    counter = i + 1;
  }
  navigate(document.getElementsByClassName("int_inputs")[0], 0);
});
// =================================================================
function readData() {
  simulate.addEventListener("click", () => {
    content = [];
    let prev_CustArrival = 0;
    let prev_serviceEnd = 0;
    for (let i = 0; i < counter; i++) {
      content.push({
        id: i + 1,
        InterArrivalTime:
          document.getElementsByClassName("int_inputs")[i].value,
        Issue_code: document.getElementsByClassName("code_inputs")[i].value,
      });
      if (content[i].InterArrivalTime == "" || content[i].Issue_code == "") {
        counter = i;
        generate_Table(counter);
        return;
      }
      console.log(content[i].InterArrivalTime);

      if (content[i].Issue_code == 1) {
        content[i].IssueType = "Network";
        content[i].serviceTime = 3;
      } else if (content[i].Issue_code == 2) {
        content[i].IssueType = "Software";
        content[i].serviceTime = 5;
      } else if (content[i].Issue_code == 3) {
        content[i].IssueType = "Hardware";
        content[i].serviceTime = 7;
      } else if (content[i].Issue_code == 4) {
        content[i].IssueType = "Security";
        content[i].serviceTime = 9;
      }
      content[i].ArrivalTime = +prev_CustArrival + +content[i].InterArrivalTime;
      prev_CustArrival = content[i].ArrivalTime;

      content[i].serviceStart = Math.max(
        prev_serviceEnd,
        +content[i].ArrivalTime
      );
      content[i].Cus_State = +content[i].serviceStart - +content[i].ArrivalTime;
      content[i].Sys_State = +content[i].serviceStart - +prev_serviceEnd;

      content[i].serviceEnd =
        +content[i].serviceStart + +content[i].serviceTime;
      prev_serviceEnd = content[i].serviceEnd;
    }
    generate_Table(counter);

    arrivalTimes = content.map((item) => item.ArrivalTime);
    serviceStartTimes = content.map((item) => item.serviceStart);
    serviceEndTimes = content.map((item) => item.serviceEnd);
    issueTypes = content.map((item) => item.IssueType);
    issueTypes.forEach((issue) => {
      issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    });
  });
}

function generate_Table(
  c,
  arr_of_obj = content,
  num_of_servers = 1,
  taskToDownload = "task1"
) {
  let server_cols = ``;
  for (let i = 1; i <= num_of_servers; i++) {
    server_cols += `
                <th><p class="srverNumber">&lt;Sr${
                  "0" + i
                }&gt;</p>Time service (begin)</th>
                <th><p class="srverNumber">&lt;Sr${
                  "0" + i
                }&gt;</p>Service time</th>
                <th><p class="srverNumber">&lt;Sr${
                  "0" + i
                }&gt;</p>Time service (end)</th>
                `;
  }

  server_cols += `<th>Customer state</th>
                <th>System State</th>
</tr>`;
  table.innerHTML =
    `<tr>
                <th>Customer#</th>
                <th>Interval Rand.</th>
                <th>Inter Arrival time</th>
                <th>Issue code Rand.</th>
                <th>Issue code</th>
                <th>Issue</th>
                <th>Arrival time</th>
                ` + server_cols;

  for (let i = 0; i < c; i++) {
    server_cols = ``;
    for (let j = 0; j < num_of_servers; j++) {
      if (j == 1) {
        server_cols += `
      <td>${arr_of_obj[i]["serviceStart_sr02"]}</td>
      <td>${arr_of_obj[i]["serviceTime_sr02"]}</td>
      <td>${arr_of_obj[i]["serviceEnd_sr02"]}</td>
      `;
      } else {
        server_cols += `
        <td>${arr_of_obj[i]["serviceStart"]}</td>
        <td>${arr_of_obj[i]["serviceTime"]}</td>
        <td>${arr_of_obj[i]["serviceEnd"]}</td>
        `;
      }
    }
    table.innerHTML +=
      `<tr>
                <td>${arr_of_obj[i].id}</td>
                <th>${
                  arr_of_obj[i].intervalRand ? arr_of_obj[i].intervalRand : "-"
                }</th>
                <td>${arr_of_obj[i].InterArrivalTime}</td>
                <th>${
                  arr_of_obj[i].issueRand ? arr_of_obj[i].issueRand : "-"
                }</th>
                <td>${arr_of_obj[i].Issue_code}</td>
                <td>${arr_of_obj[i].IssueType}</td>
                <td>${arr_of_obj[i].ArrivalTime}</td>
                ` +
      server_cols +
      ` <td>${arr_of_obj[i].Cus_State}</td>
                <td>${arr_of_obj[i].Sys_State}</td>
            </tr>
            `;
  }
  download(taskToDownload);
}
