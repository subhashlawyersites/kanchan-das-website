let siteData = {};

document.addEventListener("DOMContentLoaded", () => {

    fetch("site-data.json")
        .then(response => {

            if (!response.ok) {
                throw new Error("Could not load site-data.json");
            }

            return response.json();
        })
        .then(data => {

            siteData = data;

            renderProfile();
            renderServices();
            renderGallery();
            renderCourtOrders();
            renderContact();

        })
        .catch(error => {

            console.error("Website data error:", error);

        });

});


/* ================= PROFILE ================= */

function renderProfile() {

    const profile = siteData.profile;

    if (!profile) return;

    const highlight = document.getElementById("professional-highlight");

if (highlight) {
    highlight.style.display =
        profile.professionalHighlight ? "inline-block" : "none";

    highlight.innerHTML =
        `<i class="fas fa-building-columns me-2"></i>
         ${profile.professionalHighlight || ""}`;
}


    document.getElementById("hero-title").textContent =
        profile.name || "Advocate Kanchan Das";


    document.getElementById("hero-designation").textContent =
        profile.designation || "";


    document.getElementById("hero-tagline").textContent =
        profile.tagline || "";


    document.getElementById("hero-intro").textContent =
        profile.intro || "";


    document.getElementById("about-intro").textContent =
        profile.about || "";


const chamberBox =
    document.getElementById("chamber-address-text");

const mapIframe =
    document.getElementById("map-iframe");

if (chamberBox && profile.chambers) {

    chamberBox.innerHTML = profile.chambers.map((chamber, index) => `
        <div class="chamber-option mb-4">

            <h5>
                <i class="fas fa-location-dot me-2"></i>
                ${chamber.name}
            </h5>

            <a
                href="#map-iframe"
                class="chamber-address-link"
                data-chamber-index="${index}">
                ${chamber.address}
            </a>

            <div class="mt-2">
                <a
                    href="${chamber.googleMapUrl}"
                    target="_blank"
                    rel="noopener"
                    class="btn btn-gold btn-sm">
                    <i class="fas fa-diamond-turn-right me-2"></i>
                    Get Directions
                </a>
            </div>

        </div>
    `).join("");

    chamberBox
        .querySelectorAll(".chamber-address-link")
        .forEach(link => {

            link.addEventListener("click", event => {

                event.preventDefault();

                const index =
                    Number(link.dataset.chamberIndex);

                const chamber =
                    profile.chambers[index];

                if (mapIframe && chamber.mapEmbedUrl) {
                    mapIframe.src = chamber.mapEmbedUrl;
                }

            });

        });
}

   const footerPhone =
    document.getElementById("footer-phone");

if (footerPhone && profile.phone) {
    footerPhone.innerHTML =
        `<a href="tel:${profile.phone}">
            ${profile.phone}
         </a>`;
}


const footerEmail =
    document.getElementById("footer-email");

if (footerEmail && profile.email) {
    footerEmail.innerHTML =
        `<a href="mailto:${profile.email}">
            ${profile.email}
         </a>`;
}

   

    if (profile.phone) {

        const phoneLink = `tel:${profile.phone}`;

        document.getElementById("btn-call-hero").href = phoneLink;
        document.getElementById("contact-call").href = phoneLink;
        document.getElementById("float-call").href = phoneLink;

    }


    if (profile.whatsapp) {

        const whatsappMessage =
            "Hello Advocate Kanchan Das, I would like to enquire regarding a legal matter.";

        const whatsappUrl =
            `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

        document.getElementById("btn-wa-hero").href = whatsappUrl;
        document.getElementById("contact-wa").href = whatsappUrl;
        document.getElementById("float-wa").href = whatsappUrl;

    }


  

    document.getElementById("footer-year").textContent =
        new Date().getFullYear();

}


/* ================= SERVICES ================= */

function renderServices() {

    const grid = document.getElementById("services-grid");

    grid.innerHTML = "";


    if (!siteData.services || siteData.services.length === 0) {

        grid.innerHTML =
            `<div class="col-12 text-center text-white">
                Practice areas will be added shortly.
             </div>`;

        return;
    }


    siteData.services.forEach(service => {

        const card = document.createElement("div");

        card.className = "col-6 col-md-6 col-lg-4";


        card.innerHTML = `
            <div class="service-card"
                 onclick="openServiceModal('${service.id}')">

                <div class="service-icon">
                    <i class="fas ${service.icon || "fa-scale-balanced"}"></i>
                </div>

                <h4>${service.title}</h4>

                <p>${service.short}</p>

                <span class="service-read">
                    Read Details
                    <i class="fas fa-arrow-right ms-1"></i>
                </span>

            </div>
        `;


        grid.appendChild(card);

    });

}

function openServiceModal(serviceId) {

    const service =
        siteData.services.find(item => item.id === serviceId);

    if (!service) return;


    document.getElementById("modalServiceTitle").textContent =
        service.title;


    const body =
        document.getElementById("modalServiceBody");

    body.innerHTML = "";


    if (Array.isArray(service.paragraphs)) {

        service.paragraphs.forEach(paragraph => {

            const p = document.createElement("p");

            p.textContent = paragraph;

            body.appendChild(p);

        });

    } else {

        const p = document.createElement("p");

        p.textContent = service.full || "";

        body.appendChild(p);

    }


    const message =
        `Hello Advocate Kanchan Das, I would like to enquire regarding ${service.title}.`;

    document.getElementById("modalWaBtn").href =
        `https://wa.me/${siteData.profile.whatsapp}?text=${encodeURIComponent(message)}`;


    const modalElement =
        document.getElementById("serviceModal");

    const modal =
        bootstrap.Modal.getOrCreateInstance(modalElement);


    /*
       -----------------------------------------------------
       CREATE ONE HISTORY ENTRY FOR THE OPEN PRACTICE AREA
       -----------------------------------------------------
    */

    history.pushState(
        {
            ...(history.state || {}),
            serviceModal: true
        },
        "",
        window.location.href
    );


    modal.show();

}

/* =========================================================
   PRACTICE AREA POPUP — MOBILE BACK BUTTON SUPPORT
   ========================================================= */

(function setupServiceModalHistory() {

    const modalElement =
        document.getElementById("serviceModal");

    if (!modalElement) return;


    /*
       This flag tells the close handler whether
       the modal was closed by the phone/browser
       Back button.
    */

    let closingFromHistory = false;


    /*
       PHONE / BROWSER BACK BUTTON
       ---------------------------

       When the visitor presses Back while the
       Practice Area popup is open, the browser
       activates the previous history entry.

       We close ONLY the popup here.

       We do NOT call history.back() again.
    */

    window.addEventListener("popstate", function () {

        const modalInstance =
            bootstrap.Modal.getInstance(modalElement);


        if (
            modalInstance &&
            modalElement.classList.contains("show")
        ) {

            closingFromHistory = true;

            modalInstance.hide();

        }

    });


    /*
       NORMAL CLOSE BUTTON
       -------------------

       If the visitor uses the popup's Close button,
       remove the Practice Area history entry.

       We call history.back() ONLY when the popup
       was NOT already closed by the phone Back button.
    */

    modalElement.addEventListener(
        "hidden.bs.modal",
        function () {

            if (closingFromHistory) {

                closingFromHistory = false;

                return;
            }


            if (
                history.state &&
                history.state.serviceModal === true
            ) {

                history.back();

            }

        }
    );

})();
/* ================= GALLERY ================= */

function renderGallery() {

    const track =
        document.getElementById("gallery-track");

    const empty =
        document.getElementById("gallery-empty");


    track.innerHTML = "";


    if (!siteData.gallery || siteData.gallery.length === 0) {

        empty.style.display = "block";

        return;
    }


    empty.style.display = "none";


    siteData.gallery.forEach(image => {

        const item = document.createElement("div");

        item.className = "gallery-item";


        item.innerHTML = `
    <img
    src="${image.image}"
    alt="${image.alt || image.caption || "Professional photograph"}"
    loading="eager"
    draggable="false"
    onload="this.classList.add('loaded')">

    ${image.caption
        ? `<div class="p-3 fw-bold text-center">${image.caption}</div>`
        : ""}
`;

        track.appendChild(item);

    });
     startContinuousLoop("gallery-track");

}


/* ================= COURT ORDERS ================= */
function renderCourtOrders() {

    const grid = document.getElementById("orders-grid");
    const empty = document.getElementById("orders-empty");

    grid.innerHTML = "";

    if (!siteData.courtOrders || siteData.courtOrders.length === 0) {
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";

    siteData.courtOrders.forEach((order, index) => {

        const col = document.createElement("div");

        col.className = "court-order-slide";

        const isPDF = order.type === "pdf";

        if (isPDF) {

            col.innerHTML = `
                <div class="order-card pdf-order-card">

                    <div class="pdf-preview"
                         onclick="openCourtOrder(${index})">

                        <i class="fas fa-file-pdf"></i>

                        <h4>PDF Court Order</h4>

                        <p>Click to view the complete document</p>

                    </div>

                    <div class="order-card-content">

                        <h5>${order.title}</h5>

                        <p class="text-muted mb-2">
                            ${order.court || ""}
                        </p>

                        <p>
                            ${order.description || ""}
                        </p>

                        <button
                            type="button"
                            class="btn btn-outline-primary"
                            onclick="openCourtOrder(${index})">

                            <i class="fas fa-file-pdf me-1"></i>
                            View PDF

                        </button>

                    </div>

                </div>
            `;

        } else {

            col.innerHTML = `
                <div class="order-card">

                    <img
                        src="${order.image}"
                        alt="${order.alt || order.title}"
                        loading="lazy"
                        onclick="openCourtOrder(${index})"
                        style="cursor:pointer;">

                    <div class="order-card-content">

                        <h5>${order.title}</h5>

                        <p class="text-muted mb-2">
                            ${order.court || ""}
                        </p>

                        <p>
                            ${order.description || ""}
                        </p>

                        <button
                            type="button"
                            class="btn btn-outline-primary"
                            onclick="openCourtOrder(${index})">

                            <i class="fas fa-expand me-1"></i>
                            View Full Order

                        </button>

                    </div>

                </div>
            `;
        }

 grid.appendChild(col);

});

startContinuousLoop("orders-grid");

}

function openCourtOrder(index) {

    const order = siteData.courtOrders[index];

    if (!order) {
        console.error("Court order not found:", index);
        return;
    }


    const modalElement =
        document.getElementById("courtOrderModal");

    const modalTitle =
        document.getElementById("courtOrderModalTitle");

    const body =
        document.getElementById("courtOrderModalBody");


    if (!modalElement || !modalTitle || !body) {
        console.error("Court Order modal elements are missing.");
        return;
    }


    modalTitle.textContent =
        order.title || "Court Order";


    body.innerHTML = "";


    /* =====================================================
       PDF COURT ORDER
       ===================================================== */

    if (order.type === "pdf") {

        if (!order.file) {

            body.innerHTML = `
                <div class="pdf-error-message">
                    <i class="fas fa-triangle-exclamation"></i>
                    <p>PDF document is not available.</p>
                </div>
            `;

            console.error(
                "PDF file path is missing for:",
                order.title
            );

        } else {

            const iframe =
                document.createElement("iframe");

            iframe.src = order.file;

            iframe.title =
                order.title || "Court Order PDF";

            iframe.className =
                "court-order-pdf-viewer";

            iframe.setAttribute(
                "allowfullscreen",
                ""
            );

            body.appendChild(iframe);


            /*
               Helpful diagnostic if the PDF path
               is incorrect.
            */

            iframe.addEventListener("load", () => {

                console.log(
                    "Court Order PDF loaded:",
                    order.file
                );

            });

        }

    }


    /* =====================================================
       IMAGE COURT ORDER
       ===================================================== */

    else {

        const img =
            document.createElement("img");

        img.src = order.image;

        img.alt =
            order.alt || order.title;

        img.className =
            "court-order-full-image";

        body.appendChild(img);

    }


    /* =====================================================
       SHOW MODAL
       ===================================================== */

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );

    modal.show();

}
/* ================= CONTACT ================= */

function renderContact() {

    if (!siteData.profile) return;

    const phone =
        siteData.profile.phone;

    const whatsapp =
        siteData.profile.whatsapp;


    if (phone) {

        document.getElementById("contact-call").textContent =
            phone;

    }


    if (whatsapp) {

        document.getElementById("float-wa").title =
            "WhatsApp Advocate";

    }

}
/* ================= COURT ORDER AUTO SLIDER ================= */

let courtOrderSliderTimer = null;

function startCourtOrderAutoScroll() {

    const grid = document.getElementById("orders-grid");

    if (!grid) return;

    clearInterval(courtOrderSliderTimer);

    courtOrderSliderTimer = setInterval(() => {

        const firstCard = grid.querySelector(".court-order-slide");

        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth + 16;

        if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 10) {

            grid.scrollTo({
                left: 0,
                behavior: "smooth"
            });

        } else {

            grid.scrollBy({
                left: cardWidth,
                behavior: "smooth"
            });

        }

    }, 3500);
}

