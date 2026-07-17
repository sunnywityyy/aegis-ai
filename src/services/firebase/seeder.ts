import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"

export async function ensureDatabaseSeeded() {
  try {
    // 1. Audit recommendations
    const recsCol = collection(db, "recommendations")
    const recsSnap = await getDocs(recsCol)
    if (recsSnap.empty) {
      await addDoc(recsCol, {
        volunteerId: "demo-volunteer-1",
        matchId: "demo-match-1",
        action: "Deploy Spanish Priority Staff to Gate C",
        reason: "Bilingual assistance request spike detected via local mobile feedback loop.",
        priority: "high",
        confidence: 96,
        expectedImpact: "Ingress load reduced by 15%",
        aiModel: "Groq Llama-3.1-8b-instant",
        latency: 120,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      console.log("Auto-seeded empty 'recommendations' collection.")
    }

    // 2. Audit incidents
    const incsCol = collection(db, "incidents")
    const incsSnap = await getDocs(incsCol)
    if (incsSnap.empty) {
      await addDoc(incsCol, {
        title: "Crowd Surge at Gate C",
        description: "Significant crowd density build-up near southeast turnstiles.",
        location: "Gate C (East Entrance)",
        severity: "high",
        status: "open",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      console.log("Auto-seeded empty 'incidents' collection.")
    }

    // 3. Audit incident_logs
    const logsCol = collection(db, "incident_logs")
    const logsSnap = await getDocs(logsCol)
    if (logsSnap.empty) {
      await addDoc(logsCol, {
        volunteerId: "demo-volunteer-1",
        matchId: "demo-match-1",
        latency: 145,
        incident: "Gate C crowd build-up near turnstile 4",
        status: "open",
        response: {
          severity: "high",
          incidentType: "Crowd Surge",
          summary: "Significant crowd density build-up near southeast turnstiles.",
          rootCause: "Turnstile checkpoint throughput bottlenecks combined with high cluster arrivals.",
          immediateActions: [
            "Direct volunteers to guide overflow to Gate D paths.",
            "Open side ingress gate channels.",
            "Summon auxiliary Spanish-speaking volunteers."
          ],
          volunteerDeploymentPlan: "Deploy 4 Crowd Management Coordinators, Assign 2 Turnstile Assistance Volunteers",
          publicAnnouncements: {
            en: "Attention MetLife Stadium guests near Gate C: We are experiencing heavy entry volume. Please use adjacent turnstiles to ensure smooth ingress. Thank you.",
            hi: "गेट सी के पास मेटलाइफ़ स्टेडियम के मेहमानों के लिए ध्यान दें: हम भारी प्रवेश मात्रा का अनुभव कर रहे हैं। सुचारू प्रवेश सुनिश्चित करने के लिए कृपया बगल के टर्नस्टाइल का उपयोग करें। धन्यवाद।",
            es: "Atención a los espectadores del MetLife Stadium cerca de la Puerta C: Estamos experimentando un alto volumen de entrada. Utilice los torniquetes adyacentes para un ingreso fluido. Gracias.",
            fr: "Attention aux spectateurs du MetLife Stadium près de la Porte C: Nous connaissons un fort volume d'entrées. Veuillez utiliser les tourniquets adjacents pour une entrée fluide. Merci.",
            pt: "Atenção aos espectadores do MetLife Stadium perto do Portão C: Estamos enfrentando um alto volume de entrada. Use as catracas adjacentes para garantir uma entrada tranquila. Obrigado.",
            ar: "انتباه لزوار ملعب ميتلايف بالقرب من البوابة C: نشهد حجم دخول كثيف. يرجى استخدام الحواجز الدوارة المجاورة لضمان دخول سلس. شكرا لكم."
          },
          riskAssessment: "HIGH RISK: Queue delays exceeding 12 minutes if unchecked. Turnstile lane backups likely.",
          estimatedResolutionTime: "15 - 20 mins",
          confidence: 94
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      console.log("Auto-seeded empty 'incident_logs' collection.")
    }
  } catch (error) {
    console.error("Failed to run database seeder checks:", error)
  }
}
