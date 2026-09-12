const RATE = 8;

const DEFAULT_NAMES = [
    "Shubham",
    "Pankaj",
    "Milan",
    "Vishwesh",
    "Rajiv",
    "Aakash"
];

let people = DEFAULT_NAMES.map(name => ({
    name: name,
    past: "",
    current: ""
}));

let currentGroundData = null;


// =====================================================
// HELPERS
// =====================================================

const $ = id => document.getElementById(id);

const money = number => {
    return "₹" + Number(number || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
};


// =====================================================
// DEFAULT DATE
// =====================================================

const today = new Date();

$("billMonth").value =
    `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}`;

$("billDate").value =
    `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${String(
        today.getDate()
    ).padStart(2, "0")}`;


// =====================================================
// TOAST
// =====================================================

function toast(message) {

    const toastBox = $("toast");

    toastBox.textContent = message;

    toastBox.classList.add("show");

    clearTimeout(window.__toast);

    window.__toast = setTimeout(() => {
        toastBox.classList.remove("show");
    }, 2600);
}


// =====================================================
// TOTAL CALCULATION
// =====================================================

function totals() {

    let totalUnits = 0;
    let totalRoomBill = 0;

    people.forEach(person => {

        const past = Number(person.past);
        const current = Number(person.current);

        const valid =
            person.past !== "" &&
            person.current !== "" &&
            Number.isFinite(past) &&
            Number.isFinite(current) &&
            current >= past;

        if (valid) {

            const units = current - past;

            totalUnits += units;

            totalRoomBill += units * RATE;
        }
    });

    return {
        units: totalUnits,
        room: totalRoomBill
    };
}


// =====================================================
// RENDER METER READING TABLE
// =====================================================

function renderReadings() {

    const body = $("readingBody");

    body.innerHTML = "";


    people.forEach((person, index) => {

        const past = Number(person.past);
        const current = Number(person.current);

        const valid =
            person.past !== "" &&
            person.current !== "" &&
            Number.isFinite(past) &&
            Number.isFinite(current) &&
            current >= past;


        const units =
            valid
                ? current - past
                : 0;


        const roomBill =
            units * RATE;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>


            <td>

                <input
                    class="name-input"
                    value="${escapeAttr(person.name)}"
                    data-index="${index}"
                    data-field="name"
                >

            </td>


            <td>

                <input
                    type="number"
                    min="0"
                    value="${escapeAttr(person.past)}"
                    data-index="${index}"
                    data-field="past"
                >

            </td>


            <td>

                <input
                    type="number"
                    min="0"
                    value="${escapeAttr(person.current)}"
                    data-index="${index}"
                    data-field="current"
                >

            </td>


            <td class="readonly-cell units-cell">

                ${valid ? units : "—"}

            </td>


            <td class="readonly-cell">

                <span class="room-cell">
                    ${money(roomBill)}
                </span>

            </td>


            <td>

                <button
                    class="delete-btn"
                    data-delete="${index}"
                    title="Remove person"
                >
                    🗑️
                </button>

            </td>

        `;


        body.appendChild(row);

    });


    // =================================================
    // INPUT EVENTS
    // =================================================

    body.querySelectorAll("input")
        .forEach(input => {

            input.addEventListener(
                "input",
                event => {

                    const index =
                        Number(
                            event.target.dataset.index
                        );

                    const field =
                        event.target.dataset.field;


                    people[index][field] =
                        event.target.value;


                    renderReadings();

                }
            );

        });


    // =================================================
    // DELETE EVENTS
    // =================================================

    body.querySelectorAll("[data-delete]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    if (people.length <= 1) {

                        toast(
                            "At least one person is required."
                        );

                        return;
                    }


                    const index =
                        Number(
                            button.dataset.delete
                        );


                    people.splice(index, 1);


                    currentGroundData = null;


                    renderReadings();

                    renderGround();

                }
            );

        });


    // =================================================
    // TOTALS
    // =================================================

    const result = totals();


    $("totalUnits").textContent =
        result.units;


    $("totalRoomBill").textContent =
        money(result.room);


    $("totalUnitsCard").textContent =
        result.units;


    $("totalRoomBillCard").textContent =
        money(result.room);

}


// =====================================================
// ESCAPE ATTRIBUTE
// =====================================================

function escapeAttr(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


// =====================================================
// VALIDATE READINGS
// =====================================================

function validReadings() {

    for (
        let index = 0;
        index < people.length;
        index++
    ) {

        const person = people[index];


        if (!person.name.trim()) {

            return "Enter a name for every person.";

        }


        if (
            person.past === "" ||
            person.current === ""
        ) {

            return `Enter both readings for ${person.name}.`;

        }


        if (
            Number(person.current) <
            Number(person.past)
        ) {

            return `
                Current reading cannot be less than
                past reading for ${person.name}.
            `;

        }

    }


    return null;
}


// =====================================================
// SLIDES
// =====================================================

function showSlide(number) {

    document
        .querySelectorAll(".slide")
        .forEach((slide, index) => {

            slide.classList.toggle(
                "active",
                index === number - 1
            );

        });


    document
        .querySelectorAll(".step")
        .forEach((step, index) => {

            step.classList.toggle(
                "active",
                index === number - 1
            );

        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (number === 2) {

        renderGround();

    }

}


// =====================================================
// ADD PERSON
// =====================================================

$("addPersonBtn").onclick = () => {

    people.push({
        name: "",
        past: "",
        current: ""
    });


    renderReadings();

};


// =====================================================
// NEXT BUTTON
// =====================================================

$("nextBtn").onclick = () => {

    const error = validReadings();


    if (error) {

        toast(error);

        return;

    }


    renderGround();

    showSlide(2);

};


// =====================================================
// BACK BUTTON
// =====================================================

$("backBtn").onclick = () => {

    showSlide(1);

};


// =====================================================
// STEP BUTTONS
// =====================================================

document
    .querySelectorAll(".step")
    .forEach(step => {

        step.onclick = () => {

            const number =
                Number(step.dataset.step);


            if (number === 2) {

                const error =
                    validReadings();


                if (error) {

                    toast(error);

                    return;

                }

            }


            showSlide(number);

        };

    });


// =====================================================
// OVERALL BILL
// =====================================================

function getOverall() {

    return Number(
        $("overallBill").value
    ) || 0;

}


// =====================================================
// BUILD GROUND TABLE
// =====================================================

function buildGroundRows() {

    const body =
        $("groundBody");


    body.innerHTML = "";


    const share =
        Number(
            $("sharePerPerson").dataset.value
        ) || 0;


    people.forEach((person, index) => {

        const units =
            Number(person.current) -
            Number(person.past);


        const roomBill =
            units * RATE;


        const multiplier =
            currentGroundData
                ?.multipliers
                ?. [index] ?? 1;


        const groundAmount =
            share * multiplier;


        const finalBill =
            roomBill + groundAmount;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${index + 1}
            </td>


            <td>
                <b>
                    ${escapeHTML(person.name)}
                </b>
            </td>


            <td>
                ${money(roomBill)}
            </td>


            <td>

                <input
                    class="multiplier-input"
                    type="number"
                    min="0"
                    step="1"
                    value="${multiplier}"
                    data-multiplier="${index}"
                    title="Ground bill multiplier"
                >

            </td>


            <td class="ground-amount">

                ${money(groundAmount)}

            </td>


            <td>

                <strong>
                    ${money(finalBill)}
                </strong>

            </td>

        `;


        body.appendChild(row);

    });


    // =================================================
    // MULTIPLIER INPUT
    // =================================================

    body
        .querySelectorAll("[data-multiplier]")
        .forEach(input => {

            input.addEventListener(
                "input",
                event => {

                    const index =
                        Number(
                            event.target.dataset.multiplier
                        );


                    let value =
                        Math.max(
                            0,
                            Math.floor(
                                Number(
                                    event.target.value
                                ) || 0
                            )
                        );


                    if (!currentGroundData) {

                        currentGroundData = {
                            multipliers: []
                        };

                    }


                    currentGroundData
                        .multipliers[index] =
                        value;


                    renderGround(false);

                }
            );

        });

}


// =====================================================
// GROUND CALCULATION
// =====================================================

function renderGround(reset = false) {

    const result = totals();


    $("groundRoomBill").textContent =
        money(result.room);


    $("groundRoomTotal2").textContent =
        money(result.room);


    const overall =
        getOverall();


    const ground =
        overall - result.room;


    $("groundBillDisplay").textContent =
        money(ground);


    // =================================================
    // DEFAULT MULTIPLIERS
    // =================================================

    if (
        reset ||
        !currentGroundData ||
        currentGroundData.multipliers.length !==
        people.length
    ) {

        currentGroundData = {

            multipliers:
                people.map(() => 1)

        };

    }


    // =================================================
    // DIVIDE BY
    // =================================================

    let divideBy =
        Math.max(
            1,
            Math.floor(
                Number(
                    $("divideBy").value
                ) || 1
            )
        );


    // =================================================
    // SHARE PER PERSON
    // =================================================

    const share =
        ground / divideBy;


    $("sharePerPerson").textContent =
        money(share);


    $("sharePerPerson")
        .dataset.value =
        share;


    $("shareFormula").textContent =
        `${money(ground)} ÷ ${divideBy}`;


    // =================================================
    // GROUND ROWS
    // =================================================

    buildGroundRows();


    // =================================================
    // TOTAL MULTIPLIERS
    // =================================================

    const multiplierTotal =
        currentGroundData
            .multipliers
            .reduce(
                (total, value) =>
                    total + (Number(value) || 0),
                0
            );


    const groundTotal =
        share * multiplierTotal;


    const finalTotal =
        result.room + groundTotal;


    $("multiplierTotal").textContent =
        multiplierTotal;


    $("groundTotal2").textContent =
        money(groundTotal);


    $("finalTotal").textContent =
        money(finalTotal);


    $("finalOverall").textContent =
        money(overall);


    $("finalRoom").textContent =
        money(result.room);


    $("finalGround").textContent =
        money(groundTotal);


    $("finalTotalBig").textContent =
        money(finalTotal);


    // =================================================
    // WARNING IF MULTIPLIERS DON'T MATCH DIVIDE BY
    // =================================================

    const mismatch =
        Math.abs(
            multiplierTotal - divideBy
        ) > 0.0001;


    $("multiplierTotal").style.color =
        mismatch
            ? "#e11d48"
            : "";


    $("multiplierTotal").title =
        mismatch
            ? `
                Multipliers total ${multiplierTotal},
                but Divide By is ${divideBy}.
                Adjust the multipliers if you want
                the final total to equal the overall bill.
              `
            : "";

}


// =====================================================
// GROUND INPUT EVENTS
// =====================================================

$("overallBill")
    .addEventListener(
        "input",
        () => renderGround()
    );


$("divideBy")
    .addEventListener(
        "input",
        () => renderGround()
    );


// =====================================================
// ADD GROUND PERSON
// =====================================================

$("addGroundPersonBtn").onclick = () => {

    people.push({
        name: "",
        past: "",
        current: ""
    });


    currentGroundData = null;


    renderReadings();


    toast(
        "New person added. Enter their meter readings."
    );


    renderGround();

};


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// BILL DATA
// =====================================================

function billData() {

    const result =
        totals();


    const overall =
        getOverall();


    const ground =
        overall - result.room;


    const divideBy =
        Math.max(
            1,
            Math.floor(
                Number(
                    $("divideBy").value
                ) || 1
            )
        );


    const share =
        ground / divideBy;


    const multipliers =
        currentGroundData
            ?.multipliers
            ?.slice() ||
        people.map(() => 1);


    const rows =
        people.map(
            (person, index) => {

                const units =
                    Number(person.current) -
                    Number(person.past);


                const roomBill =
                    units * RATE;


                const multiplier =
                    Number(
                        multipliers[index]
                    ) || 0;


                const groundAmount =
                    share * multiplier;


                const finalBill =
                    roomBill +
                    groundAmount;


                return {

                    name: person.name,

                    past:
                        Number(person.past),

                    current:
                        Number(person.current),

                    units,

                    roomBill,

                    multiplier,

                    groundAmount,

                    finalBill

                };

            }
        );


    const multiplierTotal =
        multipliers.reduce(
            (total, value) =>
                total + (Number(value) || 0),
            0
        );


    const finalTotal =
        rows.reduce(
            (total, row) =>
                total + row.finalBill,
            0
        );


    return {

        month:
            $("billMonth").value,

        date:
            $("billDate").value,

        rate:
            RATE,

        overallBill:
            overall,

        totalUnits:
            result.units,

        totalRoomBill:
            result.room,

        groundBill:
            ground,

        divideBy,

        sharePerPerson:
            share,

        multiplierTotal,

        finalTotal,

        rows

    };

}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(value) {

    if (!value) {
        return "";
    }


    const [
        year,
        month,
        day
    ] = value.split("-");


    return `${day}-${month}-${year}`;

}


// =====================================================
// MONTH NAME
// =====================================================

function monthName(value) {

    if (!value) {
        return "";
    }


    const [
        year,
        month
    ] = value.split("-");


    return new Date(
        Number(year),
        Number(month) - 1,
        1
    ).toLocaleString(
        "en-IN",
        {
            month: "long",
            year: "numeric"
        }
    );

}


// =====================================================
// CREATE DOWNLOAD BILL
// =====================================================

function createBillElement(data) {

    const element =
        document.createElement("div");


    element.className =
        "print-bill";


    element.style.cssText = `
        width:794px;
        background:#fff;
        color:#111827;
        padding:38px;
        font-family:Arial,sans-serif;
        position:absolute;
        left:-10000px;
        top:0;
    `;


    element.innerHTML = `

        <div
            style="
                border-bottom:3px solid #4f46e5;
                padding-bottom:16px;
                display:flex;
                justify-content:space-between;
                align-items:end;
            "
        >

            <div>

                <h1
                    style="
                        margin:0;
                        color:#312e81;
                        font-size:28px;
                    "
                >
                    ⚡ Electricity Bill
                </h1>

                <p
                    style="
                        margin:5px 0 0;
                        color:#64748b;
                    "
                >
                    Individual bill statement
                </p>

            </div>


            <div
                style="
                    text-align:right;
                    font-size:13px;
                "
            >

                <b>
                    ${monthName(data.month)}
                </b>

                <br>

                ${formatDate(data.date)}

            </div>

        </div>


        <div
            style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:12px;
                margin:20px 0;
            "
        >

            <div
                style="
                    background:#eef2ff;
                    padding:14px;
                    border-radius:10px;
                "
            >

                <b>
                    Total Electricity Bill
                </b>

                <div
                    style="
                        font-size:22px;
                        margin-top:6px;
                    "
                >
                    ${money(data.overallBill)}
                </div>

            </div>


            <div
                style="
                    background:#ecfdf5;
                    padding:14px;
                    border-radius:10px;
                "
            >

                <b>
                    Ground Bill
                </b>

                <div
                    style="
                        font-size:22px;
                        margin-top:6px;
                    "
                >
                    ${money(data.groundBill)}
                </div>

            </div>

        </div>


        <table
            style="
                width:100%;
                border-collapse:collapse;
                font-size:12px;
            "
        >

            <thead>

                <tr
                    style="
                        background:#eef2ff;
                    "
                >

                    <th style="padding:10px;border:1px solid #dbe3f0">
                        Name
                    </th>

                    <th style="padding:10px;border:1px solid #dbe3f0">
                        Reading
                    </th>

                    <th style="padding:10px;border:1px solid #dbe3f0">
                        Units
                    </th>

                    <th style="padding:10px;border:1px solid #dbe3f0">
                        Room Bill
                    </th>

                    <th style="padding:10px;border:1px solid #dbe3f0">
                        Ground ×
                    </th>

                    <th style="padding:10px;border:1px solid #dbe3f0">
                        Ground
                    </th>

                    <th style="padding:10px;border:1px solid #dbe3f0">
                        Final
                    </th>

                </tr>

            </thead>


            <tbody>

                ${data.rows.map(row => `

                    <tr>

                        <td style="padding:9px;border:1px solid #dbe3f0">
                            ${escapeHTML(row.name)}
                        </td>

                        <td style="padding:9px;border:1px solid #dbe3f0">
                            ${row.past} → ${row.current}
                        </td>

                        <td style="padding:9px;border:1px solid #dbe3f0;text-align:center">
                            ${row.units}
                        </td>

                        <td style="padding:9px;border:1px solid #dbe3f0;text-align:right">
                            ${money(row.roomBill)}
                        </td>

                        <td style="padding:9px;border:1px solid #dbe3f0;text-align:center">
                            ×${row.multiplier}
                        </td>

                        <td style="padding:9px;border:1px solid #dbe3f0;text-align:right">
                            ${money(row.groundAmount)}
                        </td>

                        <td style="padding:9px;border:1px solid #dbe3f0;text-align:right;font-weight:bold">
                            ${money(row.finalBill)}
                        </td>

                    </tr>

                `).join("")}

            </tbody>


            <tfoot>

                <tr
                    style="
                        font-weight:bold;
                    "
                >

                    <td
                        colspan="2"
                        style="
                            padding:10px;
                            border:1px solid #dbe3f0;
                        "
                    >
                        TOTAL
                    </td>

                    <td
                        style="
                            padding:10px;
                            border:1px solid #dbe3f0;
                        "
                    >
                        ${data.totalUnits}
                    </td>

                    <td
                        style="
                            padding:10px;
                            border:1px solid #dbe3f0;
                        "
                    >
                        ${money(data.totalRoomBill)}
                    </td>

                    <td
                        style="
                            padding:10px;
                            border:1px solid #dbe3f0;
                        "
                    >
                        ${data.multiplierTotal}
                    </td>

                    <td
                        style="
                            padding:10px;
                            border:1px solid #dbe3f0;
                        "
                    >
                        ${money(data.groundBill)}
                    </td>

                    <td
                        style="
                            padding:10px;
                            border:1px solid #dbe3f0;
                        "
                    >
                        ${money(data.finalTotal)}
                    </td>

                </tr>

            </tfoot>

        </table>


        <div
            style="
                margin-top:18px;
                padding:14px;
                background:#f8fafc;
                border-radius:10px;
                font-size:13px;
            "
        >

            <b>
                Ground calculation:
            </b>

            ${money(data.groundBill)}
            ÷
            ${data.divideBy}

            =

            <b>
                ${money(data.sharePerPerson)}
            </b>

            per share

        </div>


        <div
            style="
                margin-top:28px;
                border-top:1px solid #e2e8f0;
                padding-top:12px;
                font-size:11px;
                color:#64748b;
                display:flex;
                justify-content:space-between;
            "
        >

            <span>
                Rate: ₹${data.rate} per unit
            </span>

            <span>
                Made by Shubham Srivastava
            </span>

        </div>

    `;


    document.body.appendChild(element);


    return element;

}


// =====================================================
// DOWNLOAD IMAGE
// =====================================================

async function downloadImage() {

    const data =
        billData();


    if (data.overallBill <= 0) {

        toast(
            "Enter the overall electricity bill first."
        );

        return;

    }


    const element =
        createBillElement(data);


    try {

        const canvas =
            await html2canvas(
                element,
                {
                    scale: 2,
                    backgroundColor: "#fff"
                }
            );


        const link =
            document.createElement("a");


        link.download =
            `electricity-bill-${data.month || "bill"}.png`;


        link.href =
            canvas.toDataURL("image/png");


        link.click();


        toast(
            "Bill image downloaded."
        );

    }

    catch (error) {

        console.error(error);

        toast(
            "Image download failed."
        );

    }

    finally {

        element.remove();

    }

}


// =====================================================
// DOWNLOAD PDF
// =====================================================

async function downloadPDF() {

    const data =
        billData();


    if (data.overallBill <= 0) {

        toast(
            "Enter the overall electricity bill first."
        );

        return;

    }


    const element =
        createBillElement(data);


    try {

        const canvas =
            await html2canvas(
                element,
                {
                    scale: 2,
                    backgroundColor: "#fff"
                }
            );


        const {
            jsPDF
        } = window.jspdf;


        const pdf =
            new jsPDF(
                "p",
                "mm",
                "a4"
            );


        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;

        const imageWidth =
            pageWidth - margin * 2;

        const imageHeight =
            canvas.height *
            imageWidth /
            canvas.width;


        let sourceY = 0;

        let remainingHeight =
            imageHeight;


        while (remainingHeight > 0) {

            const sliceHeight =
                Math.min(
                    remainingHeight,
                    pageHeight - margin * 2
                );


            const sourceHeight =
                Math.round(
                    sliceHeight *
                    canvas.width /
                    imageWidth
                );


            const slice =
                document.createElement(
                    "canvas"
                );


            slice.width =
                canvas.width;


            slice.height =
                sourceHeight;


            const context =
                slice.getContext("2d");


            context.drawImage(
                canvas,
                0,
                sourceY,
                canvas.width,
                sourceHeight,
                0,
                0,
                slice.width,
                slice.height
            );


            pdf.addImage(
                slice.toDataURL("image/png"),
                "PNG",
                margin,
                margin,
                imageWidth,
                sliceHeight
            );


            remainingHeight -=
                sliceHeight;


            sourceY +=
                sourceHeight;


            if (remainingHeight > 0) {

                pdf.addPage();

            }

        }


        pdf.save(
            `electricity-bill-${data.month || "bill"}.pdf`
        );


        toast(
            "Bill PDF downloaded."
        );

    }

    catch (error) {

        console.error(error);

        toast(
            "PDF download failed."
        );

    }

    finally {

        element.remove();

    }

}


// =====================================================
// DOWNLOAD EVENTS
// =====================================================

$("downloadImage")
    .onclick =
    downloadImage;


$("downloadPdf")
    .onclick =
    downloadPDF;


// =====================================================
// HISTORY
// =====================================================

const HISTORY_KEY =
    "electricityBillSplitterHistoryV2";


function getHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(
                HISTORY_KEY
            ) || "[]"
        );

    }

    catch {

        return [];

    }

}