/* =========================================================
   CONTINUOUS HORIZONTAL LOOP
   ========================================================= */
/* =========================================================
   FIXED VIEWPORT + SEAMLESS CONTINUOUS LOOP + DRAG/SWIPE
   ========================================================= */

function startContinuousLoop(elementId) {

    const track = document.getElementById(elementId);

    if (!track) return;

    if (track.dataset.loopStarted === "true") return;

    const originalItems = Array.from(track.children);

    if (originalItems.length < 2) return;

    track.dataset.loopStarted = "true";

    /*
       The viewport now exists in HTML.
       JavaScript controls ONLY the moving track.
    */

    track.classList.add("loop-track");

    /* -----------------------------------------------------
       Wait for original images
       ----------------------------------------------------- */

    const images = track.querySelectorAll("img");

    const imagePromises = Array.from(images).map(img => {

        if (img.complete) {

            return img.decode
                ? img.decode().catch(() => {})
                : Promise.resolve();

        }

        return new Promise(resolve => {

            img.addEventListener("load", resolve, {
                once: true
            });

            img.addEventListener("error", resolve, {
                once: true
            });

        });

    });


    Promise.all(imagePromises).then(() => {

        /* -------------------------------------------------
           Duplicate the original cards
           ------------------------------------------------- */

        originalItems.forEach(item => {

            const clone = item.cloneNode(true);

            clone.querySelectorAll("img").forEach(img => {

                img.loading = "eager";

                if (img.complete) {
                    img.classList.add("loaded");
                }

            });

            track.appendChild(clone);

        });


        /*
           Force browser to calculate dimensions
        */

        track.offsetWidth;


        /* -------------------------------------------------
           Calculate exact width of ONE original set
           ------------------------------------------------- */

        let loopWidth = 0;

        originalItems.forEach(item => {

            loopWidth += item.getBoundingClientRect().width;

        });


        const trackStyle =
            window.getComputedStyle(track);

        const gap =
            parseFloat(trackStyle.columnGap) ||
            parseFloat(trackStyle.gap) ||
            0;


        /*
           There is a gap between every original card.
        */

        loopWidth +=
            gap * originalItems.length;


        /* -------------------------------------------------
           Animation state
           ------------------------------------------------- */

        let position = 0;

        let lastTime = performance.now();

        let dragging = false;

        let pointerStartX = 0;

        let positionAtPointerStart = 0;

        let hasDragged = false;


        /*
           Elegant movement speed
        */

        const speed = 30;


        /* -------------------------------------------------
           NORMALIZE LOOP POSITION
           ------------------------------------------------- */

        function normalizePosition() {

            while (position >= loopWidth) {
                position -= loopWidth;
            }

            while (position < 0) {
                position += loopWidth;
            }

        }


        /* -------------------------------------------------
           APPLY POSITION
           ------------------------------------------------- */

        function applyPosition() {

            track.style.transform =
                `translate3d(${-position}px, 0, 0)`;

        }


        /* -------------------------------------------------
           POINTER DOWN
           ------------------------------------------------- */

       track.addEventListener("pointerdown", event => {

    /*
       Do not start the slider when the user is
       interacting with a button or other control.
       This keeps View PDF / View Full Order clickable.
    */

    const interactiveElement =
        event.target.closest(
            "button, a, input, textarea, select, label"
        );

    if (interactiveElement) {
        return;
    }


    dragging = true;

    hasDragged = false;

    pointerStartX = event.clientX;

    positionAtPointerStart = position;

    track.classList.add("is-dragging");

    track.setPointerCapture(event.pointerId);

});


        /* -------------------------------------------------
           POINTER MOVE
           ------------------------------------------------- */

        track.addEventListener("pointermove", event => {

            if (!dragging) return;

            const deltaX =
                event.clientX - pointerStartX;


            if (Math.abs(deltaX) > 8) {
                hasDragged = true;
            }


            /*
               Dragging left moves cards left.
               Dragging right moves cards right.
            */

            position =
                positionAtPointerStart - deltaX;

            normalizePosition();

            applyPosition();

        });


        /* -------------------------------------------------
           POINTER UP
           ------------------------------------------------- */

        function endDrag(event) {

            if (!dragging) return;

            dragging = false;

            track.classList.remove("is-dragging");

            if (
                event &&
                track.hasPointerCapture &&
                track.hasPointerCapture(event.pointerId)
            ) {
                track.releasePointerCapture(event.pointerId);
            }

            lastTime = performance.now();

        }


        track.addEventListener(
            "pointerup",
            endDrag
        );

        track.addEventListener(
            "pointercancel",
            endDrag
        );


        /* -------------------------------------------------
           CONTINUOUS AUTO MOVEMENT
           ------------------------------------------------- */

        function animate(timestamp) {

            const elapsed =
                timestamp - lastTime;

            lastTime = timestamp;


            if (!dragging) {

                position +=
                    speed * elapsed / 1000;

                normalizePosition();

                applyPosition();

            }


            requestAnimationFrame(animate);

        }


        requestAnimationFrame(animate);

    });

}
// =========================================================
// MOBILE NAVBAR — RELIABLE CLOSE BEHAVIOUR
// =========================================================

document.addEventListener("click", function (event) {

    const navbar = document.querySelector(".navbar");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    if (!navbar || !navbarCollapse) return;

    /*
       Event delegation is intentional here.
       It works even if the navigation elements were
       not available when this script first ran.
    */
    const navLink = event.target.closest(
        ".navbar-collapse .nav-link"
    );

    if (navLink) {

        const collapseInstance =
            bootstrap.Collapse.getOrCreateInstance(
                navbarCollapse,
                { toggle: false }
            );

        collapseInstance.hide();

        return;
    }

    /* Close an open mobile menu when clicking outside. */
    if (!navbarCollapse.classList.contains("show")) {
        return;
    }

    if (navbar.contains(event.target)) {
        return;
    }

    const collapseInstance =
        bootstrap.Collapse.getOrCreateInstance(
            navbarCollapse,
            { toggle: false }
        );

    collapseInstance.hide();

});