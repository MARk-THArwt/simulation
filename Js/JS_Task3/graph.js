let PrepareData;
function prepareData(simulationResults) {
  // استخراج البيانات
  const arrivalTimes = simulationResults.map((item) => item.ArrivalTime);
  const customerWaitTimes = simulationResults.map((item) => item.Cus_State);
  const systemIdleTimes = simulationResults.map((item) => item.Sys_State);
  const issueTypes = simulationResults.map((item) => item.IssueType);

  // حساب عدد العملاء لكل نوع خدمة
  const serviceCounts = issueTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return {
    arrivalTimes,
    customerWaitTimes,
    systemIdleTimes,
    serviceCounts,
  };
}

function LineChart(data) {
  const chart = anychart.line();

  // إضافة البيانات إلى الرسم
  chart
    .line(
      data.arrivalTimes.map((_, i) => [
        data.arrivalTimes[i],
        data.customerWaitTimes[i],
      ])
    )
    .name("Customer Wait Time");
  chart
    .line(
      data.arrivalTimes.map((_, i) => [
        data.arrivalTimes[i],
        data.systemIdleTimes[i],
      ])
    )
    .name("System Idle Time");

  // إعداد المحاور
  chart.xAxis().title("Arrival Time");
  chart.yAxis().title("Time (minutes)");
  chart.background().fill(null);

  // إعداد عنوان الرسم
  chart.title("Wait Time and System Idle Time");

  // عرض الرسم
  chart.container("chart_line");
  chart.draw();
}

function BarChart(data) {
  let serviceCounts = Object.entries(data.serviceCounts).map(
    ([type, count]) => ({ x: type, value: count })
  );

  // إنشاء الرسم العمودي
  const chart = anychart.bar();

  // إضافة البيانات
  chart.data(serviceCounts);

  // إعداد المحاور
  chart.xAxis().title("Service Type");
  chart.yAxis().title("Number of Customers");

  // إعداد عنوان الرسم
  chart.title("Number of Customers by Service Type");
  chart.background().fill(null);

  // عرض الرسم
  chart.container("chart_bar");
  chart.draw();
}

function DoughnutChart(data) {
  let serviceCounts = Object.entries(data.serviceCounts).map(
    ([type, count]) => ({ x: type, value: count })
  );

  // إنشاء الرسم
  const chart = anychart.pie();

  // إضافة البيانات
  chart.data(serviceCounts);

  // إعداد الرسم ليكون Doughnut
  chart.innerRadius("40%");

  // إعداد عنوان الرسم
  chart.title("Percentage of Customers by Service Type");
  chart.background().fill(null);

  // عرض الرسم
  chart.container("char_Doughnut");
  chart.draw();
}

bar.addEventListener("click", function () {
  document.getElementById("chart_bar").innerHTML = "";
  document.getElementById("chart_bar").style.display = "block";
  document.getElementById("chart_line").style.display = "none";
  document.getElementById("char_Doughnut").style.display = "none";
  BarChart(PrepareData);
});
line.addEventListener("click", function () {
  document.getElementById("chart_line").innerHTML = "";
  document.getElementById("chart_bar").style.display = "none";
  document.getElementById("chart_line").style.display = "block";
  document.getElementById("char_Doughnut").style.display = "none";
  LineChart(PrepareData);
});
circle.addEventListener("click", function () {
  document.getElementById("char_Doughnut").innerHTML = "";
  document.getElementById("chart_bar").style.display = "none";
  document.getElementById("chart_line").style.display = "none";
  document.getElementById("char_Doughnut").style.display = "block";
  DoughnutChart(PrepareData);
});
