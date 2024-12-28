let counter = 1;
let content = [];
let simulate = document.getElementById("excelInputSimultaion");
let num = document.getElementById("CustNumber");
let table = document.querySelectorAll("table")[0];
let mytable = document.querySelector("#hiddenTable");
let myform = document.querySelector("#myform");
let myhome = document.querySelector("#myhome");

// =================================================================
//   simulate.addEventListener("click", () => {
//     mytable.style.display="inline"
//     mytable.classList.add("mt-5")
//     myhome.style.justifyContent="start"
//     myform.style.position="absolute"
//     myform.style.top="50px"
//     myform.style.right="10px"
// });

function generate_Table(c, arr_of_obj, num_of_servers, taskToDownload) {
  table.style.display = "block";
  myform.classList.remove("child1");
  myform.classList.add("child2");
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