// =====================================================
// SAVE BILL
// =====================================================

function saveBill() {

    const data =
        billData();


    if (data.overallBill <= 0) {

        toast(
            "Enter the overall electricity bill first."
        );

        return;

    }


    const history =
        getHistory();


    history.unshift({

        ...data,

        id: Date.now()

    });


    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(
            history.slice(0, 100)
        )
    );


    toast(
        "Bill saved to history."
    );


    renderHistory();

}


$("saveHistory")
    .onclick =
    saveBill;


// =====================================================
// RENDER HISTORY
// =====================================================

function renderHistory() {

    const box =
        $("historyContent");


    const history =
        getHistory();


    if (!history.length) {

        box.innerHTML = `

            <div class="empty-history">

                📭

                <br>
                <br>

                No saved bills yet.

            </div>

        `;

        return;

    }


    box.innerHTML = `

        <div
            style="
                text-align:right;
                margin-bottom:10px;
            "
        >

            <button
                class="clear-history"
                id="clearHistory"
            >
                Clear All History
            </button>

        </div>


        ${history.map(record => `

            <div class="history-item">

                <div>

                    <h3>

                        ${
                            monthName(record.month)
                            || "Bill"
                        }

                        •

                        ${
                            formatDate(
                                record.date
                            )
                        }

                    </h3>


                    <p>

                        Overall:
                        <b>
                            ${money(record.overallBill)}
                        </b>

                        •

                        Room:
                        ${money(record.totalRoomBill)}

                        •

                        Ground:
                        ${money(record.groundBill)}

                        •

                        Final:
                        <b>
                            ${money(record.finalTotal)}
                        </b>

                    </p>

                </div>


                <div class="history-actions">

                    <button
                        class="view-h"
                        data-view="${record.id}"
                    >
                        View
                    </button>


                    <button
                        class="delete-h"
                        data-delete-history="${record.id}"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `).join("")}

    `;


    // =================================================
    // CLEAR HISTORY
    // =================================================

    const clearButton =
        box.querySelector(
            "#clearHistory"
        );


    clearButton.onclick = () => {

        if (
            confirm(
                "Clear all saved bills?"
            )
        ) {

            localStorage.removeItem(
                HISTORY_KEY
            );


            renderHistory();


            toast(
                "History cleared."
            );

        }

    };


    // =================================================
    // DELETE INDIVIDUAL HISTORY
    // =================================================

    box
        .querySelectorAll(
            "[data-delete-history]"
        )
        .forEach(button => {

            button.onclick = () => {

                const id =
                    Number(
                        button.dataset
                            .deleteHistory
                    );


                const updated =
                    getHistory()
                        .filter(
                            record =>
                                record.id !== id
                        );


                localStorage.setItem(
                    HISTORY_KEY,
                    JSON.stringify(updated)
                );


                renderHistory();


                toast(
                    "Bill deleted."
                );

            };

        });


    // =================================================
    // VIEW HISTORY
    // =================================================

    box
        .querySelectorAll(
            "[data-view]"
        )
        .forEach(button => {

            button.onclick = () => {

                showHistoryBill(
                    Number(
                        button.dataset.view
                    )
                );

            };

        });

}


