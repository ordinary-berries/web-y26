function getLoadTime() {
    const pageEnd = performance.mark("pageEnd")
    return pageEnd.startTime;
}

function displayLoadStats() {
    const loadStats = document.createElement("div");
    loadStats.innerHTML = "Page load time is " + Math.round(getLoadTime()) + " ms";
    document.querySelector('footer').appendChild(loadStats);
}

function changeButtonStyleOnPage() {
    let button = null
    const location = document.location.pathname.split("/").pop();

    switch (location) {
        case "sign-in.html":
            button = document.getElementById("sign-in-button");
            break;
        case "sign-up.html":
            button = document.getElementById("sign-up-button");
            break;
        default:
            break;
    }

    if (button != null) {
        button.style.backgroundColor =
            window.getComputedStyle(document.getElementById("header")).backgroundColor
    }
}

(() => {
    window.addEventListener("load", () => {
        displayLoadStats();
        changeButtonStyleOnPage();
    });
})();