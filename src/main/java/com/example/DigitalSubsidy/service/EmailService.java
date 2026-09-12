package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.ComplianceMilestone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    public void sendPaymentDisbursedEmail(
            String toEmail,
            String userName,
            String schemeName,
            Integer installmentNumber,
            Double amount
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Subsidy Installment Payment Disbursed Successfully"
        );

        message.setText(
                "Dear " + userName + ",\n\n" +

                        "Your subsidy installment payment has been successfully disbursed.\n\n" +

                        "Scheme: " + schemeName + "\n" +
                        "Installment: " + installmentNumber + "\n" +
                        "Amount: ₹" + amount + "\n" +
                        "Payment Status: DISBURSED\n\n" +

                        "The payment has been processed to your verified bank account.\n\n" +

                        "Thank you,\n" +
                        "Digital Subsidy Platform"
        );

        try {

            mailSender.send(message);

            System.out.println(
                    "PAYMENT EMAIL SENT SUCCESSFULLY"
            );

        } catch (Exception e) {

            System.out.println(
                    "PAYMENT EMAIL FAILED"
            );

            e.printStackTrace();

        }
    }

    public void sendBankDetailsRequiredEmail(
            String toEmail,
            String userName,
            String schemeName
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Bank Details Required for Subsidy Disbursement"
        );

        message.setText(
                "Dear " + userName + ",\n\n" +

                        "Congratulations! Your subsidy application has been approved.\n\n" +

                        "Scheme: " + schemeName + "\n" +
                        "Application Status: APPROVED\n\n" +

                        "To proceed with your subsidy payment, please log in to the " +
                        "Digital Subsidy Platform and submit your bank details.\n\n" +

                        "Your bank details will be verified before the subsidy amount is disbursed.\n\n" +

                        "Thank you,\n" +
                        "Digital Subsidy Platform"
        );

        mailSender.send(message);
    }
    public void sendDocumentSubmittedEmail(
            String toEmail,
            String userName,
            String schemeName,
            String documentType
    ) {

        System.out.println("================================");
        System.out.println("SENDING DOCUMENT EMAIL");
        System.out.println("TO: " + toEmail);
        System.out.println("USER: " + userName);
        System.out.println("SCHEME: " + schemeName);
        System.out.println("================================");

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Document Submitted Successfully"
        );

        message.setText(
                "Dear " + userName + ",\n\n" +
                        "Your document has been submitted successfully.\n\n" +
                        "Scheme: " + schemeName + "\n" +
                        "Document: " + documentType + "\n" +
                        "Status: PENDING VERIFICATION\n\n" +
                        "Your document will be reviewed and verified by the officer. " +
                        "You will be notified once the verification process is completed.\n\n" +
                        "Thank you,\n" +
                        "Digital Subsidy Platform"
        );

        mailSender.send(message);

        System.out.println(
                "DOCUMENT EMAIL SENT SUCCESSFULLY"
        );
    }
    public void sendApplicationRejectedEmail(
            String toEmail,
            String userName,
            String schemeName,
            String reason
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Your Subsidy Application Has Been Rejected"
        );

        message.setText(
                "Dear " + userName + ",\n\n" +

                        "We regret to inform you that your subsidy application has been rejected.\n\n" +

                        "Scheme: " + schemeName + "\n" +
                        "Application Status: REJECTED\n\n" +

                        "Reason: " + reason + "\n\n" +

                        "Please review the reason provided. You may apply again for the scheme if you meet the eligibility requirements.\n\n" +

                        "Thank you,\n" +
                        "Digital Subsidy Platform"
        );

        mailSender.send(message);
    }
    public void sendApplicationWithdrawnEmail(
            String toEmail,
            String userName,
            String schemeName
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Your Subsidy Application Has Been Withdrawn"
        );

        message.setText(
                "Dear " + userName + ",\n\n" +

                        "Your subsidy application has been successfully withdrawn.\n\n" +

                        "Scheme: " + schemeName + "\n" +
                        "Application Status: WITHDRAWN\n\n" +

                        "You can apply again for the scheme if you meet the eligibility requirements and the scheme is still active.\n\n" +

                        "Thank you,\n" +
                        "Digital Subsidy Platform"
        );

        mailSender.send(message);
    }
    public void sendBankDetailsRejectedEmail(
            String toEmail,
            String userName,
            String reason
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Bank Details Rejected - Resubmission Required"
        );

        message.setText(
                "Dear " + userName + ",\n\n" +

                        "Your submitted bank details could not be verified.\n\n" +

                        "Status: REJECTED\n" +
                        "Reason: " + reason + "\n\n" +

                        "Please log in to the Digital Subsidy Platform, " +
                        "correct your bank details, and submit them again.\n\n" +

                        "Thank you,\n" +
                        "Digital Subsidy Platform"
        );

        mailSender.send(message);
    }
    public void sendBankDetailsVerifiedEmail(
            String toEmail,
            String userName,
            String schemeName
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Bank Details Verified Successfully"
        );

        message.setText(
                "Dear " + userName + ",\n\n" +

                        "Your bank details have been successfully verified.\n\n" +

                        "Scheme: " + schemeName + "\n" +
                        "Bank Details Status: VERIFIED\n\n" +

                        "Your verified bank details are now ready for " +
                        "the subsidy disbursement process.\n\n" +

                        "Thank you,\n" +
                        "Digital Subsidy Platform"
        );

        mailSender.send(message);
    }

    public void sendUtilizationProofRejectedEmail(
            String toEmail,
            String userName,
            String reason
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Utilization Proof Rejected - Resubmission Required"
        );

        message.setText(
                "Dear " + userName + ",\n\n" +

                        "Your utilization proof has been reviewed and rejected.\n\n" +

                        "Status: REJECTED\n" +

                        "Reason: " + reason + "\n\n" +

                        "Please log in to the Digital Subsidy Platform, " +
                        "correct the issue, and resubmit your utilization proof.\n\n" +

                        "Thank you,\n" +
                        "Digital Subsidy Platform"
        );

        mailSender.send(message);
    }
    public void sendUtilizationProofReminderEmail(
            String toEmail,
            String userName,
            String schemeName,
            Integer installmentNumber,
            LocalDate dueDate,
            long daysRemaining
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Reminder: Utilization Proof Submission Required"
        );

        message.setText(
                "Dear " + userName + ",\n\n" +

                        "This is a reminder to submit your utilization proof.\n\n" +

                        "Scheme: " + schemeName + "\n" +
                        "Installment: " + installmentNumber + "\n" +
                        "Due Date: " + dueDate + "\n" +
                        "Days Remaining: " + daysRemaining + "\n\n" +

                        "Please log in to the Digital Subsidy Platform " +
                        "and submit your utilization proof before the due date.\n\n" +

                        "Thank you,\n" +
                        "Digital Subsidy Platform"
        );

        mailSender.send(message);
    }
    public void sendOverdueMilestoneEmail(String email, ComplianceMilestone milestone) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Compliance Milestone Overdue");
        message.setText(
                "Dear Beneficiary,\n\n" +
                        "Your compliance milestone is overdue.\n\n" +
                        "Milestone: " + milestone.getMilestoneName() + "\n" +
                        "Due Date: " + milestone.getDueDate() + "\n" +
                        "Status: OVERDUE\n\n" +
                        "Please submit the required utilization proof as soon as possible.\n\n" +
                        "Regards,\n" +
                        "Digital Subsidy Team"
        );

        mailSender.send(message);
    }
    public void sendDistrictApprovedEmail(
            String toEmail,
            String userName,
            String schemeName
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Application Approved by District Officer"
        );

        message.setText(
                "Dear " + userName + ",\n\n" +

                        "Your subsidy application has been successfully approved " +
                        "by the District Officer.\n\n" +

                        "Scheme: " + schemeName + "\n" +
                        "Application Status: DISTRICT APPROVED\n\n" +

                        "You can now log in to the Digital Subsidy Platform " +
                        "and submit your bank details for further processing.\n\n" +

                        "Thank you,\n" +
                        "Digital Subsidy Platform"
        );

        mailSender.send(message);
    }
}