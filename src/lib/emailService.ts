
import { TeamRegistration } from '@/types/igc';
import { supabase } from '@/integrations/supabase/client';
import { getSettings } from './settings';

// Interface for email request
interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Sends an email using Supabase Edge Functions
 * Note: Requires setting up a Supabase Edge Function for email sending
 */
export const sendEmail = async (emailRequest: EmailRequest): Promise<boolean> => {
  try {
    const { to, subject, html, from } = emailRequest;
    
    // Call the Supabase Edge Function for sending emails
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to,
        subject,
        html,
        from: from || 'IGC 2025 <no-reply@igc2025.org>'
      }
    });
    
    if (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      return false;
    }
    
    console.log(`Email envoyé avec succès à ${to}`);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return false;
  }
};

/**
 * Sends a registration confirmation email to a team
 */
export const sendRegistrationConfirmation = async (team: TeamRegistration): Promise<boolean> => {
  const settings = getSettings();
  const recipientEmail = team.generalInfo.pedagogicalReferentEmail || "";
  
  if (!recipientEmail) {
    console.error("Impossible d'envoyer l'email de confirmation: aucune adresse email fournie");
    return false;
  }
  
  const teamName = team.generalInfo.name;
  const category = team.generalInfo.category;
  const year = settings.applicationYear;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'TT Firs Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          background-color: #1b1464;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
        }
        .footer {
          font-size: 12px;
          text-align: center;
          margin-top: 20px;
          color: #666;
        }
        .highlight {
          font-weight: bold;
          color: #96005d;
        }
        .button {
          display: inline-block;
          background-color: #1b1464;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>International Genius Challenge ${year}</h2>
      </div>
      <div class="content">
        <p>Bonjour,</p>
        <p>Nous avons bien reçu l'inscription de votre équipe <span class="highlight">${teamName}</span> dans la catégorie <span class="highlight">${category}</span> à l'International Genius Challenge ${year}.</p>
        
        <p>Votre inscription a été enregistrée avec succès. Voici les prochaines étapes:</p>
        <ol>
          <li>Vous recevrez prochainement un QCM pour évaluer les connaissances de votre équipe</li>
          <li>Si votre équipe est qualifiée, vous serez invités à un entretien</li>
          <li>La sélection finale sera annoncée après les entretiens</li>
        </ol>
        
        <p>Pour toute question, n'hésitez pas à nous contacter à <a href="mailto:contact@igc2025.org">contact@igc2025.org</a>.</p>
        
        <p>Bonne chance à toute votre équipe !</p>
        
        <a href="https://igc2025.org/guide" class="button">Consulter le guide de l'IGC ${year}</a>
      </div>
      <div class="footer">
        <p>© ${year} International Genius Challenge - Tous droits réservés</p>
        <p>Ce message est envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({
    to: recipientEmail,
    subject: `Confirmation d'inscription - IGC ${year} - Équipe ${teamName}`,
    html
  });
};

/**
 * Sends an interview invitation email to a team
 */
export const sendInterviewInvitation = async (team: TeamRegistration): Promise<boolean> => {
  const settings = getSettings();
  const recipientEmail = team.generalInfo.pedagogicalReferentEmail || "";
  
  if (!recipientEmail) {
    console.error("Impossible d'envoyer l'invitation à l'entretien: aucune adresse email fournie");
    return false;
  }
  
  if (!team.interviewDate || !team.interviewTime || !team.interviewLink) {
    console.error("Impossible d'envoyer l'invitation à l'entretien: informations manquantes (date, heure ou lien)");
    return false;
  }
  
  const teamName = team.generalInfo.name;
  const category = team.generalInfo.category;
  const year = settings.applicationYear;
  const interviewDate = team.interviewDate;
  const interviewTime = team.interviewTime;
  const interviewLink = team.interviewLink;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'TT Firs Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          background-color: #1b1464;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
        }
        .footer {
          font-size: 12px;
          text-align: center;
          margin-top: 20px;
          color: #666;
        }
        .highlight {
          font-weight: bold;
          color: #96005d;
        }
        .interview-details {
          background-color: #e9e9f5;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background-color: #1b1464;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Invitation à l'Entretien - IGC ${year}</h2>
      </div>
      <div class="content">
        <p>Bonjour,</p>
        <p>Félicitations ! Votre équipe <span class="highlight">${teamName}</span> a été qualifiée pour l'entretien de l'International Genius Challenge ${year} dans la catégorie <span class="highlight">${category}</span>.</p>
        
        <div class="interview-details">
          <h3>Détails de l'entretien:</h3>
          <p><strong>Date:</strong> ${interviewDate}</p>
          <p><strong>Heure:</strong> ${interviewTime}</p>
          <p><strong>Lien Google Meet:</strong> <a href="${interviewLink}">${interviewLink}</a></p>
        </div>
        
        <p>Conseils pour l'entretien:</p>
        <ul>
          <li>Tous les membres de l'équipe doivent être présents</li>
          <li>Préparez-vous à présenter votre projet et à répondre aux questions</li>
          <li>Assurez-vous d'avoir une bonne connexion internet</li>
          <li>Connectez-vous 5 minutes avant l'heure prévue</li>
        </ul>
        
        <p>Pour toute question ou si vous avez besoin de modifier la date/heure, contactez-nous à <a href="mailto:entretiens@igc2025.org">entretiens@igc2025.org</a>.</p>
        
        <p>Nous avons hâte de vous rencontrer et d'en apprendre davantage sur votre équipe !</p>
        
        <a href="${interviewLink}" class="button">Rejoindre l'entretien</a>
      </div>
      <div class="footer">
        <p>© ${year} International Genius Challenge - Tous droits réservés</p>
        <p>Ce message est envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({
    to: recipientEmail,
    subject: `Invitation à l'entretien - IGC ${year} - Équipe ${teamName}`,
    html
  });
};

