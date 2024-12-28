let service_arrObj = [];
let customer_arrObj = [];
let opening_obj = {};

let service_probabilityTable;
let customer_probabilityTable;
let openingHour;

function manageExcel_json(result) {
  let service_cumulate = 0;
  let cust_cumulate = 0;
  let service_TO_of_customerBefore = 1;
  let cust_TO_of_customerBefore = 1;
  result.map((object_e, index) => {
    if (index != 0 && index != 5) {
      let serv_obj = {};
      service_cumulate += +object_e["Probability_1"];
      serv_obj.min = object_e["Service Time"];
      serv_obj.p = object_e["Probability_1"];
      serv_obj.cummulative = service_cumulate;
      serv_obj.from = service_TO_of_customerBefore;
      serv_obj.to = service_cumulate * 100;
      service_TO_of_customerBefore = serv_obj.to + 1;
      serv_obj.issueCode = object_e["IssueCode"];

      let cust_obj = {};
      cust_cumulate += +object_e["Probability"];
      cust_obj.min = object_e["Time Between Arrivals"];
      cust_obj.p = object_e["Probability"];
      cust_obj.cummulative = cust_cumulate;
      cust_obj.from = cust_TO_of_customerBefore;
      cust_obj.to = cust_cumulate * 100;
      cust_TO_of_customerBefore = cust_obj.to + 1;

      service_arrObj.push(serv_obj);
      customer_arrObj.push(cust_obj);
    }
    if (index == 5) {
      opening_obj.title = object_e["Time Between Arrivals"];
      opening_obj.time = object_e["Probability"];
    }
    //not allowed to break from high order function
  });

  //   =============================================

  //   =============================================
  service_probabilityTable = `  <table class="table table-striped table-hover table-dark">
        <tr>
            <th rowspan="2">Issue Code</th>
            <th>Service Time</th>
            <th>Probability</th>
            <th>Cumulative</th>
            <th colspan="2">Random Digit Assignment</th>
        </tr>
        <tr>
            <td>Minuits</td>
            <td>(0 : 1)</td>
            <td>Probability</td>
            <td>From</td>
            <td>To</td>
        </tr>
        <tr>
            <td>${service_arrObj[0].issueCode}</td>
            <td>${service_arrObj[0].min}</td>
            <td>${service_arrObj[0].p}</td>
            <td>${service_arrObj[0].cummulative}</td>
            <td>${service_arrObj[0].from}</td>
            <td>${service_arrObj[0].to}</td>
        </tr>
         <tr>
            <td>${service_arrObj[1].issueCode}</td>
            <td>${service_arrObj[1].min}</td>
            <td>${service_arrObj[1].p}</td>
            <td>${service_arrObj[1].cummulative}</td>
            <td>${service_arrObj[1].from}</td>
            <td>${service_arrObj[1].to}</td>
        </tr>
        <tr>
            <td>${service_arrObj[2].issueCode}</td>
            <td>${service_arrObj[2].min}</td>
            <td>${service_arrObj[2].p}</td>
            <td>${service_arrObj[2].cummulative}</td>
            <td>${service_arrObj[2].from}</td>
            <td>${service_arrObj[2].to}</td>
        </tr>
        <tr>
            <td>${service_arrObj[3].issueCode}</td>
            <td>${service_arrObj[3].min}</td>
            <td>${service_arrObj[3].p}</td>
            <td>${service_arrObj[3].cummulative}</td>
            <td>${service_arrObj[3].from}</td>
            <td>${service_arrObj[3].to}</td>
        </tr>
    </table>
`;

  customer_probabilityTable = `  <table class="table table-striped table-hover table-dark">
        <tr>
            <th>Time Between Arrivals</th>
            <th>Probability</th>
            <th>Cumulative</th>
            <th colspan="2">Random Digit Assignment</th>
        </tr>
        <tr>
            <td>Minuits</td>
            <td>(0 : 1)</td>
            <td>Probability</td>
            <td>From</td>
            <td>To</td>
        </tr>
      <tr>
            <td>${customer_arrObj[0].min}</td>
            <td>${customer_arrObj[0].p}</td>
            <td>${customer_arrObj[0].cummulative}</td>
            <td>${customer_arrObj[0].from}</td>
            <td>${customer_arrObj[0].to}</td>
        </tr>
         <tr>
            <td>${customer_arrObj[1].min}</td>
            <td>${customer_arrObj[1].p}</td>
            <td>${customer_arrObj[1].cummulative}</td>
            <td>${customer_arrObj[1].from}</td>
            <td>${customer_arrObj[1].to}</td>
        </tr>
        <tr>
            <td>${customer_arrObj[2].min}</td>
            <td>${customer_arrObj[2].p}</td>
            <td>${customer_arrObj[2].cummulative}</td>
            <td>${customer_arrObj[2].from}</td>
            <td>${customer_arrObj[2].to}</td>
        </tr>
        <tr>
            <td>${customer_arrObj[3].min}</td>
            <td>${customer_arrObj[3].p}</td>
            <td>${customer_arrObj[3].cummulative}</td>
            <td>${customer_arrObj[3].from}</td>
            <td>${customer_arrObj[3].to}</td>
        </tr>
    </table>
`;
  openingHour = `
<table class="table table-striped table-hover table-dark">
<tr>
<th>${opening_obj.title}</th>
<th>${opening_obj.time}</th>
</tr>
</table>
`;

  document.getElementById("viewExcel").addEventListener("click", () => {
    let ModalBody = document.getElementsByClassName("Modal")[0];
    ModalBody.querySelector("#table_1").innerHTML = customer_probabilityTable;
    ModalBody.querySelector("#table_2").innerHTML = service_probabilityTable;
    ModalBody.querySelector("#table_3").innerHTML = openingHour;
    ModalBody.style.display = "block";
  });

  document.getElementById("close_btn").addEventListener("click", () => {
    document.getElementsByClassName("Modal")[0].style.display = "none";
  });
}

