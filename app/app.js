async function generateProposal() {
    const status = document.getElementById("status");
    status.innerText = "Gathering data...";

    // Inside your Widget's generate button function:
const funcRes = await ZOHO.CRM.FUNCTIONS.execute("get_proposal_data_json", {
    "dealId": gDealId 
});

// funcRes.details.output is the string returned by your Deluge function
const dealData = JSON.parse(funcRes.details.output);

// Now send it to Vercel
const response = await fetch("https://proposal-generator-lovat.vercel.app/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dealData)
});

    if (pdfResponse.ok) {
        const blob = await pdfResponse.blob();
        // 3. Upload the Blob back to Zoho CRM
        await uploadToZoho(blob);
        status.innerText = "✅ Proposal attached to Deal!";
    }
}