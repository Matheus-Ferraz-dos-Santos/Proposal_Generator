async function generateProposal() {
    const status = document.getElementById("status");
    status.innerText = "Gathering data...";

    // 1. Call Deluge to get the pre-calculated JSON
    const funcResponse = await ZOHO.CRM.FUNCTIONS.execute("get_proposal_data_json", {
        "dealId": gDealId 
    });
    
    const dealData = JSON.parse(funcResponse.details.output);

    status.innerText = "Generating PDF Engine...";

    // 2. POST the JSON to your Vercel URL
    const vercelUrl = "https://your-project.vercel.app/api/generate";
    
    const pdfResponse = await fetch(vercelUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealData)
    });

    if (pdfResponse.ok) {
        const blob = await pdfResponse.blob();
        // 3. Upload the Blob back to Zoho CRM
        await uploadToZoho(blob);
        status.innerText = "✅ Proposal attached to Deal!";
    }
}