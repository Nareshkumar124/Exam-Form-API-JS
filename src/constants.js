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
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h2 {
      color: #333333;
      border-bottom: 2px solid #333333;
      padding-bottom: 10px;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      margin-bottom: 5px;
    }
    strong {
      font-weight: bold;
    }
    p {
      margin-bottom: 10px;
      color: #666666;
    }
    .footer {
      margin-top: 20px;
      font-size: 14px;
      color: #999999;
    }
    .highlight {
      background-color: #f5f5f5;
      padding: 5px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Examination Form Confirmation</h2>
    <p>Dear Student,</p>
    <p>Your examination form details have been received. Here is the information you provided:</p>
    <ul>
      <li><strong>Receipt Number:</strong> <span class="highlight">${
          data.receiptNumber
      }</span></li>
      <li><strong>Fees:</strong> <span class="highlight">${
          data.fees
      }</span></li>
      <li><strong>Date:</strong> <span class="highlight">${
          data.date
      }</span></li>
      <li><strong>Examination:</strong> <span class="highlight">${
          data.examination
      }</span></li>
      <li><strong>University:</strong> <span class="highlight">${
          data.university
      }</span></li>
      <li><strong>Session:</strong> <span class="highlight">${
          data.session
      }</span></li>
      <li><strong>AUID:</strong> <span class="highlight">${
          data.auid
      }</span></li>
      <li><strong>Marks Obtained:</strong> <span class="highlight">${
          data.marksObtained
      }</span></li>
      <li><strong>Marks Max:</strong> <span class="highlight">${
          data.marksMax
      }</span></li>
      <li><strong>Result:</strong> <span class="highlight">${
          data.result
      }</span></li>
    </ul>
    ${
        data.regular === "0"
            ? `<li><strong>Subject Code:</strong> <span class="highlight">${data.subjectCode}</span></li>`
            : ""
    }
    <li><strong>Courses Passed:</strong></li>
    <ul>
      ${data.coursePassed.map((course) => `<li>${course}</li>`).join("")}
    </ul>
    <p>If you have any questions or concerns, please feel free to contact us.</p>
    <p class="footer">Best regards,<br>Examination Office</p>
  </div>
</body>
</html>`;

        return emailContent;
    },
};

export { emailType };
