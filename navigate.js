document.getElementsByClassName("int_inputs")[0].addEventListener("focus",()=>{
  navigate(document.getElementsByClassName("int_inputs")[0],0)
})

function navigate(toFocus, i) {
  let int_inputs = document.getElementsByClassName("int_inputs");
  let code_inputs = document.getElementsByClassName("code_inputs");
  toFocus.focus();
  let temp_inputCheck;
  for (const element of toFocus.classList) {
    if (int_inputs[0].classList.contains(element)) temp_inputCheck = int_inputs;
    else temp_inputCheck = code_inputs;
  }
  toFocus.addEventListener("keydown", (event) => {
    if (event.key == "ArrowRight") goRight(toFocus, code_inputs, i);
    else if (event.key == "ArrowDown") goDown(temp_inputCheck, i);
    else if (event.key == "ArrowUp") goUp(temp_inputCheck, i);
    else if (event.key == "ArrowLeft") goLeft(toFocus, int_inputs, i);
  });
}

function goRight(target, code_inputs, i) {
  navigate(code_inputs[i], i);
}

function goLeft(target, int_inputs, i) {
  navigate(int_inputs[i], i);
}

function goDown(target, i) {
  navigate(target[i + 1], i + 1);
}

function goUp(target, i) {
  navigate(target[i - 1], i - 1);
}
