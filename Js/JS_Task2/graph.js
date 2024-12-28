// Data arrays for different charts
let barData;
let lineData;
let doughnutData;
let doughnutChartData;

let bar = document.getElementById("bar");
let line = document.getElementById("line");
let circle = document.getElementById("circle");
console.log(bar);

bar.addEventListener("click", (event) => {
  if (event.target.id === "bar") {
    console.log("here");
    document.getElementById("chart_bar").innerHTML = "";
  }
  console.log("here");
  document.getElementById("chart_bar").innerHTML = "";

  document.getElementById("chart_bar").style.display = "block";
  document.getElementById("chart_line").style.display = "none";
  document.getElementById("char_Doughnut").style.display = "none";
  anychart.onDocumentReady(function () {
    // 1. Bar Chart
    let barChart = anychart.bar();
    barChart.data(barData);
    barChart.title("Service Time per Customer");
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
    lineChart.data(lineData);
    lineChart.title("Customer State Time (Waiting) per Customer");
    lineChart.background().fill(null);

    lineChart.container("chart_line");
    lineChart.draw();
  });
});
circle.addEventListener("click", function () {
  doughnutChartData = Object.entries(doughnutData).map(([key, value]) => ({
    x: key,
    value,
  }));

  document.getElementById("char_Doughnut").innerHTML = "";

  document.getElementById("chart_bar").style.display = "none";
  document.getElementById("chart_line").style.display = "none";
  document.getElementById("char_Doughnut").style.display = "block";

  anychart.onDocumentReady(function () {
    let doughnutChart = anychart.pie(doughnutData);
    doughnutChart.data(doughnutChartData);
    doughnutChart.innerRadius("50%"); // لتحويله إلى Doughnut
    doughnutChart.title("Distribution of Issue Types");
    doughnutChart.background().fill(null);
    doughnutChart.container("char_Doughnut");
    doughnutChart.draw();
  });
});
