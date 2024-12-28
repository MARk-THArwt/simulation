let servers_probabilityTable;
let serviceTime_probabilityTable;
let Parallel_openingHourTable;
let Parallel_interval_arrObj = [];
let Parallel_server_arrObj = [
  {
    issueCode: 2,
    type: "software",
    duration_of_sr01: 0,
    duration_of_sr02: 0,
    sr01_counter: 0,
    sr02_counter: 0,
    probability: 0,
    from: 0,
    to: 0,
  },
  {
    issueCode: 1,
    type: "network",
    duration_of_sr01: 0,
    duration_of_sr02: 0,
    sr01_counter: 0,
    sr02_counter: 0,
    probability: 0,
    from: 0,
    to: 0,
  },
  {
    issueCode: 4,
    type: "security",
    duration_of_sr01: 0,
    duration_of_sr02: 0,
    sr01_counter: 0,
    sr02_counter: 0,
    probability: 0,
    from: 0,
    to: 0,
  },
  {
    issueCode: 3,
    type: "hardware",
    duration_of_sr01: 0,
    duration_of_sr02: 0,
    sr01_counter: 0,
    sr02_counter: 0,
    probability: 0,
    from: 0,
    to: 0,
  },
];
let Parallel_opening_obj = {};

let totalServices = [];

