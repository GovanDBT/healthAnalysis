// access elements
const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const SearchConditionBtn = document.getElementById('btnSearch');

// array of objects
const patients = [];

// event handlers
addPatientButton.addEventListener("click", addPatient); // add patient
SearchConditionBtn.addEventListener("click", searchCondition); // search condition

// add new patient
function addPatient() {
    const name = document.getElementById('name').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById('age').value;
    const condition = document.getElementById('condition').value;

    if (!name) {
        alert('Please fill in the patients name!');
    } else if (!gender) {
        alert('Please select the patients gender!');
    } else if (!age) {
        alert('Please fill in the patients age!');
    } else if (!condition) {
        alert('Please select the patients condition!');
    } else {
        patients.push({name, gender: gender.value, age, condition});
        resetForm();
        generateReport();
    }
}

// reset add patient form
function resetForm() {
    document.getElementById('name').value = "";
    document.querySelector('input[name="gender"]').checked = false;
    document.getElementById('age').value = "";
    document.getElementById('condition').value = "";
}

// display conditions report
function generateReport() {
    const numPatients = patients.length;

    const conditionsCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0
    }

    const genderConditionsCount = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            "High Blood Pressure": 0
        }
    }

    for (const patient of patients) {
        conditionsCount[patient.condition]++;
        genderConditionsCount[patient.gender][patient.condition]++;
    }

    report.innerHTML = `Number of Patients: ${numPatients}<br><br>`;
    report.innerHTML += `Conditions Breakdown:<br>`
    for (const condition in conditionsCount) {
        report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`
    }

    report.innerHTML += `<br>Gender-Based Conditions Breakdown:<br>`
    for (const gender in genderConditionsCount) {
        report.innerHTML += `${gender}: <br>`;
        for (const condition in genderConditionsCount[gender]) {
            report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`
        }
    }
}

// search condition
function searchCondition() {
    // access search result
    const searchResult = document.getElementById('conditionInput').value.toLowerCase();
    // access result container
    const resultDiv = document.getElementById('result');
    // clear result container
    resultDiv.innerHTML = "";

    // fetch results from server
    fetch('../health_analysis.json')
        .then(response => response.json())
        .then(data => {
            const condition = data.conditions.find(item => item.name.toLowerCase() === searchResult);

            if (condition) {
                const symptoms = condition.symptoms.join(', ');
                const prevention = condition.prevention.join(', ');
                const treatment = condition.treatment;

                resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
			    resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;

                resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
                resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
                resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
            } else  {
                resultDiv.innerHTML = 'Condition not found.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
			resultDiv.innerHTML = 'An error occurred while fetching data.';
        })
}
