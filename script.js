// =====================================================
// ELECTRICITY BILL CALCULATOR
// Made by Shubham Srivastava | 2026
// =====================================================


let consumers = [];

let groundBill = 0;

let groundShare = 0;


// =====================================================
// ADD CONSUMER
// =====================================================

document
    .getElementById("addConsumer")
    .addEventListener("click", () => {


        const row =
            document.createElement("div");


        row.className =
            "consumer-row";


        row.innerHTML = `

            <input
                type="text"
                class="consumer-name"
                placeholder="Enter name"
            >

            <input
                type="number"
                class="past-reading"
                placeholder="Past reading"
                min="0"
            >

            <input
                type="number"
                class="current-reading"
                placeholder="Current reading"
                min="0"
            >

            <button
                type="button"
                class="remove-btn"
                onclick="removeConsumer(this)"
                title="Remove consumer"
            >
                ×
            </button>

        `;


        document
            .getElementById("consumerContainer")
            .appendChild(row);

    });


// =====================================================
// REMOVE CONSUMER
// =====================================================

function removeConsumer(button) {


    const rows =
        document.querySelectorAll(
            ".consumer-row"
        );


    if (rows.length > 1) {

        button.parentElement.remove();

    }

}


// =====================================================
// MAIN CALCULATION
// =====================================================