function multiserver(result) {
  console.log(result);

  let temp = [];

  result.map((e, index) => {
    if (index != 0) {
      let obj = {};
      obj.id = e["Parallel Servers"];
      obj.arrivalTime = e["__EMPTY"];
      obj.serviceType = e["__EMPTY_1"];
      obj.duration = e["__EMPTY_2"];
      obj.server = e["__EMPTY_3"];

      temp.push(obj);
    }
  });

  Parallel_opening_obj.openingTime = temp[temp.length - 1]["id"];
  Parallel_opening_obj.hour = temp[temp.length - 1]["arrivalTime"];

  console.log(temp);

  let previus_arrTime = Parallel_opening_obj.hour;
  let min_interval = 0;
  let max_interval = 0;
  temp.map((item, index) => {
    let obj = {};
    if (index != temp.length - 1) {
      obj.Allinterval = minutesBetween(
        item.arrivalTime + ":00",
        previus_arrTime + ":00"
      );
      min_interval = Math.min(min_interval, obj.Allinterval);
      max_interval = Math.max(max_interval, obj.Allinterval);
      previus_arrTime = item.arrivalTime;
      Parallel_interval_arrObj.push(obj);
      console.log(Parallel_interval_arrObj);
    }
    for (element of Parallel_server_arrObj) {
      if (item.serviceType == element.type) {
        if (item.server == "Sr01") {
          element.sr01_counter++;
          element.duration_of_sr01 += +item.duration;
        } else {
          element.sr02_counter++;
          element.duration_of_sr02 += +item.duration;
        }
      }
    }
  });

  let acc_service_prob = 0;
  let previos_to_pServiceTime = 0;
  for (let i = min_interval; i <= max_interval; i++) {
    Parallel_interval_arrObj[i].interval_counter = 0;
    Parallel_interval_arrObj[i].this_interval = i;

    Parallel_interval_arrObj.map((element) => {
      if (Parallel_interval_arrObj[i].this_interval == element.Allinterval)
        Parallel_interval_arrObj[i].interval_counter++;
    });

    Parallel_interval_arrObj[i].probability =
      Parallel_interval_arrObj[i].interval_counter / (temp.length - 1);
    Parallel_interval_arrObj[i].acc =
      Parallel_interval_arrObj[i].probability + acc_service_prob;

    Parallel_interval_arrObj[i].acc =
      +Parallel_interval_arrObj[i].acc.toFixed(1);
    acc_service_prob = Parallel_interval_arrObj[i].acc;
    // acc_service_prob = acc_service_prob.toFixed(1);

    Parallel_interval_arrObj[i].from = previos_to_pServiceTime + 1;
    Parallel_interval_arrObj[i].to = Parallel_interval_arrObj[i].acc * 100;
    previos_to_pServiceTime = Parallel_interval_arrObj[i].to;
  }
  console.log(Parallel_interval_arrObj);

  let to_of_previous = 0;
  let accumulative_p = 0;
  Parallel_server_arrObj.map((element) => {
    element.probability =
      (element.sr01_counter + element.sr02_counter) / (temp.length - 1);
    element.acc = element.probability + accumulative_p;
    accumulative_p = element.acc;
    element.from = to_of_previous + 1;
    element.to = element.acc * 100;
    to_of_previous = element.to;
    element.average_ofsr01 = element.duration_of_sr01 / element.sr01_counter;
    element.average_ofsr02 = element.duration_of_sr02 / element.sr02_counter;
    if (isNaN(element.average_ofsr01)) {
      element.average_ofsr01 = element.average_ofsr02;
    }
    if (isNaN(element.average_ofsr02)) {
      element.average_ofsr02 = element.average_ofsr01;
    }
  });
  console.log(Parallel_server_arrObj);

  servers_probabilityTable = `  <table class="table table-striped table-hover table-dark">
  <tr>
  <th colspan="7">Servers Probability</th>
  </tr>
  <tr>
      <th>Service</th>
      <th>Probability</th>
      <th>Cumulative</th>
     <th>From</th>
      <th>To</th>
      <th>Sr01</th>
      <th>Sr02</th>
  </tr>
 
  <tr>
      <td>${Parallel_server_arrObj[0].type}</td>
     <td>${Parallel_server_arrObj[0].probability}</td>
     <td>${Parallel_server_arrObj[0].acc}</td>
     <td>${Parallel_server_arrObj[0].from}</td>
     <td>${Parallel_server_arrObj[0].to}</td>
     <td>${Parallel_server_arrObj[0].average_ofsr01}</td>
     <td>${Parallel_server_arrObj[0].average_ofsr02}</td>
  </tr>

   <tr>
      <td>${Parallel_server_arrObj[1].type}</td>
     <td>${Parallel_server_arrObj[1].probability}</td>
     <td>${Parallel_server_arrObj[1].acc}</td>
     <td>${Parallel_server_arrObj[1].from}</td>
     <td>${Parallel_server_arrObj[1].to}</td>
      <td>${Parallel_server_arrObj[1].average_ofsr01}</td>
     <td>${Parallel_server_arrObj[1].average_ofsr02}</td>
  </tr>

  <tr>
      <td>${Parallel_server_arrObj[2].type}</td>
     <td>${Parallel_server_arrObj[2].probability}</td>
     <td>${Parallel_server_arrObj[2].acc}</td>
     <td>${Parallel_server_arrObj[2].from}</td>
     <td>${Parallel_server_arrObj[2].to}</td>
     <td>${Parallel_server_arrObj[2].average_ofsr01}</td>
     <td>${Parallel_server_arrObj[2].average_ofsr02}</td>
  </tr>

  <tr>
      <td>${Parallel_server_arrObj[3].type}</td>
     <td>${Parallel_server_arrObj[3].probability}</td>
     <td>${Parallel_server_arrObj[3].acc}</td>
     <td>${Parallel_server_arrObj[3].from}</td>
     <td>${Parallel_server_arrObj[3].to}</td>
      <td>${Parallel_server_arrObj[3].average_ofsr01}</td>
     <td>${Parallel_server_arrObj[3].average_ofsr02}</td>
  </tr>
</table>
`;

  serviceTime_probabilityTable = `  <table class="table table-striped table-hover table-dark">
      <tr>
      <th colspan="6">Service Time Probability</th>
      </tr>
    <tr>
        <th>Intervals</th>
        <th>Probability</th>
        <th>Accumulative</th>
        <th>From</th>
        <th>To</th>
    </tr>

  <tr>
        <td>${Parallel_interval_arrObj[0].this_interval}</td>
        <td>${Parallel_interval_arrObj[0].probability}</td>
        <td>${Parallel_interval_arrObj[0].acc}</td>
        <td>${Parallel_interval_arrObj[0].from}</td>
        <td>${Parallel_interval_arrObj[0].to}</td>
    </tr>
     <tr>
        <td>${Parallel_interval_arrObj[1].this_interval}</td>
        <td>${Parallel_interval_arrObj[1].probability}</td>
        <td>${Parallel_interval_arrObj[1].acc}</td>
        <td>${Parallel_interval_arrObj[1].from}</td>
        <td>${Parallel_interval_arrObj[1].to}</td>
    </tr>
    <tr>
        <td>${Parallel_interval_arrObj[2].this_interval}</td>
        <td>${Parallel_interval_arrObj[2].probability}</td>
        <td>${Parallel_interval_arrObj[2].acc}</td>
        <td>${Parallel_interval_arrObj[2].from}</td>
        <td>${Parallel_interval_arrObj[2].to}</td>
    </tr>
    <tr>
        <td>${Parallel_interval_arrObj[3].this_interval}</td>
        <td>${Parallel_interval_arrObj[3].probability}</td>
        <td>${Parallel_interval_arrObj[3].acc}</td>
        <td>${Parallel_interval_arrObj[3].from}</td>
        <td>${Parallel_interval_arrObj[3].to}</td>
    </tr>
    <tr>
        <td>${Parallel_interval_arrObj[4].this_interval}</td>
        <td>${Parallel_interval_arrObj[4].probability}</td>
        <td>${Parallel_interval_arrObj[4].acc}</td>
        <td>${Parallel_interval_arrObj[4].from}</td>
        <td>${Parallel_interval_arrObj[4].to}</td>
    </tr>
    <tr>
        <td>${Parallel_interval_arrObj[5].this_interval}</td>
        <td>${Parallel_interval_arrObj[5].probability}</td>
        <td>${Parallel_interval_arrObj[5].acc}</td>
        <td>${Parallel_interval_arrObj[5].from}</td>
        <td>${Parallel_interval_arrObj[5].to}</td>
    </tr>
  </table>
  `;

  Parallel_openingHourTable = `
<table class="table table-striped table-hover table-dark">
<tr>
<th>${Parallel_opening_obj.openingTime}</th>
<th>${Parallel_opening_obj.hour}</th>
</tr>
</table>
`;

  document.getElementById("viewExcel").addEventListener("click", () => {
    let ModalBody = document.getElementsByClassName("Modal")[0];
    ModalBody.querySelector("#table_1").innerHTML = servers_probabilityTable;
    ModalBody.querySelector("#table_2").innerHTML =
      serviceTime_probabilityTable;
    ModalBody.querySelector("#table_3").innerHTML = Parallel_openingHourTable;
    ModalBody.style.display = "block";
  });

  document.getElementById("close_btn").addEventListener("click", () => {
    document.getElementsByClassName("Modal")[0].style.display = "none";
  });
}

