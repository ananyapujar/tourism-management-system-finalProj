/* =========================================
   TRAVELEASE JAVASCRIPT
========================================= */

let selectedPackage = "";
let selectedPrice = 0;
let selectedDestination = "";
let selectedStyle = "";

const API_BASE_URL =
    window.location.port === "5500"
        ? "http://localhost:5000/api"
        : "/api";

let bookings = [];


// =========================================
// DATABASE API FUNCTIONS
// =========================================

async function loadBookings() {

    try {

        const response = await fetch(`${API_BASE_URL}/bookings`);

        if (!response.ok) {
            throw new Error("Failed to load bookings");
        }

        const result = await response.json();

        // Convert database field names to the names used by the existing UI.
        bookings = (result.data || []).map(booking => ({
            id: booking.id,
            bookingId: booking.booking_id,
            customer: booking.customer_name,
            email: booking.email,
            phone: booking.phone,
            destination: booking.destination,
            package: booking.package_name,
            date: booking.travel_date,
            travelers: Number(booking.travelers),
            amount: Number(booking.total_amount),
            status: booking.status
        }));

        renderBookings();
        updateStatistics();

    } catch (error) {

        console.error("Error loading bookings:", error);

        bookings = [];
        renderBookings();
        updateStatistics();

    }

}

async function loadDestinations() {
    try {
        const response = await fetch(`${API_BASE_URL}/destinations`);

        if (!response.ok) {
            throw new Error("Failed to load destinations");
        }

        const result = await response.json();

        console.log("Destinations loaded:", result.data);

        return result.data || [];

    } catch (error) {
        console.error("Error loading destinations:", error);
        return [];
    }
}


async function loadPackages() {
    try {
        const response = await fetch(`${API_BASE_URL}/packages`);

        if (!response.ok) {
            throw new Error("Failed to load packages");
        }

        const result = await response.json();

        console.log("Packages loaded:", result.data);

        return result.data || [];

    } catch (error) {
        console.error("Error loading packages:", error);
        return [];
    }
}


/* =========================================
   NAVIGATION
========================================= */

