document.addEventListener("DOMContentLoaded", () => {
  console.log("🔧 dashboard.js has loaded and is running!");

  // Theme toggle (dark/light)
  const themeToggleBtn = document.getElementById("themeToggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      document.body.classList.toggle("light-mode");
      themeToggleBtn.textContent = document.body.classList.contains("dark-mode")
        ? "☀️"
        : "🌙";
    });
  }

  // Predict form submission (AJAX)
  const predictForm = document.getElementById("predictForm");
  if (predictForm) {
    predictForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(predictForm);
      const payload = {
        phosphorus: formData.get("phosphorus"),
        k: formData.get("k"),
        tn: formData.get("tn"),
        oc: formData.get("oc"),
        cec: formData.get("cec"),
        sand: formData.get("sand"),
        silt: formData.get("silt"),
        clay: formData.get("clay"),
        map: formData.get("map"),
        elevation: formData.get("elevation"),
        crop: formData.get("crop")
      };

      // Disable button while predicting
      const btn = document.getElementById("predictBtn");
      btn.disabled = true;
      btn.textContent = "🔄 Loading…";

      try {
        const resp = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const result = await resp.json();
        if (resp.ok) {
          // Show result section
          document.getElementById("resultSection").classList.remove("d-none");
          document.getElementById("fertLabel").textContent = `Fertilizer: ${result.fertilizer}`;
          document.getElementById("fertRate").textContent = `Rate (kg/ha): ${result.rate}`;

          // Render a simple bar chart of the input vs. predicted quantity
          const ctx = document.getElementById("fertChart").getContext("2d");
          if (window.fertBarChart) {
            window.fertBarChart.destroy();
          }
          window.fertBarChart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: ["Recommended Rate (kg/ha)"],
              datasets: [
                {
                  label: result.fertilizer,
                  data: [result.rate],
                  backgroundColor: "#28a745",
                  borderColor: "#1e7e34",
                  borderWidth: 1
                }
              ]
            },
            options: {
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "kg/ha" }
                }
              }
            }
          });
        } else {
          alert("Error: " + result.error);
        }
      } catch (err) {
        console.error("❌ Error fetching prediction:", err);
        alert("Unable to get prediction at this time.");
      } finally {
        btn.disabled = false;
        btn.textContent = "🌱 Predict Fertilizer";
      }
    });
  }

  // Batch table refresh
  const refreshBatchBtn = document.getElementById("refreshBatchBtn");
  if (refreshBatchBtn) {
    refreshBatchBtn.addEventListener("click", async () => {
      refreshBatchBtn.disabled = true;
      refreshBatchBtn.textContent = "🔄 Loading…";

      try {
        const resp = await fetch("/api/batch");
        const result = await resp.json();
        if (resp.ok) {
          const tbody = document.querySelector("#batchTable tbody");
          tbody.innerHTML = "";
          if (result.batch.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="5" class="text-center">No batch data available.</td>`;
            tbody.appendChild(row);
          } else {
            result.batch.forEach((item, idx) => {
              const tr = document.createElement("tr");
              tr.innerHTML = `
                <td>${idx + 1}</td>
                <td>${item.Crop_inter}</td>
                <td>${item.True_Label}</td>
                <td>${item.Pred_Label}</td>
                <td>${item["Rate(kg/ha)"]}</td>
              `;
              tbody.appendChild(tr);
            });
          }
        } else {
          alert("Error loading batch data.");
        }
      } catch (err) {
        console.error("❌ Error fetching batch:", err);
        alert("Unable to load batch at this time.");
      } finally {
        refreshBatchBtn.disabled = false;
        refreshBatchBtn.textContent = "🔄 Refresh Batch Data";
      }
    });
  }
});
