//NOTIFY IF ERROR
window.addEventListener("error", function() {var body = document.querySelector("body"); body.style.background = "black"; body.style.marginTop = "1%"; body.innerHTML = "<div style=\"text-align:center; background: red; color: white; font-size: 3em; line-height: 4em;\">FATAL ERROR</div>";});
