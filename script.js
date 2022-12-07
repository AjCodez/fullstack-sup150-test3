let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let mainCont = document.querySelector(".main-cont");
let modalCont = document.querySelector(".modal-cont");
let textareaCont = document.querySelector(".textarea-cont");
let allPriorityColor = document.querySelectorAll(".priority-color");
let toolboxColor = document.querySelectorAll(".color");

let colors = ["red", "blue", "green", "black"];
let modalPriorityColor = colors[colors.length - 1];

let addFlag = false;
let removeFlag = false;


let ticketArr = [];

if (localStorage.getItem("jira_tickets")) {
    ticketArr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    })
}

for (let i = 0; i < toolboxColor.length; i++) {
    toolboxColor[i].addEventListener("click", () => {
        let currentToolboxColor = toolboxColor[i].classList[0];

        let filteredTickets = ticketArr.filter((ticketObj) => {
            return currentToolboxColor === ticketObj.ticketColor;
        })
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }
        filteredTickets.forEach((ticketObj) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })

    })
    toolboxColor[i].addEventListener("dblclick", () => {
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }
        ticketArr.forEach((ticketObj) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })
}
allPriorityColor.forEach((ColorElem) => {
    ColorElem.addEventListener("click", () => {
        allPriorityColor.forEach((priorityColorElem) => {
            priorityColorElem.classList.remove("border");
        })
        ColorElem.classList.add("border");

        modalPriorityColor = ColorElem.classList[0];
    })
})

addBtn.addEventListener("click", () => {
    addFlag = !addFlag;
    if (addFlag) {
        modalCont.style.display = "flex";
    } else {
        modalCont.style.display = "none";
    }
})

removeBtn.addEventListener("click", () => {
    removeFlag = !removeFlag;
    if (removeFlag) {
        removeBtn.classList.add('fffen');
    }
    else {
        removeBtn.classList.remove('fffen');
    }

})

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Enter") {
        createTicket(modalPriorityColor, textareaCont.value);
        addFlag = false;
        setModalToDefault();
    }
})

function createTicket(ticketColor, ticketTask, ticketID) {
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
    <div class = "ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${ticketID}</div>
    <div class="task-area">${ticketTask}</div>
    `;
    mainCont.appendChild(ticketCont);
    if (!ticketID) {

        ticketArr.push({ ticketColor, ticketTask, ticketID: id });
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
    }

    handleRemoval(ticketCont, id);
    handleColor(ticketCont, id);
}

function handleRemoval(ticket, id) {
    ticket.addEventListener("click", () => {
        if (!removeFlag) return;

        let idx = getTicketIdx(id);
        ticketArr.splice(idx, 1);
        let strTicketArr = JSON.stringify(ticketArr);
        localStorage.setItem("jira_tickets", strTicketArr);
        ticket.remove();
    })
}

function handleColor(ticket, id) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", () => {
        let ticketIdx = getTicketIdx(id);

        let currentTicketColor = ticketColor.classList[1];
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color;
        })
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);
        ticketArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
    })
}

function getTicketIdx(id) {
    let ticketIdx = ticketArr.findIndex((ticketObj) => {
        return ticketObj.ticketID == id;
    })
    return ticketIdx;
}

function setModalToDefault() {
    modalCont.style.display = "none";
    textareaCont.value = "";
    allPriorityColor.forEach((priorityColorElem) => {
        priorityColorElem.classList.remove("border");
    })
    allPriorityColor[allPriorityColor.length - 1].classList.add("border");

}