// =====================================================
// SHOW HISTORY BILL
// =====================================================

function showHistoryBill(id) {

    const record =
        getHistory()
            .find(
                item =>
                    item.id === id
            );


    if (!record) {
        return;
    }


    const element =
        createBillElement(record);


    element.style.position =
        "relative";


    element.style.left =
        "auto";


    element.style.top =
        "auto";


    element.style.width =
        "100%";


    element.style.maxWidth =
        "794px";


    element.style.margin =
        "20px auto";


    element
        .querySelectorAll("table")
        .forEach(table => {

            table.style.fontSize =
                "11px";

        });


    $("historyContent")
        .innerHTML = "";


    $("historyContent")
        .appendChild(element);


    const backButton =
        document.createElement(
            "button"
        );


    backButton.textContent =
        "← Back to History";


    backButton.className =
        "clear-history";


    backButton.style.marginBottom =
        "10px";


    backButton.onclick =
        renderHistory;


    $("historyContent")
        .prepend(backButton);

}


// =====================================================
// HISTORY OPEN/CLOSE
// =====================================================

$("historyBtn").onclick = () => {

    $("historyPanel")
        .classList.add("open");


    renderHistory();

};


$("closeHistory").onclick = () => {

    $("historyPanel")
        .classList.remove("open");

};


// =====================================================
// DARK MODE
// =====================================================

$("themeBtn").onclick = () => {

    document.body.classList.toggle(
        "dark"
    );


    $("themeBtn").textContent =
        document.body.classList.contains("dark")
            ? "🌙"
            : "☀️";


    localStorage.setItem(
        "billTheme",
        document.body.classList.contains("dark")
            ? "dark"
            : "light"
    );

};


if (
    localStorage.getItem(
        "billTheme"
    ) === "dark"
) {

    document.body.classList.add(
        "dark"
    );


    $("themeBtn").textContent =
        "🌙";

}


// =====================================================
// INITIAL LOAD
// =====================================================

renderReadings();

renderGround(true);
