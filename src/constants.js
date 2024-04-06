export const DB_NAME = "examinationform";
// er diagram: https://app.eraser.io/workspace/C78KHKatqWdX9XH984Wl?origin=share&elements=xuD_3xAsmZxcokXtpm7Ilg

const emailType = {
    register: function (data) {
        let emailContent = `
<body style="font-family: Arial, sans-serif;">

    <h2>Welcome to Our App!</h2>

    <p>Dear ${data.fullName},</p>

    <p>Thank you for registering with our app. Your account has been successfully created. Below are the details you provided:</p>

    <ul>
      <li><strong>Auid:</strong>  ${data.auid}</li>
      <li><strong>Full Name:</strong> ${data.fullName}</li>
      <li><strong>Email Address:</strong> ${data.email}</li>
      <li><strong>Father's Name:</strong> ${data.fatherName}</li>
      <li><strong>Mother's Name:</strong> ${data.motherName}</li>
      <li><strong>Phone Number:</strong> ${data.phoneNumber}</li>
    </ul>

    <p>If you have any questions or need further assistance, feel free to contact us.</p>

    <p>Best regards,<br>
    Akal University</p>

</body>
        `;

        return emailContent;
    },

    formSubmit: function (data) {
        let emailContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Examination Form Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
    
          <h2>Examination Form Confirmation</h2>
    
          <p>Dear Student,</p>
    
          <p>Your examination form details have been received. Here is the information you provided:</p>
    
          <ul>
            <li><strong>Receipt Number:</strong> ${data.receiptNumber}</li>
            <li><strong>Fees:</strong> ${data.fees}</li>
            <li><strong>Date:</strong> ${data.date}</li>
            <li><strong>Examination:</strong> ${data.examination}</li>
            <li><strong>University:</strong> ${data.university}</li>
            <li><strong>Session:</strong> ${data.session}</li>
            <li><strong>AUID:</strong> ${data.auid}</li>
            <li><strong>Marks Obtained:</strong> ${data.marksObtained}</li>
            <li><strong>Marks Max:</strong> ${data.marksMax}</li>
            <li><strong>Result:</strong> ${data.result}</li>
        `;

        if (data.regular === "0") {
            emailContent += `<li><strong>Subject Code:</strong> ${data.subjectCode}</li>`;
        }

        emailContent += `<li><strong>Courses Passed:</strong></li><ul>`;

        data.coursePassed.forEach((course) => {
            emailContent += `<li>${course}</li>`;
        });

        emailContent += `
            </ul>
          </ul>
    
          <p>If you have any questions or concerns, please feel free to contact us.</p>
    
          <p>Best regards,<br>
          Examination Office</p>
    
        </body>
        </html>
        `;

        return emailContent;
    },


    
};

export { emailType };
