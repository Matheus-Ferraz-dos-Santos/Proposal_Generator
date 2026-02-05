import { Document, Page, Text, View, StyleSheet, Image, renderToStream } from '@react-pdf/renderer';

// --- STEP 1: DEFINE STYLES (Your CSS) ---
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  headerBand: {
    height: 12,
    backgroundColor: '#82C341',
    width: '100%',
  },
  mainContent: {
    padding: 60,
    flexGrow: 1,
  },
  titleBox: {
    backgroundColor: '#FFF9E9',
    padding: 15,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  dealTitle: {
    color: '#82C341',
    fontSize: 48,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    color: '#444',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  subLabel: {
    backgroundColor: '#FFF9E9',
    color: '#82C341',
    padding: 10,
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  footerArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 40,
  },
  dateText: {
    color: '#666',
    fontSize: 16,
  },
  logo: {
    width: 150,
  }
});

// --- STEP 2: THE COMPONENT (The Design) ---
// This is what I referred to as the "React-PDF Component"
const ProposalDocument = ({ data }) => (
  <Document>
    {/* SLIDE 1: COVER */}
    <Page size="LETTER" orientation="landscape" style={styles.page}>
      <View style={styles.headerBand} />
      
      <View style={styles.mainContent}>
        <View style={styles.titleBox}>
          <Text style={styles.dealTitle}>{data.dealName || "Proposal"}</Text>
        </View>
        
        <Text style={styles.label}>PROPOSAL TO</Text>
        <View style={styles.subLabel}>
          <Text>{data.propertyName || "Your Property"}</Text>
        </View>
      </View>

      <View style={styles.footerArea}>
        <Text style={styles.dateText}>{data.date || "February 2026"}</Text>
        <Image 
            style={styles.logo} 
            src="https://i.postimg.cc/VsJKRFmj/Image-in-slide-1-of-Proposal-Template.jpg" 
        />
      </View>
    </Page>
    
    {/* You can add Slide 2 (Plans) and Slide 3 (Phase-in) here later */}
  </Document>
);

// --- STEP 3: THE HANDLER (The Engine) ---
export default async function handler(req, res) {
  // Only allow POST requests from our Zoho Widget
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dealData = req.body;
    
    // Convert the React Component into a PDF Stream
    const stream = await renderToStream(<ProposalDocument data={dealData} />);
    
    // Tell the browser/Zoho it's a PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=proposal.pdf');

    // Send the PDF back
    stream.pipe(res);
  } catch (error) {
    console.error("PDF Error:", error);
    res.status(500).json({ error: 'Generation Failed' });
  }
}