function addMinutesToTime(timeStr, minutes) {
  // Parse the time string (format: "HH:MM")
  const [hours, minutesStr] = timeStr.split(":").map(Number);
  const totalMinutes = hours * 60 + minutesStr + minutes; // Add the total minutes

  // Calculate new hours and minutes
  const newHours = Math.floor(totalMinutes / 60) % 24; // Wrap around if over 24 hours
  const newMinutes = Math.round(totalMinutes % 60); // Get the remaining minutes

  // Format the new time string
  const formattedHours = String(newHours).padStart(2, "0");
  const formattedMinutes = String(newMinutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

function getLowerTime(time1, time2) {
  // Convert time strings to Date objects
  const date1 = new Date(`1970-01-01T${time1}Z`);
  const date2 = new Date(`1970-01-01T${time2}Z`);

  // Compare the two Date objects
  return date1 < date2 ? time1 : time2;
}

function sim_parallel_input() {
  let numberOfCustomers = document.getElementById("CustNumber").value;
  let clock = Parallel_opening_obj.hour + ":00";
  console.log(clock);
  //clock=9:00:00   period=AM
  let new_arrObj = [];
  let prev_ended = clock;
  console.log(numberOfCustomers);
  let sr01_idel = true;
  let end_of_sr01 = "8:00:00";
  let end_of_sr02 = "8:00:00";
  for (let i = 0; i < numberOfCustomers; i++) {
    let obj = {};
    obj.id = i + 1;
    //rand remove it
    obj.intervalRand = Math.floor(Math.random() * 100) + 1;
    obj.InterArrivalTime = lookUp_interval(
      obj.intervalRand,
      Parallel_interval_arrObj,
      "this_interval"
    );
    obj.ArrivalTime = addMinutes(clock, +obj.InterArrivalTime);
    clock = obj.ArrivalTime;
    obj.issueRand = Math.floor(Math.random() * 100) + 1;
    obj.Issue_code = lookUp_issueCode(obj.issueRand, Parallel_server_arrObj);
    obj.IssueType = getIssueName(obj.Issue_code);
    // -==============================================================================
    let first_toFinish = getLowerTime(end_of_sr01, end_of_sr02);
    console.log(first_toFinish, end_of_sr01, end_of_sr02);
    if (end_of_sr01 == first_toFinish) {
      sr01_idel = true;
    } else {
      sr01_idel = false;
    }
    // -==============================================================================
    console.log(sr01_idel);
    if (sr01_idel) {
      obj.serviceStart = getMaxTime(first_toFinish, obj.ArrivalTime);
      obj.serviceTime = lookUp_duration(
        obj.issueRand,
        Parallel_server_arrObj,
        "average_ofsr01"
      );
      obj.serviceEnd =
        addMinutesToTime(obj.serviceStart + ":00", +obj.serviceTime) + ":00";
      console.log(end_of_sr01);
      console.log(obj.ArrivalTime);

      obj.serviceStart_sr02 = "-";
      obj.serviceTime_sr02 = "-";
      obj.serviceEnd_sr02 = "-";

      obj.Cus_State = minutesBetween(
        obj.ArrivalTime + ":00",
        obj.serviceStart + ":00"
      );
      obj.Sys_State = minutesBetween(
        end_of_sr01 + ":00",
        obj.serviceStart + ":00"
      );
      end_of_sr01 = obj.serviceEnd;
      new_arrObj.push(obj);
    }
    //====================================================
    else {
      obj.serviceStart_sr02 = getMaxTime(first_toFinish, obj.ArrivalTime);
      obj.serviceTime_sr02 = lookUp_duration(
        obj.issueRand,
        Parallel_server_arrObj,
        "average_ofsr02"
      );
      obj.serviceEnd_sr02 =
        addMinutesToTime(obj.serviceStart_sr02 + ":00", obj.serviceTime_sr02) +
        ":00";
      console.log(end_of_sr02);

      obj.serviceStart = "-";
      obj.serviceTime = "-";
      obj.serviceEnd = "-";

      obj.Cus_State = minutesBetween(
        obj.ArrivalTime + ":00",
        obj.serviceStart_sr02 + ":00"
      );
      obj.Sys_State = minutesBetween(
        end_of_sr02 + ":00",
        obj.serviceStart_sr02 + ":00"
      );
      end_of_sr02 = obj.serviceEnd_sr02;
      new_arrObj.push(obj);
    }
  }
  console.log(new_arrObj);
  generate_Table(numberOfCustomers, new_arrObj, 2, "task3");

  PrepareData=prepareData(new_arrObj);
}
