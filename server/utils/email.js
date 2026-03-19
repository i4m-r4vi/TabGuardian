const { Resend } = require('resend');

const sendProofAlert = async (parentEmail, userName, tabletName, imageUrl) => {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing');
    return;
  }
  
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: 'TabGuardian <onboarding@resend.dev>',
      to: [parentEmail],
      subject: `✅ Medicine Taken: ${userName} - ${tabletName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px;">
          <h2 style="color: #2563eb; margin-bottom: 8px;">Medicine Proof Submitted</h2>
          <p style="font-size: 16px; color: #374151;">
            Hello, this is an automated alert from <strong>TabGuardian</strong>.
          </p>
          <p style="font-size: 16px; color: #374151;">
            <strong>${userName}</strong> has successfully taken their medicine: <strong>${tabletName}</strong>.
          </p>
          <div style="margin: 24px 0; text-align: center;">
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">Proof Image:</p>
            <img src="${imageUrl}" alt="Medicine Proof" style="max-width: 100%; border-radius: 12px; border: 4px solid #f3f4f6;" />
          </div>
          <p style="font-size: 14px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 16px; margin-top: 24px;">
            This is an automated notification. No reply is needed.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error({ error });
      return;
    }

    console.log(`Alert email sent to ${parentEmail}`, data);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

const sendHistoryReport = async (parentEmail, userName, logs) => {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const tableRows = logs.map(log => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">${log.tabletName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #f3f4f6;">${log.date}</td>
      <td style="padding: 12px; border-bottom: 1px solid #f3f4f6; color: #059669; font-weight: bold;">Taken</td>
    </tr>
  `).join('');

  try {
    const { data, error } = await resend.emails.send({
      from: 'TabGuardian <onboarding@resend.dev>',
      to: [parentEmail],
      subject: `📜 Medication History Report: ${userName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px;">
          <h2 style="color: #2563eb; margin-bottom: 8px;">Medication History Report</h2>
          <p style="font-size: 16px; color: #374151;">
            Hello, this is a summary of all medications taken by <strong>${userName}</strong>.
          </p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
            <thead>
              <tr style="background-color: #f9fafb; text-align: left;">
                <th style="padding: 12px; border-bottom: 2px solid #e5e7eb;">Medicine</th>
                <th style="padding: 12px; border-bottom: 2px solid #e5e7eb;">Date</th>
                <th style="padding: 12px; border-bottom: 2px solid #e5e7eb;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <p style="font-size: 14px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 16px; margin-top: 24px;">
            This record has been archived and cleared from the active history.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error({ error });
      return;
    }

    console.log(`History report sent to ${parentEmail}`, data);
  } catch (err) {
    console.error('Error sending history report:', err);
  }
};

module.exports = { sendProofAlert, sendHistoryReport };