document
    .getElementById("calculateBtn")
    .addEventListener("click", () => {


        const overallBill =
            Number(
                document.getElementById(
                    "overallBill"
                ).value
            );


        const billMonth =
            document.getElementById(
                "billMonth"
            ).value;


        const billDate =
            document.getElementById(
                "billDate"
            ).value;


        // VALIDATION

        if (!billMonth) {

            alert(
                "Please select the bill month."
            );

            return;
        }


        if (!billDate) {

            alert(
                "Please select the bill date."
            );

            return;
        }


        if (
            !Number.isFinite(overallBill) ||
            overallBill <= 0
        ) {

            alert(
                "Please enter the overall electricity bill."
            );

            return;
        }


        const rows =
            document.querySelectorAll(
                ".consumer-row"
            );


        consumers = [];


        let totalUnits = 0;

        let totalRoomBill = 0;


        // READ CONSUMERS

        for (const row of rows) {


            const name =
                row
                    .querySelector(
                        ".consumer-name"
                    )
                    .value
                    .trim();


            const past =
                Number(
                    row
                        .querySelector(
                            ".past-reading"
                        )
                        .value
                );


            const current =
                Number(
                    row
                        .querySelector(
                            ".current-reading"
                        )
                        .value
                );


            if (!name) {

                continue;

            }


            if (
                !Number.isFinite(past) ||
                !Number.isFinite(current)
            ) {

                alert(
                    `Please enter both readings for ${name}.`
                );

                return;
            }


            if (current < past) {

                alert(
                    `${name}: Current reading cannot be less than past reading.`
                );

                return;
            }


            // UNITS

            const units =
                current - past;


            // ROOM BILL
            // Units × ₹8

            const roomBill =
                units * 8;


            consumers.push({

                name: name,

                past: past,

                current: current,

                units: units,

                roomBill: roomBill

            });


            totalUnits += units;

            totalRoomBill += roomBill;

        }


        if (consumers.length === 0) {

            alert(
                "Please add at least one consumer."
            );

            return;
        }


        // =================================================
        // GROUND BILL
        // =================================================

        groundBill =
            overallBill - totalRoomBill;


        if (groundBill < 0) {

            alert(
                "Total Room Bill is greater than Overall Electricity Bill."
            );

            return;
        }


        // =================================================
        // INDIVIDUAL CALCULATIONS
        // =================================================

        const individualContainer =
            document.getElementById(
                "individualCalculations"
            );


        individualContainer.innerHTML = "";


        consumers.forEach(person => {


            const box =
                document.createElement(
                    "div"
                );


            box.className =
                "individual-box";


            box.innerHTML = `

                <h3>
                    👤 ${escapeHTML(person.name)}
                </h3>

                <p>
                    Current Reading − Past Reading:
                    <strong>
                        ${person.current}
                        −
                        ${person.past}
                    </strong>
                </p>

                <p>
                    Units:
                    <strong>
                        ${person.current}
                        −
                        ${person.past}
                        =
                        ${person.units}
                        Units
                    </strong>
                </p>

                <p>
                    Electricity Calculation:
                    <strong>
                        ${person.units}
                        × ₹8
                        =
                        ${formatMoney(person.roomBill)}
                    </strong>
                </p>

                <p>
                    <strong>
                        Room Bill =
                        ${formatMoney(person.roomBill)}
                    </strong>
                </p>

            `;


            individualContainer
                .appendChild(box);

        });


        // =================================================
        // ROOM TABLE
        // =================================================

        const roomTable =
            document.getElementById(
                "roomTableBody"
            );


        roomTable.innerHTML = "";


        consumers.forEach(person => {


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(person.name)}
                </td>

                <td>
                    ${person.past}
                </td>

                <td>
                    ${person.current}
                </td>

                <td>
                    ${person.units}
                </td>

                <td>
                    ${person.units}
                    × ₹8
                    =
                    ${formatMoney(person.roomBill)}
                </td>

                <td>
                    ${formatMoney(person.roomBill)}
                </td>

            `;


            roomTable.appendChild(row);

        });


        // TOTALS

        document.getElementById(
            "totalUnits"
        ).textContent =
            totalUnits;


        document.getElementById(
            "totalRoomBill"
        ).textContent =
            formatMoney(totalRoomBill);


        // OVERALL

        document.getElementById(
            "overallDisplay"
        ).textContent =
            formatMoney(overallBill);


        document.getElementById(
            "roomDisplay"
        ).textContent =
            formatMoney(totalRoomBill);


        document.getElementById(
            "groundBill"
        ).textContent =
            formatMoney(groundBill);


        // FINAL DATE

        document.getElementById(
            "finalBillInfo"
        ).textContent =
            `${formatMonth(billMonth)} • ${formatDate(billDate)}`;


        // SHOW RESULT

        document.getElementById(
            "result"
        ).style.display =
            "block";


        // RESET OLD GROUND RESULT

        document.getElementById(
            "groundResult"
        ).style.display =
            "none";


        document.getElementById(
            "finalSection"
        ).style.display =
            "none";


        // SCROLL TO RESULT

        document.getElementById(
            "result"
        ).scrollIntoView({
            behavior: "smooth"
        });

    });


// =====================================================
// GROUND BILL CALCULATION
// =====================================================

document
    .getElementById(
        "groundCalculateBtn"
    )
    .addEventListener(
        "click",
        () => {


            const persons =
                Number(
                    document.getElementById(
                        "groundPersons"
                    ).value
                );


            if (
                !Number.isInteger(persons) ||
                persons <= 0
            ) {

                alert(
                    "Please enter a valid number of persons."
                );

                return;
            }


            if (consumers.length === 0) {

                alert(
                    "Please calculate the main bill first."
                );

                return;
            }


            // GROUND SHARE

            groundShare =
                groundBill / persons;


            // DISPLAY GROUND RESULT

            document.getElementById(
                "groundAmountDisplay"
            ).textContent =
                formatMoney(groundBill);


            document.getElementById(
                "groundPersonsDisplay"
            ).textContent =
                persons;


            document.getElementById(
                "groundShare"
            ).textContent =
                formatMoney(groundShare);


            document.getElementById(
                "groundResult"
            ).style.display =
                "grid";


            // =================================================
            // FINAL BILL
            // =================================================

            const finalBody =
                document.getElementById(
                    "finalTableBody"
                );


            finalBody.innerHTML = "";


            let finalRoomTotal = 0;

            let finalGroundTotal = 0;

            let finalTotal = 0;

            let finalUnits = 0;


            consumers.forEach(person => {


                const finalBill =
                    person.roomBill +
                    groundShare;


                finalRoomTotal +=
                    person.roomBill;


                finalGroundTotal +=
                    groundShare;


                finalTotal +=
                    finalBill;


                finalUnits +=
                    person.units;


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${escapeHTML(person.name)}
                    </td>

                    <td>
                        ${person.units}
                    </td>

                    <td>
                        ${formatMoney(
                            person.roomBill
                        )}
                    </td>

                    <td>
                        ${formatMoney(
                            groundShare
                        )}
                    </td>

                    <td>
                        <strong>
                            ${formatMoney(
                                finalBill
                            )}
                        </strong>
                    </td>

                `;


                finalBody.appendChild(row);

            });


            // TOTALS

            document.getElementById(
                "finalUnitsTotal"
            ).textContent =
                finalUnits;


            document.getElementById(
                "finalRoomTotal"
            ).textContent =
                formatMoney(
                    finalRoomTotal
                );


            document.getElementById(
                "finalGroundTotal"
            ).textContent =
                formatMoney(
                    finalGroundTotal
                );


            document.getElementById(
                "finalTotal"
            ).textContent =
                formatMoney(
                    finalTotal
                );


            // SHOW FINAL

            document.getElementById(
                "finalSection"
            ).style.display =
                "block";


            document.getElementById(
                "finalSection"
            ).scrollIntoView({
                behavior: "smooth"
            });

        }
    );


// =====================================================
// SAVE BILL TO HISTORY
// =====================================================

