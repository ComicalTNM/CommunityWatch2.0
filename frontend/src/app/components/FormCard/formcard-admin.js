document.addEventListener("DOMContentLoaded", () => {
    loadForm();
    
    document.getElementById("add-question").addEventListener("click", () => {
        document.getElementById("question-popup").classList.remove("hidden");
    });

    document.getElementById("close-popup").addEventListener("click", () => {
        document.getElementById("question-popup").classList.add("hidden");
    });

    document.querySelectorAll("#question-popup button[data-type]").forEach(button => {
        button.addEventListener("click", () => {
            addQuestion(button.getAttribute("data-type"));
            document.getElementById("question-popup").classList.add("hidden");
        });
    });

    document.getElementById("save-form").addEventListener("click", saveForm);

    document.getElementById("form-fields").addEventListener("click", (event) => {
        if (event.target.classList.contains("add-option")) {
            addOption(event.target);
        }
    });
});

function addQuestion(type) {
    const formFields = document.getElementById("form-fields");
    let newField = "";

    switch (type) {
        case "text":
            newField = `
                <div class="form-group" data-type="text">
                    <label contenteditable="true">New Text Entry</label>
                    <input type="text" placeholder="Enter text here...">
                </div>`;
            break;
        case "multiple-choice":
            newField = `
                <div class="form-group" data-type="multiple-choice">
                    <label contenteditable="true">New Multiple Choice</label>
                    <div class="options">
                        <label><input type="radio" name="new-choice"> <span contenteditable="true">Option 1</span></label>
                    </div>
                    <button class="add-option">+ Add Option</button>
                </div>`;
            break;
        case "date":
            newField = `
                <div class="form-group" data-type="date">
                    <label contenteditable="true">New Date Selection</label>
                    <input type="date">
                </div>`;
            break;
        case "checklist":
            newField = `
                <div class="form-group" data-type="checklist">
                    <label contenteditable="true">New Checklist</label>
                    <div class="options">
                        <label><input type="checkbox"> <span contenteditable="true">Item 1</span></label>
                    </div>
                    <button class="add-option">+ Add Item</button>
                </div>`;
            break;
    }

    formFields.insertAdjacentHTML("beforeend", newField);
}

function addOption(button) {
    const parent = button.previousElementSibling;
    const isMultipleChoice = parent.parentElement.getAttribute("data-type") === "multiple-choice";

    const newOption = document.createElement("label");
    newOption.innerHTML = `<input type="${isMultipleChoice ? "radio" : "checkbox"}" name="choice"> <span contenteditable="true">New Option</span>`;
    parent.appendChild(newOption);
}

function saveForm() {
    const formContent = document.querySelector(".form-container").innerHTML;
    localStorage.setItem("savedForm", formContent);
    alert("Form saved!");
}

function loadForm() {
    const savedForm = localStorage.getItem("savedForm");
    if (savedForm) {
        document.querySelector(".form-container").innerHTML = savedForm;
    }
}
