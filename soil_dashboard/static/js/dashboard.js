// static/js/dashboard.js

document.addEventListener("DOMContentLoaded", function () {
  const latestSection = document.getElementById("latest-section");
  const batchSection = document.getElementById("batch-section");
  const btnLatest = document.getElementById("btn-latest");
  const btnBatch = document.getElementById("btn-batch");
  const btnRefreshBatch = document.getElementById("btn-refresh-batch");

  // Charts instances
  let latestChart = null;
  let batchChart = null;

  // Show Latest Section, hide Batch
  btnLatest.addEventListener("click", () => {
    latestSection.classList.remove("d-none");
    batchSection.classList.add("d-none");
  });

  // Show Batch Section, hide Latest
  btnBatch.addEventListener("click", () => {
    batchSection.classList.remove("d-none");
    latestSection.classList.add("d-none");
    fetchBatchData();
  });

  // On first load: show latest
  fetchLatestSample();

  // Refresh batch data on button click
  btnRefreshBatch.addEventListener("click", fetchBatchData);

  // -------------------------------
  // Fetch & Display Latest Sample
  // -------------------------------
  function fetchLatestSample() {
    fetch("/api/predictions")
      .then((resp) => resp.json())
      .then((data) => {
        displayLatest(data);
      })
      .catch((err) => {
        console.error("Error fetching latest sample:", err);
      });
  }

  function displayLatest(data) {
    const crop = data.input["Crop_inter"];
    const label = data.prediction.fertilizer_label;
    const rate = data.prediction.rate_kg_ha;

    document.getElementById("latest-crop").innerText = crop;
    document.getElementById("latest-label").innerText = label;
    document.getElementById("latest-rate").innerText = rate;

    // Simulate split of N/P/K for the doughnut:
    // If label contains “NPK”, split equally; if “Add_Urea”, show N portion; etc.
    let nutrientData = [0, 0, 0];
    const colors = ["#FF6384", "#36A2EB", "#FFCE56"]; // N / P / K colors
    if (label === "Add_NPK_17_17_17") {
      nutrientData = [1, 1, 1];
    } else if (label === "Add_Urea") {
      nutrientData = [1, 0, 0];
    } else if (label === "Add_SSP") {
      nutrientData = [0, 1, 0];
    } else if (label === "Add_Potash") {
      nutrientData = [0, 0, 1];
    } else if (label === "Add_NK") {
      nutrientData = [1, 0, 1];
    } else if (label === "Add_DAP") {
      nutrientData = [1, 1, 0];
    } else {
      nutrientData = [0, 0, 0];
    }

    drawLatestChart(nutrientData);
  }

  function drawLatestChart(dataArray) {
    const ctx = document.getElementById("chart-latest").getContext("2d");
    // Destroy previous chart if exists
    if (latestChart) latestChart.destroy();

    latestChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)"],
        datasets: [
          {
            data: dataArray,
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: "N / P / K Split for Recommended Fertilizer",
          },
        },
      },
    });
  }

  // -------------------------------------
  // Fetch & Display Batch Predictions
  // -------------------------------------
  function fetchBatchData() {
    fetch("/api/predictions?mode=batch")
      .then((resp) => resp.json())
      .then((data) => {
        displayBatchTable(data);
        drawBatchChart(data);
      })
      .catch((err) => {
        console.error("Error fetching batch data:", err);
      });
  }

  function displayBatchTable(data) {
    const tbody = document.querySelector("#table-batch tbody");
    tbody.innerHTML = ""; // clear existing

    data.forEach((row, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${row.Crop_inter}</td>
        <td>${row.True_Label}</td>
        <td>${row.Pred_Label}</td>
        <td>${row.Rate_kg_ha}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function drawBatchChart(data) {
    // Count frequency of Pred_Label
    const counts = {};
    data.forEach((row) => {
      counts[row.Pred_Label] = (counts[row.Pred_Label] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const values = labels.map((lab) => counts[lab]);

    const ctx = document.getElementById("chart-batch").getContext("2d");
    if (batchChart) batchChart.destroy();

    batchChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "# of Predictions",
            data: values,
            backgroundColor: "#36A2EB",
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Distribution of Predicted Fertilizer Labels",
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { precision: 0 },
          },
        },
      },
    });
  }
});