function lookUp_interval(rand, arrObj, ret) {
  for (let i = 0; i < arrObj.length; i++) {
    if (arrObj[i].from <= rand && rand <= arrObj[i].to) {
      return arrObj[i][ret];
    }
  }
}

function addMinutes(timeStr, minutesToAdd) {
  let [hours, minutes, seconds] = timeStr.split(":").map(Number);

  minutes += minutesToAdd;

  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

function getMaxTime(timeStr1, timeStr2) {
  function timeToSeconds(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  const seconds1 = timeToSeconds(timeStr1);
  const seconds2 = timeToSeconds(timeStr2);

  return seconds1 >= seconds2 ? timeStr1 : timeStr2;
}

function minutesBetween(timeStr1, timeStr2) {
  function timeToSeconds(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  const seconds1 = timeToSeconds(timeStr1);
  const seconds2 = timeToSeconds(timeStr2);

  const differenceInSeconds = Math.abs(seconds1 - seconds2);

  return Math.floor(differenceInSeconds / 60);
}

function lookUp_duration(rand, arrObj, ret) {
  for (let i = 0; i < arrObj.length; i++) {
    if (arrObj[i].from <= rand && rand <= arrObj[i].to) return arrObj[i][ret];
  }
}

function lookUp_issueCode(rand, arrObj) {
  for (let i = 0; i < arrObj.length; i++) {
    if (arrObj[i].from <= rand && rand <= arrObj[i].to)
      return arrObj[i].issueCode;
  }
}

function getIssueName(code) {
  if (code == "1") {
    return "Network";
  } else if (code == "2") {
    return "Software";
  } else if (code == "3") {
    return "Hardware";
  } else if (code == "4") {
    return "Security";
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sim_input() {
  let numberOfCustomers = document.getElementById("CustNumber").value;
  let [clock, period] = opening_obj.time.split(" ");
  //clock=9:00:00   period=AM
  let new_arrObj = [];
  let prev_ended = clock;
  console.log(numberOfCustomers);
  for (let i = 0; i < numberOfCustomers; i++) {
    let obj = {};
    obj.id = i + 1;
    //rand remove it
    obj.intervalRand = Math.floor(Math.random() * 100) + 1;
    obj.InterArrivalTime = lookUp_interval(
      obj.intervalRand,
      customer_arrObj,
      "min"
    );
    obj.ArrivalTime = addMinutes(clock, +obj.InterArrivalTime);
    clock = obj.ArrivalTime;
    obj.issueRand = Math.floor(Math.random() * 100) + 1;
    obj.Issue_code = lookUp_issueCode(obj.issueRand, service_arrObj);
    obj.IssueType = getIssueName(obj.Issue_code);
    obj.serviceStart = getMaxTime(prev_ended, obj.ArrivalTime);
    obj.serviceTime = lookUp_duration(obj.issueRand, service_arrObj, "min");
    obj.serviceEnd = addMinutes(obj.serviceStart, +obj.serviceTime);
    obj.Cus_State = minutesBetween(obj.ArrivalTime, obj.serviceStart);
    obj.Sys_State = minutesBetween(prev_ended, obj.serviceStart);
    prev_ended = obj.serviceEnd;
    new_arrObj.push(obj);
  }

  console.log(new_arrObj);
  generate_Table(numberOfCustomers, new_arrObj, 1, "task2");
  // Data arrays for different charts
  barData = new_arrObj.map((obj) => ({
    x: `Customer ${obj.id}`,
    value: obj.serviceTime,
  }));
  lineData = new_arrObj.map((obj, index) => ({
    x: `Customer ${index + 1}`,
    value: obj.Cus_State,
  }));
  doughnutData = new_arrObj.reduce((acc, obj) => {
    let issueType = obj.IssueType;
    if (!acc[issueType]) acc[issueType] = 0;
    acc[issueType]++;
    return acc;
  }, {});
}