document
    .getElementById(
        "saveHistoryBtn"
    )
    .addEventListener(
        "click",
        () => {


            if (consumers.length === 0) {

                alert(
                    "Please calculate the bill first."
                );

                return;
            }


            if (groundShare <= 0) {

                alert(
                    "Please calculate the Ground Share first."
                );

                return;
            }


            const month =
                document.getElementById(
                    "billMonth"
                ).value;


            const billDate =
                document.getElementById(
                    "billDate"
                ).value;


            const overallBill =
                Number(
                    document.getElementById(
                        "overallBill"
                    ).value
                );


            const groundPersons =
                Number(
                    document.getElementById(
                        "groundPersons"
                    ).value
                );


            const totalRoomBill =
                consumers.reduce(
                    (sum, person) =>
                        sum + person.roomBill,
                    0
                );


            // CREATE RECORD

            const record = {

                id: Date.now(),

                month: month,

                billDate: billDate,

                overallBill:
                    overallBill,

                totalRoomBill:
                    totalRoomBill,

                groundBill:
                    groundBill,

                groundPersons:
                    groundPersons,

                groundShare:
                    groundShare,

                consumers:
                    consumers.map(
                        person => ({

                            name:
                                person.name,

                            past:
                                person.past,

                            current:
                                person.current,

                            units:
                                person.units,

                            roomBill:
                                person.roomBill,

                            finalBill:
                                person.roomBill +
                                groundShare

                        })
                    )

            };


            let history =
                JSON.parse(
                    localStorage.getItem(
                        "electricityBillHistory"
                    )
                ) || [];


            history.unshift(record);


            localStorage.setItem(
                "electricityBillHistory",
                JSON.stringify(history)
            );


            alert(
                "✅ Bill saved successfully!"
            );


            displayHistory();

        }
    );


// =====================================================
// TOP HISTORY BUTTON
// =====================================================

document
    .getElementById(
        "topHistoryBtn"
    )
    .addEventListener(
        "click",
        () => {


            displayHistory();


            const historySection =
                document.getElementById(
                    "historySection"
                );


            historySection.style.display =
                "block";


            historySection.scrollIntoView({
                behavior: "smooth"
            });

        }
    );


// =====================================================
// CLOSE HISTORY
// =====================================================

document
    .getElementById(
        "closeHistoryBtn"
    )
    .addEventListener(
        "click",
        () => {


            document.getElementById(
                "historySection"
            ).style.display =
                "none";

        }
    );


// =====================================================
// DISPLAY HISTORY
// =====================================================

function displayHistory() {


    const historyList =
        document.getElementById(
            "historyList"
        );


    const history =
        JSON.parse(
            localStorage.getItem(
                "electricityBillHistory"
            )
        ) || [];


    historyList.innerHTML = "";


    if (history.length === 0) {


        historyList.innerHTML = `

            <div class="no-history">

                <h3>
                    No Bill History
                </h3>

                <p>
                    Your saved bills will appear here.
                </p>

            </div>

        `;


        return;

    }


    history.forEach(record => {


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "history-card";


        let consumerRows = "";


        record.consumers.forEach(
            person => {


                consumerRows += `

                    <tr>

                        <td>
                            ${escapeHTML(
                                person.name
                            )}
                        </td>

                        <td>
                            ${person.past}
                        </td>

                        <td>
                            ${person.current}
                        </td>

                        <td>
                            ${person.units}
                        </td>

                        <td>
                            ${formatMoney(
                                person.roomBill
                            )}
                        </td>

                        <td>
                            ${formatMoney(
                                person.finalBill
                            )}
                        </td>

                    </tr>

                `;

            }
        );


        card.innerHTML = `

            <h3>
                📅
                ${formatMonth(record.month)}
            </h3>


            <p>

                🗓 Bill Date:

                <strong>
                    ${formatDate(
                        record.billDate
                    )}
                </strong>

            </p>


            <p>

                💰 Overall Bill:

                <strong>
                    ${formatMoney(
                        record.overallBill
                    )}
                </strong>

            </p>


            <p>

                🏠 Total Room Bill:

                <strong>
                    ${formatMoney(
                        record.totalRoomBill
                    )}
                </strong>

            </p>


            <p>

                🌱 Ground Bill:

                <strong>
                    ${formatMoney(
                        record.groundBill
                    )}
                </strong>

            </p>


            <p>

                👥 Ground divided among:

                <strong>
                    ${record.groundPersons}
                    persons
                </strong>

            </p>


            <p>

                💵 Ground Share:

                <strong>
                    ${formatMoney(
                        record.groundShare
                    )}
                    per person
                </strong>

            </p>


            <div class="table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Name
                            </th>

                            <th>
                                Past
                            </th>

                            <th>
                                Current
                            </th>

                            <th>
                                Units
                            </th>

                            <th>
                                Room Bill
                            </th>

                            <th>
                                Final Bill
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${consumerRows}

                    </tbody>

                </table>

            </div>


            <div class="history-actions">

                <button
                    class="delete-history-btn"
                    onclick="deleteHistory(${record.id})"
                >
                    🗑 Delete This Bill
                </button>

            </div>

        `;


        historyList.appendChild(
            card
        );

    });

}