/**
 * Sends a decision notification email to a team
 */
export const sendDecisionNotification = async (team: TeamRegistration): Promise<boolean> => {
  const settings = getSettings();
  const recipientEmail = team.generalInfo.pedagogicalReferentEmail || "";
  
  if (!recipientEmail) {
    console.error("Impossible d'envoyer la notification de décision: aucune adresse email fournie");
    return false;
  }
  
  if (!team.decision) {
    console.error("Impossible d'envoyer la notification de décision: décision non définie");
    return false;
  }
  
  const teamName = team.generalInfo.name;
  const category = team.generalInfo.category;
  const year = settings.applicationYear;
  const isSelected = team.decision === 'Sélectionné';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'TT Firs Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          background-color: ${isSelected ? '#4CAF50' : '#1b1464'};
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
        }
        .footer {
          font-size: 12px;
          text-align: center;
          margin-top: 20px;
          color: #666;
        }
        .highlight {
          font-weight: bold;
          color: ${isSelected ? '#4CAF50' : '#96005d'};
        }
        .button {
          display: inline-block;
          background-color: ${isSelected ? '#4CAF50' : '#1b1464'};
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>${isSelected ? 'Félicitations' : 'Résultats'} - IGC ${year}</h2>
      </div>
      <div class="content">
        <p>Bonjour,</p>
        
        ${isSelected ? `
        <p>Nous sommes ravis de vous informer que votre équipe <span class="highlight">${teamName}</span> a été sélectionnée pour participer à l'International Genius Challenge ${year} dans la catégorie <span class="highlight">${category}</span> !</p>
        
        <p>Vous recevrez prochainement plus d'informations concernant:</p>
        <ul>
          <li>Le calendrier détaillé de la compétition</li>
          <li>Les consignes techniques</li>
          <li>Les ressources mises à votre disposition</li>
          <li>La logistique (hébergement, transport, etc.)</li>
        </ul>
        
        <p>Vous pouvez d'ores et déjà commencer à préparer votre équipe. Des documents sont disponibles sur notre site web.</p>
        
        <p>Nous vous félicitons pour cette sélection et avons hâte de vous voir à l'œuvre !</p>
        ` : `
        <p>Nous vous remercions pour votre participation au processus de sélection de l'International Genius Challenge ${year}.</p>
        
        <p>Après examen attentif de toutes les candidatures, nous sommes au regret de vous informer que votre équipe <span class="highlight">${teamName}</span> n'a pas été retenue pour cette édition.</p>
        
        <p>La compétition a été particulièrement relevée cette année, et nous avons dû faire des choix difficiles. Nous vous encourageons vivement à participer de nouveau à la prochaine édition.</p>
        
        <p>Si vous souhaitez recevoir des commentaires plus détaillés sur votre candidature, n'hésitez pas à nous contacter.</p>
        
        <p>Nous vous remercions sincèrement pour votre intérêt envers l'IGC et vous souhaitons beaucoup de succès dans vos futurs projets.</p>
        `}
        
        <a href="https://igc2025.org" class="button">Visiter le site de l'IGC</a>
      </div>
      <div class="footer">
        <p>© ${year} International Genius Challenge - Tous droits réservés</p>
        <p>Ce message est envoyé automatiquement, merci de ne pas y répondre.</p>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({
    to: recipientEmail,
    subject: `${isSelected ? 'Félicitations' : 'Résultats'} - IGC ${year} - Équipe ${teamName}`,
    html
  });
};