function scrollToSection(id) {

    const section = document.getElementById(id);

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


function scrollToBooking() {

    scrollToSection("booking");

}


function toggleMenu() {

    document
        .getElementById("navbar")
        .classList.toggle("mobile-open");

}


/* =========================================
   NAVBAR SCROLL
========================================= */

window.addEventListener("scroll", function() {

    const navbar =
        document.getElementById("navbar");

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =========================================
   HERO SEARCH
========================================= */

function searchTrips() {

    const destination =
        document.getElementById("heroDestination").value;

    const date =
        document.getElementById("heroDate").value;

    const travelers =
        document.getElementById("heroTravelers").value;


    if (!destination) {

        alert("Please select a destination.");

        return;

    }


    const packageData = getPackageByDestination(destination);


    if (packageData) {

        selectPackage(
            packageData.name,
            packageData.price,
            destination
        );

    }


    if (date) {

        document.getElementById("travelDate").value = date;

    }


    document.getElementById("travelers").value =
        travelers;


    scrollToBooking();

}


/* =========================================
   DESTINATION EXPLORATION
========================================= */

function exploreDestination(destination) {

    const packageData =
        getPackageByDestination(destination);


    if (!packageData) return;


    const message =
        `${destination} is waiting for you! Starting packages from ₹${packageData.price.toLocaleString("en-IN")}.`;


    alert(message);


    selectPackage(
        packageData.name,
        packageData.price,
        destination
    );

}


/* =========================================
   FAVORITES
========================================= */

function toggleFavorite(button) {

    button.classList.toggle("active");

    if (button.classList.contains("active")) {

        button.innerHTML = "♥";

    } else {

        button.innerHTML = "♡";

    }

}


/* =========================================
   PACKAGE DATA
========================================= */

function getPackageByDestination(destination) {

    const packages = {

        Goa: {
            name: "Goa Beach Escape",
            price: 15000
        },

        Manali: {
            name: "Manali Adventure",
            price: 18000
        },

        Paris: {
            name: "Paris Experience",
            price: 85000
        },

        Dubai: {
            name: "Dubai Luxury",
            price: 65000
        },

        Bali: {
            name: "Bali Paradise",
            price: 55000
        },

        London: {
            name: "London Explorer",
            price: 78000
        }

    };


    return packages[destination];

}


/* =========================================
   PACKAGE SELECTION
========================================= */

function selectPackage(
    packageName,
    price,
    destination
) {

    selectedPackage = packageName;

    selectedPrice = price;

    selectedDestination = destination;


    const packageSelect =
        document.getElementById("packageSelect");


    packageSelect.value = packageName;


    updatePackagePrice();


    scrollToBooking();

}


/* =========================================
   UPDATE PACKAGE PRICE
========================================= */

function updatePackagePrice() {

    const packageName =
        document.getElementById("packageSelect").value;


    const packagePrices = {

        "Goa Beach Escape": {
            price: 15000,
            destination: "Goa"
        },

        "Manali Adventure": {
            price: 18000,
            destination: "Manali"
        },

        "Paris Experience": {
            price: 85000,
            destination: "Paris"
        },

        "Dubai Luxury": {
            price: 65000,
            destination: "Dubai"
        },

        "Bali Paradise": {
            price: 55000,
            destination: "Bali"
        },

        "London Explorer": {
            price: 78000,
            destination: "London"
        }

    };


    if (packagePrices[packageName]) {

        selectedPrice =
            packagePrices[packageName].price;

        selectedDestination =
            packagePrices[packageName].destination;

        selectedPackage =
            packageName;

    }


    updateBookingTotal();

}


/* =========================================
   BOOKING STEPS
========================================= */

function nextStep(currentStep) {

    if (currentStep === 1) {

        const name =
            document.getElementById("fullName").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();


        if (!name || !email || !phone) {

            alert(
                "Please complete all personal details."
            );

            return;

        }

    }


    if (currentStep === 2) {

        const packageName =
            document.getElementById("packageSelect").value;

        const date =
            document.getElementById("travelDate").value;

        const travelers =
            document.getElementById("travelers").value;


        if (!packageName || !date || !travelers) {

            alert(
                "Please complete all trip details."
            );

            return;

        }


        updateSummary();

    }


    document
        .getElementById(`bookingStep${currentStep}`)
        .classList.remove("active");


    document
        .getElementById(`bookingStep${currentStep + 1}`)
        .classList.add("active");


    document
        .getElementById(`stepIndicator${currentStep}`)
        .classList.remove("active");


    document
        .getElementById(`stepIndicator${currentStep + 1}`)
        .classList.add("active");

}


function previousStep(currentStep) {

    document
        .getElementById(`bookingStep${currentStep}`)
        .classList.remove("active");


    document
        .getElementById(`bookingStep${currentStep - 1}`)
        .classList.add("active");


    document
        .getElementById(`stepIndicator${currentStep}`)
        .classList.remove("active");


    document
        .getElementById(`stepIndicator${currentStep - 1}`)
        .classList.add("active");

}


/* =========================================
   TOTAL PRICE
========================================= */

function updateBookingTotal() {

    const travelers =
        parseInt(
            document.getElementById("travelers").value
        ) || 1;


    const total =
        selectedPrice * travelers;


    const summaryAmount =
        document.getElementById("summaryAmount");


    if (summaryAmount) {

        summaryAmount.innerText =
            `₹${total.toLocaleString("en-IN")}`;

    }

}


/* =========================================
   SUMMARY
========================================= */

function updateSummary() {

    const name =
        document.getElementById("fullName").value;

    const packageName =
        document.getElementById("packageSelect").value;

    const date =
        document.getElementById("travelDate").value;

    const travelers =
        parseInt(
            document.getElementById("travelers").value
        ) || 1;


    const total =
        selectedPrice * travelers;


    document.getElementById("summaryName")
        .innerText = name;


    document.getElementById("summaryDestination")
        .innerText = selectedDestination;


    document.getElementById("summaryPackage")
        .innerText = packageName;


    document.getElementById("summaryDate")
        .innerText = date;


    document.getElementById("summaryTravelers")
        .innerText = travelers;


    document.getElementById("summaryAmount")
        .innerText =
        `₹${total.toLocaleString("en-IN")}`;

}


/* =========================================
   CONFIRM BOOKING
========================================= */

async function confirmBooking() {

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const packageName = document.getElementById("packageSelect").value;
    const date = document.getElementById("travelDate").value;
    const travelers =
        parseInt(document.getElementById("travelers").value) || 1;
    const amount = selectedPrice * travelers;

    if (!name || !email || !phone || !packageName || !date) {
        alert("Please complete all booking details.");
        return;
    }

    const booking = {
        customer_name: name,
        email: email,
        phone: phone,
        destination: selectedDestination,
        package_name: packageName,
        travel_date: date,
        travelers: travelers,
        total_amount: amount
    };

    try {

        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Booking failed");
        }

        alert("🎉 Booking confirmed successfully!");

        document.getElementById("successDetails").innerHTML = `
            <strong>${packageName}</strong><br>
            📍 ${selectedDestination}<br>
            📅 ${date}<br>
            👥 ${travelers} Traveler(s)<br>
            💰 ₹${Number(amount).toLocaleString("en-IN")}
        `;

        document.getElementById("successModal").classList.add("show");

        await loadBookings();

    } catch (error) {

        console.error("Booking error:", error);

        alert("❌ Unable to save booking. Please try again.");

    }

}
/* =========================================
   CLOSE MODAL
========================================= */

function closeModal() {

    document
        .getElementById("successModal")
        .classList.remove("show");


    document
        .getElementById("bookingStep3")
        .classList.remove("active");


    document
        .getElementById("bookingStep1")
        .classList.add("active");


    document
        .getElementById("stepIndicator3")
        .classList.remove("active");


    document
        .getElementById("stepIndicator1")
        .classList.add("active");


    document.getElementById("fullName").value = "";

    document.getElementById("email").value = "";

    document.getElementById("phone").value = "";

    document.getElementById("packageSelect").value = "";

}


/* =========================================
   RENDER BOOKINGS
========================================= */

function renderBookings() {

    const tbody =
        document.getElementById("bookingTableBody");


    if (bookings.length === 0) {

        tbody.innerHTML = `

            <tr class="empty-row">

                <td colspan="8">

                    <div class="empty-booking">

                        📋

                        <h3>No bookings yet</h3>

                        <p>
                            Your confirmed trips will appear here.
                        </p>

                        <button onclick="scrollToBooking()">
                            Book Your Adventure
                        </button>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML = "";


    bookings.forEach(booking => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${booking.customer}</strong>
            </td>

            <td>${booking.destination}</td>

            <td>${booking.package}</td>

            <td>${booking.date}</td>

            <td>${booking.travelers}</td>

            <td>
                ₹${Number(booking.amount).toLocaleString("en-IN")}
            </td>

            <td>
                <span class="status">
                    ${booking.status}
                </span>
            </td>

            <td>

                <button class="delete-btn"
                        onclick="deleteBooking(${booking.id})">
                    Delete
                </button>

            </td>

        `;


        tbody.appendChild(row);

    });

}


/* =========================================
   DELETE BOOKING
========================================= */

async function deleteBooking(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this booking?"
    );

    if (!confirmed) return;

    try {

        const response = await fetch(
            `${API_BASE_URL}/bookings/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Delete failed");
        }

        await loadBookings();

        alert("Booking deleted successfully.");

    } catch (error) {

        console.error("Delete booking error:", error);

        alert("❌ Unable to delete booking. Please try again.");

    }

}
/* =========================================
   SEARCH / FILTER
========================================= */

function filterBookings() {

    const search =
        document
            .getElementById("bookingSearch")
            .value
            .toLowerCase();


    const destination =
        document
            .getElementById("destinationFilter")
            .value;


    const rows =
        document.querySelectorAll(
            "#bookingTableBody tr"
        );


    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();


        const matchesSearch =
            text.includes(search);


        const matchesDestination =
            !destination ||
            text.includes(
                destination.toLowerCase()
            );


        row.style.display =
            matchesSearch && matchesDestination
                ? ""
                : "none";

    });

}


/* =========================================
   AI TRAVEL STYLE
========================================= */

function selectStyle(button, style) {

    document
        .querySelectorAll(".travel-styles button")
        .forEach(btn => {

            btn.classList.remove("selected");

        });


    button.classList.add("selected");

    selectedStyle = style;

}


/* =========================================
   AI TRIP GENERATOR
========================================= */

function createTrip() {

    const destination =
        document.getElementById("aiDestination").value;


    const budget =
        parseInt(
            document.getElementById("aiBudget").value
        ) || 0;


    const travelers =
        parseInt(
            document.getElementById("aiTravelers").value
        ) || 1;


    const duration =
        document.getElementById("aiDuration").value;


    if (budget <= 0) {

        alert("Please enter your travel budget.");

        return;

    }


    const destinations = {

        Goa: {
            package: "Goa Beach Escape",
            price: 15000,
            style: "Beach"
        },

        Manali: {
            package: "Manali Adventure",
            price: 18000,
            style: "Adventure"
        },

        Paris: {
            package: "Paris Experience",
            price: 85000,
            style: "Romantic"
        },

        Dubai: {
            package: "Dubai Luxury",
            price: 65000,
            style: "Luxury"
        },

        Bali: {
            package: "Bali Paradise",
            price: 55000,
            style: "Nature"
        },

        London: {
            package: "London Explorer",
            price: 78000,
            style: "Family"
        }

    };


    let recommendation;


    if (destination !== "Any") {

        recommendation =
            destinations[destination];

    } else {

        const affordable =
            Object.entries(destinations)
                .filter(
                    ([name,data]) =>
                        data.price <= budget
                );


        if (affordable.length > 0) {

            recommendation =
                affordable[
                    Math.floor(
                        Math.random() *
                        affordable.length
                    )
                ][1];

        } else {

            recommendation =
                destinations.Manali;

        }

    }


    if (!recommendation) {

        recommendation =
            destinations.Manali;

    }


    const result =
        document.getElementById("aiResult");


    result.innerHTML = `

        <h3>
            ✨ We found a trip for you!
        </h3>

        <br>

        <p>
            Based on your preferences,
            we recommend <strong>
            ${getDestinationName(recommendation)}
            </strong>.
        </p>

        <br>

        <p>
            ✈️ Package:
            <strong>${recommendation.package}</strong>
        </p>

        <p>
            💰 Estimated Budget:
            <strong>
            ₹${(
                recommendation.price *
                travelers
            ).toLocaleString("en-IN")}
            </strong>
        </p>

        <p>
            🕐 Duration:
            <strong>${duration}</strong>
        </p>

        <p>
            👥 Travelers:
            <strong>${travelers}</strong>
        </p>

        <p style="margin-top:10px;color:#667085;">

            ${
                selectedStyle
                    ? `Perfect for a ${selectedStyle.toLowerCase()} trip!`
                    : "This trip matches your budget and travel preferences."
            }

        </p>


        <button
            onclick="
                selectPackage(
                    '${recommendation.package}',
                    ${recommendation.price},
                    '${getDestinationName(recommendation)}'
                )
            ">

            Book This Trip →

        </button>

    `;


    result.classList.add("show");

}


function getDestinationName(packageData) {

    const mapping = {

        "Goa Beach Escape": "Goa",

        "Manali Adventure": "Manali",

        "Paris Experience": "Paris",

        "Dubai Luxury": "Dubai",

        "Bali Paradise": "Bali",

        "London Explorer": "London"

    };


    return mapping[packageData.package];

}


/* =========================================
   CHATBOT
========================================= */

function toggleChat() {

    document
        .getElementById("chatbot")
        .classList.toggle("show");

}


function chatAnswer(question) {

    const chatBody =
        document.getElementById("chatBody");


    chatBody.innerHTML += `

        <div class="user-message">
            ${question}
        </div>

    `;


    let answer = "";


    if (
        question.includes("beach")
    ) {

        answer =
            "🏖 Goa and Bali are excellent beach destinations. Goa starts at ₹15,000.";

    }

    else if (
        question.includes("20,000")
    ) {

        answer =
            "💰 Goa Beach Escape at ₹15,000 and Manali Adventure at ₹18,000 fit your budget.";

    }

    else if (
        question.includes("honeymoon")
    ) {

        answer =
            "💕 Paris and Bali are fantastic romantic destinations.";

    }

    else if (
        question.includes("family")
    ) {

        answer =
            "👨‍👩‍👧 Manali and London are great choices for a family trip.";

    }

    else {

        answer =
            "✈️ Tell me your budget and preferred travel style and I'll help you choose.";

    }


    setTimeout(() => {

        chatBody.innerHTML += `

            <div class="bot-message">
                ${answer}
            </div>

        `;


        chatBody.scrollTop =
            chatBody.scrollHeight;

    }, 500);

}


/* =========================================
   STATISTICS
========================================= */

function updateStatistics() {

    const bookingCount =
        document.getElementById("bookingCount");


    const revenue =
        document.getElementById("revenue");


    bookingCount.innerText =
        bookings.length;


    const totalRevenue =
        bookings.reduce(
            (sum,booking) =>
                sum + Number(booking.amount),
            0
        );


    revenue.innerText =
        totalRevenue.toLocaleString("en-IN");

}


/* =========================================
   COUNTER ANIMATION
========================================= */

function animateCounters() {

    const counters =
        document.querySelectorAll(".counter");


    counters.forEach(counter => {

        const target =
            parseInt(
                counter.dataset.target
            );


        let current = 0;


        const increment =
            Math.max(1,Math.ceil(target / 30));


        const interval =
            setInterval(() => {

                current += increment;


                if (current >= target) {

                    current = target;

                    clearInterval(interval);

                }


                counter.innerText = current;

            }, 40);

    });

}


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadBookings();

        animateCounters();


        /* Set minimum travel date */

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        document
            .getElementById("travelDate")
            .setAttribute(
                "min",
                today
            );


        document
            .getElementById("heroDate")
            .setAttribute(
                "min",
                today
            );

    }
);