// =====================================================
// DELETE HISTORY
// =====================================================

function deleteHistory(id) {


    const confirmation =
        confirm(
            "Are you sure you want to delete this bill?"
        );


    if (!confirmation) {

        return;

    }


    let history =
        JSON.parse(
            localStorage.getItem(
                "electricityBillHistory"
            )
        ) || [];


    history =
        history.filter(
            record =>
                record.id !== id
        );


    localStorage.setItem(
        "electricityBillHistory",
        JSON.stringify(history)
    );


    displayHistory();

}


// =====================================================
// PDF DOWNLOAD
// =====================================================

document
    .getElementById(
        "pdfBtn"
    )
    .addEventListener(
        "click",
        async () => {


            const result =
                document.getElementById(
                    "result"
                );


            const finalSection =
                document.getElementById(
                    "finalSection"
                );


            if (
                finalSection.style.display !==
                "block"
            ) {

                alert(
                    "Please calculate the Ground Share first."
                );

                return;
            }


            try {


                const canvas =
                    await html2canvas(
                        result,
                        {

                            scale: 2,

                            backgroundColor:
                                "#ffffff",

                            useCORS: true

                        }
                    );


                const imageData =
                    canvas.toDataURL(
                        "image/png"
                    );


                const {
                    jsPDF
                } =
                    window.jspdf;


                const pdf =
                    new jsPDF(
                        "p",
                        "mm",
                        "a4"
                    );


                const pageWidth =
                    pdf.internal.pageSize
                        .getWidth();


                const pageHeight =
                    pdf.internal.pageSize
                        .getHeight();


                const margin = 8;


                const imageWidth =
                    pageWidth -
                    (margin * 2);


                const imageHeight =
                    (
                        canvas.height *
                        imageWidth
                    ) /
                    canvas.width;


                let heightLeft =
                    imageHeight;


                let position =
                    margin;


                pdf.addImage(
                    imageData,
                    "PNG",
                    margin,
                    position,
                    imageWidth,
                    imageHeight
                );


                heightLeft -=
                    pageHeight -
                    (margin * 2);


                while (
                    heightLeft > 0
                ) {


                    position =
                        heightLeft -
                        imageHeight +
                        margin;


                    pdf.addPage();


                    pdf.addImage(
                        imageData,
                        "PNG",
                        margin,
                        position,
                        imageWidth,
                        imageHeight
                    );


                    heightLeft -=
                        pageHeight -
                        (margin * 2);

                }


                pdf.save(
                    "Electricity-Bill.pdf"
                );


            } catch (error) {


                console.error(
                    error
                );


                alert(
                    "Unable to create PDF. Please try again."
                );

            }

        }
    );


// =====================================================
// IMAGE DOWNLOAD
// =====================================================

document
    .getElementById(
        "imageBtn"
    )
    .addEventListener(
        "click",
        async () => {


            const result =
                document.getElementById(
                    "result"
                );


            const finalSection =
                document.getElementById(
                    "finalSection"
                );


            if (
                finalSection.style.display !==
                "block"
            ) {

                alert(
                    "Please calculate the Ground Share first."
                );

                return;
            }


            try {


                const canvas =
                    await html2canvas(
                        result,
                        {

                            scale: 2,

                            backgroundColor:
                                "#ffffff",

                            useCORS: true

                        }
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.download =
                    "Electricity-Bill.png";


                link.href =
                    canvas.toDataURL(
                        "image/png"
                    );


                link.click();


            } catch (error) {


                console.error(
                    error
                );


                alert(
                    "Unable to create image. Please try again."
                );

            }

        }
    );


// =====================================================
// HELPER FUNCTIONS
// =====================================================


// MONEY

function formatMoney(amount) {

    return (
        "₹" +
        Number(amount).toFixed(2)
    );

}


// MONTH

function formatMonth(month) {


    if (!month) {

        return "-";

    }


    const date =
        new Date(
            month +
            "-01T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {

            month: "long",

            year: "numeric"

        }
    );

}


// DATE

function formatDate(dateValue) {


    if (!dateValue) {

        return "-";

    }


    const date =
        new Date(
            dateValue +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {

            day: "2-digit",

            month: "long",

            year: "numeric"

        }
    );

}


// SAFE HTML

function escapeHTML(text) {


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}